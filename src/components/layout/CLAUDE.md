# CLAUDE.md - Layout

> Système de navigation spatiale et structure visuelle

## Hiérarchie

```
App
└── MainLayout (conteneur principal)
    ├── LayoutWrapper (flexbox row)
    │   ├── MainContent (flex: 1, contient RoomCanvas)
    │   │   └── RoomCanvas (navigation spatiale 4x3)
    │   │       └── BaseRoom (wrapper pièce)
    │   │           └── PanelGrid (grille de panels)
    │   │               └── Panel (unité de contenu)
    │   └── SideTower (20% desktop, 15% tablet, collapsible)
    │       └── TowerWrapper (gère collapse)
    │           └── TowerContainer (grid 3 étages)
    │               ├── TopTowerFloor → TowerHeader
    │               ├── MiddleTowerFloor → TowerToolbar
    │               └── BottomTowerFloor → TowerViewer
    └── SideTowerToggleButton (bouton collapse fixed)
```

---

## Composants Principaux

### MainLayout
**Fichier** : `MainLayout/MainLayout.jsx`

**Rôle** : Conteneur racine, gère le layout responsive et l'auto-collapse de SideTower

```jsx
const MainLayout = ({ responsiveLevel = 'desktop', layout }) => {
  const roomNavHook = useRoomNavigation();
  const { sideTowerCollapsed, toggleSideTowerCollapse, setSideTowerCollapsed } = usePreferencesStore();

  // Auto-collapse bidirectionnel à 1024px
  useEffect(() => {
    // Collapse si < 1024px, expand si >= 1024px (seulement au resize)
  }, []);

  return (
    <>
      <LayoutWrapper>
        <MainContent>
          <RoomCanvas roomNavHook={roomNavHook} />
        </MainContent>
        <SideTower responsiveLevel={responsiveLevel} />
      </LayoutWrapper>
      <SideTowerToggleButton onClick={toggleSideTowerCollapse} />
    </>
  );
};
```

**Features** :
- Auto-collapse SideTower à < 1024px (bidirectionnel)
- Layout flexbox (MainContent flex: 1, SideTower width: 20%/15%)
- Bouton collapse fixed toujours visible (z-index: 9999)

---

### LayoutWrapper
**Fichier** : `MainLayout/MainLayout.styles.js`

**Rôle** : Container flexbox pour MainContent + SideTower

```javascript
export const LayoutWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100svh;
  width: 100%;
  background: black;
  overflow: hidden;
`;
```

**Pattern flexbox** :
- `MainContent` : `flex: 1` (prend tout l'espace restant)
- `SideTower` : `width: 20%` (fixe, s'adapte selon responsive)

---

### MainContent
**Fichier** : `MainLayout/MainLayout.styles.js`

**Rôle** : Zone contenu principale, contient RoomCanvas

```javascript
export const MainContent = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.sm};
  background: black;
  box-sizing: border-box;
  transition: flex 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;
