---
created: 2026-01-01
updated: 2026-01-01
type: report
status: active
---

# Inventaire des 12 Pièces - État Réel vs Prévu

> Comparaison entre les spécifications CLAUDE.md et l'implémentation réelle

---

## 📊 Vue d'Ensemble

| Pièce | Statut Prévu | Statut Réel | Panels | Widgets |
|-------|--------------|-------------|--------|---------|
| Sanctuaire | ✅ Opérationnel | ✅ Complet | 4 | 4 |
| Chambre | ✅ Opérationnel | ✅ Complet | 3 | 3 |
| Scriptorium | ✅ Opérationnel | ✅ Complet | 2 | 2 |
| Comptoir | ⚠️ En construction | ✅ Complet | 4 | 6 |
| Cuisine | ✅ Opérationnel | ✅ Complet | 2 | 2 + horloge |
| **Atelier** | ✅ Opérationnel | ✅ Complet | 3 | 1 + carousel |
| Forge | ✅ Opérationnel | ✅ Complet | 3 + modals | 3 |
| Boutique | ⚠️ En construction | ❌ Vide | 0 | 0 |
| Laboratoire | ✅ Opérationnel | ✅ Complet | 1 sandbox | 1 + controls |
| Bibliothèque | ✅ Opérationnel | ⚠️ Partiel | 3 | 1 + modal |
| Jardin | ⚠️ En construction | ❌ Vide | 0 | 0 |
| Cave | ⚠️ En construction | ✅ Complet | 4 jeux | 3 + levier |

---

## 1. Sanctuaire (1,1)

**Statut** : ✅ Opérationnel (prévu et réel)

**Fonction** : Méditation, Moments OUI (besoins Rosenberg)

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| Totem | 🗿 | stone | ImageDisplay (Lion) | ✅ |
| Mantras | 🕉️ | fabric | QuoteCarousel | ✅ |
| Tri Mental | 🧘 | stone | MindLogSorter | ✅ |
| Moments OUI | ✨ | parchment | MomentsOuiWidget | ✅ |

**Grid** : 5x5

**Notes** : Conforme aux spécifications. Tous les widgets fonctionnels.

---

## 2. Chambre (2,1)

**Statut** : ✅ Opérationnel (prévu et réel)

**Fonction** : Rituels matinaux, TimeTimer, MindLog, Mantras

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| Zone Rouge | 🔴 | stone | ZoneRouge (protocole urgence) | ✅ |
| Journal Quotidien | 📖 | wood | Diary | ✅ |
| Navigation | 🧭 | metal | NavigationGrid | ✅ |

**Grid** : 12x8

**Notes** : Zone Rouge widget complet avec RespirationTimer (4-7-8), mantras Meridian, phases (intro → timer → post). Découvert lors de la mission Fusion Sages M5.

---

## 3. Scriptorium (3,1)

**Statut** : ✅ Opérationnel (prévu et réel)

**Fonction** : Documentation, écriture

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| Brouillon | 📝 | parchment | MarkdownEditor | ✅ |
| Archives du Journal | 📚 | wood | DiaryArchive | ✅ |

**Grid** : 12x8

**Notes** : Layout "effet bureau" spacieux. Espace disponible pour futurs widgets (post-its, planner).

---

## 4. Comptoir (4,1)

**Statut** : ⚠️ En construction (prévu) → ✅ Complet (réel)

**Fonction** : Discussions, échanges, portail Sages

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| Choisir un Sage | 🎭 | metal | SageSelector | ✅ |
| Questions | ❓ | metal | QuestionSelector | ✅ |
| Questions - [Sage] | 📖 | wood | QuestionsPanel | ✅ |
| Créer Handoff | ✉️ | parchment | Button → HandoffCreator modal | ✅ |

**Grid** : 12x8

**Widgets disponibles** (dossier `widgets/`):
- SageSelector.jsx
- QuestionSelector.jsx
- QuestionsPanel.jsx
- HandoffCreator.jsx (modal)
- SagesPortal.jsx (legacy)
- SageQuote.jsx
- ZoneRouge.jsx (utilisé dans Chambre)
- RespirationTimer.jsx (utilisé dans ZoneRouge)

**Notes** : Implémentation dépassant les prévisions. Mission Fusion Sages (M1-M5) complète à 80%. Intégration vault 8sages via REST API. Save questions fonctionnel.

---

## 5. Cuisine (1,2)

