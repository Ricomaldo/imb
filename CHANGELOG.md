# Changelog - IRIMMetaBrain

## [Unreleased]

### Added - 2025-12-12 (UX Improvements & Navigation)

- **📐 Mode Focus Panel** : Agrandissement plein écran des panels
  - Nouveau bouton dans Panel header pour basculer en mode focus
  - Panel s'étend sur toute la grille en mode focus
  - État persisté dans usePreferencesStore par panel
  - Améliore la lisibilité pour édition markdown ou visualisation de contenu

- **🎯 SideTower Collapsible** : Masquer/afficher la tour latérale
  - Bouton toggle vertical sur le bord droit de l'écran
  - Animation slide smooth avec transition cubic-bezier
  - RoomCanvas s'étend à 100% quand SideTower collapsed
  - Position fixed pour la SideTower (hors du grid flow)
  - État persisté dans preferences store

- **🔄 SideTowerNotes avec toggle source** : Basculer entre notes Desktop/Mobile
  - Bouton "⇄" dans le header pour switcher entre sources
  - 📝 Notes SideTower (Desktop) - couleur neutral
  - 💡 Notes Dev Companion (Mobile) - couleur cold
  - Même éditeur markdown, données séparées dans useNotesStore
  - Synchronisation garantie via Gist pour les deux sources

- **🗺️ NavigationGrid avec backgrounds** : Vignettes visuelles des pièces
  - Affichage des images de background dans les vignettes navigation
  - Noms des pièces en petit overlay bas-gauche
  - Gap drastiquement réduit (2px) pour compacité
  - Overlay sombre pour améliorer lisibilité
  - Ratio 4:3 respecté via positionnement grille

### Changed - 2025-12-12 (Rooms Reorganization)

- **🏰 Chambre redesignée** : Grille 12x8 pour meilleure flexibilité
  - **Journal Quotidien** : Pleine largeur droite (colonnes 7-13, lignes 1-5)
  - **Navigation** : Bas droite avec ratio 4:3 parfait (colonnes 7-13, lignes 5-9)
  - Quart bas gauche laissé vide pour futures fonctionnalités
  - Suppression : Totem, Mantras, TimeTimer, MindLog, Notes

- **🕉️ Sanctuaire enrichi** : Accueil de Totem + Mantras depuis Chambre
  - Layout grille 5x5 optimisé
  - **Totem** 🗿 : Haut gauche (colonnes 1-3, lignes 1-3)
  - **Mantras** 🕉️ : Haut droite (colonnes 3-6, lignes 1-3)
  - **Tri Mental** 🧘 : Bas gauche (colonnes 1-3, lignes 3-6)
  - **Moments OUI** ✨ : Bas droite (colonnes 3-6, lignes 3-6)

- **📝 Scriptorium "effet bureau"** : Layout 12x8 aéré et inspirant
  - Migration vers grille 12x8 (nouveau pattern standard)
  - **Brouillon** 📝 : Document posé sur le bureau (colonnes 1-6, lignes 1-5)
  - **Archives du Journal** 📚 : Classeur/bibliothèque (colonnes 7-13, lignes 1-7)
  - Texture wood pour Archives au lieu de parchment
  - Beaucoup d'espace vide (centre et bas) pour futurs composants
  - Effet bureau minimaliste propice à la créativité

### Fixed - 2025-12-12

- **🔧 RoomRegistry.jsx** : Fix erreurs ESLint react-refresh
  - Ajout `/* eslint-disable react-refresh/only-export-components */`
  - Fichier conserve extension .jsx pour support JSX dans DefaultRoomRenderer

- **📚 DiaryArchive** : Version compacte et fonctionnelle
  - Fix layout complètement cassé (composant illisible)
  - MonthsList: 220px → 140px largeur
  - Font sizes drastiquement réduits (14px headers, 12-13px contenu)
  - Paddings/margins réduits de 50-70%
  - Suppression emojis décoratifs superflus
  - Suppression effets "luxueux" (coin plié, gradients complexes)
  - Scrollbars minimalistes (4-6px au lieu de 8-10px)
  - Layout simple rgba backgrounds
  - Bouton "Export" au lieu de "Exporter en Markdown"
  - **Principe** : Design fonctionnel > Design décoratif pour espaces restreints

