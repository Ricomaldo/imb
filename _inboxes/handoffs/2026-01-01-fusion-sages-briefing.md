---
type: handoff
from: cockpit-system
to: imb-project
date: 2026-01-01
priority: high
status: pending
tags: [fusion, 8sages, architecture, milestone]
---

# Handoff : Fusion 8 Sages × IMB - Briefing Complet

**De** : Cockpit Système (`~/dev/__cockpit__/`)
**À** : Projet IMB (`apps/IMB/_internal/cockpit/`)
**Agent destinataire** : Chrysalis (agent IMB)
**Créateur** : Chrysalis (agent système)

---

## 🎯 Contexte

Le 31 décembre 2025, une exploration système a été menée par **7 agents Opus** pour concevoir la fusion du vault 8 Sages (meta-cerveau relationnel) avec l'app IMB (meta-cerveau spatial).

**Résultat** : 3 documents stratégiques créés au niveau système.

---

## 📚 Documents Système à Consulter

### 1. Philosophy Document (ESSENTIEL)

**Emplacement** : `/Users/irimwebforge/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-philosophy.md`

**Contenu** :
- 5 principes fondateurs (Less is More, Dev Circulaire, Validation Continue, Parking Créatif, Gratification Immédiate)
- Architecture philosophique (meta-cerveau relationnel + spatial)
- Méthodologie itérative TDA/H-adaptée
- Manifeste développeur

**À lire en priorité** : Sections "Principes Fondateurs" et "Méthodologie Itérative"

---

### 2. Roadmap Technique (CODE SNIPPETS)

**Emplacement** : `/Users/irimwebforge/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-roadmap.md`

**Contenu** :
- 5 milestones détaillées (M1-M5)
- Code snippets complets pour chaque milestone
- Algorigramme de programmation circulaire
- Validation loops + decision trees

**À lire en priorité** : Section "MILESTONE 1 - Portail Sages" (code copier-coller prêt)

---

### 3. Start Briefing (QUICK START)

**Emplacement** : `/Users/irimwebforge/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md`

**Contenu** :
- **FIXES P0** : 2 blockers critiques à résoudre AVANT M1 (25min)
  - Fix 1 : Migration ComptoirGrid → PanelGrid (15min)
  - Fix 2 : Modal avec Portal (10min)
- Quick Start M1 (checklist pré-dev)
- Code copier-coller prêt à l'emploi
- Config complète 8 Sages (JSON)
- Patterns IMB réutilisables
- Flow de travail + planning suggéré

**À lire en priorité** : Section "FIXES P0" puis "Quick Start M1"

---

## 📊 Exploration Réalisée (Contexte)

**7 agents Opus déployés** (~2.4M tokens, 1.2M réels avec crédits doublés) :

| Agent | Mission | Résultat |
|-------|---------|----------|
| Agent 1 | Deep dive IMB architecture | Patterns Zustand, stores, widgets |
| Agent 2 | Analyze CLI 8sages bash | Architecture bash→JS porting |
| Agent 3 | Design UX flow iterative | 5 milestones circulaires TDA/H |
| Agent 4 | API Vercel strategy | Edge Runtime streaming |
| Agent 5 | Integration opportunities | 10 frictions + 6 synergies |
| Agent 6 | Fact-check anti-hallucination | **0 hallucinations**, 5 corrections mineures |
| Agent 7 | UI integration analysis | 2 blockers P0 identifiés |

**Findings archivés** : `/Users/irimwebforge/dev/__cockpit__/knowledge/findings/2025-12-31-fusion-validation-finale.md`

---

## 🎯 Mission pour Agent IMB

### Phase 1 : Lecture Documents (30min)

**Ordre recommandé** :
1. Start Briefing (section FIXES P0) - **15min**
2. Roadmap Technique (M1 uniquement) - **10min**
3. Philosophy Document (principes essentiels) - **5min**

### Phase 2 : Création Mission Locale (10min)

**Action** : Créer mission dans `/Users/irimwebforge/dev/apps/IMB/_internal/cockpit/workflow/active/`

**Suggestion nom** : `2026-01-01-fusion-sages-m1.md`

**Contenu mission locale** :
```yaml
---
type: mission
date: 2026-01-01
status: active
priority: high
parent_operation: ~/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md
---

# Mission M1 : Portail Sages

**Référence système** : ~/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md

## Tâches Locales

- [ ] FIXES P0 (25min)
  - [ ] Migration ComptoirGrid → PanelGrid
  - [ ] Modal avec Portal
- [ ] M1 Portail Sages (1.5h)
  - [ ] Créer sagesConfig.json
  - [ ] Créer useSagesStore.js
  - [ ] Créer SagesPortal.jsx
  - [ ] Intégrer dans ComptoirRoom
- [ ] Validation (10min)
  - [ ] Tests checklist
  - [ ] Console sans erreurs
  - [ ] Commit

## Notes Spécifiques IMB

[À remplir par agent IMB pendant exécution]
```

### Phase 3 : Exécution (2h)

**Suivre** : Start Briefing section "Quick Start M1"

**Effort total** : 2h (25min fixes P0 + 1.5h M1)

---

## 🔄 Flow Répétable (Pour Futur)

### Quand Conception Système → Projet

**1. Documents restent dans `~/dev/__cockpit__/`** (source de vérité système)

**2. Créer handoff dans projet** :
```bash
cp ~/dev/_ref/templates/project-structure/complex/_inboxes_handoff-system-to-project.md \
   [projet]/_inboxes/handoffs/YYYY-MM-DD-[sujet].md
```

**3. Handoff contient** :
- Contexte (pourquoi ces docs)
- Liens absolus vers docs système
- Ordre lecture recommandé
- Actions projet attendues

**4. Agent projet** :
- Lit handoff
- Consulte docs système via liens
- Crée mission locale dans `_internal/cockpit/workflow/active/`
- Exécute
- Reporte status dans mission locale

**5. Coordination** :
- Mission système (`~/dev/__cockpit__/`) = vision globale
- Mission projet (`apps/IMB/_internal/cockpit/`) = exécution locale
- Handoff (`_inboxes/handoffs/`) = pont de transmission

---

## 📝 Status Handoff

- [x] Handoff créé
- [x] Handoff lu par agent IMB ✅ 2026-01-01
- [x] Mission locale créée ✅ `_internal/cockpit/workflow/active/2026-01-01-fusion-sages-m1.md`
- [ ] Exécution démarrée (prochaine session)
- [ ] Status reporté (prochaine session)

**Mettre à jour ce fichier** quand checkboxes complétées.

---

## 🔗 Voir Aussi

| Document | Emplacement | Usage |
|----------|-------------|-------|
| **Philosophy** | `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-philosophy.md` | Principes dev |
| **Roadmap** | `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-roadmap.md` | Code snippets |
| **Briefing** | `~/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md` | Quick start |
| **Validation** | `~/dev/__cockpit__/knowledge/findings/2025-12-31-fusion-validation-finale.md` | Findings agents |

---

**Handoff créé** : 1er janvier 2026
**Prochaine action IMB** : Lire ce handoff → créer mission locale → exécuter M1
