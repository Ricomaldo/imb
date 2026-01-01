---
created: 2026-01-01
updated: 2026-01-01
type: learnings
tags: [refactoring, architecture, responsive, ux]
session: SideTower Refactoring & Responsive
---

# Learnings — SideTower Refactoring & Responsive Design

> Insights et patterns établis lors de la refonte complète de la SideTower

---

## 🏗️ Architecture Pattern: Hiérarchie Sémantique

### Insight

**Nommage hiérarchique explicite > Noms fonctionnels vagues**

**Avant** (confus):
- ControlTower (contrôle de quoi?)
- WorkbenchDrawer (drawer ou toolbar?)
- SideTowerNotes (figé sur notes)

**Après** (clair):
- TowerHeader (étage supérieur)
- TowerToolbar (étage milieu)
- TowerViewer (étage inférieur)
- Préfixe `Tower` commun
- Suffixe `Floor` pour wrappers

### Principe Établi

**Hiérarchie claire dans le nommage = Architecture explicite dans le code**

Quand la structure physique (3 étages) correspond 1:1 au nommage, la maintenance devient évidente.

---

## 🎯 Pattern viewerType: Dynamic Content Switching

### Insight

**État centralisé + Switch pattern > Multiples composants conditionnels**

**Implémentation**:

```javascript
// 1. Config (buttonMapping.js)
{ id: 'timer', icon: '⏱️', viewerType: 'timer' }

// 2. Action (TowerToolbar.jsx)
if (item.viewerType) {
  setTowerViewerContent(item.viewerType);
}

// 3. Render (TowerViewer.jsx)
switch (towerViewerContent) {
  case 'timer': return <TimeTimer />;
  case 'notes': return <MarkdownEditor />;
}
```

### Principe Établi

**Un seul state `towerViewerContent` contrôle tout le viewer → Scalable et testable**

Ajouter nouveau contenu = 3 lignes (config + switch case). Pas de refactoring architectural.

---

## 📐 Responsive: Breakpoint Intermédiaire

### Insight

**iPad horizontal (1024-1439px) n'est ni tablet ni desktop → Besoin breakpoint dédié**

**Problème**:
- `tablet` (768-1023px) trop petit
- `desktop` (≥1440px) trop grand
- iPad horizontal (1180px) sans styling adapté → boutons trop larges

**Solution**:
```javascript
tabletWideOnly: `(min-width: 1024px) and (max-width: 1439px)`
```

### Principe Établi

**Responsive mobile-first !== 3 breakpoints suffisent**

Devices modernes (iPad Pro, small desktop, ultrawide) nécessitent breakpoints intermédiaires pour UX optimale.

---

## 🔘 Standardisation Composant: Props Exhaustives

### Insight

**IconButton utilisé partout mais features manquantes → Props ajoutées au fil de l'eau = dette technique**

**Ajouts requis**:
- `disabled` (placeholders 🚧)
- `ghost` variant (boutons subtils)
- `title` (tooltips)
- Responsive media queries

### Principe Établi

**Composant générique doit anticiper tous usages dès le départ**

Checklist pour composant bouton:
- [ ] Variants (primary, secondary, ghost, danger)
- [ ] States (default, hover, active, disabled)
- [ ] Sizes (small, medium, large) avec responsive
- [ ] Accessibility (title, aria-label)
- [ ] PropTypes validation

---

## ⚡ Auto-Collapse: Éviter Boucles Infinies

### Insight

**Auto-collapse basique → boucle infinie si pas de garde**

**Problème initial**:
```javascript
// ❌ Se déclenche à chaque changement de sideTowerCollapsed
useEffect(() => {
  if (width < 1024) setSideTowerCollapsed(true);
}, [sideTowerCollapsed]); // Boucle !
```

**Solution**:
```javascript
// ✅ Seulement si traverse le seuil
useEffect(() => {
  let previousWidth = window.innerWidth;

  const handleResize = () => {
    const crossedThreshold = /* ... */;
    if (crossedThreshold) {
      setSideTowerCollapsed(currentWidth < 1024);
    }
    previousWidth = currentWidth;
  };
  // ...
}, [setSideTowerCollapsed]); // Pas de sideTowerCollapsed !
```

