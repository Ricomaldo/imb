---
type: architecture
updated: 2025-09-19
version: 2.0
---

# Architecture Multi-Stores v2 - IRIM MetaBrain

## Vue d'ensemble

**Architecture modulaire** avec séparation des responsabilités entre métadonnées et données projet.

### Stores principaux

```
useNotesStore          → Notes transversales (infrastructure)
useProjectMetaStore    → Métadonnées globales des projets
useProjectDataStore    → Données spécifiques par projet (dynamique)
useDiaryStore          → Journal personnel (mindlog, archives)
usePreferencesStore    → Préférences UI et settings (fusion legacy stores)
```

---

## Store: useProjectMetaStore

**Fichier:** `stores/useProjectMetaStore.js`
**Clé localStorage:** `project-meta-store`
**Version:** 2

### Responsabilité
Gestion centralisée des métadonnées de tous les projets.

### État
```js
{
  // Navigation
  selectedProject: string,              // ID projet actuel
  visibleProjects: string[],           // IDs projets visibles dans carousel

  // Organisation
  categories: {
    pro: { label, subcategories },
    perso: { label, subcategories },
    formation: { label, subcategories }
  },

  // Métadonnées projets
  projects: {
    [projectId]: {
      // Identité
      id: string,
      name: string,
      type: string,                   // tool|wellness|finance|creative
      status: string,                 // dev_actif|concept|vision

      // Catégorisation
      category: string,               // pro|perso|formation
      subcategory: string,

      // Propriétés enrichies
      contractType: string,
      deploymentStatus: string,       // local|staging|production|concept
      projectNature: string,
      technologies: string[],
      client: string,
      startDate: string,
      endDate: string,
      order: number,                  // Position dans la liste

      // Timestamps
      created_at: string,
      updated_at: string
    }
  }
}
```

### Actions principales
```js
// CRUD
createProject(projectData)
updateProjectMeta(projectId, updates)
deleteProject(projectId)

// Navigation
selectProject(projectId)
selectNextProject()
selectPreviousProject()

// Visibilité
toggleProjectVisibility(projectId)

// Organisation
reorderProjects(activeId, overId)
updateProjectCategory(id, cat, subcat)

// Helpers
getCurrentProject()
getVisibleProjects()
getProjectsSortedByOrder()
```

---

## Store: useProjectDataStore (Dynamique)

**Fichier:** `stores/useProjectDataStore.js`
**Clé localStorage:** `project-data-${projectId}` (un par projet)
**Version:** 1

### Responsabilité
Données spécifiques à chaque projet, créé dynamiquement à la demande.

### État
```js
{
  // Contenu Markdown
  roadmapMarkdown: string,
  todoMarkdown: string,

  // État modules Atelier
  atelierModules: {
    roadmap: { collapsed: boolean },
    todo: { collapsed: boolean },
    mindlog: { collapsed: boolean, mood: string, note: string },
    actions: { collapsed: boolean, items: array },
    screentv: { collapsed: boolean, screenshots: array }
  },

  // Legacy (conservé pour compatibilité)
  roadmap: array,
  todo: array,
  idees: array,
  prochaineAction: object
}
```

### Usage
```js
import { useProjectData } from './stores/useProjectDataStore';

// Dans un composant
const projectData = useProjectData(projectId);

// Actions disponibles
projectData.updateRoadmapMarkdown(content);
projectData.updateTodoMarkdown(content);
projectData.updateModuleState(moduleName, stateUpdate);
```

### Cache et performance
```js
// Le store est mis en cache pour éviter les recreations
const storeCache = {};

// Nettoyer le cache si nécessaire
clearProjectDataCache(projectId);
```

---

## Initialisation et Migration

### Fichier: `stores/defaultProjectsData.js`

Structure des données par défaut avec 4 projets démo :
- **irimmetabrain** : IRIM MetaBrain (dev_actif)
- **moodcycle** : MoodCycle (concept)
- **pepetteszub** : Les Pepettes Zub (production)
- **echodesreves** : L'Echo des Rêves (vision)

### Fichier: `stores/migrateProjectStores.js`

Fonctions d'initialisation et migration :

```js
// Initialisation automatique (App.jsx)
const status = await initializeStores();
// Returns: 'initialized' | 'migrated' | 'reinitialized' | 'existing'

// Vérifications
needsInitialization()     // true si stores vides
verifyMigration()        // vérifie intégrité après migration

// Maintenance
rollbackMigration()      // rollback vers backup
resetToDefaultData()     // reset complet (avec confirmation)
```

### Flow d'initialisation (App.jsx)

```mermaid
graph TD
    A[App Start] --> B{localStorage vide?}
    B -->|Oui| C[Load defaultProjectsData]
    B -->|Non| D{Ancien format?}
    D -->|Oui| E[Migration v1→v2]
    D -->|Non| F{Stores corrompus?}
    F -->|Oui| G[Réinitialisation]
    F -->|Non| H[Utiliser existant]
    C --> I[App Ready]
    E --> I
    G --> I
    H --> I
```

