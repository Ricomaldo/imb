---
type: changelog
created: 2025-09-19
---

# Changelog - Architecture des Stores

## [2.0.0] - 2025-09-19

### 🚀 Migration vers Architecture Multi-Stores

#### Changements majeurs

**Avant (v1) - Architecture Monolithique**
```
useProjectsStore → Un seul store pour TOUS les projets et leurs données
```

**Après (v2) - Architecture Modulaire**
```
useProjectMetaStore  → Métadonnées globales (navigation, catégories, infos légères)
useProjectDataStore  → Données spécifiques par projet (créé dynamiquement)
```

#### Nouveaux fichiers

- `stores/useProjectMetaStore.js` - Store des métadonnées
- `stores/useProjectDataStore.js` - Factory pour stores dynamiques
- `stores/defaultProjectsData.js` - Données par défaut (4 projets démo)
- `stores/migrateProjectStores.js` - Migration automatique v1→v2
- `services/ProjectSyncAdapter.js` - Adaptateur pour sync GitHub Gist

#### Améliorations

1. **Performance**
   - Chargement à la demande (lazy loading)
   - Un store par projet au lieu d'un store géant
   - Cache des instances de stores

2. **Scalabilité**
   - Nombre illimité de projets sans impact performance
   - Isolation des données par projet
   - Structure extensible

3. **Robustesse**
   - Initialisation automatique si localStorage vide
   - Migration transparente depuis v1
   - Détection et réparation des stores corrompus
   - Backup automatique avant migration

4. **Synchronisation**
   - Compatible avec nouvelle architecture
   - Export/Import chiffré via GitHub Gist
   - Rétrocompatibilité avec format v1

#### Structure localStorage

**Avant (v1)**
```
irim-projects-store → Tout dans une clé
```

**Après (v2)**
```
project-meta-store     → Métadonnées (~5KB)
project-data-{id}      → Un par projet (~10-20KB chacun)
```

#### API Changes

**Deprecated**
- `useProjectsStore` - Remplacé par `useProjectMetaStore` + `useProjectDataStore`
- Actions legacy : `addRoadmapItem()`, `addTodoItem()`, etc.

**Nouvelles APIs**
```js
// Métadonnées
useProjectMetaStore.getState().selectProject(id)
useProjectMetaStore.getState().reorderProjects(activeId, overId)

// Données projet
const projectData = useProjectData(projectId)
projectData.updateRoadmapMarkdown(content)
projectData.updateModuleState(moduleName, state)
```

---

## [1.0.0] - 2025-09-18

### Version initiale

- Architecture monolithique avec `useProjectsStore`
- Stockage de tous les projets dans un seul store
- Synchronisation basique via GitHub Gist
- Support de 2 stores principaux : Notes + Projects

#### Limitations v1

- Performance dégradée avec beaucoup de projets
- Pas de lazy loading
- Difficile à étendre
- Migration complexe entre versions

---

## Notes de migration

### De v1 vers v2

La migration est **automatique** au premier lancement après mise à jour :

1. Détection de l'ancien format
2. Backup automatique créé (`projects-backup-v1`)
3. Conversion des données
4. Vérification d'intégrité
5. Marquage comme migré

### Rollback si nécessaire

```js
import { rollbackMigration } from './stores/migrateProjectStores'
rollbackMigration() // Restaure depuis backup
```

### Reset complet

```js
import { resetToDefaultData } from './stores/migrateProjectStores'
await resetToDefaultData() // Réinitialise avec données démo
```

---

## Roadmap future

### v2.1 (Planifié)
- [ ] Compression des données localStorage
- [ ] Sync incrémentale (diff-based)
- [ ] Cache IndexedDB pour grandes données

### v3.0 (Vision)
- [ ] Migration vers SQLite WASM
- [ ] Sync temps réel WebSocket
- [ ] Multi-user collaboration

---

**Mainteneur:** IRIM Team
**Status:** Production Ready (v2.0.0)