### Principe Établi

**Auto-behaviour !== Observer tout état**

Observer uniquement événements externes (resize, scroll) + tracker état précédent pour détecter transitions.

---

## 🎨 UX: Bouton Collapse Position & Taille

### Insight

**Position centrée + taille massive = friction navigation**

**Itérations**:
1. Centre vertical (50%) × 120px → gêne navigation spatiale
2. Haut (20px) × 60px → discret, pas de friction

### Principe Établi

**Contrôles UI !== doivent occuper espace visuel principal**

Boutons toggle/collapse doivent être:
- Visibles (opacity 0.7-0.9, pas caché)
- Discrets (haut/coin, pas centre)
- Tactiles sur mobile (28-32px minimum)
- Petits sur desktop (20-24px suffit)

---

## 📦 Z-Index Hierarchy: Layers Explicites

### Insight

**Z-index ad-hoc (9999, 100, 42) = collision garantie**

**Avant**:
- SideTower: 100
- Toggle: 9999 (au-dessus modales!)

**Après** (theme.zIndex):
```javascript
{
  base: 0,
  navigation: 10,   // SideTower
  overlay: 20,
  modal: 30         // Au-dessus tout UI
}
// Toggle: 15 (entre navigation et modal)
```

### Principe Établi

**Z-index hierarchy dans theme > Magic numbers dans composants**

Toujours référencer `theme.zIndex.*` pour cohérence globale.

---

## 📚 Documentation: Code ≠ Vérité

### Insight

**Documentation obsolète pire que pas de documentation**

**Problème**: 3 fichiers markdown créés en début session (responsive-strategy, responsive-testing-guide, responsive-fixes-summary) → 2 obsolètes à la fin.

**Solution**:
- 1 seul rapport de session (summary)
- Supprimer fichiers obsolètes immédiatement
- Documentation dans code (CLAUDE.md) mise à jour en continu

### Principe Établi

**Documentation vivante > Documentation figée**

Préférer:
1. CLAUDE.md dans src/ (proche du code)
2. Rapport de session unique (snapshot final)
3. Supprimer immédiatement obsolète

Éviter:
- Multiples docs "stratégie" qui divergent
- Guides de test qui deviennent faux

---

## 🧹 Cleanup: Legacy Code != Optionnel

### Insight

**Features legacy jamais utilisées → Dette cognitive**

