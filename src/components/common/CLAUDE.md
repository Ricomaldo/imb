# CLAUDE.md - Common Components

> Design system et composants UI réutilisables

## Structure

```
common/
├── Panel/              # Container principal
├── MarkdownEditor/     # Éditeur markdown
├── Button/             # Boutons
├── Badge/              # Badges/tags
├── Modal/              # Modals
├── IconButton/         # Boutons icône
├── Typography/         # Styles texte
├── MarkdownToolbar/    # Toolbar édition markdown
├── MindLogToolbar/     # Toolbar MindLog
└── CategoryFilters/    # Filtres par catégorie
```

---

## Panel

**Dossier** : `Panel/`

**Le composant le plus utilisé** - Container pour tout contenu dans les pièces.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gridColumn` | string | - | Position CSS grid (ex: `"1 / 3"`) |
| `gridRow` | string | - | Position CSS grid |
| `title` | string | - | Titre du panel |
| `icon` | string | - | Emoji |
| `texture` | string | `'stone'` | Texture de fond |
| `accentColor` | string | - | Couleur accent |
| `collapsible` | boolean | false | Panel repliable |
| `collapsed` | boolean | false | État replié |
| `onToggleCollapse` | function | - | Callback toggle |
| `contentType` | string | - | `'markdown'` pour styles adaptés |
| `customActions` | ReactNode | - | Actions custom dans header |
| `hideHeaderTitleWhenCollapsed` | boolean | false | Cacher titre si replié |

### Textures Disponibles

| Texture | Usage typique |
|---------|---------------|
| `stone` | Défaut, solide |
| `wood` | Chaleureux (MindLog) |
| `parchment` | Écriture (Notes, Roadmap) |
| `metal` | Technique (ScreenTV) |
| `leather` | Confort (Chambre) |
| `fabric` | Doux (Mantras) |

### Exemple

```jsx
<Panel
  gridColumn="1 / 3"
  gridRow="1 / 2"
  title="Mon Panel"
  icon="🎯"
  texture="parchment"
  accentColor={theme.colors.accents.warm}
  collapsible={true}
  collapsed={panelState.collapsed}
  onToggleCollapse={(newCollapsed) =>
    updatePanelState('room', 'panel', { collapsed: newCollapsed })
  }
>
  {/* Contenu */}
</Panel>
```

---

## MarkdownEditor

**Dossier** : `MarkdownEditor/`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | `''` | Contenu markdown |
| `onChange` | function | - | Callback modification |
| `placeholder` | string | - | Placeholder |
| `height` | string | `'100%'` | Hauteur |
| `compact` | boolean | false | Mode compact |
| `variant` | string | `'default'` | `'embedded'` pour dans Panel |
| `accentColor` | string | - | Couleur accent liens/titres |
| `readOnly` | boolean | false | Lecture seule |

### Modes

1. **Édition** : Textarea avec preview
2. **Preview** : Rendu markdown (GitHub Flavored)
3. **Split** : Édition + preview côte à côte

### Exemple

```jsx
<MarkdownEditor
  value={content}
  onChange={setContent}
  placeholder="Écrivez ici..."
  height="100%"
  compact={true}
  variant="embedded"
  accentColor={theme.colors.accents.cold}
/>
```

---

## Button

**Dossier** : `Button/`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'primary'` | `'primary'`, `'secondary'`, `'ghost'` |
| `size` | string | `'medium'` | `'small'`, `'medium'`, `'large'` |
| `disabled` | boolean | false | Désactivé |
| `onClick` | function | - | Handler click |

```jsx
<Button variant="primary" size="medium" onClick={handleClick}>
  Action
</Button>
```

---

## Badge

**Dossier** : `Badge/`

### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Texte du badge |
| `color` | string | Couleur de fond |
| `selected` | boolean | État sélectionné |
| `onClick` | function | Handler click |
| `disabled` | boolean | Désactivé |

### Usage (Moments OUI)

```jsx
<Badge
  label="Autonomie"
  color="#F59E0B"
  selected={isSelected}
  onClick={() => toggleNeed('autonomie')}
  disabled={atMaxSelection && !isSelected}
/>
```

---

## Modal

**Dossier** : `Modal/`

### Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Visibilité |
| `onClose` | function | Callback fermeture |
| `title` | string | Titre modal |
| `size` | string | `'small'`, `'medium'`, `'large'` |
| `children` | ReactNode | Contenu |

```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ma Modal">
  <p>Contenu de la modal</p>
</Modal>
```

---

## IconButton

**Dossier** : `IconButton/`

Bouton avec icône uniquement (emoji ou icon).

```jsx
<IconButton
  icon="⚙️"
  onClick={handleSettings}
  title="Paramètres"
  size="small"
/>
```

---

## Typography

**Dossier** : `Typography/`

Composants de texte stylisés.

```jsx
import { Title, Subtitle, Body, Caption } from '../common/Typography';

<Title>Titre Principal</Title>
<Subtitle>Sous-titre</Subtitle>
<Body>Corps de texte</Body>
<Caption>Légende</Caption>
```

---

## MindLogToolbar

**Dossier** : `MindLogToolbar/`

Toolbar spécifique pour le widget MindLog.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `viewMode` | string | `'compact'`, `'markdown'`, `'logs'` |
| `isEditing` | boolean | Mode édition actif |
| `logsCount` | number | Nombre de logs |
| `onToggleView` | function | Changer de mode |
| `onToggleEdit` | function | Toggle édition |
| `onQuickLog` | function | Sauvegarder rapidement |
| `onClearLogs` | function | Effacer historique |
| `showEditButton` | boolean | Afficher bouton edit |
| `showClearButton` | boolean | Afficher bouton clear |

---

## CategoryFilters

**Dossier** : `CategoryFilters/`

Filtres par catégorie (utilisé pour mantras, projets).

```jsx
<CategoryFilters
  categories={['liberateurs', 'ancrage', 'presence']}
  selected={selectedCategory}
  onSelect={setSelectedCategory}
  colorMap={{
    liberateurs: '#F59E0B',
    ancrage: '#10B981',
    presence: '#8B5CF6'
  }}
/>
```

---

## Couleurs Accent (Theme)

```javascript
// Depuis theme.colors.accents
{
  warm: '#B8860B',      // Or brun (chaleur)
  cold: '#4A5568',      // Ardoise (froid)
  success: '#10B981',   // Vert (succès)
  neutral: '#6B7280',   // Gris (neutre)
  nature: '#6B8E23'     // Olive (nature)
}
```

---

## Pattern d'utilisation

```jsx
import Panel from '../../common/Panel';
import MarkdownEditor from '../../common/MarkdownEditor';
import Button from '../../common/Button';
import { useTheme } from 'styled-components';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <Panel
      title="Titre"
      texture="parchment"
      accentColor={theme.colors.accents.warm}
    >
      <MarkdownEditor
        value={content}
        onChange={setContent}
        accentColor={theme.colors.accents.warm}
      />
      <Button variant="primary" onClick={save}>
        Sauvegarder
      </Button>
    </Panel>
  );
};
```
