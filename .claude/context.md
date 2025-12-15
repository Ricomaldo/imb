---
created: '2025-12-15'
updated: '2025-12-15'
status: active
type: session-bootstrap
scope: imb
---

# .claude/context.md — IRIMMetaBrain Session Bootstrap

**You're here**: `~/dev/apps/IMB/` — Spatial productivity tool for ADHD/creative neuro-atypical brains.

**Stack**: React 19 + Vite + Zustand (5 stores) + GitHub Gist sync + PWA companion.

**UX**: Medieval-fantasy interface with 12 spatial rooms organized in 4×3 grid.

---

## 🚀 Quick Start Path Selector

Choose based on available time:

| Path | Time | Know | Do This |
|------|------|------|---------|
| **Minimal** ⚡ | 2-5min | What's active right now | 1. Read this file / 2. Check `__cockpit__/active/` / 3. Start coding |
| **Standard** 📖 | 15-20min | What am I building & why | 1. Read CLAUDE.md overview / 2. Read active mission / 3. Skim architecture docs |
| **Deep** 🎓 | 1-2hr | How does everything work | 1. Read stores architecture / 2. Study 12 rooms grid / 3. Set up dev environment |

---

## 📁 Key Local Paths

```
.                                    # Root
├── CLAUDE.md                         # Tech stack, 12 rooms, active missions
├── README.md                         # Setup & build instructions
├── CHANGELOG.md                      # Version history
│
├── src/
│   ├── components/
│   │   ├── rooms/{RoomName}/        # 12 spatial room components
│   │   ├── room-modules/{room}/     # Widgets per room
│   │   └── widgets/                 # Reusable components
│   ├── stores/                       # 5 Zustand stores
│   │   ├── useNotesStore.js         # Notes by room + sidebar + companion
│   │   ├── useProjectMetaStore.js   # Project metadata
│   │   ├── useProjectDataStore.js   # Roadmap, todo, mindlog, actions
│   │   ├── useDiaryStore.js         # Personal journal + archives
│   │   └── usePreferencesStore.js   # UI state (room, layouts)
│   ├── services/                     # Sync, adapters, GitHub Gist
│   ├── styles/                       # Theme, textures (stoneBg, woodBg, etc.)
│   └── utils/                        # roomPositions, assetMapping
│
├── __cockpit__/                      # Project operations
│   ├── CLAUDE.md                     # Active missions, store organization
│   ├── active/                       # Active missions
│   │   └── imb-sync-mission.md       # ← PRIMARY: Auto-export to Gist
│   ├── backlog/                      # Future work
│   │   └── imb-upgrade-mission.md    # MCP + Sages integration
│   └── done/                         # Completed missions
│
└── _docs_/                           # Project documentation
    ├── architecture/stores-architecture.md     # 5 stores deep-dive
    ├── COMPANION_ARCHITECTURE.md    # PWA companion design
    ├── guides/sync-system.md        # Gist sync mechanics
    ├── decisions/ADR-*.md           # Architecture decisions
    └── [other guides]
```

---

## 🎯 Current Mission: IMB Sync Auto-Export

**Primary Active Mission**:
```bash
cat __cockpit__/active/imb-sync-mission.md
```

**Objective**: Eliminate manual Export/Import friction. Auto-save to GitHub Gist.

**Phases**:
- **A**: Auto-export with 30s debounce (core functionality)
- **B**: Sync UI indicator (visual feedback: "Synced ✓", "Syncing...", "Offline")
- **C**: Auto-import (Phase 2, not MVP)

**Stores involved**:
- useNotesStore
- useProjectMetaStore
- useProjectDataStore
- useDiaryStore
- usePreferencesStore

---

## 🎨 The 12 Rooms (4×3 Spatial Grid)

| Room | Function | Status |
|------|----------|--------|
| **Sanctuaire** | Meditation, Rosenberg needs ("yes moments") | Operational |
| **Chambre** | Morning rituals, TimeTimer, MindLog, Mantras | Operational |
| **Scriptorium** | Documentation, notes capture | Operational |
| **Comptoir** | Discussions & exchanges (future: Sages portal) | In progress |
| **Cuisine** | Wellness, hydration, breaks | Operational |
| **Atelier** | Hub central—Projects, Roadmaps, Todos | Operational |
| **Forge** | Build/deploy, technical tools | Operational |
| **Boutique** | Presentations & demos | In progress |
| **Laboratoire** | Tests, component sandbox | Operational |
| **Bibliothèque** | References & resources | Operational |
| **Jardin** | Idea growth (ideation space) | In progress |
| **Cave** | Secrets & debugging | In progress |

---

## 🛠️ Essential Commands

