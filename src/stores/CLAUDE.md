# CLAUDE.md - Stores Zustand

> Architecture multi-stores avec persistence localStorage

## Vue d'ensemble

5 stores Zustand interconnectés, chacun avec persistence localStorage via middleware `persist`.

## Les 5 Stores

### 1. useProjectMetaStore
**Clé localStorage** : `project-meta-store`

**Responsabilité** : Métadonnées globales des projets (léger, partagé)

```javascript
{
  selectedProject: "irimmetabrain",      // Projet actif
  visibleProjects: ["id1", "id2", ...],  // Carrousel
  categories: { pro, perso, formation }, // Taxonomie
  projects: {                            // Métadonnées par projet
    [id]: { name, type, status, category, technologies, deployUrl, ... }
  }
}
```

**Actions clés** :
- `selectProject(id)` / `selectNextProject()` / `selectPreviousProject()`
- `createProject(data)` / `updateProjectMeta(id, updates)` / `deleteProject(id)`
- `toggleProjectVisibility(id)` / `moveToColumn(id, column)`
- `getCurrentProject()` / `getVisibleProjects()`

---

### 2. useProjectDataStore (Factory Pattern)
**Clé localStorage** : `project-data-{projectId}` (un store par projet)

**Responsabilité** : Données lourdes par projet (roadmap, todos, notes)

```javascript
{
  roadmapMarkdown: "# Roadmap...",
  todoMarkdown: "# Todo...",
  notesMarkdown: "# Notes...",
  atelierModules: {
    roadmap: { collapsed: true },
    todo: { collapsed: true },
    mindlog: { collapsed: false, mood: "😐", note: "" },
    // ...
  }
}
```

**Usage** :
```javascript
// Hook - crée/récupère le store du projet
const projectData = useProjectData(projectId);
const { roadmapMarkdown, updateRoadmapMarkdown } = projectData;

// Direct (hors composant)
import { getProjectData } from './useProjectDataStore';
const data = getProjectData(projectId);
```

**Pattern Factory** : `storeCache` évite de recréer les stores à chaque appel.

---

### 3. useDiaryStore
**Clé localStorage** : `diary-storage`

**Responsabilité** : Journal personnel, MindLog, Moments OUI

```javascript
{
  mindlog: {
    current: { mood: 3, energy: 3, focus: 3, note: '' },
    logs: [{ timestamp, mood, energy, focus, note, hidden, category }],
    markdownNotes: ''
  },
  dailyDiary: { 'YYYY-MM-DD': 'contenu markdown' },
  monthlyArchives: { 'YYYY-MM': { 'YYYY-MM-DD': 'contenu' } },
  momentsOui: {
    moments: [{ id, timestamp, quoi, pourquoi, tags, archived }],
    metadata: { totalMoments, needsStats },
    settings: { notificationEnabled, showFloatingButton }
  }
}
```

**Actions MindLog** :
- `updateMindLogCurrent(updates)` / `addMindLogEntry(entry)`
- `toggleLogVisibility(id)` / `deleteLog(id)`
- `getTodayLogs()` / `getVisibleLogs()`

**Actions Moments OUI** :
- `addMomentOui(data)` / `updateMomentOui(id, updates)` / `deleteMomentOui(id)`
- `getMomentsOui(filters)` / `getWeeklyStats()` / `getNeedsStats(period)`

**Actions Diary** :
- `updateDailyEntry(date, content)` / `archiveMonthlyEntries()`
- `exportMonthToMarkdown(yearMonth)`

---

### 4. useNotesStore
**Clé localStorage** : `irim-notes-store`

**Responsabilité** : Notes par pièce + SideTower + Companion

```javascript
{
  roomNotes: {
    sanctuaire: '', chambre: '', cuisine: '', comptoir: '',
    jardin: '', atelier: '', forge: '', boutique: '',
    scriptorium: '', bibliotheque: '', cave: ''
  },
  sideTowerNotes: { general: '' },
  companionNotes: { devNote: '', lastSync: null }
}
```

**Actions** :
- `updateRoomNote(roomType, content)` / `getRoomNote(roomType)`
- `updateSideTowerNote(content)` / `getSideTowerNote()`
- `updateCompanionNote(key, value)` / `getCompanionNote(key)`
- `exportNotes()` / `importNotes(data)` / `importData(data)`

**Helpers debounce** :
```javascript
import { debouncedUpdateRoomNote } from './useNotesStore';
debouncedUpdateRoomNote('chambre', content); // 500ms debounce
```

---

### 5. usePreferencesStore
**Clé localStorage** : `irim-preferences-store`

**Responsabilité** : Préférences UI et états des panels

```javascript
{
  defaultRoom: { x: 2, y: 2 },       // Position démarrage (Atelier)
  customRoomLayout: null,            // Layout personnalisé (futur)
  roomUIStates: {
    chambre: {
      timer: { collapsed: false },
      totem: { collapsed: false },
      // ...
    },
    // ... autres pièces
  }
}
```

**Actions** :
- `setDefaultRoom(position)` / `getDefaultRoom()`
- `getPanelState(roomId, panelId)` / `updatePanelState(roomId, panelId, update)`
- `togglePanelCollapse(roomId, panelId)` / `resetRoomState(roomId)`

---

## Relations entre Stores

```
useProjectMetaStore ←──────→ useProjectDataStore
    (selectedProject)           (données du projet actif)
           │
           ├── useNotesStore (notes atelier = projet)
           │
           └── useDiaryStore (mindlog peut être lié au projet)

usePreferencesStore ←──── indépendant (UI states)
```

## Patterns Établis

### Persistence
```javascript
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({ /* state + actions */ }),
    { name: 'localStorage-key', version: 1 }
  )
);
```

### Actions avec set()
```javascript
// Pattern immutable
updateField: (value) => set({ field: value })

// Pattern avec état précédent
updateNested: (key, value) => set((state) => ({
  nested: { ...state.nested, [key]: value }
}))
```

### Migration
```javascript
{
  name: 'store-key',
  version: 2,
  migrate: (persistedState, version) => {
    if (version === 1) {
      // Migration v1 → v2
    }
    return persistedState;
  }
}
```

---

## Debug (console navigateur)

```javascript
// Accès direct aux stores
window.__ZUSTAND_STORES__.notes()
window.__ZUSTAND_STORES__.projectMeta()

// Via localStorage
JSON.parse(localStorage.getItem('project-meta-store'))
JSON.parse(localStorage.getItem('diary-storage'))
```

---

## Fichiers

| Fichier | Lignes | Store |
|---------|--------|-------|
| `useProjectMetaStore.js` | ~290 | Métadonnées projets |
| `useProjectDataStore.js` | ~230 | Données par projet (factory) |
| `useDiaryStore.js` | ~560 | Journal + MindLog + Moments OUI |
| `useNotesStore.js` | ~200 | Notes pièces |
| `usePreferencesStore.js` | ~180 | Préférences UI |
| `defaultData.js` | ~100 | Données initiales notes |
| `defaultProjectsData.js` | ~200 | Données initiales projets |
| `migrateProjectStores.js` | ~150 | Migration v1→v2 |
