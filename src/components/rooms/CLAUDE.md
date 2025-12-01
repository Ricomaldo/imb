# CLAUDE.md - Rooms (Pièces)

> Les 12 pièces du meta-cerveau spatial

## Structure

Chaque pièce = 1 dossier avec :
```
{RoomName}/
├── {RoomName}Room.jsx      # Composant principal
└── {RoomName}Room.styles.js # Styled-components (optionnel)
```

## Les 12 Pièces

### Grille Spatiale (4x3 dans canvas 6x5)

```
     x=1          x=2          x=3          x=4
y=1  Sanctuaire   Chambre      Scriptorium  Comptoir
y=2  Cuisine      ATELIER      Forge        Boutique
y=3  Laboratoire  Bibliothèque Jardin       Cave
```

### Statuts et Fonctions

| Pièce | Position | Fonction | Statut |
|-------|----------|----------|--------|
| **Sanctuaire** | 1,1 | Méditation, Moments OUI (besoins Rosenberg) | Opérationnel |
| **Chambre** | 2,1 | Rituels matinaux, TimeTimer, MindLog, Mantras | Opérationnel |
| **Scriptorium** | 3,1 | Documentation, écriture | Opérationnel |
| **Comptoir** | 4,1 | Discussions, échanges | En construction |
| **Cuisine** | 1,2 | Bien-être, hydratation, pauses | Opérationnel |
| **Atelier** | 2,2 | **Hub central** - Projets, Roadmaps, Todos | Opérationnel |
| **Forge** | 3,2 | Build/deploy, outils techniques | Opérationnel |
| **Boutique** | 4,2 | Présentations, démos | En construction |
| **Laboratoire** | 1,3 | Tests, sandbox composants | Opérationnel |
| **Bibliothèque** | 2,3 | Références, ressources | Opérationnel |
| **Jardin** | 3,3 | Croissance d'idées | En construction |
| **Cave** | 4,3 | Secrets, debugging | En construction |

---

## Pattern Room

### Structure Minimale

```jsx
// src/components/rooms/MaRoom/MaRoomRoom.jsx

import React from 'react';
import BaseRoom from '../../layout/BaseRoom';
import Panel from '../../common/Panel';
import PanelGrid from '../../layout/PanelGrid';

const MaRoomRoom = () => {
  return (
    <BaseRoom roomType="maroom" layoutType="grid">
      <PanelGrid columns={3} rows={2}>
        <Panel
          gridColumn="1 / 3"
          gridRow="1"
          title="Mon Panel"
          icon="🎯"
          texture="parchment"
          collapsible={true}
        >
          {/* Contenu */}
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default MaRoomRoom;
```

### Props BaseRoom

| Prop | Type | Description |
|------|------|-------------|
| `roomType` | string | Identifiant pièce (lowercase) |
| `layoutType` | `'grid'` | Type de layout |
| `children` | ReactNode | Contenu (PanelGrid) |

### Props PanelGrid

| Prop | Type | Description |
|------|------|-------------|
| `columns` | number | Nombre de colonnes (ex: 5) |
| `rows` | number | Nombre de lignes (ex: 5) |

### Props Panel

| Prop | Type | Description |
|------|------|-------------|
| `gridColumn` | string | Position CSS grid (ex: `"1 / 3"`) |
| `gridRow` | string | Position CSS grid |
| `title` | string | Titre du panel |
| `icon` | string | Emoji |
| `texture` | string | `stone`, `wood`, `parchment`, `metal`, `leather`, `fabric` |
| `accentColor` | string | Couleur accent (theme.colors.accents.*) |
| `collapsible` | boolean | Panel repliable |
| `collapsed` | boolean | État replié |
| `onToggleCollapse` | function | Callback toggle |
| `contentType` | string | `'markdown'` pour style adapté |

---

## Exemple : Atelier (référence)

```jsx
// Layout 5x5 avec panels positionnés
<PanelGrid columns={5} rows={5}>
  {/* Roadmap - large, bas gauche */}
  <Panel gridColumn="1 / 4" gridRow="3 / 6" title="Roadmap" icon="🗺️" />

  {/* Todo - droite haut */}
  <Panel gridColumn="4 / 6" gridRow="1 / 4" title="Todo" icon="✅" />

  {/* ScreenTV - petit, haut gauche */}
  <Panel gridColumn="1 / 3" gridRow="1 / 3" title="ScreenTV" icon="📺" />

  {/* MindLog - centre */}
  <Panel gridColumn="3 / 4" gridRow="1 / 3" title="MindLog" icon="🌈" />

  {/* Notes - bas droite */}
  <Panel gridColumn="4 / 6" gridRow="4 / 6" title="Notes" icon="📝" />
</PanelGrid>
```

---

## Connexion aux Stores

### Notes de pièce
```jsx
import useNotesStore from '../../../stores/useNotesStore';

const MaRoom = () => {
  const { getRoomNote, updateRoomNote } = useNotesStore();
  const note = getRoomNote('maroom');
  // ...
};
```

### État UI (collapse panels)
```jsx
import usePreferencesStore from '../../../stores/usePreferencesStore';

const MaRoom = () => {
  const { getPanelState, updatePanelState } = usePreferencesStore();
  const panelState = getPanelState('maroom', 'monpanel');

  return (
    <Panel
      collapsed={panelState.collapsed}
      onToggleCollapse={(newCollapsed) =>
        updatePanelState('maroom', 'monpanel', { collapsed: newCollapsed })
      }
    />
  );
};
```

### Projet actif (Atelier)
```jsx
import useProjectMetaStore from '../../../stores/useProjectMetaStore';
import { useProjectData } from '../../../stores/useProjectDataStore';

const AtelierRoom = () => {
  const { selectedProject, getCurrentProject } = useProjectMetaStore();
  const project = getCurrentProject();
  const projectData = useProjectData(selectedProject);
  // ...
};
```

---

## Enregistrement

Les pièces sont enregistrées dans `src/utils/RoomRegistry.jsx` qui mappe `roomType` → composant.

Pour ajouter une pièce :
1. Créer le dossier + fichiers
2. Ajouter dans `roomPositions.js` (position grille)
3. Ajouter dans `RoomRegistry.jsx` (import + mapping)
4. Ajouter dans `assetMapping.js` (background image)

---

## Conventions

- **Nommage** : `{RoomName}Room.jsx` (PascalCase + suffixe Room)
- **roomType** : lowercase, sans accents (`bibliotheque`, pas `bibliothèque`)
- **Grille** : Utiliser des fractions cohérentes (ex: 5x5 pour flexibilité)
- **Textures** : Choisir selon l'ambiance de la pièce
