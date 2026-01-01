---
created: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
status: active
type: cockpit-framework
---

# Cockpit [Nom Projet]

## 🏗️ Framework (Stable Reference)

This document defines the **cockpit architecture, workflows, and rules**. It changes rarely.

For **current state, missions, or next steps**, see:
- **Current mission** → `workflow/active/current.md`
- **All missions** → `workflow/` (active/, backlog/, done/)
- **Audit findings** → `../docs/audits/`

---

## Structure

```
_internal/cockpit/
├── CLAUDE.md           # Ce fichier — index et contexte
├── RULES.md            # Règles de tri cockpit vs docs
│
├── workflow/           # Workflow opérationnel
│   ├── active/        # Missions en cours (1-2 max)
│   ├── backlog/       # Missions planifiées
│   ├── done/          # Missions terminées
│   ├── paused/        # Missions en pause
│   └── inbox/         # Messages inter-agents
│
├── knowledge/         # Knowledge base personnelle
│   ├── devlog/        # Apprentissage, troubleshooting
│   ├── findings/      # Audits en cours, findings temporaires
│   └── guide/         # Guides de workflow personnel
│
├── planning/          # Vision stratégique
│   ├── roadmap/       # Timeline, milestones
│   └── templates/     # Templates mission/todo
│
└── testing/           # Checklists de validation
```

**Workflow mission** : `workflow/backlog/` → `workflow/active/` → `workflow/done/`

---

## Règles

- **1-2 missions actives max** par milestone
- Deux niveaux de granularité :
  - `mX-overview.md` — Suivi stratégique milestone (KPIs, liens missions)
  - `mission-[nom].md` — Exécution opérationnelle (tâches, code)
- Déplacer dans `done/` une fois terminé

---

## Références Système

| Document | Emplacement |
|----------|-------------|
| Framework Cockpit | `~/dev/_ref/frameworks/cockpit.md` |
| Framework Documentation | `~/dev/_ref/frameworks/documentation.md` |
| Index Références | `~/dev/_ref/LINKS.md` |

---

## État des Missions

### Active (`workflow/active/`)

| Fichier | Type | Description |
|---------|------|-------------|
| [À définir] | mission | [Description] |

### Backlog (`workflow/backlog/`)

| Fichier | Type | Description |
|---------|------|-------------|
| [À définir] | mission | [Description] |

### Done (`workflow/done/`)

| Fichier | Date | Description |
|---------|------|-------------|
| [À définir] | YYYY-MM-DD | [Description] |

---

*Dernière mise à jour : [Date]*