### Fixed - 2025-12-04 (Import Encryption Compatibility)

- **🔐 Import compatible PBKDF2** : SyncModal utilise maintenant projectSyncAdapter
  - **Cause** : L'auto-export utilisait PBKDF2 (salt+iv+encrypted) mais l'import manuel utilisait le chiffrement simple CryptoJS
  - **Fix** : SyncModal.jsx refactorisé pour utiliser `projectSyncAdapter.importFromGist()` et `exportToGist()`
  - **Résultat** : Export manuel et auto-sync produisent le même format, l'import fonctionne dans les deux cas
  - Suppression du code dupliqué (collectAllStores, encryptData, decryptData, uploadToGist, downloadFromGist)

### Fixed - 2025-12-04 (Auto-Sync Encryption & Companion)

- **🔐 Chiffrement compatible** : useAutoSync utilise projectSyncAdapter.exportToGist()
  - Abandon du chiffrement CryptoJS simple incompatible avec import PBKDF2
  - Export et import utilisent maintenant le même format SyncManager
  - Suppression code dupliqué (collectAllStores, encryptData)

- **📋 Clipboard silencieux** : Pas d'erreur quand auto-sync sans activation utilisateur

- **📱 Widget Moments OUI sur Companion** : Ajouté à la HomePage
  - Texture metal, collapsible
  - Même fonctionnalité que version Desktop
  - Store useDiaryStore déjà subscribed pour auto-sync

### Added - 2025-12-04 (Auto-Sync Gist & Indicateur Sync)

- **🔄 Auto-Sync vers GitHub Gist** : Synchronisation automatique après modifications
  - **Détection changements Zustand** : Subscribe direct aux 5 stores (Notes, ProjectMeta, ProjectData, Diary, Preferences)
  - **Debounce 10 secondes** : Sync après inactivité pour éviter spam API
  - **Cycle visuel complet** : Ready ☁️ → Pending ⏳ → Syncing 🔄 → Synced ✓
  - **Auto-import au démarrage** : Compare timestamp Gist vs local, importe si plus récent
  - **Support multi-device** : Modifications sur un appareil, récupérées sur l'autre au refresh

- **📍 Indicateur Sync Desktop** : Déplacé en haut à gauche du RoomCanvas
  - Position absolue avec backdrop blur
  - Animations CSS pour états syncing (spin) et pending (pulse)
  - Retiré de la ControlTower pour meilleure visibilité

- **📱 Indicateur Sync Companion** : Centré en bas au-dessus de la TabBar
  - Style pill arrondi avec fond semi-transparent
  - Mêmes animations et états que la version desktop
  - Position fixe pour visibilité permanente

- **🏗️ Architecture useAutoSync refactorisée** :
  - Abandon de l'interception localStorage.setItem (problèmes de race condition)
  - Utilisation de Zustand subscribe() pour détection fiable des changements
  - Refs pour éviter les problèmes de stale closures
  - Support stores dynamiques project-data-* via subscribeToProjectData()

- **📦 Nouveau export useProjectDataStore** :
  - `subscribeToProjectData(projectId, callback)` : S'abonner aux changements d'un projet
  - `getCachedProjectIds()` : Liste des projets en cache

### Fixed - 2025-11-09 (Code Quality & ESLint Audit)

- **🐛 Erreurs console critiques** : Correction de 2 erreurs bloquant le démarrage
  - **exposeStores.js** : Correction instanciation singleton ProjectSyncAdapter (TypeError constructor)
  - **ScriptoriumRoom.jsx** : Ajout hook `useTheme()` manquant (ReferenceError)

- **🔧 Configuration ESLint** : Séparation configs Node.js vs React/Browser
  - Configuration dédiée pour `scripts/**/*.js` avec `globals.node`
  - Configuration React pour `src/**/*.{js,jsx}` avec extends complets
  - Fix automatique de 19 erreurs `process is not defined` dans les scripts
  - Ajout `argsIgnorePattern: '^_'` pour paramètres non utilisés

- **🧹 Nettoyage variables orphelines** : 18 fichiers modifiés
  - Suppression imports inutilisés (App.jsx, MindLog.jsx, migrateProjectStores.js)
  - Suppression variables non utilisées (Badge.jsx, useDiaryStore.js, Modal.styles.js)
  - Préfixe `_` pour paramètres non utilisés (SettingsPage, BibliothequeRoom, etc.)
  - Nettoyage styled-components (LaboratoireRoom.styles, SanctuaireRoom.styles)
  - **Résultat** : Réduction de 105 à 60 problèmes ESLint (-43%)

