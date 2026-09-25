# CLAUDE.md - Services (Sync)

> Synchronisation chiffrée via GitHub Gist

## Architecture

```
ProjectSyncAdapter (orchestrateur)
       │
       └── SyncManager (crypto + appels /api/sync)
                  │
                  └── api/sync.js (fonction Vercel : seule à détenir le token GitHub)
```

Le token GitHub (`SYNC_GITHUB_TOKEN`) et l'ID du Gist (`SYNC_GIST_ID`) vivent
uniquement dans l'environnement serveur de la fonction Vercel `api/sync.js`
— jamais dans le bundle client. `SyncManager` ne parle plus à
`api.github.com` directement, il passe par `/api/sync`, protégé par un
secret partagé (`X-Irim-Sync-Key` / `VITE_SYNC_GATE_KEY`).

## ProjectSyncAdapter

**Fichier** : `ProjectSyncAdapter.js`

**Rôle** : Orchestrer la collecte et distribution des données entre les 5 stores Zustand et GitHub Gist.

### Export

```javascript
import projectSyncAdapter from './ProjectSyncAdapter';

// Configuration
projectSyncAdapter.configure(githubToken, gistId);
projectSyncAdapter.setPassword(encryptionPassword);

// Export
const result = await projectSyncAdapter.exportToGist(encrypted = true);
// → { success: true, url: 'https://gist.github.com/...', id: 'gistId' }

// Import
const result = await projectSyncAdapter.importFromGist(gistId, encrypted = true);
// → { success: true, message: 'Import successful', timestamp: '...' }
```

### Format Export v2.0

```json
{
  "version": "2.0.0",
  "architecture": "multi-store",
  "timestamp": "2025-11-30T10:00:00Z",
  "stores": {
    "notes": {
      "roomNotes": { "chambre": "...", "atelier": "..." },
      "sideTowerNotes": { "general": "..." },
      "companionNotes": { "devNote": "..." }
    },
    "projectMeta": {
      "selectedProject": "irimmetabrain",
      "visibleProjects": ["..."],
      "projects": { "id": { "name": "...", ... } }
    },
    "projectData": {
      "projectId1": { "roadmapMarkdown": "...", "todoMarkdown": "..." },
      "projectId2": { ... }
    },
    "diary": {
      "mindlog": { "current": {...}, "logs": [...] },
      "dailyDiary": { "2025-11-30": "..." },
      "monthlyArchives": { "2025-11": {...} },
      "momentsOui": { "moments": [...] }
    },
    "preferences": {
      "defaultRoom": { "x": 2, "y": 2 },
      "roomUIStates": { ... }
    }
  }
}
```

### Méthodes Clés

| Méthode | Description |
|---------|-------------|
| `collectAllStoreData()` | Agrège les 5 stores |
| `exportToGist(encrypted)` | Upload chiffré vers Gist |
| `importFromGist(gistId, encrypted)` | Download + déchiffre + dispatch |
| `importMultiStoreData(data)` | Import format v2.0 |
| `importLegacyData(data)` | Import format v1.0 (migration) |
| `cleanupOrphanedProjects()` | Supprime project-data-* sans meta |
| `getSyncStats()` | Stats sync (lastSync, needsSync) |

### Audit Projets

Le collecteur détecte automatiquement :
- **Projets orphelins** : `project-data-*` sans entrée dans `projectMeta.projects`
- **Projets fantômes** : entrée meta sans `project-data-*`

```javascript
// Console output pendant export
🔍 Audit projets: {
  metaProjects: ["imb", "moodcycle"],
  dataProjects: ["imb", "moodcycle", "old-deleted"],
  orphaned: ["old-deleted"],
  ghost: []
}
```

---

## SyncManager

**Fichier** : `SyncManager.js`

**Rôle** : Bas niveau - GitHub API + chiffrement AES-256

### Configuration

```javascript
import SyncManager from './SyncManager';

SyncManager.setPassword(password); // Min 8 caractères, saisi par l'utilisateur
```

### Méthodes

