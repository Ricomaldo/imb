# Changelog - IRIMMetaBrain

## [Unreleased]

### Added - 2025-09-24 (Widgets Cuisine & Bibliothèque)

- **Widget Journal (Diary)** : Journal quotidien avec archivage automatique
  - Une page vierge chaque jour avec éditeur Markdown
  - Archivage automatique des jours précédents à minuit
  - Archives mensuelles consultables dans la Bibliothèque
  - Export des mois en fichiers Markdown
  - Store `useDiaryStore` avec `dailyDiary` et `monthlyArchives`

- **Widget CaptureUrgente (Forge)** : Capture rapide des blocages de dev
  - Deux modes : "Bugs" et "Pause Projet"
  - Formulaire 3 champs adaptés au mode
  - Liaison au projet actif via `useProjectsStore`
  - Boutons Capturer/Annuler, reset auto et feedback visuel
  - Design Forge cohérent (métal, contrastes sombres)

- **Widget DiaryArchive (Bibliothèque)** : Consultation des archives du journal
  - Navigation par mois dans la sidebar
  - Visualisation jour par jour avec aperçu Markdown
  - Export en .md pour chaque mois complet
  - Interface compacte dans panel 2x2

- **Widget PauseCorps (Cuisine)** : Micro-mouvements pour développeurs
  - 8 exercices ciblés (nuque, yeux, dos, poignets, etc.)
  - Système de révélation avec mystère initial
  - Messages d'encouragement aléatoires après chaque exercice
  - Design vert nature avec texte blanc
  - Données dans `src/data/exercices.json` et `encouragements.json`

- **Composant AnalogClock** : Horloge murale analogique
  - Nouveau dossier `src/components/furniture/` pour objets décoratifs
  - Horloge SVG avec aiguilles animées en temps réel
  - Accrochée au mur de la Cuisine (position absolue)
  - Design vintage avec ombres et effets

- **Amélioration Bibliothèque** : Grille 5x5 avec PanelGrid
  - Archives du Journal en petit panel (2x2)
  - Espaces préparés pour Documents, Notes de Recherche et Collections
  - Cohérence avec l'architecture des autres pièces

- **Augmentation tailles de police globales** : Meilleure lisibilité
  - `base`: 14px → 16px (standard web moderne)
  - Toutes les tailles augmentées proportionnellement
  - Ratio harmonieux préservé (~1.25)

### Changed - 2025-09-24 (Refactoring Stores)

- **Fusion des stores de préférences** : Simplification de l'architecture
  - `useSettingsStore` + `useRoomsUIStore` → `usePreferencesStore` unifié
  - Migration automatique des données existantes au premier chargement
  - Réduction de 7 à 6 stores actifs pour une meilleure maintenabilité
  - Toutes les fonctionnalités conservées avec API compatible
  - Clé localStorage unifiée : `irim-preferences-store`

- **Vérification système de synchronisation** :
  - Confirmation que les 3 stores principaux sont bien synchronisés (Notes, ProjectMeta, ProjectData)
  - Les 4 stores locaux restent privés (Preferences, Diary, Settings legacy, Projects legacy)
  - Export/Import Gist 100% fonctionnel avec architecture v2.0.0

- **Correction bug SyncModal** :
  - Suppression variable inutilisée `stats` ligne 151

### Added - 2025-09-23 (Widget Tri Mental - Sanctuaire)

- **Widget MindLogSorter** : Système de catégorisation par drag&drop des entrées émotionnelles
  - 4 zones de tri : "À digérer", "Insights", "Évacué", "À revisiter"
  - Intégration native avec @dnd-kit (déjà présent dans le projet)
  - Affichage des 10 dernières entrées MindLog avec aperçu (30 chars)
  - Feedback visuel sur hover/drag avec codes couleur par catégorie
  - Support des entrées cachées avec indicateur visuel 👁️
  - **Suppression avec confirmation** : Modal overlay pour action définitive
  - Dimensions compactes : adaptatif 100% du panel parent

