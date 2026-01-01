---
type: architecture
updated: 2025-09-18
---

> ⚠️ Snapshot du 2025-09 - Structure évolutive

src/
├── components/
│   ├── layout/
│   │   ├── StudioHall/
│   │   │   ├── StudioHall.jsx
│   │   │   └── StudioHall.styles.js
│   │   ├── RoomCanvas/
│   │   │   ├── RoomCanvas.jsx
│   │   │   └── RoomCanvas.styles.js
│   │   ├── PanelGrid/
│   │   │   ├── PanelGrid.jsx
│   │   │   └── PanelGrid.styles.js
│   │   └── SideTower/
│   │       ├── SideTower.jsx
│   │       ├── SideTower.styles.js
│   │       ├── ControlTower/
│   │       │   ├── ControlTower.jsx
│   │       │   └── ControlTower.styles.js
│   │       ├── WorkbenchDrawer/
│   │       │   ├── WorkbenchDrawer.jsx
│   │       │   └── WorkbenchDrawer.styles.js
│   │       └── SideTowerNotes/
│   │           ├── SideTowerNotes.jsx
│   │           └── SideTowerNotes.styles.js
│   ├── rooms/
│   │   ├── shared/
│   │   │   ├── BaseRoom/
│   │   │   │   ├── BaseRoom.jsx
│   │   │   │   ├── BaseRoom.styles.js
│   │   │   │   └── index.js
│   │   │   └── RoomNote/
│   │   │       ├── RoomNote.jsx
│   │   │       ├── RoomNote.styles.js
│   │   │       └── index.js
│   │   ├── Atelier/
│   │   │   ├── AtelierRoom.jsx
│   │   │   └── AtelierRoom.styles.js
│   │   ├── Sanctuaire/
│   │   │   ├── SanctuaireRoom.jsx
│   │   │   └── SanctuaireRoom.styles.js
│   │   ├── Chambre/
│   │   │   ├── ChambreRoom.jsx
│   │   │   ├── ChambreRoom.styles.js
│   │   │   └── index.js
│   │   ├── Cuisine/
│   │   │   ├── CuisineRoom.jsx
│   │   │   └── CuisineRoom.styles.js
│   │   ├── Comptoir/
│   │   │   ├── ComptoirRoom.jsx
│   │   │   ├── ComptoirRoom.styles.js
│   │   │   └── index.js
│   │   ├── Jardin/
│   │   │   ├── JardinRoom.jsx
│   │   │   └── JardinRoom.styles.js
│   │   ├── Forge/
│   │   │   ├── ForgeRoom.jsx
│   │   │   ├── ForgeRoom.styles.js
│   │   │   └── index.js
│   │   ├── Boutique/
│   │   │   ├── BoutiqueRoom.jsx
│   │   │   ├── BoutiqueRoom.styles.js
│   │   │   └── index.js
│   │   ├── Scriptorium/
│   │   │   ├── ScriptoriumRoom.jsx
│   │   │   ├── ScriptoriumRoom.styles.js
│   │   │   └── index.js
│   │   ├── Bibliotheque/
│   │   │   ├── BibliothequeRoom.jsx
│   │   │   ├── BibliothequeRoom.styles.js
│   │   │   └── index.js
│   │   └── Cave/
│   │       ├── CaveRoom.jsx
│   │       ├── CaveRoom.styles.js
│   │       └── index.js
│   ├── common/
│   │   ├── IconButton/
│   │   │   ├── IconButton.jsx
│   │   │   └── IconButton.styles.js
│   │   ├── MarkdownEditor/
│   │   │   ├── MarkdownEditor.jsx
│   │   │   ├── MarkdownEditor.styles.js
│   │   │   ├── index.js
│   │   │   └── MarkdownPreview/
│   │   │       ├── MarkdownPreview.jsx
│   │   │       └── MarkdownPreview.styles.js
│   │   ├── MarkdownToolbar/
│   │   │   └── MarkdownToolbar.jsx
│   │   ├── Panel/
│   │   │   ├── Panel.jsx
│   │   │   ├── Panel.styles.js
│   │   │   ├── PanelContext.jsx
│   │   │   └── index.js
│   │   └── Typography/
│   │       ├── Typography.jsx
│   │       ├── PanelTitle.jsx
│   │       └── index.js
│   └── navigation/
│       └── ArrowButton/
│           ├── ArrowButton.jsx
│           └── ArrowButton.styles.js
├── hooks/
│   ├── useRoomNavigation.js
│   ├── usePanelContent.js
│   └── useTypography.js
├── stores/
│   ├── useNotesStore.js
│   └── useProjectsStore.js
├── styles/
│   ├── theme.js
│   └── mixins.js
├── utils/
│   ├── roomPositions.js
│   ├── buttonMapping.js
│   ├── assetMapping.js
│   └── debounce.js
├── assets/
│   └── images/
│       ├── potion-craft-2.jpg
│       ├── SideTower.jpg
│       ├── rooms/
│       │   ├── atelier-workbench.jpg
│       │   ├── boutique-medieval.jpg
│       │   ├── chambre-cozy.jpg
│       │   └── forge-fire.jpg
│       └── ui/
│           ├── metal-surface.jpg
│           ├── parchment-texture.jpg
│           ├── stone-wall.jpg
│           └── wood-grain.jpg
├── App.jsx
├── main.jsx
└── index.css
