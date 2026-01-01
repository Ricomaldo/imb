---
type: guide
updated: 2025-09-18
---

# 🚀 Système Auto-Documentation IRIMMetaBrain

> Workflow ultra-rapide pour capturer, organiser et indexer tes pensées

## Vue d'ensemble

Système en 3 étapes pour transformer le chaos créatif en documentation structurée :

```
Pensée brute → Devlog (capture) → Docs officiels (promote) → Index auto (index)
```

## 📝 Commandes Essentielles

### 1. Capture instantanée
```bash
npm run doc:capture "N'importe quelle idée qui passe"
```
- Ajoute automatiquement dans `devlog/YYYY-MM-DD.md`
- Timestamp précis (HH:MM)
- Titre auto-généré des 5 premiers mots

### 2. Promotion vers docs
```bash
npm run doc:promote devlog/2025-09-18.md architecture/pattern.md
```
- Nettoie les timestamps
- Ajoute front-matter (type, updated)
- Classe dans la bonne catégorie

### 3. Index automatique
```bash
npm run doc:index
```
- Scanne tous les `docs/**/*.md`
- Génère `docs/README.md` avec liens
- Groupe par catégories

## 🧠 Workflow TDA/H Optimisé

### Usage personnel (terminal)
```bash
# Pensée instantanée
npm run doc:capture "Bug bizarre avec le localStorage qui garde les anciennes valeurs"

# Plus tard, quand tu organises
npm run doc:promote devlog/2025-09-18.md decisions/localstorage-fix.md

# Voir toute ta doc
npm run doc:index
```

### Usage avec Claude/IA
Tu peux dire :
- **"Capture ça :"** → L'IA utilise `doc:capture`
- **"Documente ce pattern"** → Capture puis propose promotion
- **"Prends des notes"** → Capture au fur et à mesure
- **"Transforme en doc officielle"** → Utilise `doc:promote`
- **"Update l'index"** → Lance `doc:index`

## 📁 Structure Générée

```
devlog/
├── 2025-09-18.md       # Notes brutes du jour avec timestamps
└── 2025-09-17.md       # Notes d'hier

docs/
├── README.md           # Index auto-généré
├── architecture/       # Patterns et vision
├── decisions/          # ADR et choix techniques
├── guides/            # Tutoriels et how-to
├── specs/             # Spécifications
└── milestones/        # Jalons du projet
```

## ⚡ Points Forts

- **Zero friction** : Une commande = une capture
- **Chronologique** : Tout est horodaté
- **Flexible** : Du chaos vers l'ordre progressivement
- **IA-friendly** : Structure claire pour agents
- **Léger** : 3 scripts < 50 lignes chacun

## 🔧 Architecture Technique

### doc-capture.js
- Input : Texte via args
- Process : Append avec timestamp
- Output : `devlog/YYYY-MM-DD.md`

### doc-promote.js
- Input : Source + destination
- Process : Clean + front-matter + move
- Output : `docs/{category}/{file}.md`

### doc-index.js
- Input : Scan `docs/**/*.md`
- Process : Parse + group + generate
- Output : `docs/README.md` mis à jour

## 💡 Tips & Tricks

1. **Capture tout** : Mieux vaut trop que pas assez
2. **Promote sélectivement** : Seules les notes utiles
3. **Index régulièrement** : Après chaque session
4. **Commit devlog/** : C'est ton historique de pensée

## Exemples Concrets

```bash
# Capturer un bug découvert
npm run doc:capture "Bug: les flèches clavier interfèrent avec l'éditeur markdown"

# Capturer une idée de feature
npm run doc:capture "Idée: ajouter un mode zen qui cache tous les panneaux"

# Documenter une solution
npm run doc:capture "Solution localStorage: faire clear() puis reload pour reset"

# Promouvoir après réflexion
npm run doc:promote devlog/2025-09-18.md decisions/keyboard-navigation.md
```

---

*Système conçu pour le meta-cerveau spatial TDA/H - Capture instantanée, organisation progressive*