**Exemples supprimés**:
- `isExpanded` state (jamais utilisé, toujours true)
- Collapsed view TowerViewer (jamais affiché)
- Bouton "Fermer" (inutile, pas d'usage)
- Header Timer (gaspille espace)

### Principe Établi

**Si feature jamais utilisée après implémentation → Supprimer immédiatement**

Checklist cleanup:
- [ ] State jamais toggles? → Supprimer
- [ ] Condition jamais false? → Supprimer branche
- [ ] Bouton jamais cliqué? → Supprimer
- [ ] Header générique pour tous contenus? → Conditionner

---

## 🔄 Refactoring: Renommage Composants

### Insight

**Renommage composant = Opportunité refactoring architectural**

**Workflow établi**:
1. Renommer fichiers (`ControlTower` → `TowerHeader`)
2. Renommer exports (`index.js`)
3. Renommer imports (App.jsx, SideTower.jsx)
4. Git commit avec `renamed:` pour tracking
5. Refactor contenu (opportunité de cleanup)

### Principe Établi

**Renommage !== Find & Replace**

Profiter du renommage pour:
- Revoir architecture (3 étages)
- Supprimer legacy (isExpanded)
- Standardiser patterns (viewerType)
- Mettre à jour docs

---

## 🎯 Pattern Conversion: Inline → Styled-Components

### Insight

**Inline styles OK prototype, mais pas OK production responsive**

**Exemple**: MarkdownToolbar avait inline styles partout → Impossible responsive.

**Conversion**:
```javascript
// Avant
<button style={{ minWidth: '32px', height: '24px' }}>

// Après
const ToolbarButton = styled.button`
  min-width: 32px;
  height: 24px;

  @media ${MEDIA_QUERIES.tabletWideOnly} {
    min-width: 28px;
    height: 22px;
  }
`;
```

### Principe Établi

**Si composant réutilisé > 2 fois → Styled-components avec responsive**

Inline styles réservés à:
- Layout unique (flex containers)
- Override ponctuel (debug)

---

## 🚀 Performance: Éviter Re-renders Inutiles

### Insight

**Toggle manuel + Auto-collapse = Double render si mal codé**

**Solution**: `setSideTowerCollapsed` seulement dans deps, pas `sideTowerCollapsed`.

```javascript
// ❌ Re-render à chaque toggle
useEffect(() => { /* ... */ }, [sideTowerCollapsed, setSideTowerCollapsed]);

// ✅ Seulement au resize
useEffect(() => { /* ... */ }, [setSideTowerCollapsed]);
```

### Principe Établi

**Deps array minimal = Performance maximale**

Inclure seulement:
- Fonctions stables (setters Zustand)
- Props qui changent rarement
- Événements externes (resize listeners)

Exclure:
- States qui changent souvent
- Valeurs dérivées

---

## 🎨 Design: Concevoir en Codant

### Insight (User feedback)

> "désolé de concevoir en codant. c'est mon metabrain :-)"

**Pattern établi**:
1. Implémentation rapide (v1)
2. Test visuel
3. Ajustements UX (taille, couleur, position)
4. Itérations jusqu'à satisfaction
5. Commit final

### Principe Établi

**Design itératif > Design figé**

Pour projets personnels (MetaBrain):
- Coder vite, ajuster visuellement
- User (toi-même) teste immédiatement
- Itérations rapides OK
- Documentation après stabilisation

Pour projets client:
- Design Figma avant code
- Moins d'itérations
- Feedback loop plus long

---

## 📊 Métriques Session

**Refactoring complet**:
- 34 fichiers modifiés
- 2,714 additions
- 668 suppressions
- 3 composants renommés
- 1 nouveau breakpoint (`tabletWideOnly`)
- 708 lignes documentation (CLAUDE.md)
- 0 bugs introduits (tests manuels OK)

**Temps**: ~2-3h session intensive (conception en codant)

---

## 🎓 Takeaways Principaux

1. **Architecture sémantique** : Hiérarchie dans nommage → Code auto-documenté
2. **Dynamic content pattern** : State + switch > Multiples composants
3. **Breakpoint intermédiaire** : iPad horizontal nécessite styling dédié
4. **Cleanup legacy** : Si jamais utilisé → Supprimer immédiatement
5. **Documentation vivante** : 1 source de vérité mise à jour, pas multiples docs obsolètes
6. **UX controls** : Discrets (haut/coin), pas centre écran
7. **Z-index hierarchy** : Theme centralisé > Magic numbers
8. **Concevoir en codant** : OK pour projets perso, itérations rapides
9. **Auto-behaviour guards** : Tracker état précédent pour éviter boucles
10. **Refactoring opportuniste** : Renommage = Occasion cleanup architectural

---

## 📁 Fichiers Créés (Knowledge)

- `_internal/docs/reports/responsive-fixes-summary.md` : Rapport session complet
- `_internal/docs/architecture/responsive-strategy.md` : ~~Supprimé (obsolète)~~
- `_internal/docs/guides/responsive-testing-guide.md` : ~~Supprimé (obsolète)~~
- `_internal/cockpit/knowledge/findings/2026-01-01-sidetower-refactoring-learnings.md` : Ce fichier

---

## 🔮 Prochaines Applications

Ces patterns s'appliquent à:
- **Portail Sages** (mission suivante) : viewerType pour cards Sages
- **Autres viewers** : Calendrier, Stats, etc. dans TowerViewer
- **Responsive général** : tabletWideOnly pour autres composants
- **Cleanup continu** : Traquer legacy code (isExpanded pattern)
