# MindLogCompact

## Vue d'ensemble

MindLogCompact est un tracker émotionnel et de productivité conçu pour s'intégrer dans des espaces restreints (1×2 dans une grille). Il offre trois modes d'affichage et deux contextes de persistance, permettant un suivi personnel ou lié aux projets.

## Caractéristiques principales

- **3 modes d'affichage** : Compact, Markdown, Logs
- **2 contextes** : Diary (personnel) ou Project (lié au projet actif)
- **Design ultra-compact** : Optimisé pour grilles 1×2
- **Persistance automatique** : Via useDiaryStore ou useProjectDataStore
- **Toolbar dédiée** : MindLogToolbar avec 3 actions principales

## Props

```typescript
interface MindLogCompactProps {
  context: 'diary' | 'project';  // Contexte de persistance
  onLogSave?: (log: LogEntry) => void;  // Callback après sauvegarde
  onMount?: (handlers: Handlers) => void;  // Expose les handlers
}
```

## Modes d'affichage

### Mode Compact (par défaut)

Interface principale avec :
- **Emoji central** : Représente l'humeur actuelle (32px)
- **Sélecteur d'humeur** : 5 emojis (😫 😐 🙂 😊 🔥)
- **Sliders visuels** :
  - ⚡ Énergie (1-5)
  - 🎯 Focus (1-5)
- **Note rapide** : Textarea pour contexte

Effets visuels :
- Pulse + glow doré quand mood ≥ 4
- Feedback de sélection (scale, shadow)
- Sliders avec curseur illuminé

### Mode Markdown

Éditeur de notes avec deux états :
- **Édition** (✏️) : Textarea pour écrire en markdown
- **Lecture** (👁️) : Rendu basique du markdown
  - Headers (# et ##)
  - Listes (-)
  - **Gras** et *italique*

### Mode Logs

Historique chronologique avec :
- Format : `[HH:MM] 😊 ⚡⚡⚡ 🎯🎯 - Note`
- 10 dernières entrées visibles
- Bouton × pour suppression individuelle
- Bouton "🗑️ Tout effacer"

## Contextes de persistance

### Context "diary" (Chambre)

Journal personnel indépendant des projets :
- Store : `useDiaryStore`
- Données : mood, energy, focus, notes, logs
- Limite : 50 logs maximum
- Usage : Suivi personnel quotidien

### Context "project" (Atelier)

Lié au projet actif :
- Store : `useProjectDataStore`
- Données : Stockées dans `moduleStates.mindlog`
- Limite : 20 logs par projet
- Usage : Suivi productivité par projet

## Toolbar (MindLogToolbar)

3 boutons principaux :
1. **✏️/👁️** : Toggle édition/lecture (mode markdown)
2. **📊** : Log rapide avec badge count
3. **🔄** : Changer de vue (cycle compact → markdown → logs)

## Structure des logs

```javascript
{
  timestamp: "2025-09-20T10:30:00.000Z",
  mood: 4,              // 1-5
  emoji: "😊",          // Emoji sélectionné
  energy: 3,            // 1-5
  focus: 2,             // 1-5
  notes: "Note...",     // Texte optionnel
  type: "compact"       // Type de log
}
```

## Intégration

### Dans l'Atelier

```jsx
<Panel
  title="MindLog"
  icon="🌈"
  hideHeaderTitleWhenCollapsed={true}
  customActions={
    <MindLogToolbar
      viewMode={handlers?.viewMode}
      onToggleView={() => handlers?.handleToggleView?.()}
      // ...
    />
  }
>
  <MindLogCompact
    context="project"
    onMount={(handlers) => {
      // Stocker les handlers pour la toolbar
    }}
  />
</Panel>
```

### Dans la Chambre

```jsx
<MindLogCompact
  context="diary"
  onLogSave={(log) => {
    console.log("Journal personnel:", log);
  }}
/>
```

## Design & Thème

### Couleurs
- Background : Gradient `stone` → `secondary`
- Énergie : `theme.colors.accents.success` (vert olive)
- Focus : `theme.colors.accents.danger` (rouge terre)
- Humeur active : `theme.colors.accents.gold` (or)

### Dimensions
- Padding global : 6px
- Emoji principal : 32px
- Boutons humeur : 28×28px
- Sliders : hauteur 20px
- Police logs : 10px

## Handlers exposés

```javascript
{
  handleQuickLog: Function,     // Enregistrer un log
  handleToggleView: Function,   // Changer de vue
  handleToggleEdit: Function,   // Toggle édition (markdown)
  handleClearLogs: Function,    // Effacer tous les logs
  viewMode: String,             // Mode actuel
  isEditing: Boolean,           // État édition
  logsCount: Number            // Nombre de logs
}
```

## Optimisations

### Performance
- useCallback pour tous les handlers
- Dépendances minimales dans useEffect
- Limite de logs (20 projet, 50 diary)
- Re-renders optimisés via event custom

### UX
- Feedback visuel immédiat
- Transitions douces (0.2-0.3s)
- Indicateurs visuels (badges, glow)
- Validation silencieuse

## États spéciaux

### Mood élevé (≥ 4)
- Emoji principal : pulse animation
- Effet glow doré
- Indicateur de bonne humeur

### Énergie/Focus élevés (> 3)
- Barre de progression illuminée
- Shadow sur le curseur
- Valeur en couleur vive

## Exemples d'utilisation

### Suivi simple

```jsx
<MindLogCompact context="diary" />
```

### Avec callback

```jsx
<MindLogCompact
  context="project"
  onLogSave={(log) => {
    // Analytics, notifications, etc.
    trackEvent('mindlog_saved', log);
  }}
/>
```

### Intégration complète

```jsx
const [handlers, setHandlers] = useState(null);

<MindLogCompact
  context="diary"
  onMount={setHandlers}
  onLogSave={(log) => {
    updateDashboard(log);
  }}
/>

// Utiliser les handlers ailleurs
<button onClick={() => handlers?.handleQuickLog?.()}>
  Log externe
</button>
```

## Troubleshooting

### Les logs ne se sauvent pas
- Vérifier le contexte (diary/project)
- S'assurer que le store est initialisé
- Vérifier les permissions localStorage

### La toolbar ne fonctionne pas
- Vérifier que onMount est appelé
- S'assurer que les handlers sont passés
- Vérifier hideHeaderTitleWhenCollapsed

### Les emojis ne s'affichent pas
- Vérifier l'encodage UTF-8
- Tester sur différents navigateurs
- Fallback sur caractères ASCII si nécessaire

## Évolutions futures

- Export CSV des logs
- Graphiques de tendance
- Rappels programmés
- Tags personnalisés
- Intégration calendrier
- Analyse sentiment IA