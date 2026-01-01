# 🤝 Guide de Contribution - Documentation IRIMMetaBrain

> Comment contribuer efficacement à la documentation du meta-cerveau spatial

**Version :** 3.0.0
**Dernière mise à jour :** 1er octobre 2025

## 🎯 Vue d'Ensemble

Cette documentation suit une **architecture modulaire** reflétant l'architecture technique d'IRIMMetaBrain v3.0. Chaque contribution doit respecter les standards établis pour maintenir la cohérence.

## 📁 Structure Documentation

```
docs/
├── README.md                    # 🏠 Navigation principale
├── CONTRIBUTING.md              # 🤝 Ce guide
├── COMPANION_ARCHITECTURE.md    # 📱 Architecture mobile
├── AI-cheatsheet.md            # 🤖 Guide IA
├── architecture/               # 🏗️ Documentation technique
│   ├── stores-architecture.md   # Multi-stores Zustand
│   ├── security-system.md      # Système sécurité symbolique
│   ├── component-organization.md
│   ├── folder-structure.md
│   ├── project-vision.md
│   └── theme-management.md
├── decisions/                  # 📋 ADR (Architecture Decision Records)
│   ├── README.md               # Index ADR
│   ├── ADR-006-sync-ultra-simple.md
│   ├── ADR-007-mobile-companion.md
│   ├── ADR-008-securite-symbolique.md
│   └── ...
├── guides/                     # 📖 Guides utilisateur
│   ├── environment-setup.md    # Variables d'environnement
│   ├── sync-system.md          # Synchronisation v3.0
│   ├── dev-tools.md            # Outils de développement
│   ├── data-flow-guide.md      # Architecture données
│   └── ...
├── specs/                      # 🎯 Spécifications
└── milestones/                 # 🚀 Jalons projet
```

## 📝 Standards Documentation

### Front Matter Obligatoire

Chaque fichier documentation doit commencer par :

```yaml
---
type: architecture|guide|decision|spec
updated: YYYY-MM-DD
version: X.Y (optionnel)
---
```

### Format Titres

```markdown
# 📚 Titre Principal avec Emoji

> Description concise en italique

**Version :** X.Y.Z
**Type :** Type de document

## 🎯 Section avec Emoji Descriptif
### Sous-section sans emoji
#### Détail sans emoji
```

### Liens Internes

**Toujours utiliser des chemins relatifs :**

```markdown
✅ Correct:
- [Architecture Stores](../architecture/stores-architecture.md)
- [Guide Sync](sync-system.md)

❌ Incorrect:
- [Stores](/docs/architecture/stores-architecture.md)
- [Guide](https://example.com/docs/sync-system.md)
```

## 🏗️ Types de Documentation

### 1. Architecture (`architecture/`)

**Objectif :** Documentation technique des systèmes

**Format type :**
```markdown
# 🏗️ Nom du Système - IRIMMetaBrain

> Description système avec contexte architectural

## Vue d'ensemble
## Architecture Technique
## Composants Principaux
## Flow de Données
## Performance & Optimisation
## Évolutions Futures
## Liens Connexes
```

**Exemples :**
- `stores-architecture.md` - Multi-stores Zustand
- `security-system.md` - Protection symbolique

### 2. ADR - Décisions (`decisions/`)

**Objectif :** Traçabilité décisions architecturales

**Format obligatoire :**
```markdown
---
type: decision
updated: YYYY-MM-DD
---

# ADR-XXX: Titre de la Décision

**Date :** DD mois YYYY
**Status :** Accepté|Rejeté|Superseded
**Auteurs :** @username + collaborateurs

## Contexte
## Décision
## Alternatives Considérées
## Conséquences
## Implémentation
## Liens
```

**Numérotation :** Format ADR-XXX avec XXX incrémental

### 3. Guides (`guides/`)

**Objectif :** Documentation utilisateur pratique

**Format type :**
```markdown
# 📖 Guide Pratique - Fonctionnalité

> Objectif utilisateur concret

## Setup Rapide (X minutes)
## Configuration Détaillée
## Usage Quotidien
## Dépannage
## Évolutions
```

**Exemples :**
- `environment-setup.md` - Variables d'environnement
- `sync-system.md` - Synchronisation

### 4. Spécifications (`specs/`)

**Objectif :** Documentation technique détaillée

**Format type :**
```markdown
# 🎯 Spécification Technique

## API Reference
## Props & Types
## Exemples d'Usage
## Edge Cases
```

## 🔄 Workflow Contribution

### 1. Mise à Jour Documentation Existante

```bash
# 1. Lire le document à mettre à jour
# 2. Modifier avec les nouvelles informations
# 3. Mettre à jour le front matter `updated`
# 4. Vérifier liens internes
# 5. Commit avec message descriptif
```

