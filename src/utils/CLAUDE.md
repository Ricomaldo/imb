# CLAUDE.md - Utils

> Utilitaires et configuration spatiale

## Structure

```
utils/
├── roomPositions.js    # Configuration grille spatiale
├── assetMapping.js     # Mapping assets (backgrounds, textures)
├── RoomRegistry.jsx    # Registry composants pièces
├── debounce.js         # Helper debounce
└── helpers.js          # Fonctions utilitaires diverses
```

---

## roomPositions.js

**Le cœur de la navigation spatiale**

### Configuration Grille

```javascript
// Canvas 6x5, maison 4x3 centrée (x: 1-4, y: 1-3)
const defaultRoomConfig = [
  // Ligne 1
  { x: 1, y: 1, type: 'sanctuaire', name: 'Sanctuaire' },
  { x: 2, y: 1, type: 'chambre', name: 'Chambre' },
  { x: 3, y: 1, type: 'scriptorium', name: 'Scriptorium' },
  { x: 4, y: 1, type: 'comptoir', name: 'Comptoir' },

  // Ligne 2
  { x: 1, y: 2, type: 'cuisine', name: 'Cuisine' },
  { x: 2, y: 2, type: 'atelier', name: 'Atelier' },  // CENTRE
  { x: 3, y: 2, type: 'forge', name: 'Forge' },
  { x: 4, y: 2, type: 'boutique', name: 'Boutique' },

  // Ligne 3
  { x: 1, y: 3, type: 'laboratoire', name: 'Laboratoire' },
  { x: 2, y: 3, type: 'bibliotheque', name: 'Bibliothèque' },
  { x: 3, y: 3, type: 'jardin', name: 'Jardin' },
  { x: 4, y: 3, type: 'cave', name: 'Cave' }
];
```

### Exports

```javascript
// Configuration actuelle (prend en compte customLayout si défini)
export const roomConfig = getRoomConfig();

// Positions adjacentes
export const getAdjacentRooms = (currentPos) => {
  return {
    up: currentPos.y > 0 ? { x: currentPos.x, y: currentPos.y - 1 } : null,
    down: currentPos.y < 4 ? { x: currentPos.x, y: currentPos.y + 1 } : null,
    left: currentPos.x > 0 ? { x: currentPos.x - 1, y: currentPos.y } : null,
    right: currentPos.x < 5 ? { x: currentPos.x + 1, y: currentPos.y } : null
  };
};

// Validation position (dans canvas 6x5)
export const isValidPosition = (pos) => {
  return pos && pos.x >= 0 && pos.x <= 5 && pos.y >= 0 && pos.y <= 4;
};

// Vérifie si pièce existe à cette position
export const roomExistsAt = (pos) => {
  if (!pos) return false;
  return getRoomConfig().some(room => room.x === pos.x && room.y === pos.y);
};
```

### Custom Layout

```javascript
// Vérifie preferences store pour layout personnalisé
const getRoomConfig = () => {
  const customLayout = prefs?.state?.customRoomLayout;
  if (customLayout && customLayout.length === 12) {
    return customLayout;
  }
  return defaultRoomConfig;
};
```

---

## assetMapping.js

**Mapping des assets visuels par pièce**

### Backgrounds

```javascript
export const roomBackgrounds = {
  sanctuaire: '/backgrounds/sanctuaire.jpg',
  chambre: '/backgrounds/chambre.jpg',
  scriptorium: '/backgrounds/scriptorium.jpg',
  comptoir: '/backgrounds/comptoir.jpg',
  cuisine: '/backgrounds/cuisine.jpg',
  atelier: '/backgrounds/atelier.jpg',
  forge: '/backgrounds/forge.jpg',
  boutique: '/backgrounds/boutique.jpg',
  laboratoire: '/backgrounds/laboratoire.jpg',
  bibliotheque: '/backgrounds/bibliotheque.jpg',
  jardin: '/backgrounds/jardin.jpg',
  cave: '/backgrounds/cave.jpg'
};
```

### Textures (pour Panels)

```javascript
export const textureMap = {
  stone: '/textures/stone.png',
  wood: '/textures/wood.png',
  parchment: '/textures/parchment.png',
  metal: '/textures/metal.png',
  leather: '/textures/leather.png',
  fabric: '/textures/fabric.png'
};
```

---

## RoomRegistry.jsx

**Registry des composants de pièces**

```javascript
import AtelierRoom from '../components/rooms/Atelier/AtelierRoom';
import ChambreRoom from '../components/rooms/Chambre/ChambreRoom';
// ... autres imports

const roomComponents = {
  atelier: AtelierRoom,
  chambre: ChambreRoom,
  sanctuaire: SanctuaireRoom,
  // ... autres pièces
};

export const getRoomComponent = (roomType) => {
  return roomComponents[roomType] || DefaultRoom;
};
```

### Ajouter une pièce

1. Créer `src/components/rooms/MaPiece/MaPieceRoom.jsx`
2. Importer dans `RoomRegistry.jsx`
3. Ajouter au mapping : `mapiece: MaPieceRoom`

---

## debounce.js

**Helper pour limiter les appels fréquents**

```javascript
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
```

### Usage

```javascript
import { debounce } from '../utils/debounce';

// Dans un composant
const debouncedSave = useMemo(
  () => debounce((value) => saveToStore(value), 500),
  []
);

// Ou export pré-configuré dans store
export const debouncedUpdateRoomNote = debounce((roomType, content) => {
  useNotesStore.getState().updateRoomNote(roomType, content);
}, 500);
```

---

## Schéma Spatial

```
Canvas 6x5 (positions 0-5 sur x, 0-4 sur y)

    0     1     2     3     4     5
  +-----+-----+-----+-----+-----+-----+
0 |     |     |     |     |     |     |
  +-----+-----+-----+-----+-----+-----+
1 |     | SAN | CHA | SCR | COM |     |
  +-----+-----+-----+-----+-----+-----+
2 |     | CUI | ATE | FOR | BOU |     |
  +-----+-----+-----+-----+-----+-----+
3 |     | LAB | BIB | JAR | CAV |     |
  +-----+-----+-----+-----+-----+-----+
4 |     |     |     |     |     |     |
  +-----+-----+-----+-----+-----+-----+

Légende:
SAN=Sanctuaire, CHA=Chambre, SCR=Scriptorium, COM=Comptoir
CUI=Cuisine, ATE=Atelier, FOR=Forge, BOU=Boutique
LAB=Laboratoire, BIB=Bibliothèque, JAR=Jardin, CAV=Cave
```

### Position par défaut

```javascript
// Atelier au centre
defaultRoom: { x: 2, y: 2 }
```

---

## Conventions

- **roomType** : lowercase, sans accents (`bibliotheque`)
- **Positions** : Objets `{ x: number, y: number }`
- **Navigation** : Via `getAdjacentRooms()` + `roomExistsAt()`
