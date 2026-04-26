---
created: '2025-12-07'
updated: '2026-01-01'
status: active
---

# CLAUDE.md - IRIMMetaBrain

> Point d'entrée principal. Instructions complètes : `_cockpit/CLAUDE.md`

> Meta-cerveau spatial pour cerveaux créatifs neuro-atypiques

**Déploiement** : https://irim-metabrain.vercel.app/

---

## Projet

**IRIMMetaBrain** est un outil de productivité spatiale conçu pour les cerveaux TDA/H et créatifs neuro-atypiques. Interface médiévale-fantasy avec navigation spatiale entre 12 pièces thématiques.

### Stack Technique
- **Frontend** : React 19 + Vite + Styled Components
- **State** : Zustand (5 stores avec localStorage persistence)
- **Sync** : GitHub Gist + AES-256 encryption
- **Mobile** : PWA Companion (`/companion`)

### Les 12 Pièces (grille 4x3)

| Pièce | Fonction | Statut |
|-------|----------|--------|
| Sanctuaire | Méditation, Moments OUI (besoins Rosenberg) | Opérationnel |
| Chambre | Rituels matinaux, TimeTimer, MindLog, Mantras | Opérationnel |
| Scriptorium | Documentation | Opérationnel |
| Comptoir | Discussions & échanges (futur: portail Sages) | En construction |
| Cuisine | Bien-être, hydratation, pauses | Opérationnel |
| **Atelier** | **Hub central** - Projets, Roadmaps, Todos | Opérationnel |
| Forge | Build/deploy, outils techniques | Opérationnel |
| Boutique | Présentations & démos | En construction |
| Laboratoire | Tests, sandbox composants | Opérationnel |
| Bibliothèque | Références & ressources | Opérationnel |
| Jardin | Croissance d'idées | En construction |
| Cave | Secrets & debugging | En construction |

### Les 5 Stores Zustand

```
useNotesStore        → Notes par pièce + sideTower + companion
useProjectMetaStore  → Métadonnées projets (selectedProject, visibleProjects)
useProjectDataStore  → Données par projet (roadmap, todo, mindlog, actions)
useDiaryStore        → Journal personnel + mindlog + archives mensuelles
usePreferencesStore  → UI (defaultRoom, roomUIStates, layouts)
```

### Pattern Desktop/Companion

```
Desktop (StudioHall)  ↔  Mobile (CompanionApp)
   Navigation spatiale 4x3  |  TabBar navigation
   12 pièces thématiques    |  4 pages (Home/Atelier/Dev/Settings)
   Textures médiévales      |  UI simplifiée
        ↓                            ↓
        └────── Mêmes 5 stores Zustand ──────┘
```

---

## Conventions Code

### Structure Fichiers
```
src/
├── components/
│   ├── rooms/{RoomName}/          # Pièces principales
│   ├── room-modules/{room}/       # Widgets par pièce
│   └── widgets/                   # Composants réutilisables
├── stores/                        # Zustand stores
├── services/                      # Sync, adapters
├── styles/                        # Theme, mixins (textures)
└── utils/                         # roomPositions, assetMapping
```

### Patterns Établis
- **Textures** : `stoneBg`, `woodBg`, `leatherBg`, `metalBg`, `fabricBg`, `parchmentBg`
- **Panels** : Composant `Panel` avec header collapsible, grid positioning
- **Markdown** : `MarkdownEditor` pour toutes les notes
- **Stores** : Actions Zustand avec `set()` + persistence localStorage

### Standards Documentation
- Front matter YAML obligatoire (`type`, `updated`)
- ADR pour décisions architecturales (`_docs/decisions/ADR-XXX-*.md`)
- Liens internes en chemins relatifs

---

## Missions Actives

### Mission Prioritaire : IMB Sync — Auto-export Gist
**Fichier** : `_cockpit/missions/done/imb-sync-mission.md`
**Statut** : DONE (déjà exécutée)

Voir historique dans `_cockpit/missions/done/` pour détails.

---

### Mission Secondaire : IMB Upgrade — MCP + Sages
**Fichier** : `_cockpit/missions/backlog/imb-upgrade-mission.md`
**Statut** : À commencer après sync stabilisée