---

## Store: useDiaryStore

**Fichier:** `stores/useDiaryStore.js`
**Clé localStorage:** `diary-storage`
**Version:** 1

### Responsabilité
Gestion du journal personnel, mindlog compact et archivage temporel.

### État
```js
{
  // MindLog personnel
  mindlog: {
    current: {
      mood: number,           // 1-5
      energy: number,         // 1-5
      focus: number,          // 1-5
      note: string            // Note contextuelle
    },
    logs: [{                  // Historique (max 50 entrées)
      id: number,
      timestamp: string,
      mood: number,
      energy: number,
      focus: number,
      note: string,
      category: string,       // Catégorisation mentale
      categoryDate: string,
      hidden: boolean         // Visible par défaut
    }],
    markdownNotes: string     // Notes personnelles markdown
  },

  // Journal quotidien actif
  dailyDiary: {
    'YYYY-MM-DD': 'contenu markdown'
  },

  // Archives mensuelles (jours passés archivés automatiquement)
  monthlyArchives: {
    'YYYY-MM': {
      'YYYY-MM-DD': 'contenu'
    }
  },

  // Futures entrées journal (extension prévue)
  entries: []
}
```

### Actions principales
```js
// MindLog
updateMindLogCurrent({ mood, energy, focus, note })
addMindLogEntry({ mood, energy, focus, note })
updateMarkdownNotes(notes)
clearMindLogHistory()

// Catégorisation mentale
updateLogCategory(logId, category)
getUncategorizedLogs()
getCategorizedLogs(category)
toggleLogVisibility(logId)
deleteLog(logId)

// Journal quotidien
getDailyEntry(date)
updateDailyEntry(date, content)
archiveMonthlyEntries()          // Archive automatiquement jours passés

// Archives
getMonthlyArchive(yearMonth)
getArchivedMonths()
exportMonthToMarkdown(yearMonth)

// Helpers
getTodayLogs()
getLastLog()
getVisibleLogs()                 // Pour interface Chambre
getAllLogs()                     // Pour interface Sanctuaire
```

---

## Store: usePreferencesStore

**Fichier:** `stores/usePreferencesStore.js`
**Clé localStorage:** `irim-preferences-store`
**Version:** 1

### Responsabilité
Fusion de `useSettingsStore` et `useRoomsUIStore` - Préférences UI globales et états des panneaux par room.

### État
```js
{
  // === PRÉFÉRENCES APPLICATION (ancien useSettingsStore) ===

  // Navigation par défaut
  defaultRoom: { x: 2, y: 2 },         // Pièce de démarrage (Atelier au centre)
  customRoomLayout: null,              // Disposition personnalisée rooms (futur)

  // === ÉTATS UI DES ROOMS (ancien useRoomsUIStore) ===

  // État UI par room et par panel
  roomUIStates: {
    chambre: {
      timer: { collapsed: false },
      totem: { collapsed: false },
      mindlog: { collapsed: false },
      mantra: { collapsed: false },
      notes: { collapsed: false },
      navigation: { collapsed: false }
    },
    forge: {
      mainPanel: { collapsed: false },
      notes: { collapsed: false }
    },
    // ... autres rooms
    sanctuaire: {
      trimental: { collapsed: false }
    }
  }
}
```

### Actions principales
```js
// Préférences application
setDefaultRoom(position)
getDefaultRoom()
setCustomRoomLayout(layout)
getCustomRoomLayout()

// États UI des rooms (compatible ancien useRoomsUIStore)
getPanelState(roomId, panelId)         // Retourne état panel avec fallback
updatePanelState(roomId, panelId, stateUpdate)
resetRoomState(roomId)                 // Reset complet room
togglePanelCollapse(roomId, panelId)   // Helper toggle collapse

// Migration automatique (appelé au chargement)
migrateFromOldStores()                 // Migre depuis anciennes clés localStorage
```

### Migration automatique
Le store migre automatiquement les données depuis :
- `irim-settings-store` → `defaultRoom`
- `irim-rooms-ui-store` → `roomUIStates`

Les anciennes clés sont supprimées après migration réussie.

---

## Synchronisation Multi-Device

### Service: `ProjectSyncAdapter` (MODIFIÉ v3.0)

Adaptateur pour synchroniser l'architecture multi-stores avec GitHub Gist.

**⚠️ NOUVELLE VERSION ULTRA-SIMPLE** : Configuration via variables d'environnement uniquement.

```js
// Plus de configuration manuelle - tout via .env.local :
// VITE_GITHUB_TOKEN=ghp_token
// VITE_SYNC_PASSWORD=password
// VITE_SYNC_GIST_ID=gist_id (optionnel)

// Export direct (collecte TOUS les stores automatiquement)
const result = await exportToGist();
// → { success: true, url: string, id: string }

// Import direct (écrase tout + reload)
const result = await importFromGist();
// → { success: true, message: string, timestamp: string }
```

