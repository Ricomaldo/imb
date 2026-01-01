---
type: mission
date: 2026-01-01
status: active
priority: high
milestone: M1
parent_operation: ~/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md
---

# M1 : Portail des 8 Sages

**Handoff reçu de** : Cockpit Système
**Référence** : `~/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md`

**Objectif** : Intégrer le Portail des 8 Sages dans le Comptoir IMB

**Effort estimé** : 2h (25min FIXES P0 + 1.5h M1)

---

## 📋 Tâches

### Phase 1 : FIXES P0 (25min) ⚡

**Problèmes identifiés par validation Opus** : 2 blockers critiques.

#### Fix 1 : Migration ComptoirGrid → PanelGrid (15min)

**Problème** : `ComptoirRoom.jsx` utilise `ComptoirGrid` incompatible avec pattern `Panel`.

**Fichier** : `src/components/rooms/Comptoir/ComptoirRoom.jsx`

**Action** :
```jsx
// AVANT
import { ComptoirGrid } from './ComptoirRoom.styles';
<ComptoirGrid>{/* incompatible */}</ComptoirGrid>

// APRÈS
import PanelGrid from '../../layout/PanelGrid';
<PanelGrid columns={4} rows={3}>
  {/* Compatible avec Panel pattern */}
</PanelGrid>
```

**Référence** : `src/components/rooms/Sanctuaire/SanctuaireRoom.jsx` (pattern modèle)

- [ ] PanelGrid importé depuis `../../layout/PanelGrid`
- [ ] ComptoirGrid supprimé/migré
- [ ] Structure CSS compatible

#### Fix 2 : Modal avec Portal (10min)

**Problème** : Modal inline risque clipping par `overflow: hidden` du parent.

**Fichier** : `src/components/rooms/Comptoir/widgets/SagesPortal.jsx` (à créer)

**Action** :
```javascript
import { createPortal } from 'react-dom';

// EN BAS du composant
{selectedSage && createPortal(
  <ModalOverlay onClick={() => setSelectedSage(null)}>
    <ModalContent onClick={e => e.stopPropagation()}>
      {/* Contenu modal */}
    </ModalContent>
  </ModalOverlay>,
  document.body
)}
```

**Référence** : Pattern `FocusOverlay` dans `src/components/common/Panel/Panel.jsx`

- [ ] `createPortal()` importé
- [ ] Modal rendu sur `document.body`
- [ ] Événement `stopPropagation()` présent

#### Validation FIXES P0

- [ ] `npm run dev` → aucune erreur console
- [ ] Comptoir s'affiche avec grille PanelGrid vide
- [ ] Pas de warnings React

---

### Phase 2 : M1 - Portail Sages (1.5h) 🎭

#### Étape 1 : Configuration (15min)

**Fichier** : `src/data/sagesConfig.json` (créer)

**Contenu** : Config 8 Sages avec id, name, emoji, age, specialty, color, room

Snippet dans : `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-roadmap.md` (section "Config Sages")

- [ ] Fichier créé
- [ ] JSON valide (test: `JSON.parse()`)
- [ ] Tous 8 sages configurés

#### Étape 2 : Store Zustand (15min)

**Fichier** : `src/stores/useSagesStore.js` (créer)

**Contenu** :
- `currentSage` : sage actuellement sélectionné
- `sageHistory` : historique 10 derniers sages
- Actions : `selectSage()`, `addHistory()`, `importData()`, `exportData()`
- Persistence : localStorage `sages-store`

Snippet : `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-roadmap.md` (section "Store Zustand")

- [ ] Store créé avec `create()` et `persist()`
- [ ] localStorage key: `sages-store` (convention IMB)
- [ ] Debug: `window.__ZUSTAND_STORES__.sages()` fonctionne

#### Étape 3 : Composant SagesPortal (45min)

**Fichier** : `src/components/rooms/Comptoir/widgets/SagesPortal.jsx` (créer)

**Contenu** :
- Grid 4×2 avec 8 cartes (1 par sage)
- Chaque carte : emoji + nom + âge
- Hover effect : `translateY(-5px)`
- Clic : ouvre modal
- Modal : emoji, nom, age, specialty
- Portal pour éviter overflow

Snippet : `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-roadmap.md` (section "Composant Portal")

- [ ] Grid affiche 8 cartes
- [ ] Hover effet visible
- [ ] Clic sage → modal s'ouvre
- [ ] Modal fermable (button ou clic overlay)

