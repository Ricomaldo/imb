---
type: milestone
updated: 2025-09-18
---

# IRIM StudioLab - Phase -1 : Wireframe & Assets

## Objectif Phase -1

Créer le wireframe de base avec structure layout claire et collecter les assets visuels pour l'ambiance craft médiévale.

## Architecture Layout

### Structure Components
```
StudioHall (container principal)
├── RoomCanvas (75% largeur) - Zone navigation spatiale
└── SideTower (25% largeur) - Interface permanente
    ├── ControlTower (100px haut) - Contexte temporel
    └── WorkbenchDrawer (100px bas) - Outils opérationnels
```

### Navigation Spatiale Prévue
4 pièces de base : Chambre → Atelier → Forge → Boutique
Navigation par clic bords écran (inspiration Potion Craft)

## Stack Technique

- **Framework :** React + Vite
- **Styling :** CSS-in-JS (styled-components/emotion)
- **État :** Zustand (prévu phase suivante)

## Assets Requis Phase -1

### Fonds de Pièce (4 minimum)
- Chambre : ambiance chaleureuse, privée
- Atelier : établi bois, outils artisan
- Forge : métallique, feu/charbon
- Boutique : commercial médiéval

### Éléments UI
- Texture parchemin (panneaux/notes)
- Bordures craft médiévales
- Boutons navigation discrets

## Validation Phase -1

✅ Navigation fluide entre 4 pièces vides  
✅ Plaisir visuel maintenu 10min+ sans fonctionnalité  
✅ Structure layout prête pour développement Phase 0

## Next Phase

Phase 0 : Intégration données projets dans structure validée

---

*Eric - Septembre 2025*  
*Approche atomique : 1 brique fonctionnelle à la fois*