| Méthode | Description |
|---------|-------------|
| `uploadGist(data, encrypted)` | POST /api/sync — crée/update Gist côté serveur |
| `downloadGist(gistId, encrypted)` | GET /api/sync — télécharge + déchiffre (`gistId` ignoré, déterminé côté serveur) |

### Chiffrement

- **Algorithme** : AES-256-CBC (via `crypto-js`, côté client uniquement)
- **Clé** : Dérivée du password via PBKDF2 (10 000 itérations)
- **Format stocké** : `hex(salt) + hex(iv) + base64(ciphertext)`, concaténés en une seule chaîne

---

## Variables d'Environnement

```bash
# Client (bundle public — .env.local ou Vercel Preview/Production)
VITE_SYNC_GATE_KEY=xxxxxxxxxxxx      # Secret partagé, vérifié par api/sync.js
VITE_ACCESS_PASSWORD=password        # Gate d'accès app (symbolique)

# Serveur uniquement (fonction Vercel api/sync.js, jamais préfixé VITE_)
SYNC_GITHUB_TOKEN=ghp_xxxxxxxxxxxx   # Personal Access Token (scope: gist)
SYNC_GIST_ID=abc123def456            # Créé au premier export si absent

# Mot de passe de chiffrement : saisi par l'utilisateur dans SyncModal,
# persisté en localStorage (`sync-encryption-password`) — plus une variable d'env.
```

---

## Flow Complet

### Export
```
1. collectAllStoreData()
   ├── collectNotesData()
   ├── collectProjectMetaData()
   ├── collectAllProjectData() → scan localStorage project-data-*
   ├── collectDiaryData()
   └── collectPreferencesData()

2. SyncManager.uploadGist()
   ├── JSON.stringify(data)
   ├── encrypt(json, password) → AES-256
   └── POST /api/sync (X-Irim-Sync-Key)
        └── api/sync.js → GitHub API: PATCH /gists/{id} ou POST /gists

3. Copie Gist ID dans presse-papier
```

### Import
```
1. SyncManager.downloadGist()
   ├── GET /api/sync (X-Irim-Sync-Key)
   │    └── api/sync.js → GitHub API: GET /gists/{SYNC_GIST_ID}
   └── decrypt(content, password)

2. Détection version
   ├── v2.0.0 → importMultiStoreData()
   └── v1.0.0 → importLegacyData() + migration

3. Dispatch vers stores
   ├── useNotesStore.importNotes()
   ├── localStorage.setItem('project-meta-store', ...)
   ├── localStorage.setItem('project-data-{id}', ...) × N
   ├── localStorage.setItem('diary-storage', ...)
   └── localStorage.setItem('irim-preferences-store', ...)

4. window.location.reload() (rehydratation stores)
```

---

## Debug Console

```javascript
// Collecter sans exporter
window.__SYNC_TOOLS__.collectAllStoreData()

// Nettoyer orphelins
window.__SYNC_TOOLS__.cleanupOrphanedProjects()

// Stats sync
projectSyncAdapter.getSyncStats()
// → { lastSync: Date, projectCount: 4, needsSync: false }
```

---

## Gestion Erreurs

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Unknown data format version` | Format Gist non reconnu | Vérifier version export |
| `Decryption failed` | Mauvais password | Ressaisir le mot de passe dans SyncModal |
| `403 Forbidden` | `X-Irim-Sync-Key` manquante/erronée | Vérifier `VITE_SYNC_GATE_KEY` (client et serveur) |
| `500 ... not configured` | `SYNC_GITHUB_TOKEN`/`SYNC_GIST_ID` absent côté Vercel | Poser les variables serveur dans Vercel |
| `401 Unauthorized` (dans le texte de l'erreur GitHub relayée) | Token GitHub invalide | Régénérer `SYNC_GITHUB_TOKEN` |
| `404 Not Found` (dans le texte de l'erreur GitHub relayée) | Gist ID inexistant | Exporter d'abord (crée le Gist, copier l'id dans `SYNC_GIST_ID`) |
