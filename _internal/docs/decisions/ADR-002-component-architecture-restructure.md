---
type: decision
updated: 2025-09-18
---

# ADR-002: Restructuration Architecture Composants

## Statut
Accepté et implémenté

## Contexte
Le projet avait besoin d'une organisation claire des composants pour distinguer :
- Les composants réutilisables
- Les composants spécifiques aux rooms
- Les outils de développement
- Les pages complètes (rooms)

Le ComponentCatalog nécessitait une structure permettant de filtrer intelligemment les composants à afficher.

## Décision

### Nouvelle structure adoptée :

```
src/components/
├── widgets/           # Composants réutilisables
│   ├── MindLog/       # Tracker d'humeur
│   ├── ActionList/    # Todo list (ex-Actions)
│   └── ImageCarousel/ # Carousel d'images (ex-ScreenTV)
│
├── room-modules/      # Composants spécifiques aux rooms
│   ├── atelier/       # Modules uniques à l'Atelier
│   ├── forge/         # Modules uniques à la Forge
│   └── .../          # Un dossier par room
│
├── rooms/            # Pages complètes
│   ├── Atelier/      # AtelierRoom.jsx
│   ├── Laboratoire/  # LaboratoireRoom.jsx (ex-Undefined)
│   └── .../
│
├── dev/              # Outils de développement
│   ├── ComponentCatalog/
│   └── RoomNote/     # Notes de dev (meta-système)
│
├── common/           # Composants UI de base
├── navigation/       # Navigation
├── tower/           # Tour de contrôle
└── layout/          # Layouts de base
```

## Conséquences

### Positives
- **Séparation claire** des responsabilités
- **ComponentCatalog** peut filtrer intelligemment (exclut rooms/*Room et layout/)
- **Réutilisabilité** : widgets/ contient les composants génériques
- **Scalabilité** : room-modules/ prêt pour futurs composants spécifiques
- **Clarté** : Undefined renommé en Laboratoire

### Négatives
- Migration nécessaire des imports existants
- Plus de dossiers (mais mieux organisés)

## Notes
- RoomNote est dans dev/ car c'est du meta-système (notes de développement)
- Les dossiers dans room-modules/ sont créés même vides pour la clarté
- ComponentCatalog affiche : widgets/, common/, tower/, navigation/, dev/