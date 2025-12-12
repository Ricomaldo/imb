# ADR-004: Annotation JSDoc @renders pour Cartographie des Composants

## Statut
Accepté

## Contexte
Le composant SystemOverview utilisait un arbre de composants codé en dur, créant une illusion de dynamisme mais nécessitant une maintenance manuelle constante. Cette approche entraînait des problèmes de :
- Désynchronisation entre l'architecture réelle et la visualisation
- Maintenance fastidieuse lors d'ajouts/suppressions de composants
- Absence de source de vérité unique pour l'architecture

## Décision
Nous adoptons une convention d'annotation JSDoc `@renders` permettant aux composants de déclarer leurs dépendances directement dans leur code source.

### Syntaxe

```javascript
/**
 * Composant principal de navigation entre les pièces
 * @renders BaseRoom
 * @renders NavigationArrows
 * @renders SideTower
 */
const RoomCanvas = () => {
  // ...
}
```

### Format d'annotation

- **@renders {ComponentName}** : Déclare qu'un composant en rend un autre
- Un composant peut avoir plusieurs tags @renders
- Les noms doivent correspondre exactement aux noms des composants exportés
- Les annotations peuvent être placées sur :
  - La déclaration du composant
  - L'export par défaut
  - La fonction/classe du composant

### Script de parsing

Le script `scripts/parse-component-tree.js` :
1. Parcourt récursivement `src/components/`
2. Extrait les annotations @renders via regex
3. Génère `architecture-map.json` avec la structure :

```json
{
  "timestamp": "2025-09-18T14:58:50.981Z",
  "totalComponents": 62,
  "rootComponents": ["App", "Router"],
  "components": [
    {
      "name": "RoomCanvas",
      "path": "layout/RoomCanvas",
      "renders": ["BaseRoom", "NavigationArrows"],
      "children": ["BaseRoom", "NavigationArrows"]
    }
  ]
}
```

### Intégration avec SystemOverview

SystemOverview lit `architecture-map.json` au build-time pour générer l'arbre de composants, garantissant une synchronisation parfaite avec le code source.

## Conséquences

### Positives

1. **Source de vérité unique** : Les annotations sont dans le code source
2. **Maintenance simplifiée** : Mise à jour automatique lors des changements
3. **Documentation intégrée** : Les dépendances sont visibles dans le code
4. **Validation possible** : Un linter peut vérifier la cohérence
5. **Pas d'analyse AST complexe** : Simple parsing regex

### Négatives

1. **Effort initial** : Nécessite l'annotation de tous les composants existants
2. **Discipline requise** : Les développeurs doivent maintenir les annotations
3. **Pas de détection automatique** : Les imports non annotés ne sont pas détectés

### Neutres

1. **Convention supplémentaire** : Une convention de plus à apprendre
2. **Build step additionnel** : Génération du JSON avant le build

## Alternatives considérées

1. **Analyse AST des imports** : Trop complexe, imports != rendu
2. **Configuration externe** : Séparation code/config indésirable
3. **Runtime introspection** : Performance impact, complexité accrue
4. **Maintien manuel** : Status quo insatisfaisant

## Exemples d'application

### Composant simple
```javascript
/**
 * @renders Panel
 */
const Dashboard = () => <Panel>...</Panel>;
```

### Composant avec rendu conditionnel
```javascript
/**
 * @renders Modal - Rendu conditionnel
 * @renders Button
 * @renders IconButton
 */
const SettingsView = ({ showModal }) => {
  return (
    <>
      <Button />
      <IconButton />
      {showModal && <Modal />}
    </>
  );
};
```

### Composant conteneur
```javascript
/**
 * @renders RoomCanvas
 * @renders ControlTower
 * @renders ModalManager
 */
export const Router = () => {
  // Logique de routage
};
```

## Implémentation

### Phase 1 : Infrastructure
- ✅ Créer `scripts/parse-component-tree.js`
- ✅ Générer `architecture-map.json`
- ✅ Documenter la convention (ce document)

### Phase 2 : Migration
- ⏳ Annoter les composants principaux (App, Router, RoomCanvas...)
- ⏳ Annoter les composants de layout
- ⏳ Annoter les composants de rooms
- ⏳ Annoter les composants UI

### Phase 3 : Intégration
- ⏳ Adapter SystemOverview pour lire le JSON
- ⏳ Ajouter script npm "doc:tree"
- ⏳ Intégrer au workflow de build

### Phase 4 : Améliorations
- ⏳ Linter pour vérifier les annotations
- ⏳ Support des props passées
- ⏳ Support des stores connectés

## Références

- [JSDoc](https://jsdoc.app/)
- [React DevTools Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)
- Scripts : `scripts/parse-component-tree.js`
- Output : `architecture-map.json`

## Date
2025-09-18