### Added - 2025-10-15 (Widget Moments OUI - Sanctuaire)

- **Widget Moments OUI** : Capture et visualisation des moments de plénitude
  - **3 champs de capture** : Quand (datetime), Quoi (200 char), Pourquoi nourrissant (500 char)
  - **Taxonomie Rosenberg complète** : 7 familles de besoins CNV (30 besoins au total)
    - Autonomie 🦅, Célébration ✨, Intégrité 💎, Interdépendance 🤝
    - Jeu 🎪, Communion spirituelle 🕊️, Besoins physiques 🌱
  - **Sélecteur de besoins accordéon** : Max 5 besoins par moment, badges cliquables
  - **Timeline chronologique** : Affichage des moments avec dates intelligentes (Aujourd'hui/Hier/date complète)
  - **Statistiques hebdomadaires** : Compteur "Cette semaine : X moments OUI ✨"
  - **Mini heatmap** : Top 3 besoins avec barres de progression colorées
  - **Modal de capture** : Formulaire avec validation, compteurs de caractères, pré-remplissage datetime
  - **Actions sur moments** : Édition, suppression avec confirmation
  - **Design médiéval cohérent** : Texture parchment, couleurs famille par besoin

- **Extension useDiaryStore** : Nouvelle section `momentsOui` (+308 lignes)
  - Structure complète : moments[], metadata (stats globales), settings (notifications/FAB)
  - **10 actions CRUD** : addMomentOui, updateMomentOui, deleteMomentOui, getMomentsOui, etc.
  - **Statistiques automatiques** : Calcul temps réel (totalMoments, needsStats, firstMomentDate)
  - **Filtres avancés** : Par période, tags, mots-clés
  - **Agrégation hebdomadaire** : getWeeklyStats() avec top 5 besoins

- **8 composants créés** dans `src/components/room-modules/sanctuaire/MomentsOui/`
  - `NeedsSelector.jsx` : Accordéon 7 familles avec sélection multi-besoins
  - `CaptureModal.jsx` : Modal 3 champs + sélecteur besoins
  - `MomentCard.jsx` : Carte expandable avec aperçu/détails
  - `MomentsTimeline.jsx` : Liste chronologique avec empty state
  - `WeeklyCounter.jsx` : Statistique semaine courante
  - `NeedsMiniHeatmap.jsx` : Top 3 besoins avec barres colorées
  - `MomentsOuiWidget.jsx` : Container principal orchestrant tous les composants
  - `MomentsOui.styles.js` : 470 lignes de styled-components

- **Constante rosenbergNeeds.js** : Taxonomie CNV complète (182 lignes)
  - 7 familles avec couleurs, emojis, descriptions
  - 30 besoins individuels avec IDs uniques
  - Fonctions helper : getAllNeedsFlat(), getNeedById(), getFamilyByNeedId()

- **Intégration Sanctuaire** : Panel 2x3 dans grille 5x5
  - Titre "Moments OUI ✨", texture parchment
  - État collapse persisté via useRoomsUIStore
  - Position colonnes 4-6, lignes 2-5

### Fixed - 2025-10-15 (Améliorations visuelles Widget Moments OUI)

- **Badges besoins illisibles** : Amélioration drastique du contraste (NeedsSelector.jsx)
  - Couleurs changées : `primary`/`muted` → `success`/`secondary`
  - Variants changés : `solid`/`subtle` → `solid`/`outline`
  - Ajout couleur texte explicite : blanc (sélectionné) / `#F7FAFC` (non sélectionné)
  - Application aux 2 zones : grille sélection + badges sélectionnés

- **Bouton save invisible au hover** : Ajout styling manquant (Button.styles.js)
  - **Variant 'primary'** ajouté (+26 lignes) : background `accents.primary`, hover avec lift + shadow
  - **Variant 'danger'** ajouté (+18 lignes) : background `accents.danger`, hover rouge adouci
  - Texte blanc (`text.light`) pour contraste maximal
  - Animation hover : `translateY(-2px)` + box-shadow avec alpha
  - Support disabled state : opacity 0.5, cursor not-allowed, pas d'animation

- **Hotfix: Badges disparaissent au hover** : Correction styles inline (NeedsSelector.jsx)
  - **Cause:** Styles inline `color` écrasaient le `:hover` du Badge
  - **Fix:** Suppression des styles inline `color`, le Badge gère maintenant lui-même
  - **Résultat:** Hover fonctionne (translateY -1px + shadow) sans disparition
  - Utilisation correcte des composants Badge du projet (variants solid/outline)

- **Utils de debug** : Exposition `window.stores.momentsOui` dans exposeStores.js
  - Fonctions console : getAll, getById, add, update, delete, getWeeklyStats, getNeedsStats

## [3.0.0] - 2025-10-01

### 🚀 Major - Architecture Ultra-Simple v3.0

- **📚 Documentation Complète v3.0** : Refonte totale cohérence documentation
  - **Architecture Stores v2.0** : Documentation multi-stores (useNotesStore, useProjectMetaStore, useProjectDataStore, useDiaryStore, usePreferencesStore)
  - **ADR 006-008** : Nouvelles décisions architecture (Sync Ultra-Simple, Mobile Companion, Sécurité Symbolique)
  - **Guides Utilisateur** : Environment Setup, Sync System v3.0, Dev Tools mis à jour
  - **Navigation Optimisée** : README principal restructuré, index ADR, guide contribution
  - **Dead-docs Cleanup** : Fichiers obsolètes organisés en backup, zéro liens morts

- **🔄 Sync Ultra-Simple v3.0** : Révolution interface synchronisation
  - **2 boutons uniquement** : EXPORT/IMPORT sans configuration manuelle
  - **Variables d'environnement** : Configuration robuste via VITE_GITHUB_TOKEN, VITE_SYNC_PASSWORD
  - **Multi-stores complet** : Synchronisation 5 stores (notes, projectMeta, projectData, diary, preferences)
  - **GitHub Gist chiffré** : AES-256 sécurisé avec gestion automatique Gist ID
  - **UX perfectionnée** : Messages temps réel, auto-close, copy Gist ID

- **📱 Mobile Companion PWA v3.0** : Interface mobile native
  - **Architecture parallèle** : Stores Zustand partagés desktop ↔ mobile
  - **4 pages optimisées** : Home (Diary/Mantras), Atelier (Projets), Dev (Notes), Settings (Sync)
  - **PWA complète** : Installation iOS/Android, manifest optimisé
  - **Icône château vectorielle** : SVG dessiné remplaçant emoji pour compatibilité
  - **Routing isolé** : `/companion` séparé avec TabBar navigation

### 🔒 Security & Accessibility

- **🛡️ Sécurité Symbolique** : Protection élégante non-intrusive
  - **LoginPage + AccessGate** : Interface cohérente avec thème château
  - **SessionStorage temporaire** : Sécurité par session, re-login à fermeture onglet
  - **Variables d'environnement** : VITE_ACCESS_PASSWORD configurable

- **♿ Accessibility Fix** : Score Lighthouse 87→95+
  - **Viewport optimisé** : Retrait user-scalable=no pour permettre zoom malvoyants
  - **Standards WCAG** : Compatibilité screen magnifiers et pinch-to-zoom

### Fixed - 2025-10-01 (Import/Export Fix + Sécurité Symbolique)

- **🔧 Fix Import/Export** : Correction bugs majeurs système de synchronisation
  - **SyncManager** : Correction du bug qui forçait toujours la version à '1.0.0' lors des exports
  - **ProjectSyncAdapter** : Préservation du format v2.0.0 multi-store pendant l'export/import
  - **CORS Fix** : Résolution problème CORS avec headers GitHub API appropriés
  - **Debug amélioré** : Logs détaillés pour diagnostiquer les problèmes de sync
  - **Support multi-noms de fichiers** : Compatibilité `irim-sync.json`, `irim-metabrain-backup.json`, etc.
  - **UX améliorée** : Fermeture automatique modal après export (2s) et import (3s)
  - **Import intelligent** : Suggestion F5 au lieu de rechargement forcé

- **🔐 Sécurité Symbolique** : Page de connexion minimaliste pour protéger l'accès
  - **LoginPage** : Interface élégante avec thème cohérent, logo château 🏰
  - **Authentification simple** : Mot de passe depuis `VITE_ACCESS_PASSWORD` (fallback: metabrain2024)
  - **SessionStorage** : État de connexion persistant pendant la session navigateur
  - **Wrapper sécurisé** : Vérification automatique état connexion dans App.jsx

- **🧹 Structure HTML** : Correction erreur `<div>` dans `<p>` dans SyncModal

### Added - 2025-10-01 (IMB Companion - Interface Mobile)

- **IMB Companion** : Interface mobile hyper-réduite avec navigation par onglets
  - **DeviceChoiceModal** : Modale au démarrage sur mobile pour choisir interface (desktop/companion)
  - Détection automatique mobile (<768px) avec préférence sauvegardée
  - Routing automatique vers `/companion` avec TabBar fixe en bas
  - **4 pages mobiles** :
    - **HomePage** : Mantras (QuoteCarousel) + Journal (Diary) en pile collapsible
    - **AtelierPage** : Roadmap, Todo, MindLog, Notes, ScreenTV avec ProjectCarousel
    - **DevPage** : Notes de développement avec MarkdownEditor (sauvegarde auto Zustand)
    - **SettingsPage** : Sync, info app, stockage, préférences interface
  - **TabBar** : Navigation 4 onglets (🏠 Home, 🛠️ Atelier, 💡 Dev, ⚙️ Settings)
  - Réutilisation maximale des composants desktop (Panel, MarkdownEditor, MindLog, etc.)
  - Support complet du PanelContext et toolbars (édition markdown, filtres mantras, etc.)

- **Extension stores pour Companion** :
  - `useNotesStore.companionNotes` : Notes mobiles séparées (devNote, lastSync)
  - Actions : `updateCompanionNote(key, value)`, `getCompanionNote(key)`

- **Configuration PWA** :
  - `manifest.json` avec shortcuts vers pages Companion
  - Meta tags viewport et thème pour mobile
  - Icônes et configuration standalone

### Added - 2025-10-01 (Support Variables d'Environnement pour Sync)

- **SyncModal avec .env support** : Automatisation de la configuration GitHub Gist
  - Chargement automatique depuis `VITE_GITHUB_TOKEN`, `VITE_SYNC_PASSWORD`, `VITE_SYNC_GIST_ID`
  - Champs pré-remplis et verrouillés si credentials dans .env.local
  - Indicateur visuel "✅ Configuration chargée depuis .env.local"
  - Fichier `.env.local.example` avec documentation complète
  - Plus besoin de saisir manuellement les credentials à chaque session

### Fixed - 2025-10-01

- **HomePage Companion** : Simplification architecture panels
  - Suppression PanelGrid inutile, utilisation pile simple (flexbox column)
  - Fix bouton collapse qui n'ouvrait pas les widgets
  - Utilisation `defaultCollapsed={true}` au lieu de `collapsed` (état interne)
  - Architecture cohérente avec les rooms desktop

- **AtelierPage Companion** : Ajout ProjectCarousel
  - Navigation entre projets avec flèches ◀ ▶
  - Remplacement titre statique + badge par carousel interactif

### Added - 2025-09-25 (Documentation Composants pour Dev Tools)

- **Documentation PropTypes et @renders** : Amélioration des outils de développement
  - **ProjectsDropdown** : PropTypes pour `onOpenModal`, 18 annotations @renders
  - **DeploymentNotes** : Structure PropTypes complète, 8 annotations @renders
  - **NavigationGrid** : PropTypes ajoutés, annotations @renders améliorées
  - **BaseRoom** : PropTypes détaillés (roomType, layoutType, children, className)
  - **PanelGrid** : PropTypes pour columns/rows/gap avec valeurs par défaut
  - **DiaryArchive** : Structure PropTypes, 11 annotations @renders
  - **Badge** : PropTypes exhaustifs avec 20+ couleurs, variants et sizes
  - **PauseCorps** : Structure PropTypes, 14 annotations @renders
  - ComponentCatalog peut maintenant extraire automatiquement les props
  - SystemOverview enrichi avec les dépendances via @renders

### Added - 2025-09-25 (Cave / Salle de Jeux)

- **Salle Cave avec 3 jeux interactifs** : Transformation de la Cave en salle de jeux ludique
  - **Puzzle Glissant (15-puzzle)** : Puzzle 4x4 classique avec 15 tuiles à remettre en ordre
    - Mélange algorithmique garantissant la solvabilité
    - Contrôle clavier (flèches) et souris
    - Compteur de coups et message de victoire animé
  - **2048 Medieval** : Version thématique médiévale du célèbre 2048
    - Titres de noblesse pour chaque tuile (Paysan → Empereur)
    - Couleurs progressives du marron au violet
    - Contrôle QSDZ/WASD (pour éviter conflit avec navigation écran)
    - Sauvegarde du meilleur score
  - **Mastermind** : Jeu de déduction logique (à implémenter)
  - **Tableau des Scores** : Affichage des records à battre
  - Utilisation de BaseRoom pour fond d'écran et notes

- **Levier Secret** : Mécanisme interactif pour révéler/cacher les jeux
  - Position absolue sur le côté droit de la pièce
  - Design métallique avec poignée en bois animée
  - Animation d'apparition des jeux (fondu + glissement + flou)
  - Effet mystérieux et ludique pour la découverte

### Fixed - 2025-09-25

- **Medieval2048 Input** : Correction du problème de saisie clavier
  - Utilisation de `useCallback` avec pattern state setter
  - Élimination des closures obsolètes dans les event handlers
  - Configuration touches QSDZ pour clavier AZERTY

### Added - 2025-09-24 (Gamification Projets & Refactoring)

- **Widget ProjectsDropdown (Bibliothèque)** : Gamification de la documentation des projets
  - Indicateurs visuels de complétude pour 5 champs de métadonnées
  - Système de couleurs : vert (complet), orange (partiel), rouge (manquant)
  - Barre de progression globale pour encourager la documentation
  - Tri automatique par complétude (projets moins documentés en premier)
  - Intégration directe avec ProjectOverviewModal pour édition rapide
  - Icônes interactives : 🌐 (deploy), 📁 (github), ⚙️ (framework), 🔗 (env), 📝 (notes)

- **Widget DeploymentNotes (Forge)** : Gestion des notes de déploiement
  - Éditeur Markdown dédié aux notes CI/CD par projet
  - Template automatique avec sections : Config, Stack, Repository, CI/CD, etc.
  - Sauvegarde automatique avec debounce manuel
  - Sélecteur de projet intégré
  - Affichage des liens de production et GitHub

### Changed - 2025-09-24 (Optimisations & Nettoyage)

- **Refactoring NavigationGrid** : Affichage optimisé des pièces actives
  - Retour à la grille 4x3 affichant uniquement les 12 pièces centrales
  - Filtrage des rooms aux coordonnées (1,1) à (4,3)
  - Suppression de l'affichage des cases vides périphériques

- **Nettoyage migrateProjectStores.js** : Suppression du code obsolète
  - Suppression de 110 lignes de fonctions inutilisées
  - Fonctions retirées : autoMigrate, verifyMigration, rollbackMigration, resetToDefaultData
  - Conservation uniquement des fonctions critiques pour la migration v1→v2
  - Réduction de 348 à 238 lignes (-32%)

### Added - 2025-09-24 (Grille 6x5 & Navigation)

- **Système de grille étendu 6x5** : Expansion de l'espace de navigation
  - Migration de la grille 4x3 vers 6x5 avec bordure vide
  - Les 12 pièces centrées aux positions (1,1) à (4,3)
  - Cases vides prêtes pour futures expansions (texture parchemin prévue)
  - `RoomLayoutEditor` avec drag & drop pour réorganiser les pièces
  - Coordonnées natives dans `roomPositions.js` (plus de décalages)

- **Navigation améliorée** : Détection intelligente des pièces
  - Nouvelle fonction `roomExistsAt()` vérifie l'existence réelle des pièces
  - Flèches n'apparaissent que vers les pièces existantes
  - Correction de `useRoomNavigation` pour la grille 6x5
  - `RoomCanvas` adapté pour afficher toute la grille

- **NavigationGrid amélioré** : Grille de navigation dans la Chambre
  - Retour à la grille 4x3 pour afficher uniquement les pièces existantes
  - Styles améliorés avec bordures, ombres et animations
  - Aspect ratio 1.5 pour meilleure lisibilité des noms

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