### 2. Création Nouveau Document

```bash
# 1. Choisir le bon dossier selon le type
# 2. Utiliser le template approprié
# 3. Nommer avec convention cohérente
# 4. Ajouter liens dans README.md principal
# 5. Ajouter liens croisés si pertinent
```

### 3. Création ADR

```bash
# 1. Obtenir prochain numéro ADR
# 2. Utiliser template ADR obligatoire
# 3. Documenter alternatives considérées
# 4. Ajouter dans decisions/README.md
# 5. Lier depuis documentation connexe
```

## 📋 Checklist Contribution

### ✅ Avant Commit

- [ ] **Front matter** présent et correct
- [ ] **Liens internes** testés (chemins relatifs)
- [ ] **Emojis cohérents** avec standards existants
- [ ] **Structure** respecte les templates
- [ ] **Orthographe** vérifiée
- [ ] **Navigation** mise à jour (README.md si nouveau doc)

### ✅ ADR Spécifique

- [ ] **Numérotation** séquentielle correcte
- [ ] **Status** défini clairement
- [ ] **Alternatives** documentées
- [ ] **Conséquences** équilibrées (✅⚠️🔄)
- [ ] **Index ADR** mis à jour

### ✅ Architecture/Guides

- [ ] **Code examples** testés
- [ ] **Screenshots** à jour si UI
- [ ] **Versions** logiciels correctes
- [ ] **Liens croisés** ajoutés

## 🛠 Outils et Commandes

### Scripts Documentation

```bash
# Capturer une pensée rapide
npm run doc:capture "Idée amélioration sync"

# Promouvoir devlog vers doc officielle
npm run doc:promote devlog/2025-10-01.md guides/new-feature.md

# Régénérer index principal
npm run doc:index
```

### Validation Liens

```bash
# Vérifier tous les liens markdown
find docs -name "*.md" -exec grep -l "\[.*\](" {} \;

# Tester existence fichiers liés
# (manuel pour l'instant)
```

### Preview Local

```bash
# Serveur de développement
npm run dev

# Documentation accessible via /docs dans l'app
# Ou directement dans IDE avec preview markdown
```

## 🎨 Standards Visuels

### Emojis Conventionnels

```
🏗️ Architecture/Technique
📋 ADR/Décisions
📖 Guides/Documentation
🎯 Spécifications/Objectifs
🔧 Configuration/Setup
🔄 Workflows/Processus
📱 Mobile/Companion
🛡️ Sécurité
⚡ Performance
🚀 Déploiement/Release
🐛 Debug/Dépannage
💡 Conseils/Tips
⚠️ Attention/Warnings
✅ Validé/Testé
❌ Incorrect/Éviter
```

### Code Blocks

```markdown
# Configuration avec langage
\`\`\`bash
npm install
\`\`\`

\`\`\`javascript
// Code JavaScript avec commentaires
const example = () => {}
\`\`\`

# Inline code
Utiliser \`variableName\` pour référencer
```

### Diagrammes

```markdown
# Mermaid pour flows
\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`

# ASCII simple pour structures
\`\`\`
src/
├── components/
└── stores/
\`\`\`
```

## 🔗 Liens et Références

### Documentation de Référence

- **[📚 README Principal](README.md)** - Navigation complète
- **[📋 Index ADR](decisions/README.md)** - Toutes les décisions
- **[🏗️ Architecture Stores](architecture/stores-architecture.md)** - Système état
- **[📱 Mobile Companion](COMPANION_ARCHITECTURE.md)** - Interface mobile

### Ressources Externes

- **[Architecture Decision Records](https://adr.github.io/)** - Format ADR standard
- **[Mermaid Diagrams](https://mermaid-js.github.io/)** - Syntaxe diagrammes
- **[Markdown Guide](https://www.markdownguide.org/)** - Référence Markdown

---

## 🤝 Comment Contribuer

### 1. Pour les Développeurs

**Vous implémentez une nouvelle feature ?**
1. Créer un ADR pour documenter la décision
2. Mettre à jour les guides utilisateur impactés
3. Ajouter debug commands si applicable

### 2. Pour la Documentation

**Vous améliorez la doc ?**
1. Identifier le type de document (architecture/guide/ADR)
2. Suivre le template approprié
3. Vérifier la cohérence avec l'existant
4. Tester tous les liens

### 3. Pour les Nouvelles Architectures

**Vous ajoutez un système majeur ?**
1. ADR obligatoire avec alternatives
2. Documentation architecture technique
3. Guide utilisateur pratique
4. Mise à jour README navigation

---

**Questions ?** Consultez les exemples existants ou créez une issue pour clarification.

**Mainteneurs :** IRIM Team
**Standards Version :** 3.0.0