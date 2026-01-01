---
type: spec
updated: 2025-09-18
---

# Documentation Props & Hooks - IRIM StudioLab

## Architecture Panel (Refactorisation 2024)

### Composant: Panel (Composant Atomique)

**Fichier:** `components/common/Panel/Panel.jsx`

**Props:**
```js
{
  // CONTENU
  title: string,              // Titre du panneau
  icon: string,               // Emoji d'icône
  children: ReactNode,        // Contenu du panneau

  // APPARENCE
  texture: string,            // 'parchment'|'metal'|'wood'|'stone'
  accentColor: string,        // Couleur d'accentuation
  maxHeight: string,          // Hauteur maximale

  // LAYOUT
  gridColumn: string,         // Position CSS Grid
  gridRow: string,            // Position CSS Grid

  // COMPORTEMENT
  collapsible: boolean,       // Peut être réduit
  collapsed: boolean,         // État externe (contrôlé)
  defaultCollapsed: boolean,  // État initial (non contrôlé)
  onToggleCollapse: function, // Callback collapse
  badge: string|number,       // Badge de notification
  contentType: string,        // Type de contenu ('markdown'|'default')

  // ÉVÉNEMENTS
  onClick: function           // Handler clic sur le panel
}
```

**Context:** Utilise `PanelContext` pour la gestion d'état

**Usage:** Composant atomique de base pour tous les panneaux de l'application

---

### PanelContext

**Fichier:** `components/common/Panel/PanelContext.jsx`

**État fourni:**
```js
{
  // États
  zoom: number,              // Niveau de zoom (-2 à +2)
  editing: boolean,          // Mode édition actif
  contentType: string,       // Type de contenu du panel

  // Actions
  handleZoomIn: function,    // Augmenter zoom
  handleZoomOut: function,   // Réduire zoom
  handleToggleEdit: function // Basculer édition
}
```

**Usage:** Context automatiquement fourni par Panel, consommé par MarkdownEditor

---

### Composant: MarkdownEditor

**Fichier:** `components/common/MarkdownEditor/MarkdownEditor.jsx`

**Props:**
```js
{
  // CONTENU
  value: string,              // Contenu Markdown
  onChange: function,         // Callback de changement
  placeholder: string,        // Texte placeholder

  // APPARENCE
  height: string,             // Hauteur de l'éditeur
  compact: boolean,           // Mode compact
  accentColor: string,        // Couleur d'accentuation

  // COMPORTEMENT
  variant: string,            // 'embedded'|'standalone'
  showPreview: boolean,       // Afficher l'aperçu
  readOnly: boolean,          // Mode lecture seule
  zoomLevel: number          // Niveau de zoom (fallback si pas de context)
}
```

**Context:** Consomme `PanelContext` si disponible, sinon gestion interne

**Usage:** S'intègre dans Panel pour l'édition Markdown avec zoom et preview

---

### Composant: MarkdownToolbar

**Fichier:** `components/common/MarkdownToolbar/MarkdownToolbar.jsx`

**Props:**
```js
{
  zoomLevel: number,         // Niveau de zoom actuel
  onZoomIn: function,        // Augmenter zoom
  onZoomOut: function,       // Réduire zoom
  isEditing: boolean,        // État édition
  onToggleEdit: function,    // Basculer édition
  showEditButton: boolean    // Afficher bouton d'édition
}
```

**Usage:** Toolbar intégrée automatiquement dans Panel quand contentType="markdown"

---

## Pattern d'Usage Panel + MarkdownEditor

**Architecture simplifiée:**

```jsx
// Exemple: AtelierRoom - Roadmap Panel
<Panel
  gridColumn="1 / 4"
  gridRow="3 / 6"
  title="Roadmap"
  icon="🗺️"
  texture="parchment"
  accentColor={theme.colors.accents.cold}
  contentType="markdown"              // Active MarkdownToolbar
  collapsible={true}
  collapsed={roadmapState.collapsed}
  onToggleCollapse={(newCollapsed) => updateModuleState(project.id, 'roadmap', { collapsed: newCollapsed })}
>
  <MarkdownEditor
    value={roadmapContent}
    onChange={updateRoadmapContent}
    placeholder="Définissez votre roadmap..."
    height="100%"
    variant="embedded"                // S'adapte au PanelContext
    accentColor={theme.colors.accents.cold}
  />
</Panel>
```

**Flux:**
1. Panel fournit PanelContext
2. Panel détecte contentType="markdown" → affiche MarkdownToolbar
3. MarkdownEditor consomme PanelContext pour zoom/editing
4. MarkdownToolbar contrôle les actions via PanelContext

---

## Hooks de Persistance

### Hook: usePanelContent

**Fichier:** `hooks/usePanelContent.js`

**Retourne:**
```js
{
  roadmapContent: string,
  todoContent: string,
  updateRoadmapContent: function,
  updateTodoContent: function
}
```

**Usage:** Persistance contenu Markdown des panels par projet

---

## Stores et État Global

### Store: useProjectsStore

**Fonctions de gestion des modules:**
```js
{
  getModuleState: (projectId, moduleType) => { collapsed: boolean },
  updateModuleState: (projectId, moduleType, newState) => void
}
```

**Usage:** Persistance état collapsed des panels par projet