```

**S'étend automatiquement** quand SideTower collapse (flex: 1 prend tout l'espace).

---

### SideTowerToggleButton
**Fichier** : `MainLayout/MainLayout.styles.js`

**Rôle** : Bouton collapse/expand de la SideTower, toujours visible

```javascript
export const SideTowerToggleButton = styled.button`
  position: fixed;
  right: ${({ collapsed }) => collapsed ? '0' : '20%'};
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 120px;
  background: ${({ theme }) => theme.colors.accents.neutral};
  z-index: 9999;
  cursor: pointer;
  opacity: 0.9;

  &:hover {
    width: 32px;
    background: ${({ theme }) => theme.colors.accents.warm};
  }

  /* Responsive tablet */
  @media ${MEDIA_QUERIES.tablet} {
    width: 32px;
    height: 140px;
    &:hover { width: 40px; }
  }
`;
```

**Position** :
- `right: 20%` quand SideTower ouverte (desktop)
- `right: 15%` sur tablet
- `right: 0` quand collapsed (bord droit de l'écran)

**Visibilité** :
- Toujours visible (z-index maximal)
- Taille tactile adaptée iPad (32px × 140px sur tablet)

---

## SideTower - Architecture 3 Étages

### SideTower
**Fichier** : `SideTower/SideTower.jsx`

**Rôle** : Panneau latéral persistant avec 3 sections thématiques

```jsx
const SideTower = ({ responsiveLevel = 'desktop' }) => {
  const sideTowerCollapsed = usePreferencesStore((state) => state.sideTowerCollapsed);

  return (
    <TowerWrapper collapsed={sideTowerCollapsed} responsiveLevel={responsiveLevel}>
      <TowerContainer responsiveLevel={responsiveLevel}>
        <TopTowerFloor id="header-floor">
          <TowerHeader />
        </TopTowerFloor>

        <MiddleTowerFloor id="toolbar-floor">
          <TowerToolbar />
        </MiddleTowerFloor>

        <BottomTowerFloor id="viewer-floor">
          <TowerViewer />
        </BottomTowerFloor>
      </TowerContainer>
    </TowerWrapper>
  );
};
```

**Structure Grid** :
```javascript
// TowerContainer
grid-template-rows: auto 3fr 320px;  // Desktop
grid-template-rows: auto 2fr 280px;  // Tablet
```

---

### TowerWrapper
**Fichier** : `SideTower/SideTower.styles.js`

**Rôle** : Gère l'affichage/masquage de la SideTower (collapse)

```javascript
export const TowerWrapper = styled.div`
  position: relative;
  flex: 0 0 auto;
  height: 100%;
  width: ${({ collapsed }) => collapsed ? '0' : '20%'};
  z-index: 100;
  background: black;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  opacity: ${({ collapsed }) => collapsed ? '0' : '1'};
  visibility: ${({ collapsed }) => collapsed ? 'hidden' : 'visible'};
  pointer-events: ${({ collapsed }) => collapsed ? 'none' : 'auto'};

  @media ${MEDIA_QUERIES.tablet} {
    width: ${({ collapsed }) => collapsed ? '0' : '15%'};
  }
`;
```

**Largeurs responsive** :
- Desktop (≥ 1440px) : 20%
- TabletWide (1024-1439px) : 20%
- Tablet (768-1023px) : 15%
- Collapsed : 0 (width, opacity, visibility, pointer-events)

---

### TopTowerFloor → TowerHeader

**Fichier** : `tower/TowerHeader/TowerHeader.jsx`

**Rôle** : Date/Heure + Actions globales (Sync, Settings, WIP)

```jsx
<TowerContainer>
  {/* Date + Heure (pleine largeur) */}
  <DateTimeSection>
    <TimeDisplay>16:36</TimeDisplay>
    <DateDisplay>2026-01-01</DateDisplay>
  </DateTimeSection>

  {/* Actions Globales (4 boutons) */}
  <GlobalActionsRow>
    <IconButton icon="🔄" title="Synchronisation" />
    <IconButton icon="⚙️" title="Paramètres" />
    <IconButton icon="🚧" disabled placeholder />
    <IconButton icon="🚧" disabled placeholder />
  </GlobalActionsRow>
