# Système de Test Laboratoire

## Vue d'ensemble

Le Laboratoire est un environnement de test dynamique permettant de développer et valider des composants dans différentes configurations de Panel. Il offre une communication bidirectionnelle entre le composant testé et son conteneur Panel.

## Architecture

```
LaboratoireRoom
    ├── Controls (W/H buttons)
    ├── Panel (configuré dynamiquement)
    │   └── ComponentToTest
    │       ├── TEST_CONFIGS (définitions)
    │       ├── getPanelConfig() (export)
    │       └── Component actif
```

## Workflow d'utilisation

### 1. Ajouter un nouveau composant à tester

```jsx
// src/components/room-modules/laboratoire/ComponentToTest.jsx

// 1. Importer le composant
import MonComposant from '../../widgets/MonComposant';

// 2. Ajouter la configuration
const TEST_CONFIGS = {
  montest: {
    // Configuration du composant
    component: MonComposant,
    props: {
      // Props par défaut
      defaultProp: 'value',
      context: 'test'
    },

    // Configuration du Panel
    panel: {
      title: "Mon Composant Test",
      icon: "🎯",
      texture: "wood",
      collapsible: true,
      hideHeaderTitleWhenCollapsed: true,
      minWidth: 2,
      minHeight: 2,
      recommendedWidth: 3,
      recommendedHeight: 3,

      // Toolbar custom (optionnel)
      getCustomActions: (handlers) => (
        <CustomToolbar {...handlers} />
      )
    }
  }
};

// 3. Activer le test
const ACTIVE_TEST = 'montest';
```

### 2. Configuration avancée

#### Props calculées selon dimensions

```jsx
const ComponentToTest = ({ panelWidth, panelHeight, collapsed }) => {
  const computedProps = {
    ...config.props,
    compact: panelWidth <= 2,      // Mode compact si largeur ≤ 2
    debug: panelHeight >= 3,       // Mode debug si hauteur ≥ 3
    verbose: panelWidth >= 4 && panelHeight >= 4  // Mode verbose
  };

  return <Component {...computedProps} />;
};
```

#### Communication avec la toolbar

```jsx
// Dans le composant
const MonComposant = ({ onMount }) => {
  const [state, setState] = useState();

  // Exposer les handlers à la toolbar
  useEffect(() => {
    if (onMount) {
      onMount({
        handleAction: () => doSomething(),
        currentState: state,
        // ... autres handlers
      });
    }
  }, [onMount, state]);
};

// Dans la config
panel: {
  getCustomActions: (handlers) => (
    <button onClick={() => handlers?.handleAction?.()}>
      Action {handlers?.currentState}
    </button>
  )
}
```

## Communication bidirectionnelle

### ComponentToTest → LaboratoireRoom

Via `getPanelConfig()` exporté :
- Configuration du Panel (titre, icône, texture)
- Props spéciales (hideHeaderTitleWhenCollapsed)
- Toolbar custom (customActions)
- Contraintes (minWidth, minHeight)

### LaboratoireRoom → ComponentToTest

Via props passées :
- `panelWidth` : largeur actuelle (1-5)
- `panelHeight` : hauteur actuelle (1-5)
- `collapsed` : état collapsed du Panel
- `showPanel` : mode Panel ou Direct

### Composant → Toolbar

Via event system :
1. Composant appelle `onMount(handlers)`
2. `componentHandlers` stocke les références
3. Event `lab-component-mounted` déclenché
4. LaboratoireRoom re-render avec toolbar mise à jour

## Indicateurs visuels

### Badge d'information
Affiché en haut à droite (si hauteur ≥ 3) :
- Dimensions actuelles (ex: `3×3`)
- Nom du test actif
- Warning si dimensions insuffisantes

### Warnings dimensions
Bannières rouges si dimensions < minimum :
- ⚠️ Largeur minimale recommandée
- ⚠️ Hauteur minimale recommandée

## Exemples de configurations

### Composant simple

```jsx
simple: {
  component: SimpleWidget,
  props: { color: 'blue' },
  panel: {
    title: "Widget Simple",
    icon: "🔵",
    texture: "metal"
  }
}
```

### Composant avec toolbar

```jsx
mindlog: {
  component: MindLogCompact,
  props: { context: 'diary' },
  panel: {
    title: "MindLog Test",
    icon: "🧠",
    hideHeaderTitleWhenCollapsed: true,
    getCustomActions: (handlers) => (
      <MindLogToolbar
        viewMode={handlers?.viewMode}
        onToggleView={() => handlers?.handleToggleView?.()}
        // ...
      />
    )
  }
}
```

### Composant avec contraintes

```jsx
complexe: {
  component: ComplexComponent,
  props: {},
  panel: {
    title: "Composant Complexe",
    minWidth: 3,        // Nécessite au moins 3 colonnes
    minHeight: 3,       // Nécessite au moins 3 lignes
    recommendedWidth: 4,
    recommendedHeight: 4
  }
}
```

## Modes de test

### Mode Panel (par défaut)
- Composant dans un Panel avec header
- Possibilité de collapse
- Toolbar custom disponible
- Dimensions variables 1×1 à 5×5

### Mode Direct (sans Panel)
- Bouton 👁️/∅ pour toggle
- Composant en pleine grille 5×5
- Pas de header ni toolbar
- Utile pour tests grandeur nature

## Tips & Best Practices

1. **Nommage** : Utiliser des noms descriptifs dans TEST_CONFIGS
2. **Props par défaut** : Définir les props minimales pour fonctionner
3. **Dimensions** : Toujours spécifier minWidth/minHeight si nécessaire
4. **Debug** : Utiliser les props calculées pour adapter le rendu
5. **Cleanup** : Retirer les configs de test non utilisées
6. **Documentation** : Commenter les configs complexes

## Troubleshooting

### La toolbar ne s'affiche pas
- Vérifier que `getCustomActions` retourne un élément React
- S'assurer que `onMount` est appelé dans le composant
- Vérifier `hideHeaderTitleWhenCollapsed: true`

### Le Panel n'a pas la bonne config
- Vérifier que `ACTIVE_TEST` correspond à une clé dans TEST_CONFIGS
- Relancer le serveur de développement après modifications
- Vérifier l'export de `getPanelConfig`

### Les handlers sont undefined
- S'assurer que le composant appelle `onMount` après le montage
- Vérifier que les handlers sont passés correctement
- Utiliser l'opérateur `?.` pour éviter les erreurs

## Conclusion

Ce système offre une approche scalable et maintenable pour tester des composants dans différentes configurations. L'architecture permet d'ajouter facilement de nouveaux tests sans modifier le code du Laboratoire.