- **Extension MindLog avec gestion visibilité** :
  - Fonction "Cacher" dans MindLog (Chambre) : masque l'entrée localement
  - Entrées cachées restent visibles uniquement dans le Sanctuaire
  - Toggle "Voir cachés" pour afficher temporairement les entrées masquées
  - Indicateurs visuels : opacity réduite + badge "(caché)"

- **Store useDiaryStore amélioré** :
  - Nouvelles propriétés : `category`, `categoryDate`, `hidden` par entrée
  - Actions : `updateLogCategory()`, `toggleLogVisibility()`, `deleteLog()`
  - Getters : `getVisibleLogs()` (Chambre), `getAllLogs()` (Sanctuaire)
  - Rétrocompatibilité totale avec entrées existantes

- **Intégration Sanctuaire** :
  - PanelGrid 5x5 avec layout cohérent aux autres pièces
  - Panel "Tri Mental" (2x2) avec texture stone et icône 🧘
  - Zones placeholder pour futures fonctionnalités méditation/réflexion
  - Persistence état via useRoomsUIStore

### Added - 2025-09-23 (Widget Notes & Hydration Reminder)

- **Widget Notes dans l'Atelier** : Nouveau panel pour notes longues liées au projet
  - Position : bas-droite sous le Todo (colonnes 4-6, lignes 4-6)
  - Contenu markdown persistant par projet via `notesMarkdown` dans useProjectDataStore
  - Structure par défaut : Contexte, Idées et réflexions, Documentation
  - Hook `usePanelContent` étendu avec `notesContent` et `updateNotesContent`
  - Debounce 1s pour sauvegarde automatique optimisée
  - Texture parchment, icône 📝, couleur accent neutre
  - État collapsible mémorisé dans `atelierModules.notes`

- **Widget Hydration Reminder dans la Cuisine** : Invitation bienveillante à s'hydrater
  - Module dédié dans `room-modules/cuisine/HydrationReminder`
  - Message fixe "Pause hydratation ?" sans tracking ni compteur
  - Bouton unique "J'ai bu" avec animation de célébration
  - **Animation paillettes CSS** : 24 particules avec variations
    - Alternance couleurs or/bleu ardoise
    - Durée aléatoire 0.8s-1.5s par particule
    - Rotation et scale progressifs
    - Animation 3 secondes totale
  - Design cohérent : texture wood, fond transparent
  - Animations optimisées GPU avec `will-change: transform`
  - État minimal : uniquement `isAnimating` local
  - Affichage optionnel de l'heure de dernière hydratation

### Fixed - 2025-09-20 (ProjectOverviewModal)

- **Formulaire de création de projet** : Ajout du champ "Position Kanban"
  - Sélection de la colonne initiale : Réserve, En Tête, Actif ou Pause
  - Désactivé automatiquement pour les projets de type Formation
  - Validation de la limite de 5 projets max pour la colonne "En Tête"

- **Actualisation après création** : Correction du rafraîchissement instantané
  - Suppression du `useMemo` pour garantir les données fraîches
  - La liste des projets se met à jour immédiatement après ajout
  - Plus besoin de recharger la page pour voir les nouveaux projets

- **Modal de détails projet** : Actualisation après modification
  - Les données sont maintenant récupérées directement du store
  - L'écran de synthèse affiche toujours les informations à jour
  - Correction du problème de données obsolètes après édition

### Added - 2025-09-20 (Session MindLog & Lab Testing System)

- **Composant MindLogCompact** : Tracker émotionnel et productivité multi-contexte
  - 3 modes d'affichage : Compact (sliders), Markdown (notes), Logs (historique)
  - Double contexte : `diary` (personnel) ou `project` (lié au projet actif)
  - Sliders visuels pour énergie ⚡ et focus 🎯 avec représentation par répétition d'emojis
  - Mode markdown avec toggle édition/visualisation (✏️/👁️)
  - Historique des logs avec suppression individuelle et clear all
  - Intégration Atelier (context project) et Chambre (context diary)
  - Design ultra-compact optimisé pour grilles 1×2