</TowerContainer>
```

**Grid** : `grid-template-rows: auto 1fr` (DateTimeSection prend hauteur auto, Actions le reste)

---

### MiddleTowerFloor → TowerToolbar

**Fichier** : `tower/TowerToolbar/TowerToolbar.jsx`

**Rôle** : Actions thématiques par onglets (4 tabs)

```jsx
const TowerToolbar = () => {
  const [activeTab, setActiveTab] = useState('viewer');
  const setTowerViewerContent = usePreferencesStore((state) => state.setTowerViewerContent);

  const handleItemClick = (item) => {
    if (item.placeholder) return;

    // Si viewerType défini, changer contenu du viewer
    if (item.viewerType) {
      setTowerViewerContent(item.viewerType);
    }

    // Sinon exécuter action normale (modale, etc.)
    if (item.action || item.onClick) {
      (item.action || item.onClick)();
    }
  };

  return (
    <ToolbarContainer>
      <TabsHeader>
        {toolbarTabs.map(tab => (
          <TabButton $active={tab.id === activeTab} onClick={() => setActiveTab(tab.id)}>
            {tab.icon}
          </TabButton>
        ))}
      </TabsHeader>
      <TabContent>
        <ItemsGrid>
          {items.map(item => (
            <IconButton
              icon={item.icon}
              onClick={() => handleItemClick(item)}
              disabled={item.placeholder}
            />
          ))}
        </ItemsGrid>
      </TabContent>
    </ToolbarContainer>
  );
};
```

**4 Tabs** (depuis `buttonMapping.js`) :
- **Viewer** (👁️) : Notes, Timer, Calendrier, WIP
- **Projets** (📊) : Actions projets (WIP)
- **Test UI** (🧪) : Tests composants (WIP)
- **WIP** (🚧) : Placeholders futurs

**Pattern `viewerType`** :
```javascript
// Dans buttonMapping.js
{ id: 'notes', icon: '📝', label: 'Notes', viewerType: 'notes' }
{ id: 'timer', icon: '⏱️', label: 'Timer', viewerType: 'timer' }
```

Quand cliqué, change `towerViewerContent` dans store → TowerViewer affiche le contenu correspondant.

---

### BottomTowerFloor → TowerViewer

**Fichier** : `tower/TowerViewer/TowerViewer.jsx`

**Rôle** : Viewer dynamique multi-contenus (Notes, Timer, Calendrier, etc.)

```jsx
const TowerViewer = () => {
  const { towerViewerContent } = usePreferencesStore();

  const renderContent = () => {
    switch (towerViewerContent) {
      case 'timer':
        return <TimeTimer maxSize={250} colorSelect={false} />;

      case 'notes':
        return (
          <>
            {/* Header avec toggle Desktop/Companion */}
            <div>
              <IconButton
                icon={isSideTowerSource ? '🖥️' : '📱'}
                onClick={toggleSideTowerNotesSource}
                variant="ghost"
                title="Notes Dev (Desktop/Companion)"
              />
              <MarkdownToolbar {...} />
            </div>

            {/* MarkdownEditor */}
            <MarkdownEditor value={currentNote} onChange={updateNote} />
          </>
        );

      default:
        return <p>Aucun contenu à afficher</p>;
    }
  };

  return (
    <ViewerContainer>
      {renderContent()}
      <IconButton icon="⬇️" label="Fermer" onClick={() => setIsExpanded(false)} />
    </ViewerContainer>
  );
};
```

**Contenus disponibles** :
- `'notes'` : Notes Dev (Desktop ↔ Companion avec toggle 🖥️/📱)
- `'timer'` : TimeTimer widget
- `'calendar'` : Calendrier (WIP)
- Autres à venir...

**Notes Dev** :
- 2 sources : `'sidetower'` (Desktop) ou `'companion'` (Companion)
- Toggle via IconButton 🖥️/📱
- Même store `useNotesStore` : `sideTowerNotes.general` ou `companionNotes.devNote`

---

## RoomCanvas

**Fichier** : `RoomCanvas/RoomCanvas.jsx`

**Rôle** : Affiche la pièce courante selon la position

```jsx
const RoomCanvas = ({ roomNavHook }) => {
  const { currentPosition } = roomNavHook;

  const currentRoom = roomConfig.find(
    room => room.x === currentPosition.x && room.y === currentPosition.y
  );

  const RoomComponent = getRoomComponent(currentRoom.type);

  return (
    <CanvasContainer>
      <RoomComponent />
    </CanvasContainer>
  );
};
```

**Canvas 4x3** : Grille virtuelle avec 12 pièces (positions 1-4 sur x, 1-3 sur y)

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

## Responsive Design

### Breakpoints (responsiveConfig.js)

| Breakpoint | Range | Usage |
|------------|-------|-------|
| `mobile` | < 576px | Phones |
| `tablet` | 768-1023px | iPad portrait, tablets |
| `tabletWide` | ≥ 1024px | iPad landscape, desktop |
| `tabletWideOnly` | 1024-1439px | iPad horizontal, small desktop |
| `desktop` | ≥ 1440px | Desktop complet |

### Auto-Collapse Logic

**MainLayout.jsx** :
```javascript
useEffect(() => {
  let previousWidth = window.innerWidth;

  const handleResize = () => {
    const currentWidth = window.innerWidth;

    // Seulement agir si on traverse le seuil 1024px
    const crossedThreshold =
      (previousWidth < 1024 && currentWidth >= 1024) ||
      (previousWidth >= 1024 && currentWidth < 1024);

    if (crossedThreshold) {
      setSideTowerCollapsed(currentWidth < 1024);
    }

    previousWidth = currentWidth;
  };

  // Check initial
  if (window.innerWidth < 1024) {
    setSideTowerCollapsed(true);
  }

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [setSideTowerCollapsed]);
```

**Comportement** :
- < 1024px : Auto-collapse
- ≥ 1024px : Auto-expand
- Pas de conflit avec toggle manuel (seulement au resize qui traverse seuil)

### IconButton Responsive

**IconButton.styles.js** :
```javascript
/* Desktop (default) */
medium: 48px × 48px, fontSize: 20px

/* TabletWideOnly (1024-1439px) - iPad horizontal */
@media ${MEDIA_QUERIES.tabletWideOnly} {
  medium: 44px × 44px, fontSize: 16px
}

/* Tablet (768-1023px) */
@media ${MEDIA_QUERIES.tablet} {
  medium: 40px × 40px, fontSize: 14px
}
```

### MarkdownToolbar Responsive

**MarkdownToolbar.jsx** :
```javascript
/* Desktop (default) */
minWidth: 32px, height: 24px, fontSize: 12px

/* TabletWideOnly (1024-1439px) */
@media ${MEDIA_QUERIES.tabletWideOnly} {
  minWidth: 28px, height: 22px, fontSize: 11px
}

/* Tablet (768-1023px) */
@media ${MEDIA_QUERIES.tablet} {
  minWidth: 26px, height: 20px, fontSize: 10px
}
```

---

## Navigation Spatiale

### Positions Valides (roomPositions.js)

```javascript
const defaultRoomConfig = [
  // Ligne 1
  { x: 1, y: 1, type: 'sanctuaire' },
  { x: 2, y: 1, type: 'chambre' },
  { x: 3, y: 1, type: 'scriptorium' },
  { x: 4, y: 1, type: 'comptoir' },

  // Ligne 2 (centre)
  { x: 1, y: 2, type: 'cuisine' },
  { x: 2, y: 2, type: 'atelier' },  // Position par défaut
  { x: 3, y: 2, type: 'forge' },
  { x: 4, y: 2, type: 'boutique' },

  // Ligne 3
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

// Vérifier si pièce existe à cette position
roomExistsAt({ x: 2, y: 2 }); // true (Atelier)
roomExistsAt({ x: 0, y: 0 }); // false (vide)
```

---

## Flux de Rendu

```
1. MainLayout initialise avec auto-collapse check
2. MainContent contient RoomCanvas
3. RoomCanvas lookup roomConfig → type: 'atelier' (défaut x:2, y:2)
4. RoomRegistry.getRoomComponent('atelier') → AtelierRoom
5. AtelierRoom render avec BaseRoom + PanelGrid + Panels
6. SideTower render avec 3 étages (Header/Toolbar/Viewer)
7. SideTowerToggleButton toujours visible (fixed)
```

---

## Store Integration

### usePreferencesStore

**États liés au layout** :
```javascript
{
  defaultRoom: { x: 2, y: 2 },           // Position démarrage (Atelier)
  customRoomLayout: null,                // Layout personnalisé (futur)
  sideTowerCollapsed: false,             // État collapse SideTower
  sideTowerNotesSource: 'sidetower',     // Source notes ('sidetower' | 'companion')
  towerViewerContent: 'notes',           // Contenu viewer ('notes' | 'timer' | ...)
  roomUIStates: { /* états panels */ }   // États UI par pièce
}
```

**Actions** :
- `toggleSideTowerCollapse()` / `setSideTowerCollapsed(bool)`
- `toggleSideTowerNotesSource()` / `setSideTowerNotesSource(source)`
- `setTowerViewerContent(contentType)`
- `setDefaultRoom(position)` / `getDefaultRoom()`

---

## Patterns Établis

### Flexbox Layout
```
LayoutWrapper (flex row)
├── MainContent (flex: 1)  ← S'étend pour remplir l'espace
└── SideTower (width: 20%) ← Largeur fixe responsive
```

### Grid Layout (SideTower)
```
TowerContainer (grid)
├── TopTowerFloor (auto)     ← Hauteur contenu (DateTime + Actions)
├── MiddleTowerFloor (3fr)   ← Flex space pour toolbar
└── BottomTowerFloor (320px) ← Hauteur fixe pour viewer
```

### Dynamic Content Switching (TowerViewer)
```javascript
// buttonMapping.js
{ id: 'timer', icon: '⏱️', viewerType: 'timer' }

// TowerToolbar.jsx
if (item.viewerType) {
  setTowerViewerContent(item.viewerType);
}

// TowerViewer.jsx
switch (towerViewerContent) {
  case 'timer': return <TimeTimer />;
  case 'notes': return <MarkdownEditor />;
}
```

### Responsive Pattern (Mobile-First)
```javascript
/* Desktop (default) */
width: 48px;

/* TabletWideOnly (1024-1439px) */
@media ${MEDIA_QUERIES.tabletWideOnly} {
  width: 44px;
}

/* Tablet (768-1023px) */
@media ${MEDIA_QUERIES.tablet} {
  width: 40px;
}
```

---

## Customisation Layout (Future)

Le store `usePreferencesStore` peut stocker un `customRoomLayout` pour réorganiser les pièces.

```javascript
// roomPositions.js vérifie d'abord customRoomLayout
const getRoomConfig = () => {
  const customLayout = prefs?.state?.customRoomLayout;
  if (customLayout && Array.isArray(customLayout)) {
    return customLayout;
  }
  return defaultRoomConfig;
};
```

---

## Conventions

- **Composants Tower** : Prefixe `Tower` (TowerHeader, TowerToolbar, TowerViewer)
- **Floors** : Suffixe `Floor` (TopTowerFloor, MiddleTowerFloor, BottomTowerFloor)
- **roomType** : lowercase, sans accents (`bibliotheque`)
- **Positions** : Objets `{ x: number, y: number }`
- **Navigation** : Via `getAdjacentRooms()` + `roomExistsAt()`
- **ViewerType** : String identifier dans buttonMapping (`'notes'`, `'timer'`, etc.)