#### Étape 4 : Styles (15min)

**Fichier** : `src/components/rooms/Comptoir/widgets/SagesPortal.styles.js` (créer si besoin)

**Contenu** : Styled components pour Grid, Card, Modal

Pattern IMB : Textures (`stoneBg`, `woodBg`), borders, transitions

- [ ] Grid spacing correct
- [ ] Card borders et couleurs (color from config)
- [ ] Modal overlay styling

#### Étape 5 : Intégration (15min)

**Fichier** : `src/components/rooms/Comptoir/ComptoirRoom.jsx` (modifier)

**Action** :
```javascript
import { SagesPortal } from './widgets/SagesPortal';

export const ComptoirRoom = () => {
  return (
    <BaseRoom roomType="comptoir">
      <SagesPortal />
    </BaseRoom>
  );
};
```

- [ ] SagesPortal importé
- [ ] Rendu dans BaseRoom
- [ ] Pas d'erreurs console

---

### Phase 3 : Validation (10min) ✨

#### Test Rapide

```javascript
// Console browser
window.__ZUSTAND_STORES__.sages()
// → { currentSage: null, sageHistory: [], ... }
```

#### Checklist Validation M1

- [ ] 8 cartes visibles dans Comptoir
- [ ] Emoji + nom + âge affichés
- [ ] Hover effet (`translateY`)
- [ ] Clic Meridian → modal s'affiche
- [ ] Modal fermeture propre (button + click overlay)
- [ ] `console.log(useSagesStore.getState())` → currentSage = "meridian"
- [ ] `npm run build` → sans erreurs

#### Commit

```bash
git add src/data/sagesConfig.json src/stores/useSagesStore.js \
        src/components/rooms/Comptoir/widgets/SagesPortal.* \
        src/components/rooms/Comptoir/ComptoirRoom.jsx

git commit -m "M1: Portail Sages - 8 cartes cliquables + modal"
```

- [ ] Commit créé
- [ ] Branche: `feature/fusion-sages-m1`

---

## 🔗 Références Système (À Consulter)

| Doc | Emplacement | Usage |
|-----|-------------|-------|
| **Philosophy** | `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-philosophy.md` | Principes (Less is More, Dev Circulaire) |
| **Roadmap M1** | `~/dev/__cockpit__/planning/roadmap/2025-12-31-fusion-roadmap.md` | Code snippets (Store, Config, Composant) |
| **Start Briefing** | `~/dev/__cockpit__/workflow/active/2025-12-31-fusion-8sages-imb.md` | Quick Start + Fixes P0 |
| **Validation** | `~/dev/__cockpit__/knowledge/findings/2025-12-31-fusion-validation-finale.md` | Findings agents Opus |

---

## 📝 Notes d'Exécution

### Conventions IMB à Respecter

| Élément | Convention | Exemple |
|---------|-----------|---------|
| localStorage key | `irim-[module]` | `irim-sages-store` |
| Import Panel | `../../../common/Panel` depuis `widgets/` | ✅ |
| Debug store | `window.__ZUSTAND_STORES__.[nom]()` | ✅ |
| Textures | stoneBg, woodBg, etc | Dans styles |
| PanelGrid | Layout compatible | `<PanelGrid columns={4}>` |

### Corrections Mineures (Déjà Intégrées)

- ✅ localStorage key: `irim-sages-store` (convention IMB)
- ✅ Import Panel paths corrects
- ✅ Debug pattern window.__ZUSTAND_STORES__
- ✅ sagesConfig enrichi avec `color` et `room`

---

## 🎯 Status Tracking

- [x] Handoff lu + docs système consultés
- [x] FIXES P0 validées (ComptoirGrid + Modal)
- [x] Étape 1-5 complétées (config, store, composant, styles, intégration)
- [x] Tests validation réussis
- [x] Commit créé et pushé
- [x] Prêt pour M2 (Voix des Sages)

---

## 🔄 Prochaine Action (M2)

Après validation M1 :
- [ ] Créer mission `_internal/cockpit/workflow/active/2026-01-XX-fusion-sages-m2.md`
- [ ] Consulter doc système M2 : Quotes + Voix Sages
- [ ] Enrichir SagesPortal avec quote rotative

---

**Créée** : 1er janvier 2026
**Mise à jour** : 2026-01-01
**Status** : Prête pour exécution
