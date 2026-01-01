# Widget Moments OUI - Documentation Technique

> **Sanctuaire** - Capture et visualisation des moments de plénitude

**Version:** 1.0.0
**Date:** 2025-10-15
**Branch:** `feature/widget-moments-oui`

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Composants](#composants)
- [Store et données](#store-et-données)
- [Taxonomie Rosenberg](#taxonomie-rosenberg)
- [Utilisation](#utilisation)
- [API](#api)
- [Décisions de design](#décisions-de-design)

---

## Vue d'ensemble

Le Widget Moments OUI permet de capturer et d'analyser les moments de plénitude, de bien-être ou de satisfaction dans la vie quotidienne. Il s'appuie sur la **Communication Non Violente (CNV)** de Marshall Rosenberg pour identifier les besoins satisfaits lors de ces moments.

### Objectifs

1. **Capturer** les moments positifs avec contexte (quand/quoi/pourquoi)
2. **Identifier** les besoins satisfaits selon la taxonomie Rosenberg
3. **Visualiser** les patterns de bien-être à travers le temps
4. **Analyser** quels besoins sont le plus souvent nourris

### Caractéristiques principales

- ✨ Capture en 3 champs (Quand, Quoi, Pourquoi nourrissant)
- 🏷️ Sélection de 1 à 5 besoins parmi 30 (7 familles)
- 📊 Statistiques hebdomadaires
- 🎨 Mini heatmap des besoins les plus satisfaits
- ⏱️ Timeline avec dates intelligentes
- 💾 Persistence via useDiaryStore
- 🎭 Design médiéval cohérent avec le thème

---

## Architecture

### Structure des fichiers

```
src/
├── constants/
│   └── rosenbergNeeds.js          # Taxonomie CNV complète (182 lignes)
├── stores/
│   └── useDiaryStore.js           # Extension momentsOui (+308 lignes)
└── components/
    └── room-modules/
        └── sanctuaire/
            └── MomentsOui/
                ├── index.js                    # Exports
                ├── MomentsOui.styles.js        # Styled-components (470 lignes)
                ├── MomentsOuiWidget.jsx        # Container principal
                ├── CaptureModal.jsx            # Formulaire de capture
                ├── NeedsSelector.jsx           # Sélecteur besoins accordéon
                ├── MomentCard.jsx              # Carte moment expandable
                ├── MomentsTimeline.jsx         # Liste chronologique
                ├── WeeklyCounter.jsx           # Stats semaine
                └── NeedsMiniHeatmap.jsx        # Top 3 besoins
```

### Flux de données

```
User Action → MomentsOuiWidget
                ↓
    CaptureModal (capture/edit)
                ↓
         NeedsSelector (select needs)
                ↓
        useDiaryStore.addMomentOui()
                ↓
        Auto-calcul stats (metadata)
                ↓
    Timeline/Counter/Heatmap (display)
```

### Dépendances

- **Composants communs:** Modal, Badge, Button
- **Stores:** useDiaryStore
- **Constantes:** rosenbergNeeds (taxonomie CNV)
- **Hooks:** useState, useEffect
- **Libs:** React, styled-components

---

## Composants

### 1. MomentsOuiWidget.jsx

**Container principal** qui orchestre tous les sous-composants.

**Responsabilités:**
- Gestion de l'état modal (ouvert/fermé, create/edit)
- Coordination Timeline + Stats + Capture
- Layout en 3 sections: Stats (top), Timeline (middle), Capture (bottom)

**Props:** Aucune (standalone)

**Structure:**
```jsx
<WidgetContainer>
  <StatsRow>
    <WeeklyCounter />
    <NeedsMiniHeatmap />
  </StatsRow>

  <MomentsTimeline
    onEdit={handleEdit}
  />

  <Button onClick={handleOpenCreate}>
    Capturer un moment OUI +
  </Button>

  <CaptureModal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    onSave={handleSave}
    initialData={editingMoment}
  />
</WidgetContainer>
```

---

### 2. CaptureModal.jsx

**Formulaire de capture/édition** d'un moment OUI.

**Props:**
- `isOpen` (boolean): État ouverture modal
- `onClose` (function): Callback fermeture
- `onSave` (function): Callback sauvegarde (momentData)
- `initialData` (object): Données pour édition (optionnel)

**Champs:**
1. **Quand** (datetime-local): Pré-rempli avec date/heure actuelle
2. **Quoi** (textarea): Brève description (max 200 char)
3. **Pourquoi** (textarea): Besoins satisfaits (max 500 char)
4. **Besoins** (NeedsSelector): 1 à 5 besoins sélectionnables

**Validation:**
- Quoi et Pourquoi obligatoires
- Respect des limites de caractères
- Compteurs en temps réel (X/200, X/500)

**Format de sauvegarde:**
```javascript
{
  quand: '2025-10-15T14:30:00.000Z',  // ISO string
  quoi: 'Promenade en forêt',
  pourquoi: 'Ressourcement profond...',
  tags: ['autonomie_liberte', 'besoins_air', 'communion_beaute']
}
```

---

### 3. NeedsSelector.jsx

**Sélecteur multi-besoins** avec accordéon par famille.

**Props:**
- `selectedNeeds` (string[]): IDs des besoins sélectionnés
- `onChange` (function): Callback changement sélection
- `maxSelection` (number): Limite de sélection (default: 5)

**Fonctionnalités:**
- Accordéon 7 familles collapsibles
- Badge cliquable par besoin
- Indicateur de sélection (compteur par famille)
- Désactivation automatique quand limite atteinte
- Badge différencié: selected (success/solid), unselected (secondary/outline)

**États visuels:**
- Sélectionné: Badge vert solid, texte blanc
- Non sélectionné: Badge gris outline, texte `#F7FAFC`
- Limite atteinte: Opacity 0.5, cursor not-allowed

**Affichage compact:**
Zone séparée en bas affichant uniquement les besoins sélectionnés avec possibilité de retrait (clic)

---

### 4. MomentCard.jsx

**Carte expandable** pour afficher un moment.

**Props:**
- `moment` (object): Données du moment
- `onEdit` (function): Callback édition
- `onDelete` (function): Callback suppression

**Modes:**
- **Collapsed (default):** Date + aperçu Quoi (80 char) + nombre de besoins
- **Expanded (clic):** Affichage complet avec Pourquoi + badges besoins

**Actions au hover:**
- Bouton ✏️ Modifier (visible uniquement au hover)
- Bouton 🗑️ Supprimer (visible uniquement au hover)

**Format date intelligent:**
- Aujourd'hui → "Aujourd'hui, 14:30"
- Hier → "Hier, 14:30"
- Autre → "15 octobre 2025, 14:30"

---

### 5. MomentsTimeline.jsx

**Liste chronologique** de tous les moments.

**Props:**
- `onEdit` (function): Callback édition moment

**Fonctionnalités:**
- Tri anti-chronologique (plus récent en haut)
- Empty state si aucun moment
- Modal de confirmation pour suppression
- Scroll automatique pour liste longue

**Empty state:**
```
Aucun moment OUI capturé

Commencez par capturer un moment
qui vous a nourri aujourd'hui ✨
```

---

### 6. WeeklyCounter.jsx

**Statistique de la semaine courante** (lundi-dimanche).

**Props:** Aucune (utilise directement useDiaryStore)

**Affichage:**
```
Cette semaine : 5 moments OUI ✨
```

**Logique:**
- Calcule automatiquement le lundi de la semaine courante
- Filtre les moments entre lundi 00:00 et dimanche 23:59
- Mise à jour temps réel

---

### 7. NeedsMiniHeatmap.jsx

**Top 3 des besoins** les plus satisfaits (toutes périodes).

**Props:** Aucune (utilise directement useDiaryStore)

**Affichage:**
- Maximum 3 besoins
- Barre de progression par besoin
- Couleur de la famille Rosenberg
- Emoji + label + compteur

**Exemple visuel:**
```
🦅 Liberté      [████████░░] 8
💎 Authenticité [██████░░░░] 6
🤝 Connexion    [█████░░░░░] 5
```

**Calcul:**
- Agrégation globale sur tous les moments
- Tri par fréquence descendante
- Normalisation sur le max pour les barres

---

## Store et données

### Extension useDiaryStore

**Section:** `momentsOui`

**Structure d'état:**
```javascript
momentsOui: {
  moments: [
    {
      id: 1729001234567,        // Timestamp unique
      timestamp: '2025-10-15T14:30:00.000Z',
      quoi: 'Promenade en forêt',
      pourquoi: 'Ressourcement profond dans la nature...',
      tags: ['autonomie_liberte', 'besoins_air', 'communion_beaute'],
      createdAt: '2025-10-15T14:35:00.000Z',
      updatedAt: '2025-10-15T14:35:00.000Z'
    }
    // ... autres moments
  ],

  metadata: {
    totalMoments: 12,
    firstMomentDate: '2025-10-01T10:00:00.000Z',
    lastMomentDate: '2025-10-15T14:30:00.000Z',
    needsStats: {
      'autonomie_liberte': 8,
      'besoins_air': 5,
      'communion_beaute': 6
      // ... stats par besoin
    }
  },

  settings: {
    notificationEnabled: false,      // Notification douce (futur)
    notificationTime: '21:00',       // Heure notification
    showFloatingButton: true,        // FAB Sanctuaire (futur)
    autoSuggestTags: true            // Suggestion auto (futur)
  }
}
```

### Actions disponibles

#### 1. addMomentOui(momentData)
Ajoute un nouveau moment OUI.

**Input:**
```javascript
{
  quand: '2025-10-15T14:30:00.000Z',  // ISO string
  quoi: 'Promenade en forêt',
  pourquoi: 'Ressourcement profond...',
  tags: ['autonomie_liberte', 'besoins_air']
}
```

**Effet:**
- Génère ID unique (timestamp)
- Ajoute createdAt/updatedAt
- Recalcule metadata automatiquement
- Sauvegarde dans localStorage

---

#### 2. updateMomentOui(momentId, updates)
Met à jour un moment existant.

**Effet:**
- Modifie le moment
- Met à jour updatedAt
- Recalcule needsStats si tags modifiés

---

#### 3. deleteMomentOui(momentId)
Supprime un moment.

**Effet:**
- Retire du tableau
- Recalcule toutes les metadata

---

#### 4. getMomentsOui(filters)
Récupère moments avec filtres optionnels.

**Filters:**
```javascript
{
  period: 'week' | 'month' | 'year',  // Période
  tags: ['autonomie_liberte'],        // Besoins spécifiques
  keyword: 'forêt'                    // Recherche texte
}
```

---

#### 5. getMomentOuiById(momentId)
Récupère un moment par ID.

---

#### 6. getWeeklyStats()
Statistiques de la semaine courante.

**Output:**
```javascript
{
  totalMoments: 5,
  topNeeds: [
    { needId: 'autonomie_liberte', count: 3, needData: {...} },
    { needId: 'besoins_air', count: 2, needData: {...} }
    // Top 5 max
  ]
}
```

---

#### 7. getNeedsStats(period)
Distribution des besoins par période.

**Periods:** 'all' | 'week' | 'month' | 'year'

**Output:**
```javascript
{
  'autonomie_liberte': 8,
  'besoins_air': 5,
  'communion_beaute': 6
}
```

---

#### 8. recalculateMomentsOuiMetadata() [private]
Recalcule automatiquement les metadata.

**Quand:** Appelée automatiquement après add/update/delete

**Calcule:**
- totalMoments
- firstMomentDate / lastMomentDate
- needsStats (agrégation de tous les tags)

---

## Taxonomie Rosenberg

### 7 Familles de besoins (CNV)

La taxonomie complète de Marshall Rosenberg comprend 7 grandes familles de besoins universels:

#### 1. 🦅 Autonomie (orange #F59E0B)
> Liberté de choisir et agir selon ses valeurs

Besoins:
- Choix 🎯
- Indépendance 🗽
- Liberté 🕊️
- Espace personnel 🏠

#### 2. ✨ Célébration (jaune #FCD34D)
> Célébrer la vie et les accomplissements

Besoins:
- Joie 🎉
- Accomplissement 🏆
- Gratitude 🙏
- Célébration 🎊

#### 3. 💎 Intégrité (bleu #3B82F6)
> Être authentique et cohérent avec soi-même

Besoins:
- Authenticité 🎭
- Cohérence 🧩
- Sens 🧭
- Créativité 🎨

#### 4. 🤝 Interdépendance (vert #10B981)
> Connexion et appartenance

Besoins:
- Amour ❤️
- Appartenance 🏡
- Compréhension 👂
- Connexion 🔗
- Soutien 🤗

#### 5. 🎪 Jeu (rose #EC4899)
> S'amuser et se détendre

Besoins:
- Jeu 🎮
- Humour 😄
- Détente 🛋️
- Plaisir 🎵

#### 6. 🕊️ Communion spirituelle (violet #8B5CF6)
> Connexion à quelque chose de plus grand

Besoins:
- Beauté 🌸
- Harmonie 🎼
- Inspiration ✨
- Paix intérieure 🧘

#### 7. 🌱 Besoins physiques (terre #78716C)
> Bien-être corporel

Besoins:
- Air 🌬️
- Eau 💧
- Nourriture 🍎
- Repos 😴
- Sécurité 🛡️

---

### Helpers disponibles

**Fichier:** `src/constants/rosenbergNeeds.js`

```javascript
import {
  ROSENBERG_NEEDS,      // Tableau complet des 7 familles
  getAllNeedsFlat,      // Tous les besoins en array plat
  getNeedById,          // Récupère un besoin par ID
  getFamilyByNeedId     // Trouve la famille d'un besoin
} from '@/constants/rosenbergNeeds';

// Exemples
const allNeeds = getAllNeedsFlat();
// => [{ id: 'autonomie_choix', label: 'Choix', emoji: '🎯' }, ...]

const need = getNeedById('autonomie_liberte');
// => { id: 'autonomie_liberte', label: 'Liberté', emoji: '🕊️' }

const family = getFamilyByNeedId('autonomie_liberte');
// => { id: 'autonomie', label: 'Autonomie', color: '#F59E0B', ... }
```

---

## Utilisation

### Intégration dans le Sanctuaire

**Fichier:** `src/components/rooms/Sanctuaire/SanctuaireRoom.jsx`

```jsx
import MomentsOuiWidget from '../../room-modules/sanctuaire/MomentsOui';

<Panel
  gridColumn="4 / 6"
  gridRow="2 / 5"
  title="Moments OUI"
  icon="✨"
  texture="parchment"
  accentColor={theme.colors.accents.warm}
  collapsible={true}
  collapsed={getPanelState("sanctuaire", "moments_oui").collapsed}
  onToggleCollapse={(val) =>
    updatePanelState("sanctuaire", "moments_oui", { collapsed: val })
  }
>
  <MomentsOuiWidget />
</Panel>
```

**Position:** Colonnes 4-6, Lignes 2-5 (Panel 2x3)

---

### Workflow utilisateur

1. **Capturer un moment:**
   - Clic sur "Capturer un moment OUI +"
   - Remplir les 3 champs (Quand pré-rempli)
   - Sélectionner 1 à 5 besoins satisfaits
   - Valider avec "Capturer ✨"

2. **Consulter les moments:**
   - Timeline affiche tous les moments
   - Clic sur une carte pour voir les détails
   - Stats semaine + Top 3 besoins en haut

3. **Modifier un moment:**
   - Hover sur une carte → bouton ✏️
   - Modal pré-remplie avec données existantes
   - Modifier et "Mettre à jour"

4. **Supprimer un moment:**
   - Hover sur une carte → bouton 🗑️
   - Confirmation avant suppression définitive

---

### Debug console

Accès direct au store dans la console:

```javascript
// Voir tous les moments
window.stores.momentsOui.getAll();

// Stats hebdomadaires
window.stores.momentsOui.getWeeklyStats();

// Ajouter un moment de test
window.stores.momentsOui.add({
  quand: new Date().toISOString(),
  quoi: 'Test moment',
  pourquoi: 'Pour tester le système',
  tags: ['autonomie_choix', 'celebration_joie']
});

// Voir les stats des besoins
window.stores.momentsOui.getNeedsStats('all');
```

---

## API

### Types TypeScript (référence)

```typescript
// Moment OUI
interface MomentOui {
  id: number;                    // Timestamp unique
  timestamp: string;             // ISO date string
  quoi: string;                  // Max 200 char
  pourquoi: string;              // Max 500 char
  tags: string[];                // IDs besoins (1-5)
  createdAt: string;             // ISO date string
  updatedAt: string;             // ISO date string
}

// Besoin Rosenberg
interface Need {
  id: string;                    // Ex: 'autonomie_liberte'
  label: string;                 // Ex: 'Liberté'
  emoji: string;                 // Ex: '🕊️'
}

// Famille de besoins
interface NeedFamily {
  id: string;                    // Ex: 'autonomie'
  label: string;                 // Ex: 'Autonomie'
  emoji: string;                 // Ex: '🦅'
  color: string;                 // Hex: '#F59E0B'
  description: string;           // Description longue
  needs: Need[];                 // 4-6 besoins
}

// Stats hebdomadaires
interface WeeklyStats {
  totalMoments: number;
  topNeeds: {
    needId: string;
    count: number;
    needData: Need;
  }[];
}

// Filtres
interface MomentsFilter {
  period?: 'week' | 'month' | 'year';
  tags?: string[];
  keyword?: string;
}
```

---

## Décisions de design

### 1. Limite de 5 besoins par moment

**Raison:** Éviter la dilution de l'attention. Forcer à identifier les besoins **réellement** satisfaits, pas tous ceux qui pourraient l'être.

**Alternative rejetée:** Sélection illimitée (trop de noise dans les stats)

---

### 2. Focus 100% sur les moments OUI

**Raison:** Psychologie positive - se concentrer sur ce qui nourrit plutôt que sur ce qui manque.

**Alternative rejetée:** Capture des moments "NON" (trop négatif, déjà couvert par MindLog)

---

### 3. Taxonomie Rosenberg complète (30 besoins)

**Raison:** Richesse et précision de la CNV. Les 7 familles permettent une navigation par thème.

**Alternative rejetée:** Liste réduite à 13 besoins (trop restrictif, perd la nuance)

---

### 4. Accordéon par famille (collapsed par défaut)

**Raison:** Éviter l'overwhelm visuel avec 30 badges affichés en même temps. Permet une exploration progressive.

**Alternative rejetée:** Grille plate 30 badges (trop dense, scroll vertical)

---

### 5. Timeline anti-chronologique

**Raison:** Les moments récents sont plus pertinents. L'utilisateur veut voir en premier ce qu'il vient de capturer.

**Alternative rejetée:** Chronologique (oblige à scroller pour voir les nouveaux)

---

### 6. Stats automatiques temps réel

**Raison:** Gratification immédiate. L'utilisateur voit l'impact de ses captures instantanément.

**Alternative rejetée:** Calcul à la demande (moins engageant)

---

### 7. Pas de gamification (points, streaks)

**Raison:** Éviter la pression de performance. Le widget doit rester un outil de conscience, pas un jeu compétitif.

**Alternative rejetée:** Système de points/badges (risque d'anxiété si pas de streak)

---

### 8. Dates intelligentes (Aujourd'hui/Hier)

**Raison:** Clarté immédiate. Plus naturel que "2025-10-15" quand c'est aujourd'hui.

**Alternative rejetée:** ISO date fixe (moins humain)

---

### 9. Badge contrast fix (success/secondary, solid/outline)

**Raison:** Lisibilité critique. Les badges avec subtle + muted étaient illisibles.

**Fix appliqué:**
- Selected: `color="success"` + `variant="solid"` + `color: white`
- Unselected: `color="secondary"` + `variant="outline"` + `color: #F7FAFC`

---

### 10. Button primary variant ajouté

**Raison:** Le variant 'primary' n'existait pas dans Button.styles.js, causant un hover invisible.

**Fix appliqué:**
- Background: `accents.primary`
- Hover: `primary` avec lift + shadow
- Text: `text.light` (blanc) pour contraste maximal

---

## Roadmap (fonctionnalités futures)

### Phase 2 - Notifications douces (optionnel)
- Toast 20h-22h pour rappel capture journalière
- Désactivable dans settings
- Non-intrusive (pas de notification browser)

### Phase 3 - FAB Sanctuaire (optionnel)
- Bouton flottant dans le Sanctuaire uniquement
- Accès rapide à la capture sans scroller
- Position bottom-right, `z-index: 100`

### Phase 4 - Analyses avancées
- Rapport 3-6 mois avec insights
- Graphiques d'évolution temporelle
- Corrélations besoins-contextes

### Phase 5 - Export
- Export Markdown (timeline formatée)
- Export JSON (backup/import)
- Export CSV (analyse externe)

### Phase 6 - Recherche et filtres
- Filtre par période (semaine/mois/année)
- Filtre par besoins spécifiques
- Recherche full-text dans Quoi/Pourquoi

---

## Maintenance

### Tests recommandés

1. **Capture basique:**
   - Créer moment avec 1 besoin
   - Créer moment avec 5 besoins
   - Vérifier persistence après refresh

2. **Édition:**
   - Modifier texte d'un moment
   - Ajouter/retirer des besoins
   - Vérifier updatedAt changé

3. **Suppression:**
   - Supprimer moment
   - Vérifier stats recalculées
   - Vérifier localStorage mis à jour

4. **Stats:**
   - Capturer 3 moments cette semaine
   - Vérifier WeeklyCounter = 3
   - Vérifier top 3 heatmap correct

5. **Limites:**
   - Tester 200/500 caractères
   - Tester sélection 6ème besoin (désactivé)
   - Tester champs vides (validation)

---

### Debugging

**localStorage key:** `irim-diary-store`

**Voir les données brutes:**
```javascript
JSON.parse(localStorage.getItem('irim-diary-store')).state.momentsOui
```

**Reset complet:**
```javascript
localStorage.removeItem('irim-diary-store');
window.location.reload();
```

**Logs store:**
Les actions add/update/delete loguent automatiquement dans la console en mode dev.

---

## Auteurs

- **Design & Spécifications:** IRIM + Claude Code
- **Implémentation:** Claude Code (Sonnet 4.5)
- **Review:** IRIM

**Date:** 15 octobre 2025
**Commits:** 4 (bc4e258, eaf1d82, 3b27841, 49304ef)

---

## Licence

Propriétaire - IRIMMetaBrain © 2025