### Format de synchronisation v2 (ÉTENDU)

```json
{
  "version": "2.0.0",
  "architecture": "multi-store",
  "timestamp": "2025-10-01T10:00:00Z",
  "stores": {
    "notes": {
      "roomNotes": {},
      "sideTowerNotes": {},
      "companionNotes": {}          // ← NOUVEAU (notes mobile)
    },
    "projectMeta": {
      "selectedProject": "id",
      "visibleProjects": [],
      "categories": {},
      "projects": {}
    },
    "projectData": {
      "projectId1": { /* données projet */ },
      "projectId2": { /* données projet */ }
    },
    "diary": {                      // ← NOUVEAU
      "mindlog": {},
      "dailyDiary": {},
      "monthlyArchives": {},
      "entries": []
    },
    "preferences": {                // ← NOUVEAU
      "defaultRoom": { x: 2, y: 2 },
      "customRoomLayout": null,
      "roomUIStates": {}
    }
  }
}
```

### Compatibilité descendante

Le système détecte automatiquement :
- Format v1.0.0 → Migration automatique
- Format v2.0.0 → Import direct
- Format inconnu → Erreur avec message

---

## Patterns d'usage

### Création d'un nouveau projet

```js
// 1. Créer les métadonnées
const metaStore = useProjectMetaStore.getState();
const projectId = metaStore.createProject({
  name: "Mon Projet",
  type: "tool",
  status: "concept",
  category: "perso",
  subcategory: "demo"
});

// 2. Le store de données sera créé automatiquement au premier accès
const projectData = useProjectData(projectId);
projectData.updateRoadmapMarkdown("# Ma Roadmap");
```

### Navigation entre projets

```js
// Dans un composant
const { selectedProject, selectNextProject } = useProjectMetaStore();
const projectData = useProjectData(selectedProject);

// Navigation
selectNextProject();
// Le nouveau projet est automatiquement chargé
```

### Synchronisation complète

```js
// Export
await ProjectSyncAdapter.exportToGist(true);

// Import (avec confirmation utilisateur)
await ProjectSyncAdapter.importFromGist(gistId, true);
```

---

## Performance et optimisations

### Lazy Loading
- Les `ProjectDataStore` sont créés à la demande
- Cache des instances pour éviter les recreations
- localStorage lu une seule fois par session

### Debounce
- Markdown editors : 1000ms
- Module states : 500ms
- Notes : 500ms

### Taille des données
```
project-meta-store     : ~5KB (métadonnées)
project-data-{id}      : ~10-20KB par projet
Total (4 projets)      : ~50-100KB
```

---

## Scénarios de test

### 1. Premier lancement (localStorage vide)
```
✅ Doit charger defaultProjectsData
✅ 4 projets créés avec contenu démo
✅ Navigation fonctionnelle
```

### 2. Migration ancien format
```
✅ Détection automatique ancien store
✅ Migration sans perte de données
✅ Backup créé automatiquement
```

### 3. Import/Export Gist
```
✅ Export chiffré avec mot de passe
✅ Import avec confirmation
✅ Gestion versions v1 et v2
```

### 4. Changement navigateur
```
✅ Export depuis navigateur A
✅ Import dans navigateur B
✅ Données identiques après sync
```

### 5. Corruption données
```
✅ Détection store corrompu
✅ Réinitialisation automatique
✅ Message utilisateur
```

---

## Commandes de debug

```js
// Console browser

// Voir l'état complet
window.stores.projectMeta()              // useProjectMetaStore
window.stores.projectData('irimmetabrain')  // useProjectDataStore
window.stores.notes()                    // useNotesStore
window.stores.diary()                    // useDiaryStore ← NOUVEAU
window.stores.preferences()              // usePreferencesStore ← NOUVEAU

// Forcer réinitialisation
import { resetToDefaultData } from './stores/migrateProjectStores'
await resetToDefaultData()

// Vérifier migration
import { verifyMigration } from './stores/migrateProjectStores'
verifyMigration()

// Stats sync (plus besoin d'import - tout via variables d'env)
// Voir nouvelle documentation: docs/guides/sync-system.md

// Debug collecte TOUS les stores
window.__SYNC_TOOLS__.collectAllStoreData()

// Nettoyage projets orphelins
window.__SYNC_TOOLS__.cleanupOrphanedProjects()
```

---

## Évolutions futures

### v2.1 - Optimisations
- [ ] Compression des données localStorage
- [ ] Sync incrémentale (diff-based)
- [ ] Cache IndexedDB pour grandes données

### v2.2 - Fonctionnalités
- [ ] Templates de projets
- [ ] Import/Export CSV
- [ ] Historique des modifications
- [ ] Multi-user collaboration

### v3.0 - Architecture
- [ ] Migration vers SQLite WASM
- [ ] Sync temps réel WebSocket
- [ ] Offline-first avec service worker

---

**Status:** ✅ Production Ready
**Version:** 2.0.0
**Date:** 2025-09-19