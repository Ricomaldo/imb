# CLAUDE.md - Services (Sync)

> Synchronisation chiffrée via GitHub Gist

## Architecture

```
ProjectSyncAdapter (orchestrateur)
       │
       └── SyncManager (GitHub API + crypto)
```

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

SyncManager.configure(githubToken, gistId);
SyncManager.setPassword(password); // Min 8 caractères
```

### Méthodes

| Méthode | Description |
|---------|-------------|
| `uploadGist(data, encrypted)` | Crée/update Gist |
| `downloadGist(gistId, encrypted)` | Télécharge + déchiffre |
| `testConnection()` | Vérifie token GitHub |
| `listGists()` | Liste les Gists du user |

### Chiffrement

- **Algorithme** : AES-256-GCM (Web Crypto API)
- **Clé** : Dérivée du password via PBKDF2 (100k itérations)
- **Format stocké** : `base64(salt + iv + ciphertext)`

---

## Variables d'Environnement

```bash
# .env.local
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx   # Personal Access Token (scope: gist)
VITE_SYNC_PASSWORD=MySecurePassword  # Min 8 chars, AES-256 key
VITE_SYNC_GIST_ID=abc123def456       # Optionnel, auto-créé si absent
VITE_ACCESS_PASSWORD=password        # Gate d'accès app (symbolique)
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
   └── GitHub API: PATCH /gists/{id} ou POST /gists

3. Copie Gist ID dans presse-papier
```

### Import
```
1. SyncManager.downloadGist(gistId)
   ├── GitHub API: GET /gists/{id}
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
| `Decryption failed` | Mauvais password | Vérifier VITE_SYNC_PASSWORD |
| `401 Unauthorized` | Token GitHub invalide | Régénérer token |
| `404 Not Found` | Gist ID inexistant | Exporter d'abord (crée Gist) |
