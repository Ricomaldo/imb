---
type: guide
updated: 2025-09-18
---

# 🎨 Stratégie d'Intégration Progressive des UI Kits

> Document de planification pour l'intégration motivante et progressive des assets visuels

---

## 📦 Vue d'ensemble des UI Kits disponibles

### UI Kit 1 : Fantasy Premium (Bleu/Or)
- **Localisation** : `/src/assets/images/UI_KIT.jpg`
- **Style** : Ornements dorés sur fond bleu nuit (#19253f → #111629)
- **Éléments** : 7 panneaux, boutons dorés, progress bars, éléments décoratifs
- **Usage optimal** : Zones premium, modales spéciales, achievements

### UI Kit 2 : Medieval Wood Panels
- **Localisation** : `/src/assets/images/lib/wood-pannel-ui/`
- **Variantes** :
  - Argent/Bois clair (contenu secondaire)
  - Or/Bois sombre (contenu premium)
- **Usage optimal** : Panneaux principaux, RoomCanvas, conteneurs de contenu

### UI Kit 3 : Cartoon Wood UI
- **Localisation** : `/src/assets/images/lib/ui-kit-2/`
- **Style** : Ludique avec coins métalliques
- **Éléments** : Boutons colorés, barres de progression, cadres bois
- **Usage optimal** : UI interactive, feedback visuel, notifications

---

## 🎯 Stratégie d'Extraction Minimaliste

### Phase 1 : Assets Prioritaires (30min - 4 assets)

```markdown
1. wood-panel-gold.png      # 1 panneau bois/or (UI Kit 2)
2. button-green.png         # 1 bouton vert action (UI Kit 3)
3. progress-bar-gold.png    # 1 barre progression (UI Kit 3)
4. ornamental-border.png    # 1 bordure décorative (UI Kit 1)
```

### Pourquoi ces 4 assets ?
- **Couverture maximale** : Panel, Button, Progress, Decoration
- **Réutilisabilité** : Techniques CSS pour adapter les tailles
- **Impact visuel** : Transformation immédiate de l'UI
- **Temps minimal** : 20min de découpage + 10min d'intégration

---

## 🧪 Laboratoires d'Expérimentation par Room

### 🔬 **Forge** = Laboratoire UI Kit 3
```javascript
// ForgeRoom.jsx
const ForgeRoom = () => {
  const experimentalUI = useFeatureFlag('forge-ui-experiment');

  return (
    <BaseRoom>
      {experimentalUI ? (
        <>
          <WoodPanel variant="cartoon">
            <ProgressBar
              src="/assets/progress-bar-gold.png"
              value={forgeProgress}
              label="Forgeage en cours..."
            />
            <GreenButton onClick={forge}>
              Forger l'objet
            </GreenButton>
          </WoodPanel>
        </>
      ) : (
        <Panel>{/* UI actuelle */}</Panel>
      )}
    </BaseRoom>
  );
};
```

**Objectifs Forge** :
- Tester les barres de progression animées
- Boutons verts pour actions de crafting
- Feedback visuel du processus

### 📚 **Bibliothèque** = Laboratoire Wood Panels
```javascript
// BibliothequeRoom.jsx
const BibliothequeRoom = () => {
  const experimentalUI = useFeatureFlag('bibliotheque-ui-experiment');

  return (
    <BaseRoom texture={experimentalUI ? 'wood-light' : 'parchment'}>
      <BookShelf
        borderImage={experimentalUI ? woodPanelSilver : null}
      />
    </BaseRoom>
  );
};
```

**Objectifs Bibliothèque** :
- Panneaux bois pour étagères
- Ambiance médiévale authentique
- Hiérarchie visuelle argent/or

### 🏛️ **Sanctuaire** = Laboratoire Premium
```javascript
// SanctuaireRoom.jsx
const SanctuaireRoom = () => {
  const premiumUI = useFeatureFlag('sanctuaire-premium');

  return (
    <BaseRoom>
      <OrnamentalPanel
        gradient="uiKitBlue"
        borderImage="/assets/ornamental-border.png"
      >
        {/* Contenu sacré */}
      </OrnamentalPanel>
    </BaseRoom>
  );
};
```

**Objectifs Sanctuaire** :
- Bordures dorées ornementales
- Gradients premium bleu/or
- Atmosphère mystique

---

## 🎨 Techniques CSS Avancées

### 1. Border-Image (1 asset = infinite tailles)
```css
.wood-panel {
  /* Un seul fichier PNG découpé en 9 zones */
  border-image-source: url('/assets/wood-panel-gold.png');
  border-image-slice: 30 30 30 30 fill;
  border-image-width: 30px;
  border-image-repeat: stretch;

  /* Adaptable à n'importe quelle taille */
  width: var(--panel-width, 100%);
  height: var(--panel-height, auto);
}
```

### 2. CSS Mask pour variations de couleur
```css
.progress-bar {
  /* Base neutre */
  background: linear-gradient(90deg,
    var(--progress-start, #FFD700),
    var(--progress-end, #FFA500)
  );

  /* Texture via mask */
  mask-image: url('/assets/progress-bar-gold.png');
  mask-size: 100% 100%;

  /* Variations illimitées sans nouveaux assets */
}

/* Variantes */
.progress-bar.health { --progress-start: #FF0000; --progress-end: #CC0000; }
.progress-bar.mana { --progress-start: #0088FF; --progress-end: #0044AA; }
.progress-bar.exp { --progress-start: #00FF00; --progress-end: #00AA00; }
```

### 3. Composants Styled avec Props Dynamiques
```javascript
// styles/premium.js
import styled from 'styled-components';

export const OrnamentalBorder = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -15px;
    border: 15px solid transparent;
    border-image: url(${props => props.$borderSrc}) 15 stretch;
    pointer-events: none;
    z-index: 10;
  }

  /* Contenu avec padding pour la bordure */
  padding: 20px;
  background: ${props => props.theme.gradients[props.$gradient]};
`;
```

---

## 📈 Plan de Progression

### Semaine 1 : Extraction & Test (2h total)
- [ ] Extraire les 4 assets prioritaires (20min)
- [ ] Créer composants réutilisables (30min)
- [ ] Implémenter dans Forge (30min)
- [ ] Tester et ajuster (40min)

### Semaine 2 : Extension (1h30)
- [ ] 2-3 assets supplémentaires
- [ ] Bibliothèque implementation
- [ ] Feature flags système

### Semaine 3 : Polish (1h)
- [ ] Sanctuaire premium
- [ ] Animations CSS
- [ ] Documentation composants

### Semaine 4+ : Adoption Progressive
- [ ] Room par room
- [ ] Feedback utilisateur
- [ ] Ajustements finaux

---

## 💡 Hiérarchie Visuelle

```javascript
const UI_HIERARCHY = {
  bronze: {
    kit: 'cartoon-wood',
    usage: 'UI courante, boutons standards',
    rooms: ['Cave', 'Cuisine', 'Jardin']
  },
  silver: {
    kit: 'wood-panel-silver',
    usage: 'Contenu important, panneaux principaux',
    rooms: ['Bibliothèque', 'Scriptorium', 'Comptoir']
  },
  gold: {
    kit: 'wood-panel-gold + premium-ornamental',
    usage: 'Zones spéciales, actions premium',
    rooms: ['Sanctuaire', 'Forge', 'Chambre']
  }
};
```

---

## 🚀 Implementation Helpers

### Feature Flag System
```javascript
// hooks/useFeatureFlag.js
export const useFeatureFlag = (flag) => {
  const flags = {
    'forge-ui-experiment': true,
    'bibliotheque-ui-experiment': false,
    'sanctuaire-premium': false
  };
  return flags[flag] || false;
};
```

### Asset Loader Utility
```javascript
// utils/assetLoader.js
export const uiKitAssets = {
  panels: {
    woodGold: '/assets/extracted/wood-panel-gold.png',
    woodSilver: '/assets/extracted/wood-panel-silver.png',
    ornamental: '/assets/extracted/ornamental-border.png'
  },
  buttons: {
    green: '/assets/extracted/button-green.png',
    red: '/assets/extracted/button-red.png'
  },
  progress: {
    gold: '/assets/extracted/progress-bar-gold.png'
  }
};

// Lazy loading
export const loadUIAsset = async (category, name) => {
  const path = uiKitAssets[category]?.[name];
  if (!path) throw new Error(`Asset ${category}.${name} not found`);

  const img = new Image();
  img.src = path;
  await img.decode();
  return path;
};
```

### Theme Extensions
```javascript
// styles/theme.js additions
export const theme = {
  ...existingTheme,

  gradients: {
    uiKitBlue: 'linear-gradient(135deg, #19253f 0%, #111629 100%)',
    uiKitGold: 'linear-gradient(135deg, #f0deba 0%, #b1845a 100%)',
    goldShine: 'linear-gradient(90deg, #b1845a, #f0deba, #b1845a)',
    woodLight: 'linear-gradient(180deg, #D4A373 0%, #BC9A6A 100%)',
    woodDark: 'linear-gradient(180deg, #8B4513 0%, #654321 100%)'
  },

  uiKit: {
    borderRadius: {
      wood: '8px',
      ornamental: '0px' // Les ornements gèrent leur propre forme
    },
    borderWidth: {
      thin: '15px',  // Pour border-image slice
      thick: '30px'
    }
  }
};
```

---

## 🎮 Motivation & Gamification

### Système de Progression Personnel
```markdown
🏆 Achievements UI Kit Integration

[ ] First Asset  - Extraire et intégrer 1 asset
[ ] Lab Master   - Activer UI expérimentale dans 1 room
[X] The Planner  - Créer ce document
[ ] Border Wizard - Maîtriser border-image CSS
[ ] Asset Ninja  - Réutiliser 1 asset pour 3 usages différents
[ ] Polish Pro   - Ajouter animations sur hover
[ ] Ship It      - Déployer une room complète
```

### Impact Metrics
- **Avant** : UI fonctionnelle mais basique
- **Après chaque asset** : +25% de "premium feel"
- **ROI** : 5min d'extraction = transformation visuelle permanente

---

## 📝 Notes & Idées

### Optimisations Futures
- Sprite sheets pour réduire les requêtes
- CSS-in-JS pour variations dynamiques
- Thème sombre avec inversions de gradients
- Assets SVG pour scalabilité infinie

### Inspiration Rooms Futures
- **Atelier** : Mélange des 3 kits selon l'outil
- **Boutique** : UI Kit 3 pour aspect commercial
- **Chambre** : Wood panels cozy

### Tips Découpage Rapide
1. Photoshop Actions pour batch processing
2. ImageMagick CLI : `convert input.jpg -transparent white output.png`
3. Online tools : remove.bg pour extraction rapide
4. 9-slice generator : peut créer les bordures automatiquement

---

**Dernière mise à jour** : 2024-09-16
**Auteur** : @Ricomaldo + Claude
**Statut** : 🟢 Ready to experiment
