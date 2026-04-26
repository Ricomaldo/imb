---
type: architecture
updated: 2025-09-18
---

# Organisation des Composants - IRIMMetaBrain

## Vue d'ensemble

L'architecture des composants suit une organisation modulaire claire pour faciliter la maintenance et la réutilisabilité.

## Structure des Dossiers

### `/widgets`
**Composants réutilisables** pouvant être utilisés dans plusieurs contextes.

Exemples :
- `MindLog` : Tracker d'humeur configurable
- `ActionList` : Liste de tâches générique
- `ImageCarousel` : Carousel d'images/screenshots

### `/room-modules`
**Composants ultra-spécifiques** à une room particulière.

Structure :
- Un sous-dossier par room (atelier/, forge/, etc.)
- Contient les composants qui n'ont de sens QUE dans cette room

### `/rooms`
**Pages complètes** représentant chaque pièce du château.

- Fichiers `*Room.jsx` (AtelierRoom, ForgeRoom, etc.)
- Utilisent BaseRoom comme layout
- Composent widgets et room-modules

### `/dev`
**Outils de développement** et meta-système.

- `ComponentCatalog` : Documentation vivante des composants
- `RoomNote` : Système de notes de dev attachées aux rooms

### `/common`
**Composants UI de base** (Button, Panel, Modal, etc.)

### `/navigation`
**Composants de navigation** (NavigationArrows, etc.)

### `/tower`
**Composants de la tour de contrôle**

### `/layout`
**Layouts de base** (BaseRoom, PanelGrid, etc.)

## Règles de Placement

1. **C'est réutilisable ?** → `widgets/`
2. **C'est spécifique à UNE room ?** → `room-modules/{room}/`
3. **C'est une page complète ?** → `rooms/`
4. **C'est pour le dev/debug ?** → `dev/`
5. **C'est un composant UI basique ?** → `common/`

## ComponentCatalog

Le catalog affiche automatiquement :
- ✅ widgets/
- ✅ common/
- ✅ navigation/
- ✅ tower/
- ✅ dev/
- ❌ rooms/ (pages complètes)
- ❌ layout/ (infrastructure)
- ❌ room-modules/ (trop spécifiques)

## Migration des Composants

Lors du refactor de 2025-09-18 :
- `Atelier/MindLog` → `widgets/MindLog`
- `Atelier/Actions` → `widgets/ActionList`
- `Atelier/ScreenTV` → `widgets/ImageCarousel`
- `rooms/shared/RoomNote` → `dev/RoomNote`
- `Undefined/` → `Laboratoire/`