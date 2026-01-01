---
created: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
status: active
type: guidelines
---

# Règles de Tri : Cockpit vs Docs

> Distinction claire entre bureau de travail personnel et bibliothèque de référence

## 🎯 Principe Fondamental

**`_internal/cockpit/`** = Bureau de travail personnel (workflow, apprentissage, planning)
**`_internal/docs/`** = Bibliothèque de référence (guides réutilisables, décisions, rapports finalisés)

---

## ✅ Quand mettre dans `cockpit/` ?

### Workflow Opérationnel
- Missions actives (`workflow/active/`)
- Missions planifiées (`workflow/backlog/`)
- Missions terminées (`workflow/done/`)
- Messages inter-agents (`workflow/inbox/`)

### Knowledge Base Personnelle
- Apprentissage temporaire (`knowledge/devlog/`)
- Audits en cours, findings temporaires (`knowledge/findings/`)
- Guides de workflow personnel (`knowledge/guide/`)

### Planning Stratégique
- Roadmap et timeline (`planning/roadmap/`)
- Templates mission/todo (`planning/templates/`)

### Validation
- Checklists de validation (`testing/`)

---

## ✅ Quand mettre dans `docs/` ?

### Guides Techniques
- Builds, déploiement (`_internal/docs/guides/builds-*`, `deployment-*`)
- Tests (`_internal/docs/guides/testing-*`)
- Features (`_internal/docs/guides/features-*`)

### Décisions
- Architecture Decision Records (`_internal/docs/decisions/adr-*`)
- Stratégies techniques (`_internal/docs/decisions/*-strategy.md`)

### Rapports Finalisés
- Audits standardisés (`_internal/docs/reports/audit-*`)
- Analyses (`_internal/docs/reports/analysis-*`)
- Architecture (`_internal/docs/reports/architecture-*`)

---

## 🔄 Quand migrer `cockpit/` → `docs/` ?

### Devlog → Guide
**Quand :** Un devlog devient un guide réutilisable
**Exemple :**
- `cockpit/knowledge/devlog/setup-notes.md`
- → `_internal/docs/guides/setup-guide.md`

**Critères :**
- ✅ Processus stabilisé et validé
- ✅ Réutilisable pour d'autres projets
- ✅ Format standardisé (pas de notes personnelles)

### Finding → Rapport
**Quand :** Un finding devient un rapport standardisé
**Exemple :**
- `cockpit/knowledge/findings/2026-01-01-audit.md`
- → `_internal/docs/reports/audit-2026-01-01.md`

**Critères :**
- ✅ Audit complété et validé
- ✅ Format standardisé (recommandations)
- ✅ Référence pour audits futurs

### Mission → Guide/Decision
**Quand :** Une mission contient des éléments réutilisables
**Exemple :**
- Extraire la partie "procédure" d'une mission
- → Créer `_internal/docs/guides/procedure-*` ou `_internal/docs/decisions/adr-*`

---

## 🚫 Règles Anti-Doublon

1. **Pas de copie** : Un document existe dans UN seul endroit
2. **Migration, pas duplication** : Quand on migre, on supprime l'original
3. **Référence si besoin** : Dans cockpit, référencer docs avec lien relatif

---

## 🔍 Checklist de Décision

Avant de créer un document, se poser :

1. **C'est temporaire ou permanent ?**
   - Temporaire → `cockpit/`
   - Permanent → `_internal/docs/`

2. **C'est personnel ou partageable ?**
   - Personnel → `cockpit/`
   - Partageable → `_internal/docs/`

3. **C'est en cours ou finalisé ?**
   - En cours → `cockpit/`
   - Finalisé → `_internal/docs/`

4. **C'est workflow ou référence ?**
   - Workflow → `cockpit/`
   - Référence → `_internal/docs/`

---

*Dernière mise à jour : [Date]*
