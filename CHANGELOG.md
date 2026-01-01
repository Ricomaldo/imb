# Changelog - IRIMMetaBrain

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Portail 8 Sages dans Comptoir avec 8 cartes cliquables (Meridian, Éléonore, Luna, Onyx, Atlas, Chrysalis, Bodhi, Gouvernail)
- Store Zustand `useSagesStore` pour gestion état Sages (localStorage: `irim-sages-store`)
- Configuration `sagesConfig.json` avec métadonnées complètes (emoji, âge, spécialité, couleur, room)
- Modal Sage avec `createPortal` pour éviter clip z-index
- Widget SagesPortal.jsx dans Comptoir/widgets/
- Questions Panel dans Comptoir avec intégration vault 8sages via REST API VPS
- QuestionSelector widget avec single-select et feedback visuel (border sage color)
- QuestionsPanel widget avec MarkdownEditor intégré et save functionality
- Extraction automatique questions + filepaths depuis markdown vault index
- Save questions vers vault via `replaceNote()` API
- Panel toolbar integration (onSave, isSaving, showSaveButton props)
- MarkdownToolbar save button support
- **Companion**: ComptoirPage mobile avec 3 panels (SageSelector, QuestionSelector, QuestionsPanel)
- **Companion**: TabBar navigation avec onglet Comptoir (🧙)
- **Companion**: HomePage étendue avec widgets bien-être (Hydratation 💧, Pause Corps 🧘, Moments OUI ✨, Zone Rouge 🔴)

### Changed
- ComptoirRoom migré de `ComptoirGrid` custom vers `PanelGrid` pattern (compatibilité `Panel`)
- MarkdownToolbar accepte `onSave`, `isSaving`, `showSaveButton` props pour save functionality
- Panel passe save props à MarkdownToolbar (lignes 165-180, 228-240)
- QuestionsPanel utilise `forwardRef` + `useImperativeHandle` pour exposer save method
- Sage ID "eleonore" → "eleo" dans sagesConfig.json (alignement convention vault)
- **Companion**: TabBar paths migrés `/companion/*` → `/*` (fix routes)
- **Companion**: manifest.json scope `/companion` → `/` (fix PWA mode)
- **Companion**: Panels utilisent collapse controlé (useState) au lieu de defaultCollapsed

### Fixed
- Modal Sage utilise `createPortal` pour éviter `overflow:hidden` du parent Panel
- Filepath extraction regex pattern (split → matchAll avec lookahead)
- Mode focus MarkdownEditor affichage vide (ajout key={questionId})
- Background sage color (transparentContent={true} sur Panels)
- Question titles colorées avec sage color (pas backgrounds)
- **Companion**: SagesPortal.jsx imports legacy (SagesKnowledge, HandoffCreator)
- **Companion**: PWA Safari navigation buttons (manifest scope mismatch)
- **Companion**: Collapse buttons Comptoir panels (ajout state management)
- **Companion**: Moments OUI widget non-fonctionnel (migration controlled collapse)

## [0.1.0] - 2024-XX-XX

### Added
- Application initiale IRIMMetaBrain
- 12 pièces médiévales (Sanctuaire, Chambre, Scriptorium, Comptoir, Cuisine, Atelier, Forge, Boutique, Laboratoire, Bibliothèque, Jardin, Cave)
- 5 stores Zustand (Notes, ProjectMeta, ProjectData, Diary, Preferences)
- Système de sync GitHub Gist avec encryption AES-256
- PWA Companion pour mobile

[unreleased]: https://github.com/ezuber/irimmetabrain/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ezuber/irimmetabrain/releases/tag/v0.1.0
