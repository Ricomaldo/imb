---
created: 2026-01-01
updated: 2026-01-01
status: active
type: guide
---

# Panel + MarkdownEditor + MarkdownToolbar System

> Le cœur de l'UI IMB : une architecture trio pour édition/affichage de contenu markdown avec gestion d'état intégrée.

---

## Vue d'ensemble

L'IMB repose sur trois composants qui travaillent ensemble de manière sophistiquée :

| Composant | Rôle | Responsabilité |
|-----------|------|-----------------|
| **Panel** | Conteneur principal | Layout, header, états collapse/focus, gestion textures |
| **MarkdownEditor** | Éditeur/Afficheur | Edit mode / Preview mode, synchronisation contenu |
| **MarkdownToolbar** | Contrôles | Zoom, toggle edit/preview, expand mode focus, save |

### Architecture : PanelContext

Ces trois composants communiquent via **PanelContext**, un système d'état partagé qui gère :

```
PanelContext
├── editing        # Mode édition vs lecture
├── zoom           # Niveau de zoom (-2 à +5)
├── isExpanded     # Mode focus actif
├── contentType    # 'markdown' ou 'mantras' (détermine la toolbar)
└── ...autres
```

**Pourquoi PanelContext ?** Pour synchroniser :
- Quand tu cliques "✏️" dans la toolbar, `editing` passe à true
- Le MarkdownEditor bascule automatiquement en mode édition
- Pas de props drilling, une source de vérité unique

---

## 1. Panel (Conteneur)

**Fichier** : `src/components/common/Panel/Panel.jsx`

### Props Essentiels

```jsx
<Panel
  // LAYOUT
  gridColumn="1 / 3"      // CSS grid position
  gridRow="1 / 3"

  // CONTENU
  title="Roadmap"         // Titre affiché
  icon="🗺️"              // Emoji

  // APPARENCE
  texture="parchment"     // stone | wood | parchment | metal | leather | fabric
  accentColor="#B8860B"   // Couleur sage ou thème

  // MARKDOWN SUPPORT
  contentType="markdown"  // Active MarkdownToolbar automatiquement
  transparentContent={true} // Fond transparent (affiche la texture)

  // COMPORTEMENT
  collapsible={true}      // Permettre collapse/expand
  collapsed={false}       // État initial
  onToggleCollapse={(newState) => {...}} // Callback collapse

  // ÉDITION & SAVE
  onSave={handleSave}     // Callback quand toolbar save cliqué
  isSaving={false}        // État loading pendant save
  showSaveButton={true}   // Afficher bouton save dans toolbar

  // ÉVÉNEMENTS
  onClick={() => {...}}   // Callback au clic panel
>
  {/* Contenu enfant */}
</Panel>
```

### Ce que Panel Fait

1. **Crée PanelProvider** (automatique) qui entoure les enfants
2. **Gère le header** avec titre + toolbar (basée sur contentType)
3. **Gère collapse/expand** - réduit à juste le header si `collapsed=true`
4. **Gère mode focus** - overlay fullscreen quand toolbar expand cliqué
5. **Applique texture** via `background-image`
6. **Passe les props** `onSave`, `isSaving`, `showSaveButton` à MarkdownToolbar

### Pattern PanelProvider

```jsx
// Panel crée automatiquement :
<PanelProvider contentType={props.contentType}>
  <PanelInner {...props}>
    {children}
  </PanelInner>
</PanelProvider>

// Donc tes enfants (MarkdownEditor, autres) peuvent faire :
const panelContext = usePanelContext(); // Accès au contexte
```

---

## 2. MarkdownEditor (Éditeur/Afficheur)

**Fichier** : `src/components/common/MarkdownEditor/MarkdownEditor.jsx`

### Props Principaux

```jsx
<MarkdownEditor
  // CONTENU
  value="# Mon markdown"     // String markdown à éditer
  onChange={setContent}      // Callback de changement

  // APPARENCE
  height="100%"              // Hauteur (100% en embedded)
  compact={true}             // Format compact (padding réduit)
  variant="embedded"         // 'embedded' (dans Panel) ou 'standalone'
  accentColor="#B8860B"      // Couleur titres markdown

  // COMPORTEMENT
  placeholder="Écrivez..."   // Placeholder textarea
  readOnly={false}           // Lecture seule
  showPreview={true}         // Afficher onglets edit/preview
/>
```

### Ce que MarkdownEditor Fait

1. **S'enregistre auprès de PanelContext** (si présent)
2. **Gère deux modes** :
   - `activeTab === 'edit'` → Textarea avec votre contenu
   - `activeTab === 'preview'` → MarkdownPreview avec rendu (GitHub Flavored Markdown)
3. **Synchronise avec toolbar** :
   - Quand toolbar clique ✏️, `editing` du context change
   - MarkdownEditor bascule automatiquement d'onglet
4. **Gère zoom** via PanelContext
5. **Enveloppe le contenu** dans `EditorContainer` avec flex/height pour occupy 100%

### États Importants