**Statut** : ✅ Opérationnel (prévu et réel)

**Fonction** : Bien-être, hydratation, pauses

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| Hydratation | 💧 | wood | HydrationReminder | ✅ |
| Pause Corps | 🧘 | wood | PauseCorps | ✅ |

**Furniture** : AnalogClock (horloge murale)

**Grid** : 5x5

**Notes** : Conforme. Horloge analogique présente (180px, numbers, seconds).

---

## 6. Atelier (2,2) ⭐ Hub Central

**Statut** : ✅ Opérationnel (prévu et réel)

**Fonction** : Projets, Roadmaps, Todos

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| Roadmap | 🗺️ | parchment | MarkdownEditor | ✅ |
| Todo | ✅ | parchment | MarkdownEditor | ✅ |
| Notes | 📝 | parchment | MarkdownEditor | ✅ |

**Navigation** : ProjectCarousel (sélection projet)

**Grid** : 5x5

**Notes** : Hub central fonctionnel. Tous les panels utilisent MarkdownEditor avec contentType="markdown" (toolbar auto). Synchronisation avec useProjectDataStore par projet.

---

## 7. Forge (3,2)

**Statut** : ✅ Opérationnel (prévu et réel)

**Fonction** : Build/deploy, outils techniques

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| Capture de Bugs | 🐛 | metal | CaptureUrgente (type: bug) | ✅ |
| Pause Projet | 💾 | metal | CaptureUrgente (type: saveState) | ✅ |
| Notes Déploiement | 🚀 | metal | DeploymentNotes | ✅ |

**Modals conditionnels** :
- ComponentCatalog (props catalog) - Button "🔨 PROPS"
- SystemOverview (architecture tree) - Button "🌳 TREE"

**Grid** : 5x5

**Toolbar** : 4 boutons (PROPS, TREE, Action 3, Action 4)

**Notes** : Interface dev complète. Pattern toggle modal fullscreen pour catalogue et tree.

---

## 8. Boutique (4,2)

**Statut** : ⚠️ En construction (prévu) → ❌ Vide (réel)

**Fonction** : Présentations, démos

### Panels/Widgets Implémentés

Aucun.

**Notes** : Fichier Room minimal. BoutiqueGrid présent mais vide. À développer.

---

## 9. Laboratoire (1,3)

**Statut** : ✅ Opérationnel (prévu et réel)

**Fonction** : Tests, sandbox composants

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| (Dynamic) | 🔬 | wood | ComponentToTest | ✅ |

**Controls** :
- Width: 1-5 (buttons)
- Height: 1-5 (buttons)
- Toggle Panel visibility

**Grid** : 5x5

**Notes** : Sandbox complet pour tester composants. Système dynamique de resize Panel. Affichage avec/sans Panel. ComponentToTest importable ligne 23.

---

## 10. Bibliothèque (2,3)

**Statut** : ✅ Opérationnel (prévu) → ⚠️ Partiel (réel)

**Fonction** : Références, ressources

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| Projets & Archives | 📊 | wood | ProjectsDropdown | ✅ |
| Notes de Recherche | 🔍 | parchment | (Placeholder) | ⚠️ |
| Collections | ⭐ | metal | (Placeholder) | ⚠️ |

**Modal** : ProjectOverviewModal

**Grid** : 5x5

**Notes** : Widget ProjectsDropdown fonctionnel. 2 panels sont placeholders ("Notes de Recherche", "Collections"). À compléter.

---

## 11. Jardin (3,3)

**Statut** : ⚠️ En construction (prévu) → ❌ Vide (réel)

**Fonction** : Croissance d'idées

### Panels/Widgets Implémentés

Aucun.

**Notes** : Fichier Room minimal. JardinGrid présent mais vide. À développer.

---

## 12. Cave (4,3)

**Statut** : ⚠️ En construction (prévu) → ✅ Complet (réel)

**Fonction** : Secrets, debugging

### Panels/Widgets Implémentés

| Panel | Icon | Texture | Widget/Composant | Statut |
|-------|------|---------|------------------|--------|
| ⚔️ Puzzle Glissant | 🧩 | stone | SlidingPuzzle | ✅ |
| 👑 2048 Medieval | 👑 | wood | Medieval2048 | ✅ |
| 🔮 Mastermind | 🔮 | fabric | Mastermind | ✅ |
| 🏆 Tableau des Scores | 🏆 | metal | (Placeholder scores) | ⚠️ |