- **MindLogToolbar** : Barre d'outils dédiée pour MindLog
  - 3 boutons : Edit/View, Log avec badge, Change View
  - Badge dynamique affichant le nombre de logs
  - Intégration cohérente avec le design system

- **Store useDiaryStore** : Persistance du journal personnel
  - Gestion de l'état MindLog (mood, energy, focus, notes)
  - Historique des logs avec limite de 50 entrées
  - Notes markdown personnelles
  - Prêt pour futures extensions (entries journal complet)

- **Panel hideHeaderTitleWhenCollapsed** : Nouvelle prop pour optimiser l'espace
  - Mode ouvert : masque le titre pour afficher la toolbar custom
  - Mode collapsed : affiche titre complet pour identification
  - Permet jusqu'à 4 boutons dans la toolbar du header

- **Système de Test Laboratoire** : Architecture scalable pour tests de composants
  - ComponentToTest avec configuration centralisée (TEST_CONFIGS)
  - Export getPanelConfig() pour communication bidirectionnelle
  - Panel dynamique s'adaptant aux besoins du composant testé
  - Indicateurs visuels : dimensions, warnings min/max, mode debug
  - Guide d'utilisation intégré en commentaires
  - Event system pour synchronisation handlers/toolbar
  - Props calculées selon dimensions (compact, debug, verbose)

### Improved - 2025-09-20

- **Design MindLog** : Optimisations visuelles et UX
  - Emoji principal avec effet pulse et glow doré quand mood ≥ 4
  - Sélection emoji avec feedback visuel (scale, shadow, border)
  - Background gradient stone → secondary (remplace moutarde)
  - Padding réduit à 6px pour maximiser l'espace utile
  - Logs affichés avec emojis répétés : `⚡⚡⚡ 🎯🎯` au lieu de `E:3 F:2`

- **Architecture Laboratoire** : Refactoring complet
  - Séparation config/composant pour meilleure scalabilité
  - Communication Panel ↔ ComponentToTest via getPanelConfig
  - Workflow simplifié : changer ACTIVE_TEST suffit
  - Support multi-dimensions avec adaptation automatique

### Added - 2025-09-19 (Session Capture d'État & Interface)

- **Bouton Capture d'État** : Nouveau bouton 📷 dans ControlTower
  - Icône appareil photo intégrée dans la BottomRow (quickActions)
  - Modale de confirmation `CaptureConfirmModal` avec design thématisé
  - Instructions claires pour lancer `npm run capture` manuellement
  - Copie automatique de la commande dans le presse-papier
  - Interface cohérente avec le design system de l'application
  - Styles utilisant `theme.radii`, `theme.colors.accent`, et `theme.colors.accents.danger`
  - Workflow pratique : clic → instructions → exécution terminal → résultats

- **Système Modal Robuste** : Corrections et améliorations
  - Fix des handlers de modales avec dépendances dynamiques dans ModalManager
  - Enregistrement automatique des nouveaux handlers lors d'ajouts
  - Logs de debug temporaires pour diagnostics de problèmes modal
  - Correction des références de thème (borderRadius → radii, accent.primary → accent)

### Added - 2025-09-19 (Session Navigation & Keyboard Hooks)

- **Hook useKeyboardNavigation** (`src/hooks/useKeyboardNavigation.js`) :
  - Externalisation de la gestion des raccourcis clavier depuis RoomCanvas
  - API flexible avec support des touches personnalisées (WASD, etc.)
  - Protection intelligente contre les éditeurs (textarea, input, contenteditable)
  - Prévention du scroll par défaut des flèches
  - Vérification des directions disponibles avant navigation
  - Documentation JSDoc complète avec exemples d'usage
  - Support de la touche Échap pour retour à la pièce par défaut
  - Calcul de chemin complet (Manhattan) vers la pièce par défaut
  - Exécution pas-à-pas avec temporisation configurable
  - Intégration transparente dans RoomCanvas sans modification de l'architecture