```javascript
// Interne
const [activeTab, setActiveTab] = useState('edit'); // ou 'preview'
const [localValue, setLocalValue] = useState(value);

// Via context (si dans Panel)
const panelContext = usePanelContext();
const currentZoomLevel = panelContext?.zoom || 0;
const shouldEdit = panelContext?.editing ?? !readOnly;
```

### Synchronisation Clé

```javascript
// MarkdownEditor se synchronise avec context.editing
React.useEffect(() => {
  const shouldEdit = panelContext ? panelContext.editing : !readOnly;
  setActiveTab(shouldEdit ? 'edit' : 'preview');
}, [panelContext?.editing, readOnly]);
```

**Pourquoi c'est important** : Tu ne vois pas les détails, mais quand tu cliques le bouton ✏️ dans la toolbar, c'est ça qui bascule le mode.

---

## 3. MarkdownToolbar (Contrôles)

**Fichier** : `src/components/common/MarkdownToolbar/MarkdownToolbar.jsx`

### Props

```jsx
<MarkdownToolbar
  // ZOOM
  zoomLevel={0}              // Niveau zoom (-2 à +5)
  onZoomIn={() => {...}}     // Callback +1 zoom
  onZoomOut={() => {...}}    // Callback -1 zoom

  // ÉDITION
  isEditing={true}           // Mode édition actif ?
  onToggleEdit={() => {...}} // Toggle edit ↔️ preview
  showEditButton={true}      // Afficher ✏️ ?

  // FOCUS MODE
  isExpanded={false}         // Mode focus fullscreen ?
  onToggleExpand={() => {...}} // Toggle focus mode
  showExpandButton={true}    // Afficher ⛶ ?

  // SAVE
  onSave={handleSave}        // Callback save
  isSaving={false}           // État loading
  showSaveButton={true}      // Afficher 💾 ?
/>
```

### Ce que MarkdownToolbar Affiche

| Bouton | Condition | Action |
|--------|-----------|--------|
| 🔍︎- / 🔍︎+ | Toujours | Zoom in/out |
| ✏️ | `showEditButton=true` | Toggle edit/preview mode |
| 💾 | `showSaveButton && isEditing` | Appel `onSave` callback |
| ⛶ | `showExpandButton=true` | Toggle mode focus |

---

## 4. Intégration : Comment Ça Marche Ensemble

### Cas 1 : Lecture Simple (Atelier Roadmap)

```jsx
// ComptoirRoom.jsx
<Panel
  title="Roadmap"
  contentType="markdown"
>
  <MarkdownEditor
    value={roadmapContent}      // Depuis store
    onChange={updateRoadmap}    // Met à jour store
  />
</Panel>
```

**Flux** :
1. Panel crée PanelProvider
2. MarkdownEditor se registre auprès du contexte
3. Toolbar apparaît automatiquement (contentType="markdown")
4. Utilisateur peut cliquer ✏️ pour passer en édition
5. Le contenu bascule du preview au textarea
6. Changements sauvegardés via onChange

### Cas 2 : Édition + Save (Comptoir Questions)

```jsx
// ComptoirRoom.jsx
const handleSaveQuestion = async () => {
  await questionsPanelRef.current.saveCurrentQuestion(questionId);
};

<Panel
  contentType="markdown"
  onSave={handleSaveQuestion}      // Callback save
  isSaving={isSaving}              // État loading
  showSaveButton={true}            // Afficher bouton
>
  <QuestionsPanel
    ref={questionsPanelRef}        // Pour exposer saveCurrentQuestion
  />
</Panel>
```

**Flux** :
1. Panel reçoit `onSave`, `isSaving`, `showSaveButton`
2. Panel transmet ces props à MarkdownToolbar
3. Toolbar affiche le bouton 💾 quand `showSaveButton=true`
4. Quand utilisateur clique 💾 :
   - `onSave` est appelé
   - Le handler sauvegarde via l'API
   - `isSaving` passe à true → bouton affiche ⏳
   - Après save, `isSaving` revient à false

---

## 5. PanelContext en Détail

**Fichier** : `src/components/common/Panel/PanelContext.js`

### Ce qu'il Gère

```javascript
{
  // Édition
  editing: boolean,              // Mode édition actif
  handleToggleEdit: () => {},

  // Zoom
  zoom: number,                  // -2 à +5
  handleZoomIn: () => {},
  handleZoomOut: () => {},

  // Focus mode
  isExpanded: boolean,           // Mode fullscreen
  handleToggleExpand: () => {},

  // Content type
  contentType: string,           // 'markdown' | 'mantras'

  // Mantras specifics (optionnel)
  categories: array,
  activeFilters: array,
  // ...
}
```

### Utilisation dans Composants Enfants

```javascript
// Dans MarkdownEditor, MarkdownToolbar, etc.
const panelContext = usePanelContext();

// Accéder aux valeurs
const { editing, zoom, isExpanded, contentType } = panelContext;

// Appeler les handlers
panelContext.handleToggleEdit();
panelContext.handleZoomIn();
```