**Chantiers** :
- A. MCP Endpoint IMB (API Vercel Serverless → lecture Gist)
- B. Comptoir = Portail Sages
- C. Notifications iOS/macOS (PWA push)
- D. Protocole Zone Rouge
- E. Diary Upgrade - Amorces Cathartiques

**Dépendance** : Requiert M1 (sync) complète

---

## Références

### Documentation Projet
- [Architecture Stores](_docs/architecture/stores-architecture.md)
- [Architecture Companion](_docs/COMPANION_ARCHITECTURE.md)
- [Guide Sync](_docs/guides/sync-system.md)
- [Contributing](_docs/CONTRIBUTING.md)
- [ADR Index](_docs/decisions/README.md)

### Références Système

Ce projet suit l'Architecture V2. Sources de vérité :

| Document | Emplacement |
|----------|-------------|
| Index Références | `~/dev/_ref/LINKS.md` |
| ADR-01 Architecture | `~/dev/_ref/standards/ADR-01-architecture-v2.md` |
| ADR-02 Conventions | `~/dev/_ref/standards/ADR-02-conventions-nommage.md` |
| ADR-03 Linking | `~/dev/_ref/standards/ADR-03-strategie-linking.md` |
| Framework Cockpit | `~/dev/_ref/frameworks/cockpit.md` |
| Framework Documentation | `~/dev/_ref/frameworks/documentation.md` |

### Conventions Appliquées (ADR-02)

| Contexte | Convention | Exemple |
|----------|------------|---------|
| Fichiers/dossiers | kebab-case | `user-profile.tsx` |
| Composants | PascalCase | `UserProfile` |
| Variables/fonctions | camelCase | `getUserData` |
| Constantes | SCREAMING_SNAKE | `MAX_RETRIES` |

### Frontmatter Obligatoire

Tous les fichiers `.md` :

```yaml
---
created: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
status: draft | active | archived
---
```

---

## 🗺️ Framework Navigation

**You're here**: Working on IRIMMetaBrain (React + Zustand spatial interface for ADHD/creative brains).

### Quick Reads (New Session)
- **System overview** (5min): `~/dev/_ref/guides/framework-momentum.md`
- **Agent onboarding** (20min): `~/dev/_ref/guides/agent-onboarding.md` ← **Read this first if new to project**
- **Audit methodology** (reference): `~/dev/_ref/guides/audit-cycles.md`

### Active Work
- **Cockpit**: `_cockpit/`
  - **Done missions**: `_cockpit/missions/done/`
  - **Active missions**: `_cockpit/missions/active/`
  - **Backlog missions**: `_cockpit/missions/backlog/`
- **Project state**: Stores + sync + 12 rooms spatial interface

### Project Documentation
- **Stores architecture**: `_docs/architecture/stores-architecture.md`
- **Companion PWA**: `_docs/COMPANION_ARCHITECTURE.md`
- **Sync system**: `_docs/guides/sync-system.md`
- **ADRs**: `_docs/decisions/` (architecture decisions)
- **Contributing**: `_docs/CONTRIBUTING.md`

### System Standards (System-Level)
- **ADR-01** (Architecture): `~/dev/_ref/standards/ADR-01-architecture-v2.md`
- **ADR-02** (Conventions): `~/dev/_ref/standards/ADR-02-conventions-nommage.md`
- **Cockpit Framework**: `~/dev/_ref/frameworks/cockpit.md`
- **Documentation Framework**: `~/dev/_ref/frameworks/documentation.md`

### Tooling
- **Validate frontmatter**: `~/dev/_infra/scripts/validate-frontmatter.sh`
- **Check all active missions**: `~/dev/_infra/scripts/check-missions.sh`

---

## Commandes Utiles

```bash
# Dev
npm run dev              # Serveur local :5173
npm run build            # Build production

# Documentation
npm run doc:capture      # Capturer pensée rapide
npm run doc:index        # Régénérer index

# Debug (console navigateur)
window.__ZUSTAND_STORES__.notes()
window.__ZUSTAND_STORES__.projectMeta()
window.__SYNC_TOOLS__.collectAllStoreData()
```

---

**Philosophie** : L'IMB est conçu comme source de vérité autonome. Pas d'intégration externe (Obsidian, Todoist). Navigation spatiale > navigation fonctionnelle. Sophistication visuelle au service de l'engagement TDA/H.
