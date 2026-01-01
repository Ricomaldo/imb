---
type: decision
updated: 2025-09-18
---

# ADR-001: Système de Modales avec React Portals

Date: 2024-09-16
Status: Accepté
Auteurs: @Ricomaldo + Claude

## Contexte

Le projet nécessitait un système de modales flexible capable de :
- S'afficher dans différentes zones de l'interface (overlay, RoomCanvas, SideTower)
- Maintenir une hiérarchie z-index cohérente
- Éviter les problèmes de overflow avec les containers parents
- Permettre différentes tailles et comportements

## Décision

Utiliser React Portals avec un système de variantes :

```javascript
// 3 variantes définies
variant = 'overlay'        // Plein écran classique
variant = 'roomCanvas'     // Remplace la zone RoomCanvas
variant = 'baseFloorTower' // Remplace BottomTowerFloor
```

Chaque variante render dans un container spécifique via `createPortal`:
- `document.body` pour overlay
- `#room-canvas-container` pour roomCanvas
- `#notes-floor` pour baseFloorTower

## Conséquences

### Positives
✅ Flexibilité maximale de positionnement
✅ Évite les problèmes de z-index complexes
✅ Performance optimale (render uniquement où nécessaire)
✅ Réutilisabilité du composant Modal de base

### Négatives
⚠️ Nécessite des IDs sur les containers cibles
⚠️ Plus complexe qu'une simple modale
⚠️ Dépendance à la structure DOM

### Neutres
• Apprentissage des React Portals nécessaire
• Pattern non conventionnel mais puissant

## Alternatives considérées

1. **Modales séparées** : Créer 3 composants distincts
   - Rejeté : Duplication de code

2. **Position absolute simple** : Sans portals
   - Rejeté : Problèmes de z-index et overflow

3. **Library externe** : react-modal ou similar
   - Rejeté : Trop générique, manque de contrôle

## Références

- [React Portals Documentation](https://react.dev/reference/react-dom/createPortal)
- Commit: bd94091 - "Implémentation du système de modales centralisé"

## Apprentissages

Le pattern Portal + Variants est extrêmement puissant pour les UI complexes. À réutiliser pour tooltips, dropdowns, et autres overlays contextuels.