- **Navigation Échap vers Pièce par Défaut** :
  - Touche Échap pré-calcule le chemin vers la pièce définie dans SettingsModal
  - Utilise la même logique que les flèches de navigation existantes
  - Navigation automatique étape par étape jusqu'à destination
  - Synchronisation avec useSettingsStore pour la pièce par défaut
  - Temporisation de 520ms entre chaque mouvement pour animations fluides

- **Refactoring RoomCanvas** :
  - Suppression de 40+ lignes de gestion clavier
  - Remplacement par 6 lignes utilisant le hook dédié
  - Code plus propre et réutilisable
  - Séparation des responsabilités (UI vs logique clavier)

### Added - 2025-09-19 (Session NavigationGrid)

- **NavigationGrid dans la Chambre** (`src/components/room-modules/chambre/NavigationGrid.jsx`) :
  - Grille de navigation 4x3 représentant toutes les rooms
  - Cases cliquables avec couleurs distinctives par room
  - Navigation programmée pas-à-pas utilisant les flèches existantes
  - Simulation de clics sur `button[aria-label="Navigate ${direction}"]`
  - Logique identique à `capture-state.js` pour robustesse
  - Indicateur visuel de la room actuelle avec surbrillance
  - Libellés courts (3 premières lettres) pour identification
  - Intégration transparente sans modification de l'architecture existante
  - Temporisation de 600ms entre chaque mouvement pour animations fluides
  - Priorité X puis Y pour trajectoire cohérente
  - Stratégie spéciale pour rangées 1 et 2 via l'atelier comme hub central
  - Navigation intelligente : rangée 0 → directe, rangée 1 → atelier puis destination, rangée 2 → atelier → colonne → descente

- **Remplacement du Placeholder Navigation** :
  - NavigationGrid remplace le contenu temporaire du panel Navigation
  - Import ajouté dans ChambreRoom.jsx
  - Aucune modification de RoomCanvas ou useRoomNavigation nécessaire
  - Utilise l'API publique des flèches pour navigation automatique

### Added - 2025-09-20 (Session TimeTimer Complet)