```bash
# Development
npm run dev              # Start Vite dev server (:5173)
npm run build            # Build production

# Documentation
npm run doc:capture      # Capture quick thought (devlog)
npm run doc:index        # Regenerate docs index

# Debug (browser console)
window.__ZUSTAND_STORES__.notes()         # Peek notes store
window.__ZUSTAND_STORES__.projectMeta()   # Peek meta store
window.__SYNC_TOOLS__.collectAllStoreData() # See all sync data
```

---

## 📚 Framework Navigation

### Session Starters (Read First)
- **Momentum guide** (1-page quick ref): `~/dev/_ref/guides/framework-momentum.md`
- **Agent onboarding** (3 paths, 2-2hr): `~/dev/_ref/guides/agent-onboarding.md`
- **Audit cycles** (methodology reference): `~/dev/_ref/guides/audit-cycles.md`

### Project Documentation
- **Tech stack & rooms**: `CLAUDE.md`
- **Active missions**: `__cockpit__/active/`
  - Primary: `imb-sync-mission.md` (Auto-export Gist)
  - Future: `imb-upgrade-mission.md` (MCP + Sages)
- **Stores deep-dive**: `_docs_/architecture/stores-architecture.md`
- **Companion PWA**: `_docs_/COMPANION_ARCHITECTURE.md`
- **Sync mechanics**: `_docs_/guides/sync-system.md`
- **Architecture decisions**: `_docs_/decisions/`

### System Standards
- **ADR-01** (Architecture): `~/dev/_ref/standards/ADR-01-architecture-v2.md`
- **ADR-02** (Conventions): `~/dev/_ref/standards/ADR-02-conventions-nommage.md`
- **ADR-03** (Linking): `~/dev/_ref/standards/ADR-03-strategie-linking.md`
- **Cockpit Framework**: `~/dev/_ref/frameworks/cockpit.md`
- **Documentation Framework**: `~/dev/_ref/frameworks/documentation.md`

### Tooling & Validation
```bash
# Validate frontmatter across all files
~/dev/_infra/scripts/validate-frontmatter.sh

# Check all active missions (system-wide)
~/dev/_infra/scripts/check-missions.sh

# Scaffold new project
~/dev/_infra/scripts/new-project.sh [project-name]
```

---

## 💡 Common Tasks

| Task | Where | Pattern |
|------|-------|---------|
| Add component to room | `src/components/rooms/{RoomName}/` | Copy similar room, follow naming |
| Add widget to room | `src/components/room-modules/{room}/` | Small, reusable, use Panel component |
| Update notes store | `src/stores/useNotesStore.js` | Add action with `set()` + localStorage persist |
| Add sync functionality | `src/services/SyncManager.js` | Handle debounce, error states, retry logic |
| Add texture/style | `src/styles/` | Use texture mixins (stoneBg, woodBg, etc.) |
| Test store changes | Browser console | Use `window.__ZUSTAND_STORES__` debug tools |
| Debug sync | DevTools/Console | Use `window.__SYNC_TOOLS__.collectAllStoreData()` |

---

## ⚡ Pro Tips

1. **Stores are reactive**: All UI updates through Zustand subscriptions. No prop drilling.
2. **Persist is automatic**: localStorage handled by Zustand config. Just add to store definition.
3. **Sync is async**: GitHub Gist operations are debounced. Check mission for current phase (A/B/C).
4. **Textures > pure CSS**: Use defined texture mixins instead of raw CSS for visual coherence.
5. **12 rooms are independent**: Each room can be developed/tested separately. No circular dependencies.

---

## 🔗 Session Start Workflow

**Every session**:
1. ✅ Decide path (Minimal / Standard / Deep)
2. ✅ Read this file (you're here!)
3. ✅ Check active mission: `cat __cockpit__/active/imb-sync-mission.md`
4. ✅ Read mission Quick Start section (if present)
5. ✅ Check dependencies: `npm install` (if needed)
6. ✅ Start dev: `npm run dev` (Vite on :5173)
7. ✅ Open browser DevTools console
8. ✅ Begin work on next checklist item in mission

---

## 🧠 Philosophy

> L'IMB est conçu comme source de vérité autonome. Pas d'intégration externe (Obsidian, Todoist). Navigation spatiale > navigation fonctionnelle. Sophistication visuelle au service de l'engagement TDA/H.

**Translation**: IMB is designed as an autonomous system of truth. No external integrations. Spatial navigation > functional navigation. Visual sophistication serves ADHD/creative engagement.

---

**Created**: 2025-12-15
**Framework**: Documentation Framework + Cockpit Framework
**For**: Claude agents starting IMB sessions
