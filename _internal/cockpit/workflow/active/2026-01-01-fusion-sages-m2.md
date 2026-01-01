---
type: mission
date: 2026-01-01
status: active
priority: high
milestone: M2
parent_operation: ~/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md
depends_on: 2026-01-01-fusion-sages-m1.md
---

# M2 : Voix des Sages — Quotes + Questions Liées

**Handoff reçu de** : M1 complétée
**Référence** : `~/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md`

**Objectif** : Enrichir modales avec quotes rotatives et questions liées (domaines expertise chaque sage)

**Effort estimé** : 1.5h (Quotes 30min + Questions/Index 45min + Integration 15min)

---

## 📋 Tâches

### Phase 1 : Config Quotes (30min) 📚

#### Étape 1 : Créer `sagesQuotes.json` (15min)

**Fichier** : `src/data/sagesQuotes.json`

**Structure** : 3 quotes par sage (27 total)
```json
{
  "chrysalis": [
    "La métamorphose n'est jamais linéaire...",
    "Chaque contrainte cache une opportunité...",
    "Tu vois le papillon avant que la chrysalide..."
  ],
  "meridian": [ ... ],
  ...
}
```

**Source** : `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-roadmap.md` (section "Quotes par Sage")

**Validation** :
- [ ] JSON valide (test: `JSON.parse()`)
- [ ] 8 clés (1 par sage ID)
- [ ] Chaque sage = 3 quotes
- [ ] Quotes uniques + thématiques (archétype sage)

#### Étape 2 : Implémenter SageQuote component (15min)

**Fichier** : `src/components/rooms/Comptoir/widgets/SageQuote.jsx` (déjà créé M1)

**Validation** :
- [ ] Composant exporte une quote
- [ ] Rotation aléatoire à chaque ouverture modal
- [ ] Affichage formaté (italique, couleur sage)
- [ ] Fallback si sage pas dans config

### Phase 2 : Config Questions/Index (45min) 🎯

#### Étape 1 : Créer `sagesIndex.json` (20min)

**Fichier** : `src/data/sagesIndex.json`

**Structure** : Questions liées par sage
```json
{
  "chrysalis": {
    "questions": [
      { "id": "IDE01", "title": "...", "domain": "identite" },
      { "id": "IDE03", "title": "...", "domain": "identite" },
      { "id": "PRO01", "title": "...", "domain": "professionnel" }
    ]
  },
  ...
}
```

**Scope Questions** :
- **Chrysalis** : IDE01-05 (identité/métamorphose) + PRO01-08 (création/innovation)
- **Éléonore** : REL01-06 (relationnel) + ACC02 (limites IA/humain)
- **Onyx** : IDE06-10 (archétypes/shadow work) + SPI01-04 (spirituel)
- **Meridian** : CON01-02 (constitution/régulation) + FAM01-05 (paternité)
- **Atlas** : PAT01-04 (patrimoine) + FAM06-09 (famille)
- **Luna** : IDE11-13 (créativité/expression) + SPI05-08 (arts sacrés)
- **Bodhi** : ACC01-06 (accompagnement/coordination) + SPI09-12 (silence)
- **Gouvernail** : ACC06-08 (coordination système) + vue globale

**Source** : Mapping questions V4 en cours

**Validation** :
- [ ] JSON valide
- [ ] 8 clés (1 par sage ID)
- [ ] Chaque sage = 2-4 questions liées
- [ ] IDs correspondent à structure V4 (IDE, REL, PRO, etc.)

#### Étape 2 : Implémenter SagesKnowledge component (25min)

**Fichier** : `src/components/rooms/Comptoir/widgets/SagesKnowledge.jsx` (déjà créé M1)

**Validation** :
- [ ] Component exporte questions liées au sage
- [ ] Affichage = liste cliquable
- [ ] Clic = détail question (domaine + description)
- [ ] Design cohérent (couleur sage)
- [ ] Fallback si sage pas dans index

### Phase 3 : Intégration Modale (15min) 🎪

#### Étape 1 : Layout Modal (10min)

**Fichier** : `src/components/rooms/Comptoir/widgets/SagesPortal.jsx` (modifier)

