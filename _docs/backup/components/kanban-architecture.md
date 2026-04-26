# Architecture Kanban - Documentation Technique

## Vue d'ensemble

Le système Kanban implémente une gestion de projets par colonnes avec drag & drop, catégorisation et visibilité automatique.

## Structure des Composants

### ProjectOverviewModal
Composant principal orchestrant l'interface Kanban.

#### État
- `activeTab` : Onglet actif (pro/perso/formation)
- `showNewProjectForm` : Affichage formulaire création
- `editingProject` : Projet en édition
- `activeId` : ID élément en cours de drag

#### Flux de données
```
ProjectOverviewModal
├── TabSelector (navigation)
├── KanbanView / FormationView (selon tab)
│   ├── DraggableProjectCard (cards)
│   └── ProjectDetailsModal (overlay)
└── ProjectForm (création/édition)
```

### KanbanView

Gère l'affichage Kanban pour Pro/Perso.

#### Colonnes
1. **EN TÊTE** (`entete`)
   - Maximum 5 projets
   - Auto-visible dans carousel
   - Fond doré pour mise en valeur

2. **ACTIF** (`actif`)
   - Projets en cours
   - Visibilité manuelle

3. **PAUSE** (`pause`)
   - Projets suspendus
   - Jamais visibles
   - Opacité réduite

4. **INBOX** (section séparée)
   - Projets sans `kanbanColumn`
   - Zone de réserve en bas

#### Drag & Drop

```javascript
// Configuration DnD
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }
  }),
  useSensor(KeyboardSensor)
);

// Handler de drop
handleDragEnd = (event) => {
  const { active, over } = event;
  // Détection colonne vs projet
  if (over.id.startsWith('column-')) {
    // Drop sur colonne vide
    moveToColumn(active.id, columnId);
  } else {
    // Drop sur projet existant
    moveToColumn(active.id, overProject.kanbanColumn);
  }
};
```

### DraggableProjectCard

Carte de projet avec fonctionnalités riches.

#### Features
- **Drag handle** : Zone de préhension à gauche
- **Collapse** : Bouton ▶/▼ pour replier
- **Checkbox** : Toggle visibilité carousel
- **Badges** : Status, type, technologies
- **Click handlers** :
  - Simple clic → Détails (modal overlay)
  - Double clic → Édition directe
  - Timer 200ms pour distinguer

#### Styles conditionnels
```javascript
// EN TÊTE : Fond doré + ombre colorée
background: linear-gradient(135deg,
  ${alpha(warm, 0.08)},
  ${alpha(warm, 0.02)}
);

// PAUSE : Grayscale + opacité
filter: grayscale(0.3);
opacity: 0.6;
```

### FormationView

Vue spécifique pour projets Formation.

#### Sections par complexité
- **Débutant** : `subcategory === 'exercice'`
- **Intermédiaire** : `subcategory === 'cours'`
- **Avancé** : `subcategory === 'certification'`

#### Features
- Tri par complexité ou date
- Sections collapsibles
- Grid layout responsive

## Store Integration

### useProjectMetaStore

#### Propriétés projet
```javascript
{
  id: string,
  name: string,
  category: 'pro' | 'perso' | 'formation',
  kanbanColumn: 'entete' | 'actif' | 'pause' | 'inbox' | null,
  order: number,
  // ... autres métadonnées
}
```

#### Actions Kanban
```javascript
// Déplacer vers colonne
moveToColumn(projectId, column) {
  // Update kanbanColumn
  // Si EN TÊTE → auto visible
  // Si PAUSE → auto invisible
}

// Réorganiser l'ordre
reorderProjects(activeId, overId) {
  // Recalcul des index order
}
```

## ProjectDetailsModal

Modal overlay pour affichage détails.

### Modes
1. **Consultation** : Affichage structuré des infos
2. **Édition** : Formulaire ProjectForm intégré

### Z-index Management
```javascript
// roomCanvas modal : z-index 100
// overlay modal : z-index 10000
variant="overlay" // Pour superposition
```

## Patterns d'implémentation

### Drop Zones
```jsx
const DroppableColumn = ({ columnId, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${columnId}`
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
};
```

### Auto-visibilité
```javascript
if (column === 'entete') {
  // Ajouter à visibleProjects
  if (!visibleProjects.includes(projectId)) {
    setVisibleProjects([...visibleProjects, projectId]);
  }
} else if (column === 'pause') {
  // Retirer de visibleProjects
  setVisibleProjects(
    visibleProjects.filter(id => id !== projectId)
  );
}
```

### Timer Click/DoubleClick
```javascript
const [clickTimeout, setClickTimeout] = useState(null);

handleClick = (e) => {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    setClickTimeout(null);
  } else {
    const timeout = setTimeout(() => {
      onClick(); // Simple clic
    }, 200);
    setClickTimeout(timeout);
  }
};

handleDoubleClick = (e) => {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    setClickTimeout(null);
  }
  onDoubleClick(e);
};
```

## Performance

### Optimisations
1. **useMemo** pour filtrage projets
2. **React.memo** sur cards statiques
3. **Lazy loading** des modales
4. **Debounce** sur drag operations

### Limites
- Maximum 5 projets EN TÊTE
- Affichage limité technologies (3 + count)
- Sections Formation collapsées par défaut

## Accessibilité

- Navigation clavier complète
- ARIA labels sur zones interactives
- Titles descriptifs sur hover
- Contraste WCAG AA minimum

## Évolutions futures

1. **Filtrage avancé**
   - Par status, type, technologies
   - Recherche textuelle
   - Sauvegarde filtres

2. **Analytics**
   - Temps par colonne
   - Vélocité projets
   - Burn-down charts

3. **Templates**
   - Configurations sauvegardées
   - Import/Export layouts
   - Presets par métier