# Badge System Documentation

## Vue d'ensemble

Le système de badges fournit un composant réutilisable pour afficher des informations visuelles catégorisées avec support de couleurs, tailles et variantes.

## Composant Badge

### Import
```javascript
import Badge from '@/components/common/Badge';
```

### Props

| Prop | Type | Default | Options | Description |
|------|------|---------|---------|-------------|
| `children` | `ReactNode` | - | - | Contenu du badge |
| `color` | `string` | `'primary'` | `primary`, `success`, `warning`, `info`, `danger`, `muted`, `tech`, `secondary` | Couleur du badge |
| `variant` | `string` | `'subtle'` | `subtle`, `solid`, `outline` | Style visuel |
| `size` | `string` | `'md'` | `sm`, `md`, `lg` | Taille du badge |
| `shape` | `string` | `'default'` | `default`, `rounded`, `pill` | Forme des bordures |
| `icon` | `string` | - | - | Icône/emoji optionnel |
| `onClick` | `function` | - | - | Handler de clic |

### Exemples d'utilisation

#### Badge simple
```jsx
<Badge>Nouveau</Badge>
```

#### Badge avec icône et couleur
```jsx
<Badge
  color="success"
  icon="✅"
>
  Complété
</Badge>
```

#### Badge cliquable
```jsx
<Badge
  variant="outline"
  onClick={() => console.log('clicked')}
>
  Cliquable
</Badge>
```

#### Variantes de style
```jsx
// Subtle (défaut)
<Badge variant="subtle">Subtle</Badge>

// Solid
<Badge variant="solid">Solid</Badge>

// Outline
<Badge variant="outline">Outline</Badge>
```

### Couleurs automatiques

Le système mappe automatiquement certaines valeurs à des couleurs :

#### Status de projet
- `dev_actif` → Vert (success)
- `concept` → Orange (warning)
- `vision` → Bleu (info)
- `pause` → Gris (muted)
- `archive` → Rouge (danger)

#### Types de projet
- `tool` / `outil` → Primaire (brun)
- `app` / `application` → Accent (peru)
- `website` / `site` → Secondaire (tan)
- `api` → Froid (bleu ardoise)
- `library` / `librairie` → Succès (vert)

## ProjectBadges Component

Composant spécialisé pour afficher les badges d'un projet.

### Import
```javascript
import ProjectBadges from '@/components/modals/ProjectOverviewModal/ProjectBadges';
```

### Props
- `project` : Objet projet contenant les métadonnées
- `showAll` : Boolean pour afficher tous les badges ou limiter

### Badges affichés
1. **ContractBadge** : Type de contrat (conception, maintenance, etc.)
2. **DeploymentBadge** : Statut de déploiement avec indicateur animé
3. **ClientBadge** : Nom du client avec icône
4. **TechBadge** : Technologies utilisées (limitées à 3 par défaut)

## Intégration dans ProjectCard

Les badges sont utilisés dans `DraggableProjectCard` :

```jsx
// Status badge
<Badge
  color={project.status}
  variant="subtle"
  size="sm"
  shape="rounded"
  icon={getStatusIcon(project.status)}
>
  {getStatusLabel(project.status)}
</Badge>

// Type badge
<Badge
  color={project.type}
  variant="subtle"
  size="sm"
  shape="rounded"
  icon={getTypeIcon(project.type)}
>
  {getTypeLabel(project.type)}
</Badge>
```

## Personnalisation

### Ajouter une nouvelle couleur
Dans `Badge.jsx`, ajouter un case dans le switch :

```javascript
case 'custom':
  bgColor = '#yourcolor';
  break;
```

### Créer une variante custom
Étendre le système de variantes :

```javascript
if ($variant === 'gradient') {
  return `
    background: linear-gradient(135deg, ${bgColor}, ${lighten(bgColor)});
    // ...
  `;
}
```

## Best Practices

1. **Cohérence** : Utiliser les mêmes couleurs pour les mêmes types d'information
2. **Taille** : `sm` pour les cards compactes, `md` pour l'affichage normal
3. **Icônes** : Toujours associer une icône pour améliorer la reconnaissance
4. **Contraste** : Vérifier la lisibilité en mode sombre/clair
5. **Performance** : Limiter le nombre de badges visibles (voir `showAll`)

## ComponentCatalog

Le Badge est disponible dans le ComponentCatalog avec panneau de contrôle interactif :
- Dropdown pour couleur, variant, size, shape
- Input pour texte et icône
- Preview en temps réel

## Migration

Pour migrer depuis l'ancien système :
```javascript
// Ancien
<ProjectStatus $status={project.status}>
  {project.status}
</ProjectStatus>

// Nouveau
<Badge color={project.status} size="sm" shape="rounded">
  {project.status}
</Badge>
```