---

## 6. Pièges Courants & Solutions

### ❌ Piège 1 : MarkdownEditor affiche rien en mode focus

**Cause** : Hauteur mal propagée ou contenu pas chargé

**Solution** :
- Ajouter une `key` pour forcer re-render
- Vérifier que le `value` est chargé avant render

```jsx
<MarkdownEditor
  key={questionId}  // Force re-création si ID change
  value={content}
  // ...
/>
```

### ❌ Piège 2 : Toolbar n'apparaît pas

**Cause** : `contentType` manquant ou Panel mal configuré

**Solution** :
```jsx
<Panel
  contentType="markdown"  // C'est OBLIGATOIRE pour la toolbar
  // ...
>
```

### ❌ Piège 3 : Changes pas synchronisés entre edit et preview

**Cause** : `onChange` callback pas appelé correctement

**Solution** :
```jsx
<MarkdownEditor
  value={content}
  onChange={(newValue) => {
    // DOIT être synchrone et immédiat
    setContent(newValue);
  }}
/>
```

### ❌ Piège 4 : Save button n'apparaît pas

**Cause** : Panel props mal configurés

**Solution** :
```jsx
<Panel
  contentType="markdown"           // Obligatoire
  onSave={handleSave}             // Obligatoire
  isSaving={isSaving}             // Obligatoire
  showSaveButton={shouldShow}     // Obligatoire
>
```

---

## 7. Exemples Complets

### Exemple A : Notes simples (Atelier Notes)

```jsx
import Panel from '../../common/Panel';
import MarkdownEditor from '../../common/MarkdownEditor';

export const NotesPanel = ({ content, onChange }) => {
  return (
    <Panel
      gridColumn="1 / 3"
      gridRow="1 / 3"
      title="Notes"
      icon="📝"
      texture="parchment"
      accentColor={theme.colors.accents.neutral}
      contentType="markdown"      // Active toolbar
      collapsible={true}
    >
      <MarkdownEditor
        value={content}
        onChange={onChange}
        height="100%"
        compact={true}
        variant="embedded"
      />
    </Panel>
  );
};
```

### Exemple B : Questions avec save (Comptoir)

```jsx
export const QuestionsPanel = forwardRef(({ content, onSave }, ref) => {
  useImperativeHandle(ref, () => ({
    saveCurrentQuestion: async (questionId) => {
      await replaceNote(path, content);
    }
  }));

  return (
    <MarkdownEditor
      key={questionId}
      value={content}
      onChange={setContent}
      height="100%"
      compact={true}
      variant="embedded"
      accentColor={sageColor}
    />
  );
});

// Dans parent room :
const [isSaving, setIsSaving] = useState(false);

const handleSave = async () => {
  setIsSaving(true);
  await questionsPanelRef.current.saveCurrentQuestion(activeQuestionId);
  setIsSaving(false);
};

<Panel
  contentType="markdown"
  onSave={handleSave}
  isSaving={isSaving}
  showSaveButton={selectedQuestionIds.length > 0}
>
  <QuestionsPanel ref={questionsPanelRef} />
</Panel>
```

---

## 8. Checklist Implémentation

Quand tu ajoutes un nouveau Panel avec MarkdownEditor :

- [ ] Panel a `contentType="markdown"` ?
- [ ] Panel a `texture="parchment"` ou autre approprié ?
- [ ] MarkdownEditor a `height="100%"` et `variant="embedded"` ?
- [ ] MarkdownEditor a `value={content}` et `onChange={setContent}` ?
- [ ] État collapse géré via `usePreferencesStore` ?
- [ ] Si save : `onSave`, `isSaving`, `showSaveButton` sur Panel ?
- [ ] Si save : `forwardRef` + `useImperativeHandle` sur MarkdownEditor enfant ?
- [ ] MarkdownEditor a `key={identifier}` si contenu peut changer ?

---

## 9. À Compléter

### Actions à ajouter :

- [ ] **Mode mantras** : Comment `contentType="mantras"` change la toolbar ?
- [ ] **Advanced zoom** : Mathématiques font sizes à différents niveaux
- [ ] **Accessibility** : ARIA labels, keyboard shortcuts
- [ ] **Performance** : Memoization patterns pour grandes pages
- [ ] **Testing** : Exemples tests MarkdownEditor + Panel
- [ ] **Personnalisation** : Comment ajouter des buttons custom toolbar ?

---

## 10. Références Rapides

| Fichier | Utilité |
|---------|---------|
| Panel.jsx | Conteneur principal |
| Panel.styles.js | Styles Panel, PanelHeader, PanelContent |
| MarkdownEditor.jsx | Logique edit/preview |
| MarkdownEditor.styles.js | Styles editeur |
| MarkdownPreview.jsx | Rendu markdown (React Markdown) |
| MarkdownToolbar.jsx | Boutons zoom/edit/expand/save |
| PanelContext.js | État partagé |

---

**Version** : 1.0 (draft, à compléter)
**État** : À enrichir avec cas avancés, tests, perfs
