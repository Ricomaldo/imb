---
type: parking
mission: fusion-8sages-imb
created: 2026-01-01
updated: 2026-01-01
status: active
---

# 🅿️ Parking Créatif - Fusion 8 Sages × IMB

Idées émergentes capturées pour **M3+**, **v2**, ou futures itérations.
*BUT : Ne pas perdre le focus sur le MVP actuel (M1-M5).*

---

## Idée #1 : Quotes Dynamiques via MCP [PRIORITY: HAUTE]

**Date** : 2026-01-01 (M2)
**Origine** : M2 implémentation (quotes JSON statique)
**Description** :
- Actuellement : `sagesQuotes.json` statique (fallback OK)
- Futur : Connecter via MCP vers vault 8sages
  - Lire contributions Sages (sections dans questions IDE)
  - Lire sessions (quotes émergentes)
  - Lire manifestos (citations authentiques)
- Avantage : Quotes "vivantes", mises à jour en temps réel, reflètent l'évolution réelle Sages

**Cas d'usage** :
- Sage publie nouvelle quote dans sa question IDE → Comptoir IMB la propose
- Session archive → Quote capture le moment
- Manifesto évolue → Citation mise à jour

**Effort estimé** : 2-3h (MCP setup + adapter SageQuote)
**Dépendance** : M3-M5 d'abord (foundation)
**Parked pour** : Post-M5 ou v1.1

---

## Idée #2 : Avatar Images au lieu d'Emoji

**Date** : 2026-01-01 (M1)
**Origine** : Design refinement
**Description** :
- Actuellement : Emoji 3em (🧘, 🌸, etc.)
- Futur : Petites images (PNG/SVG) avatar Sages
- Avantage : Plus sophistiqué, plus personnel

**Effort estimé** : 1-2h (design + intégration)
**Parked pour** : v1.1 design polish

---

## Idée #3 : Animations Entrée Modal

**Date** : 2026-01-01 (M1)
**Origine** : UX refinement
**Description** :
- Modal slide-in ou fade-in avec timing
- Cartes hover glow effect
- Quotes transition smooth

**Effort estimé** : 30min
**Parked pour** : v1.1 polish

---

## Idée #4 : Historique Sages Visités

**Date** : 2026-01-01 (M1)
**Origine** : Zustand store a déjà `sageHistory`
**Description** :
- `sageHistory` dans store (10 derniers sages visités)
- Afficher "Derniers visités" dans Comptoir (sidebar?)
- Quick access aux Sages fréquents

**Effort estimé** : 45min
**Parked pour** : M4 ou v1.1

---

## Idée #5 : Palette Couleurs Cohérente

**Date** : 2026-01-01 (M1)
**Origine** : Design review
**Description** :
- Couleurs sages (color dans config) pas toujours cohérentes
- Vérifier contraste, luminosité, harmonie
- Potentiellement aligner avec theme IMB

**Effort estimé** : 30min
**Parked pour** : v1.1 design review

---

## Idée #6 : Mode Sombre pour Quotes

**Date** : 2026-01-01 (M2)
**Origine** : M2 implémentation
**Description** :
- Quotes sur fond `rgba(255,255,255,0.05)` - peut être mieux
- Potentiellement couleur fond par sage
- Ou gradient basé sur `sageColor`

**Effort estimé** : 15min
**Parked pour** : v1.1 polish

---

## Décisions Reportées

### MCP vs JSON pour Quotes
**Status** : JSON fallback pour MVP (M1-M5)
**Raison** : Rapide, offline, testé
**Transition** : Post-M5 si pertinent (need assessment)

### Avatar Images
**Status** : Emoji pour MVP
**Raison** : Zéro dépendance design, universellement visible
**Transition** : v1.1 si ressources design disponibles

---

## Workflow Parking

Quand idée émerge pendant dev :
1. **STOP dev** (max 30sec pour noter)
2. **Ajouter ici** avec date + contexte
3. **REPRENDRE dev** immédiatement

**But** : Garder momentum, pas d'interruption focus.

---

**Total idées parked** : 6
**Total effort futur** : ~6-7h (v1.1 + post-M5)
**Momentum actuel** : M3-M5 sans distraction ✅