- **Composant TimeTimer Finalisé** (`src/components/widgets/TimeTimer.jsx`) :
  - Timer visuel façon vrai TimeTimer physique avec disque qui se vide
  - Représentation sur base 60 minutes (horloge complète comme une vraie horloge)
  - 2 durées présélectionnées : 4min et 20min uniquement
  - Messages contextuels temporisés : "C'est parti" (2s au démarrage), "Pause", "C'est reparti" (2s après pause), "C'est fini"
  - Responsive carré parfait (min 150px, max 400px) avec ResizeObserver
  - **Inversion du sens d'écoulement** : bouton pour basculer horaire/anti-horaire
  - **60 graduations de minutes** à l'intérieur du cercle (plus longues toutes les 5 min)
  - **Nombres 0-55** à l'extérieur du cercle, inversés selon le sens d'écoulement
  - **Disque central** opaque de 15% du rayon (style TimeTimer authentique)
  - **Icônes SVG** personnalisées : play, pause, reset, reverse (remplacent les emojis)
  - **Carousel de palettes de couleurs** : 8 palettes disponibles via `palettes.json`
  - Navigation par triangles avec animation type roulette verticale
  - **Thème sombre** : fond gris foncé (#1F2937) pour contraste maximal avec cercle blanc
  - Tous les éléments en nuances de gris cohérentes pour hiérarchie visuelle
  - **Intégration dans la Chambre** : remplace le placeholder Timer Zone (panel 2x2)

- **Corrections Système de Capture** :
  - Fix du script `update-viewer.js` : création de `captures-index.json` au lieu de `index.json`
  - Viewer HTML corrigé pour charger correctement les captures existantes
  - Vérification de la structure complète : 4 captures avec 12 screenshots chacune
  - Support du serveur HTTP local pour visualisation (Python ou Live Server)

### Added - 2025-09-19 (Session Kanban & Design System Badges)

- **Architecture Kanban pour Gestion des Projets** :
  - ADR-005 : Architecture décisionnelle documentée
  - 3 colonnes : EN TÊTE (max 5, auto-visible), ACTIF, PAUSE (invisible)
  - Système de tabs : Professionnel | Personnel | Formation
  - Drag & drop entre colonnes avec `@dnd-kit`
  - Drop zones avec `useDroppable` pour colonnes vides
  - Auto-visibilité basée sur colonne (EN TÊTE → visible, PAUSE → invisible)

- **Section Inbox/Réserve** :
  - Zone "📥 Réserve de projets" pour projets non classés
  - Drag depuis inbox vers colonnes Kanban
  - Catégorie obligatoire dans formulaire
  - KanbanColumn par défaut : 'inbox' pour nouveaux projets

- **Composant Badge Réutilisable** (`src/components/common/Badge/`) :
  - Variants : subtle (défaut), solid, outline
  - Tailles : sm, md, lg
  - Formes : default, rounded, pill
  - Couleurs automatiques selon type de donnée
  - Support d'icônes intégrées

- **Amélioration Visuelle des ProjectCards** :
  - Status avec badges colorés et icônes (⚡ Dev Actif, 💡 Concept, etc.)
  - Types avec badges colorés (🔨 Outil, 📱 App, 🌐 Site, etc.)
  - Hiérarchie visuelle : EN TÊTE doré et mis en valeur
  - Cards PAUSE estompées (opacité 60% + grayscale)
  - Drag handle amélioré (28px, plus visible)
  - Layout TopBar avec collapse button

- **Modal ProjectDetails (Overlay)** :
  - Clic simple sur carte → affiche détails complets
  - Double-clic → édition directe
  - Support modales superposées (overlay z-index: 10000)
  - Vue structurée des infos projet
  - Bouton "✏️ Modifier" intégré

- **Améliorations UI/UX** :
  - Tabs plus visibles (fond opaque, meilleur contraste)
  - Boutons avec gradient et text-shadow
  - Suppression barre de stats inutile
  - Timer pour distinguer simple/double clic
  - Checkbox non-overlapping avec titre

- **Vue Formation Spécifique** :
  - Sections par complexité (Débutant/Intermédiaire/Avancé)
  - Tri par complexité ou date
  - Sections collapsibles
  - Grid layout responsive

### Added - 2025-09-19 (J6 - Architecture Multi-Stores v2 & Robustesse)

- **Architecture Multi-Stores v2** : Refonte complète de la gestion des données
  - Séparation métadonnées (`useProjectMetaStore`) / données (`useProjectDataStore`)
  - Stores dynamiques par projet avec lazy loading
  - Migration automatique et transparente v1 → v2
  - Backup automatique avant migration
  - Cache des instances pour performance optimale

- **Système d'Initialisation Robuste** :
  - Détection automatique localStorage vide → charge 4 projets démo
  - `defaultProjectsData.js` avec contenu riche (roadmaps, todos, modules)
  - Gestion des stores corrompus avec réinitialisation automatique
  - Loading state pendant l'initialisation dans App.jsx
  - Fallback intelligent sur données démo si problème

- **Synchronisation Cloud Améliorée** :
  - `ProjectSyncAdapter` compatible avec architecture multi-stores
  - Format v2.0 avec détection automatique de version
  - Compatibilité descendante (import v1 → migration → v2)
  - Export/Import chiffré AES-256 vers GitHub Gist
  - SyncModal mise à jour pour nouvelle architecture

- **Documentation Complète et Pédagogique** :
  - `data-flow-guide.md` : Guide utilisateur simple avec scénarios concrets
  - `sync-system.md` v2 : Documentation technique mise à jour
  - `CHANGELOG-stores.md` : Historique détaillé de l'évolution
  - Consolidation docs (suppression stores-architecture.md obsolète)
  - Commandes debug et test documentées

- **UI/UX ProjectOverviewModal** :
  - `DraggableProjectCard` : Cards réorganisables par drag & drop
  - `ProjectBadges` : Badges visuels pour statuts et catégories
  - `ProjectForm` : Formulaire création/édition avec champs enrichis
  - Support de propriétés enrichies (technologies, dates, client, etc.)

- **Outils de Test et Debug** :
  - `test-scenarios.js` : Script de validation complète
  - `window.stores` : Accès simplifié pour console
  - `exposeStores.js` amélioré avec alias pratiques
  - Commandes de réinitialisation et migration

### Added - 2025-09-19 (Session Gestion Projets & ProjectCarousel)

- **Système de Gestion de Projets Complet** : Infrastructure pour gérer multiples projets
  - ProjectOverviewModal : Interface fullscreen pour visualiser tous les projets
  - Projets organisés par catégories (Professionnel, Personnel, Formation)
  - Système de visibilité pour sélectionner les projets actifs
  - Bouton "📊 Projets" ajouté dans ControlTower
  - Cards blanches avec ombres pour meilleure lisibilité
  - Bouton "+ Nouveau Projet" (base posée pour création future)

- **ProjectCarousel dans Atelier** : Navigation entre projets visibles
  - Navigation circulaire infinie (retour au début après le dernier)
  - Style cohérent avec metalBg + secondaryLevel
  - Bordure text.light pour visibilité
  - Largeur 25% centrée horizontalement
  - Triangles (◀ ▶) pour navigation
  - Titre centré verticalement (après debug approfondi)
  - Déplacé dans `room-modules/atelier/` pour organisation

- **Store Enrichi** : Extensions useProjectsStore
  - `visibleProjects`: Liste des projets affichés dans le carousel
  - `categories`: Structure pour organiser les projets
  - `toggleProjectVisibility()`: Afficher/masquer des projets
  - `selectNextProject()` et `selectPreviousProject()`: Navigation
  - Fallback pour charger les projets même après premier run
  - 4 projets de démo avec catégories assignées

- **Fixes Techniques** :
  - Correction du chargement des projets vides après premier run
  - Alignement vertical du ProjectCarousel (refait de zéro)
  - Migration des styles inline vers styled-components

### Added - 2025-09-18 (Session SystemOverview & Architecture)

- **SystemOverview dans la Forge** : Nouveau bouton 🌳 TREE pour visualiser l'architecture
  - Intégration dans Panel fullscreen avec texture metal et bordure bleue
  - Harmonisation complète avec le thème bleu de ComponentCatalog
  - Suppression de la texture pierre au profit du gradient uiKitBlue
  - Palette de bleus ajoutée au theme (blues: 100-500)
  - Toutes les couleurs référencent maintenant le theme
  - Hauteur réduite à 450px pour visibilité de la légende

- **Laboratoire UI Refactoring** : Interface simplifiée et optimisée
  - Nouveaux sélecteurs Width/Height séparés (10 boutons au lieu de 26)
  - Bouton toggle pour afficher/masquer le panel
  - Titre "🧪 Rendu" restauré grâce à l'interface compacte
  - Fix alignement NoPanelContent (grid-row: 1/6)
  - Fix débordement scrollbar avec wrapper dédié
  - Simplification de ControlHeader

- **Système @renders complet** : 41 composants annotés
  - Tous les composants principaux ont maintenant des annotations JSDoc
  - Parser script amélioré pour extraction complète
  - Architecture-map.json reflète toute la hiérarchie
  - Suppression de la limite de profondeur dans l'arbre

### Added - 2025-09-18 (Session précédente)

- **Layout Chambre Implémenté** : Structure complète avec panels placeholder
  - Grille 4x4 avec 6 zones distinctes
  - Timer Zone (2x2) : Gestion du temps, texture bois
  - Totem (1x1) : Élément spirituel, texture pierre
  - MindLog (2x1) : État mental, texture cuir
  - Mantras (2x1) : Méditation, texture tissu
  - Notes (2x1) : Fonctionnel avec MarkdownEditor
  - Navigation (2x1) : Accès rapide, texture métal
  - Textures variées pour différenciation visuelle
- **Laboratoire (UndefinedRoom) Amélioré** : Ajout boutons dimensions manquantes
  - Toutes les dimensions 1×1 à 5×5 disponibles (26 configurations)
  - Grid responsive avec auto-fit
  - Boutons compacts avec largeur réduite
- **Forge Simplifiée** : Reset et ajout toolbar
  - ForgeToolbar avec mixins secondaryLevel + metalBg
  - 4 boutons placeholder pour futures fonctionnalités
  - Structure minimale prête pour expansion
- **SystemOverview Refactoring** : Réécriture complète basée sur annotations JSDoc
  - Nouveau système d'annotations `@renders` dans les composants
  - Script `parse-component-tree.js` pour extraire l'architecture
  - Génération automatique de `architecture-map.json`
  - SystemOverview lit maintenant le JSON au lieu d'un arbre hardcodé
  - ADR-004 documentant la convention @renders
  - Script npm `doc:tree` pour générer l'arbre de composants

### Added - 2025-09-18 (précédent)

- **Paramètre Pièce de Démarrage** : Choix de la room initiale au lancement
  - Nouveau store `useSettingsStore` avec persistance localStorage
  - Modal Settings accessible via bouton ⚙️ dans ControlTower
  - Dropdown pour sélectionner parmi les 12 pièces disponibles
  - Application du paramètre au prochain refresh de l'app
- **Système Auto-Documentation** : Workflow capture → promote → index
  - `doc-capture.js` : Capture instantanée de pensées dans devlog avec timestamps
  - `doc-promote.js` : Migration et nettoyage devlog → docs structurés
  - `doc-index.js` : Génération automatique de l'index README.md
- **Fix Navigation Clavier** : Désactivation des flèches pendant l'édition markdown
- **Renommage Projet** : IRIMStudioHall → IRIMMetaBrain
- **ComponentCatalog** : Outil de test et documentation des composants
  - Auto-découverte des composants
  - Prévisualisation interactive avec props éditables
  - Génération de code d'utilisation
  - Intégré dans le Laboratoire (ex-UndefinedRoom)
  - Sidebar collapsible avec catégories dépliables
  - Détection automatique des types de props (dropdowns pour enums, checkbox pour booléens)
  - Common ouvert et Button sélectionné par défaut
- **Restructuration Architecture Composants** :
  - Nouveau dossier `widgets/` pour composants réutilisables (MindLog, ActionList, ImageCarousel)
  - Nouveau dossier `room-modules/` pour composants spécifiques aux rooms
  - RoomNote déplacé dans `dev/` (meta-système)
  - Renommage : UndefinedRoom → LaboratoireRoom
- **PropTypes** : Ajout de définitions PropTypes aux composants clés
  - ActionList, ImageCarousel, Panel, Button, IconButton, Modal, MarkdownEditor
  - Amélioration de la documentation automatique dans ComponentCatalog
- **Panel Amélioré** :
  - Nouvelle prop `borderType` avec options : 'default', 'blue', 'craft'
  - Utilisation des mixins `blueBorder` et `craftBorderHeavy`
  - Border blue appliqué au ComponentCatalog dans la Forge
- **Forge Integration** :
  - ComponentCatalog accessible via bouton "🔨 PROPS" dans la toolbar
  - Panel fullscreen avec texture metal et border blue
  - Fix du chevauchement grid/toolbar avec max-height approprié

### Added - Précédent

- Design System harmonization
- Centralized Modal System with React Portals
- Advanced Navigation with Golden Arrows
- AsyncStorage Sync Manager with GitHub Gist backend

### Changed

- Replaced hardcoded values with theme-based styling
- Centralized actions in `buttonMapping.js`
- **Scripts de capture** : Migration `capture-state-simple.js` de CommonJS vers ESM pour compatibilité avec le projet
- **Navigation clavier** : Externalisation de la logique dans un hook réutilisable `useKeyboardNavigation`

### Improved

- Performance optimizations
- UX enhancements in navigation and modal interactions
- **Navigation** : Ajout de la touche Échap pour retour rapide à la pièce par défaut
- **Code quality** : Refactoring de la gestion clavier avec séparation des responsabilités
- **Scripts** : Correction des scripts de capture pour création automatique de dossiers timestamp