**Secret** : SecretLever (levier animé pour révéler jeux)

**Grid** : 5x5

**Notes** : Implémentation dépassant les prévisions. Salle de jeux complète avec 3 jeux fonctionnels. Levier secret avec animation. Tableau scores est placeholder.

---

## 📈 Synthèse

### ✅ Pièces Complètes (9/12)

1. Sanctuaire
2. Chambre
3. Scriptorium
4. Comptoir
5. Cuisine
6. Atelier
7. Forge
8. Laboratoire
9. Cave

### ⚠️ Pièces Partielles (1/12)

10. Bibliothèque (1 widget fonctionnel, 2 placeholders)

### ❌ Pièces Vides (2/12)

8. Boutique
11. Jardin

---

## 🎯 Écarts Prévisions vs Réalité

### Surprises Positives

1. **Comptoir** : Prévu "en construction" → Complet avec système Sages complet (M1-M5 Fusion 8 Sages)
2. **Cave** : Prévue "en construction/debugging" → Salle de jeux complète avec 3 jeux + levier secret
3. **Chambre** : Widget Zone Rouge complet découvert (protocole 3 phases + timer + mantras)

### Pièces À Développer

1. **Boutique** : Vide (présentations/démos)
2. **Jardin** : Vide (croissance idées)
3. **Bibliothèque** : 2 placeholders à remplacer

---

## 📂 Structure Modules

### `/widgets` (Réutilisables)

- DiaryArchive
- Diary
- ImageDisplay
- QuoteCarousel
- MindLog/MindLogCompact

### `/room-modules/{room}` (Spécifiques)

**sanctuaire/**
- MindLogSorter
- MomentsOui

**chambre/**
- NavigationGrid

**atelier/**
- ProjectCarousel

**cuisine/**
- HydrationReminder
- PauseCorps

**forge/**
- CaptureUrgente
- DeploymentNotes

**bibliotheque/**
- ProjectsDropdown

**laboratoire/**
- ComponentToTest

### `/rooms/Comptoir/widgets` (Isolés)

- SageSelector
- QuestionSelector
- QuestionsPanel
- HandoffCreator
- SagesPortal (legacy)
- SageQuote
- ZoneRouge (utilisé dans Chambre)
- RespirationTimer (utilisé dans ZoneRouge)

---

## 📝 Notes Architecturales

### Pattern Panel + MarkdownEditor

Utilisé dans : Atelier (Roadmap, Todo, Notes), Scriptorium (Brouillon), Chambre (Journal), Comptoir (Questions)

**Pourquoi** : Système standardisé avec toolbar auto (zoom, edit/preview, expand, save)

### Grilles Dominantes

- **5x5** : Sanctuaire, Cuisine, Atelier, Forge, Laboratoire, Bibliothèque, Cave
- **12x8** : Chambre, Scriptorium, Comptoir

**Pourquoi 12x8** : Pièces nécessitant plus de flexibilité layout (multi-panels complexes)

### Textures Par Ambiance

| Texture | Pièces | Usage |
|---------|--------|-------|
| `stone` | Sanctuaire, Chambre (Zone Rouge), Cave | Ancrage, sérieux |
| `wood` | Chambre, Scriptorium, Bibliothèque, Cuisine, Forge, Cave | Chaleur, travail |
| `parchment` | Sanctuaire, Atelier, Scriptorium, Comptoir | Écriture, documentation |
| `metal` | Comptoir, Chambre, Bibliothèque, Forge, Cave | Technique, précision |
| `fabric` | Sanctuaire, Cave | Confort, détente |
| `leather` | — | Non utilisé actuellement |

---

## 🔮 Prochaines Actions

### Priorité 1 : Compléter Partielles

- [ ] **Bibliothèque** : Remplacer placeholders "Notes de Recherche" + "Collections"

### Priorité 2 : Développer Vides

- [ ] **Boutique** : Définir fonction (présentations/démos) et implémenter
- [ ] **Jardin** : Définir fonction (croissance idées) et implémenter

### Priorité 3 : Améliorations

- [ ] **Cave** : Compléter Tableau des Scores (localStorage tracking)
- [ ] **Scriptorium** : Widgets espace vide (post-its, planner hebdo)
- [ ] **Forge** : Définir actions 3 et 4 toolbar

---

**Rapport généré** : 2026-01-01
**Source** : Code inspection `src/components/rooms/`
**Référence** : `CLAUDE.md` (spécifications)
