---
type: architecture
updated: 2025-09-18
---

# Gestion du thème – IRIM StudioHall

Ce document définit les règles d’usage du `theme`, les échelles (spacing, radii, borders, shadows, motion, zIndex), et les bonnes pratiques pour styled-components.

## Échelles disponibles

- Spacing: `3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl`
- Radii: `xs, sm, md, lg, xl`
- Borders: `thin, base, thick, heavy`
- Shadows: `sm, md, lg`
- Motion: `durations.fast|base|slow`, `easings.standard|emphasized`
- zIndex: `base, level1, level2, level3, navigation, overlay, modal`
- Typography: `families.primary|secondary|mono|ui`, `sizes`, `weights`, `lineHeights`, `letterSpacing`

## Règles d’usage

1. Toujours utiliser la syntaxe déstructurée: `({ theme }) => ...`.
2. Bannir les valeurs "en dur":
   - Couleurs hex/rgba → utiliser `theme.colors` + `alpha(color, a)`.
   - z-index numériques → utiliser `theme.zIndex.*`.
   - border-radius en px → `theme.radii.*`.
   - espacements (gap/margin/padding) → `theme.spacing.*`.
3. Typo: n’utiliser que `theme.typography.families.*` (plus `theme.fonts`).
4. Effets: préférer `theme.shadows.*` et `theme.motion.*` pour transitions.

## Utilitaire couleur

```js
import { alpha } from '../../src/styles/color';

background: ${({ theme }) => alpha(theme.colors.primary, 0.6)};
```

## Exemples

- Bordure:
```js
border: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
```
- Rayon:
```js
border-radius: ${({ theme }) => theme.radii.md};
```
- Ombre:
```js
box-shadow: ${({ theme }) => theme.shadows.md};
```
- Transition:
```js
transition: ${({ theme }) => `all ${theme.motion.durations.base} ${theme.motion.easings.standard}`};
```
- z-index:
```js
z-index: ${({ theme }) => theme.zIndex.navigation};
```
- **Typographie (font-size uniquement):**
```js
font-size: ${({ theme }) => theme.typography.sizes.base};
```

## Typographie - Usage spécifique

**IMPORTANT:** Pour la typographie, utiliser **UNIQUEMENT** `theme.typography.sizes.*` pour les `font-size`.

Les autres propriétés typographiques (font-family, font-weight, line-height, etc.) doivent utiliser les **mixins** du hook `useTypography()` :

```js
import { useTypography } from '../../hooks/useTypography';

const StyledText = styled.p`
  ${({ theme }) => {
    const typo = useTypography();
    return typo.mixins.bodyText; // Inclut font-family, font-weight, line-height
  }}

  // Seule la taille peut être surchargée si nécessaire
  font-size: ${({ theme }) => theme.typography.sizes.lg};
`;
```

**Échelle des tailles disponibles:**
- `xs`: 10px (metadata, code)
- `sm`: 12px (panneaux compacts, labels)
- `base`: 14px (texte standard)
- `md`: 16px (texte important)
- `lg`: 20px (sous-titres)
- `xl`: 25px (titres sections)
- `2xl`: 31px (titres pages)
- `3xl`: 39px (titres hero)

**Échelle des espacements (spacing):**
- `3xs`: 2px (micro-espacements, padding code)
- `2xs`: 4px (très petit)
- `xs`: 6px (Cave, espacements serrés)
- `sm`: 8px (standard small)
- `md`: 12px (standard medium)
- `lg`: 16px (standard large)
- `xl`: 24px (large)
- `2xl`: 32px (extra large)
- `3xl`: 40px (Sanctuaire, sections hero)

## Nouvelles couleurs système

```js
colors: {
  // Neutres système
  white: '#FFFFFF',
  black: '#000000',
  gray: '#333333',
  beige: '#F5F5DC',
  // ... reste des couleurs existantes
}
```

## Gradients UI Kit

Gradients premium issus des UI Kits pour enrichissement visuel progressif :

```js
gradients: {
  // Or premium (flèches navigation, bordures spéciales)
  uiKitGold: 'linear-gradient(135deg, #f0deba 0%, #b1845a 100%)',

  // Bleu nuit profond (backgrounds premium, Sanctuaire)
  uiKitBlue: 'linear-gradient(135deg, #19253f 0%, #111629 100%)',

  // Effet brillance or (animations, hover states)
  goldShine: 'linear-gradient(90deg, #b1845a 0%, #f0deba 50%, #b1845a 100%)'
}
```

### Techniques CSS pour bordures dorées

```css
/* Bordure gradient avec background transparent */
.gold-border {
  border: 2px solid transparent;
  background:
    linear-gradient(${theme.colors.background}, ${theme.colors.background}) padding-box,
    ${theme.gradients.uiKitGold} border-box;
  border-radius: ${theme.radii.md};
}

/* Glow doré pour hover states */
.gold-glow:hover {
  box-shadow:
    0 0 10px ${alpha('#f0deba', 0.4)},
    inset 0 0 10px ${alpha('#b1845a', 0.2)};
}

/* Background bleu premium avec overlay */
.premium-bg {
  background: ${theme.gradients.uiKitBlue};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.gradients.goldShine};
    opacity: 0.05;
    pointer-events: none;
  }
}
```

### Usages recommandés

- **WorkbenchDrawer tabs** : Bordure dorée sur tab actif
- **Modal variant roomCanvas** : Subtile bordure premium
- **Sanctuaire room** : Background bleu nuit
- **RoomNote hover** : Effet glow doré
- **Boutons spéciaux** : Save, Sync, Achievement

## Checklist PR

- ✅ Pas de `#[0-9A-Fa-f]{6}` hors `theme.js` (utiliser `theme.colors.*`).
- ✅ Pas de `z-index: \d+` (utiliser `theme.zIndex.*`).
- ✅ Pas de `:\s*\d+px` pour padding/margin/gap/border-radius (utiliser `theme.spacing.*` et `theme.radii.*`).
- ✅ Pas d'usage de `theme.fonts.*` (deprecated, utiliser `theme.typography.families.*`).
- ✅ **Typographie:** Pas de `font-size: \d+px` → utiliser `theme.typography.sizes.*`.
- ✅ **RGBA:** Utiliser `alpha(color, opacity)` au lieu de `rgba()` hardcodé.
- ✅ **Typographie:** Préférer les composants Typography ou les mixins `useTypography()`.
- ✅ **Gradients:** Utiliser `theme.gradients.*` pour les nouveaux effets premium.

## Migration

- Utiliser des remplacements ciblés et valider visuellement.
- Si une valeur manque dans l'échelle, l'ajouter au thème au lieu d'un px "en dur".
- Pour les effets premium, préférer les gradients aux couleurs plates.
