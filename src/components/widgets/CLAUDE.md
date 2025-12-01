# CLAUDE.md - Widgets

> Composants réutilisables autonomes

## Vue d'ensemble

Widgets = composants fonctionnels complets, utilisés dans plusieurs pièces.

```
widgets/
├── TimeTimer.jsx          # Timer visuel (24k lignes!)
├── MindLog/               # Tracker mood/énergie/focus
├── QuoteCarousel/         # Mantras et citations
├── Diary/                 # Journal quotidien
├── DiaryArchive/          # Archives mensuelles
├── ImageCarousel/         # Carousel d'images
├── ImageDisplay/          # Affichage image simple
└── ActionList/            # Liste d'actions
```

---

## TimeTimer

**Fichier** : `TimeTimer.jsx` (~750 lignes)

**Usage** : Chambre (rituels), modals

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxMinutes` | number | 60 | Durée max en minutes |
| `colorSelect` | boolean | false | Afficher sélecteur couleur |
| `size` | number | 300 | Taille en pixels |
| `presets` | array | `[4, 20]` | Présets de durée |
| `onComplete` | function | - | Callback fin du timer |

### Fonctionnalités

- **Disque SVG** progressif (sens horaire ou anti-horaire)
- **Audio** : Boucle méditation pendant cycles 4 min
- **Contrôles** : Play/Pause, Reset, Reverse direction
- **Messages** : "C'est parti", "C'est reparti", "Pause", "C'est fini"
- **Animation** : Pulsation centrale pendant exécution

```jsx
<TimeTimer
  maxMinutes={25}
  colorSelect={true}
  presets={[4, 20, 25]}
  onComplete={() => console.log('Timer terminé!')}
/>
```

---

## MindLog

**Dossier** : `MindLog/`

### MindLogCompact

**Fichier** : `MindLog/MindLogCompact.jsx`

**Usage** : Chambre (personnel), Atelier (projet)

### Props

| Prop | Type | Description |
|------|------|-------------|
| `context` | `'diary'` \| `'project'` | Contexte de sauvegarde |
| `onMount` | function | Callback avec handlers exposés |
| `onLogSave` | function | Callback après sauvegarde |

### Modes d'affichage

1. **Compact** : Sliders + emoji mood
2. **Markdown** : Notes éditables
3. **Logs** : Historique des entrées

### Structure données

```javascript
{
  mood: 3,        // 1-5 (😫 😐 🙂 😊 🔥)
  energy: 3,      // 1-5 (⚡)
  focus: 3,       // 1-5 (🎯)
  note: "..."     // Texte libre
}
```

### Handlers exposés (via onMount)

```javascript
onMount={(handlers) => {
  handlers.viewMode          // 'compact' | 'markdown' | 'logs'
  handlers.handleToggleView()
  handlers.handleToggleEdit()
  handlers.handleQuickLog()
  handlers.handleClearLogs()
  handlers.logsCount
}}
```

---

## QuoteCarousel

**Dossier** : `QuoteCarousel/`

**Usage** : Chambre (mantras)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quotes` | array | mantrasData | Liste de citations |
| `randomize` | boolean | true | Mode aléatoire |
| `showCategory` | boolean | true | Afficher catégorie |

### Structure quote

```javascript
{
  text: "L'amour n'attend pas",
  category: "liberateurs"  // liberateurs, ancrage, presence, creatifs, action
}
```

### Navigation

- **→** : Nouvelle citation aléatoire
- **←** : Citation précédente (historique)

### Données

Source : `src/data/mantras.json`

```json
{
  "liberateurs": [
    { "text": "L'amour n'attend pas", "category": "liberateurs" }
  ],
  "ancrage": [...],
  "presence": [...],
  "creatifs": [...],
  "action": [...]
}
```

---

## Diary

**Dossier** : `Diary/`

**Usage** : Companion (HomePage)

### Props

| Prop | Type | Description |
|------|------|-------------|
| `date` | string | Date au format YYYY-MM-DD |
| `onDateChange` | function | Callback changement date |

### Fonctionnalités

- Éditeur markdown pour le jour sélectionné
- Navigation par date
- Auto-archivage des jours passés (vers monthlyArchives)

### Store

Utilise `useDiaryStore` :
- `getDailyEntry(date)` / `updateDailyEntry(date, content)`
- `archiveMonthlyEntries()` - Archive automatique

---

## DiaryArchive

**Dossier** : `DiaryArchive/`

**Usage** : Companion, Chambre

### Props

| Prop | Type | Description |
|------|------|-------------|
| `yearMonth` | string | Mois au format YYYY-MM |

### Fonctionnalités

- Liste des mois archivés
- Lecture seule des entrées passées
- Export markdown d'un mois complet

### Store

- `getArchivedMonths()` - Liste YYYY-MM triée
- `getMonthlyArchive(yearMonth)` - Entrées du mois
- `exportMonthToMarkdown(yearMonth)` - Export formaté

---

## ImageDisplay / ImageCarousel

### ImageDisplay

**Fichier** : `ImageDisplay/ImageDisplay.jsx`

```jsx
<ImageDisplay
  src="/path/to/image.png"
  alt="Description"
  hoverEffect={true}
/>
```

**Usage** : Totem Lion dans Chambre

### ImageCarousel

**Fichier** : `ImageCarousel/ImageCarousel.jsx`

```jsx
<ImageCarousel
  images={[{ src: '...', alt: '...' }, ...]}
  autoPlay={true}
  interval={5000}
/>
```

**Usage** : ScreenTV dans Atelier (placeholder)

---

## ActionList

**Fichier** : `ActionList/ActionList.jsx`

Liste d'actions avec statuts (done/pending).

```jsx
<ActionList
  actions={[
    { id: 1, text: "Faire X", done: false },
    { id: 2, text: "Faire Y", done: true }
  ]}
  onToggle={(id) => toggleAction(id)}
  onAdd={(text) => addAction(text)}
/>
```

---

## Patterns Communs

### Connexion Store

```jsx
import useDiaryStore from '../../../stores/useDiaryStore';

const MyWidget = () => {
  const { mindlog, updateMindLogCurrent } = useDiaryStore();
  // ...
};
```

### Debounce

Pour les widgets avec saisie fréquente :

```jsx
import { debounce } from '../../../utils/debounce';

const debouncedSave = useMemo(
  () => debounce((value) => saveToStore(value), 500),
  []
);
```

### Handlers exposés

Pattern pour exposer des actions au parent :

```jsx
const MyWidget = ({ onMount }) => {
  const handlers = {
    doSomething: () => { /* ... */ },
    getValue: () => someValue
  };

  useEffect(() => {
    onMount?.(handlers);
  }, [handlers]);
};
```
