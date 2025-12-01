# CLAUDE.md - Layout

> Système de navigation spatiale et structure visuelle

## Hiérarchie

```
App
└── StudioHall (conteneur principal)
    ├── RoomCanvas (navigation spatiale 6x5)
    │   └── BaseRoom (wrapper pièce)
    │       └── PanelGrid (grille de panels)
    │           └── Panel (unité de contenu)
    └── SideTower (panneau latéral)
```

## Composants

### StudioHall
**Fichier** : `StudioHall/StudioHall.jsx`

**Rôle** : Conteneur racine, gère la position courante et la navigation

```jsx
// État
const [currentPosition, setCurrentPosition] = useState({ x: 2, y: 2 }); // Atelier par défaut

// Rendu
<StudioHallContainer>
  <RoomCanvas
    currentPosition={currentPosition}
    onNavigate={handleNavigate}
  />
  <NavigationArrows
    currentPosition={currentPosition}
    onNavigate={handleNavigate}
  />
  <SideTower />
</StudioHallContainer>
```

---

### RoomCanvas
**Fichier** : `RoomCanvas/RoomCanvas.jsx`

**Rôle** : Affiche la pièce courante selon la position

```jsx
// Logique
const currentRoom = roomConfig.find(
  room => room.x === currentPosition.x && room.y === currentPosition.y
);

// Rendu dynamique via RoomRegistry
const RoomComponent = getRoomComponent(currentRoom.type);
return <RoomComponent />;
```

**Canvas 6x5** : Grille virtuelle avec maison 4x3 centrée (positions 1-4 sur x, 1-3 sur y)

---

### BaseRoom
**Fichier** : `BaseRoom/BaseRoom.jsx`

**Rôle** : Wrapper pour chaque pièce, applique le style de base

```jsx
<BaseRoom roomType="chambre" layoutType="grid">
  {children}
</BaseRoom>
```

**Props** :
| Prop | Type | Description |
|------|------|-------------|
| `roomType` | string | Identifiant pièce (pour styles) |
| `layoutType` | `'grid'` | Type de disposition |
| `children` | ReactNode | Contenu (PanelGrid) |

**Applique** :
- Background selon `roomBackgrounds[roomType]`
- Padding et dimensions
- Context pour les enfants

---

### PanelGrid
**Fichier** : `PanelGrid/PanelGrid.jsx`

**Rôle** : Grille CSS Grid pour positionner les panels

```jsx
<PanelGrid columns={5} rows={5}>
  <Panel gridColumn="1 / 3" gridRow="1 / 2" />
  <Panel gridColumn="3 / 6" gridRow="1 / 3" />
</PanelGrid>
```

**Props** :
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | number | 3 | Colonnes de la grille |
| `rows` | number | 2 | Lignes de la grille |
| `gap` | string | `'12px'` | Espacement |

**CSS généré** :
```css
display: grid;
grid-template-columns: repeat(5, 1fr);
grid-template-rows: repeat(5, 1fr);
gap: 12px;
```

---

### SideTower
**Fichier** : `SideTower/SideTower.jsx`

**Rôle** : Panneau latéral persistant (notes globales, outils)

```jsx
// Position fixe à droite
<SideTowerContainer>
  <SideTowerNotes />  {/* Notes markdown globales */}
  <ControlTower />    {/* Sync, settings */}
</SideTowerContainer>
```

**Composants enfants** :
- `tower/SideTowerNotes/` - Éditeur markdown notes globales
- `tower/ControlTower/` - Boutons sync, settings
- `tower/WorkbenchDrawer/` - Drawer outils (optionnel)

---

## Navigation

### Positions Valides

```javascript
// src/utils/roomPositions.js
const defaultRoomConfig = [
  // y=1
  { x: 1, y: 1, type: 'sanctuaire' },
  { x: 2, y: 1, type: 'chambre' },
  { x: 3, y: 1, type: 'scriptorium' },
  { x: 4, y: 1, type: 'comptoir' },
  // y=2
  { x: 1, y: 2, type: 'cuisine' },
  { x: 2, y: 2, type: 'atelier' },    // Centre
  { x: 3, y: 2, type: 'forge' },
  { x: 4, y: 2, type: 'boutique' },
  // y=3
  { x: 1, y: 3, type: 'laboratoire' },
  { x: 2, y: 3, type: 'bibliotheque' },
  { x: 3, y: 3, type: 'jardin' },
  { x: 4, y: 3, type: 'cave' }
];
```

### Helpers Navigation

```javascript
import { getAdjacentRooms, isValidPosition, roomExistsAt } from '../../utils/roomPositions';

// Positions adjacentes
const adjacent = getAdjacentRooms({ x: 2, y: 2 });
// → { up: {x:2,y:1}, down: {x:2,y:3}, left: {x:1,y:2}, right: {x:3,y:2} }

// Vérifier si position dans canvas 6x5
isValidPosition({ x: 2, y: 2 }); // true
isValidPosition({ x: 6, y: 1 }); // false (hors canvas)

// Vérifier si pièce existe à cette position
roomExistsAt({ x: 2, y: 2 }); // true (Atelier)
roomExistsAt({ x: 0, y: 0 }); // false (vide)
```

### NavigationArrows

Flèches aux bords d'écran pour naviguer :
- Désactivées si pas de pièce adjacente
- Animation de transition (600ms)

---

## Flux de Rendu

```
1. StudioHall initialise position { x: 2, y: 2 }
2. RoomCanvas lookup roomConfig → type: 'atelier'
3. RoomRegistry.getRoomComponent('atelier') → AtelierRoom
4. AtelierRoom render avec BaseRoom + PanelGrid + Panels
5. Chaque Panel positionné via gridColumn/gridRow
```

---

## Customisation Layout

Le store `usePreferencesStore` peut stocker un `customRoomLayout` pour réorganiser les pièces (fonctionnalité future).

```javascript
// roomPositions.js vérifie d'abord customRoomLayout
const getRoomConfig = () => {
  const customLayout = prefs?.state?.customRoomLayout;
  if (customLayout && Array.isArray(customLayout)) {
    // Utiliser layout custom
  }
  return defaultRoomConfig;
};
```