**Changement** :
```jsx
<ModalBody color={selectedSage.color}>
  {/* Colonne gauche : Quote + Questions */}
  <ModalSection>
    <SageQuote sageId={selectedSage.id} color={selectedSage.color} />
    <SagesKnowledge sageId={selectedSage.id} color={selectedSage.color} />
  </ModalSection>

  {/* Colonne droite : Handoff */}
  <ModalSection>
    <HandoffCreator
      emetteurId={selectedSage.id}
      emetteurName={selectedSage.name}
      color={selectedSage.color}
    />
  </ModalSection>
</ModalBody>
```

**Validation** :
- [ ] SageQuote affiché haut gauche
- [ ] SagesKnowledge affiché bas gauche
- [ ] HandoffCreator colonne droite
- [ ] Layout 2-col responsive

#### Étape 2 : Styles & Polish (5min)

**Fichier** : `src/components/rooms/Comptoir/widgets/SagesPortal.jsx`

**Changement** :
- Spacing entre composants gauche
- Bordures/couleurs cohérentes
- Scrolling smooth

**Validation** :
- [ ] Modal s'affiche sans layout break
- [ ] Composants visibles + lisibles
- [ ] Pas de warning React console

### Phase 4 : Validation (10min) ✨

#### Test Rapide

```javascript
// Console browser
window.__ZUSTAND_STORES__.sages()
// → { currentSage: "chrysalis", ... }

// Devtools Zustand
// → currentSage = "chrysalis"
```

#### Checklist Validation M2

- [ ] Clic sage → modal s'affiche
- [ ] Quote affichée (rotative à chaque ouverture)
- [ ] Questions listées (2-4 par sage)
- [ ] Clic question → détail apparaît
- [ ] Handoff toujours accessible
- [ ] Layout 2-col responsive
- [ ] Pas d'erreurs console
- [ ] `npm run build` → sans erreurs

#### Commit

```bash
git add src/data/sagesQuotes.json \
        src/data/sagesIndex.json \
        src/components/rooms/Comptoir/widgets/SageQuote.jsx \
        src/components/rooms/Comptoir/widgets/SagesKnowledge.jsx \
        src/components/rooms/Comptoir/widgets/SagesPortal.jsx

git commit -m "M2: Voix des Sages - Quotes rotatives + Questions liées"
```

- [ ] Commit créé
- [ ] Branche: `feature/fusion-sages-m1`

---

## 🔗 Références Système

| Doc | Emplacement | Usage |
|-----|-------------|-------|
| **Roadmap M2** | `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-roadmap.md` | Code snippets (Quotes, Index) |
| **Mapping V4** | `~/dev/__cockpit__/planning/roadmap/questions-v4-mapping.md` | Questions par sage |
| **M1 Complétée** | `./2026-01-01-fusion-sages-m1.md` | État du Portail |

---

## 📝 Notes d'Exécution

### Conventions IMB

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Sage ID | kebab-case | `chrysalis`, `meridian` |
| Question ID | CODE### | `IDE01`, `PRO07` |
| Color | Hex from config | `#8B5CF6` (Chrysalis) |
| Import data | `src/data/[name].json` | `sagesQuotes.json` |

### Architecture Actuelle M1→M2

```
SagesPortal (grid 4x2)
  ↓ clic sage
  Modal (responsive 2-col)
    ├─ Col gauche (scrollable)
    │  ├─ SageQuote (quote rotative)
    │  └─ SagesKnowledge (questions expandables)
    └─ Col droite (sticky)
       └─ HandoffCreator (form)
```

---

## 🎯 Status Tracking

- [ ] Handoff M1→M2 complété
- [ ] `sagesQuotes.json` créé
- [ ] `sagesIndex.json` créé
- [ ] SageQuote component implanté
- [ ] SagesKnowledge component implanté
- [ ] Modal intégrée (2-col)
- [ ] Tests validation réussis
- [ ] Commit créé et pushé

---

## 🔄 Prochaines Actions (M3+)

**M3 : Handoff Opérationnel**
- Intégration MCP client pour lire Gist
- API endpoint `/api/vault/handoff` fonctionnel
- Créer handoff depuis modal → file Gist

**M4 : Protocole Zone Rouge** (déjà existant)
- Respiration guidée complète

**M5 : Diary Upgrade**
- Amorces cathartiques par sage
- Intégration questions dans journal

---

**Créée** : 1er janvier 2026
**Status** : Prête pour exécution
