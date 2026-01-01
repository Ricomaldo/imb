---
created: '2026-01-01'
updated: '2026-01-01'
status: active
type: documentation
---

# Projets Satellites (_external/)

## Principe

Le dossier `_external/` regroupe les projets satellites liés à IMB mais maintenus séparément.

**Règles** :
- Chaque satellite a son propre dossier `_nom-satellite_/`
- Chaque satellite peut avoir son propre git repo (symlink ou submodule)
- Les satellites ne font PAS partie du produit principal
- Préfixe `_nom_` pour distinguer des dossiers normaux

---

## Structure Possible IMB

```
_external/
├── _companion_/          # PWA mobile (symlink → ../IMB-companion)
├── _analytics_/          # Dashboard analytics futur
└── _mcp-endpoint_/       # MCP API (Vercel serverless)
```

---

## Exemples de Satellites pour IMB

### _companion_
- React Native / Expo app
- Tech : React Native + Zustand (same stores)
- Lifecycle : Beta actuellement
- Localisation : ~/dev/apps/IMB-companion

### _analytics_
- Dashboard Mixpanel/usage
- Tech : Next.js + Recharts
- Lifecycle : Futur (M2+)

### _mcp-endpoint_
- Vercel serverless API
- Tech : Node.js + AES-256
- Lifecycle : M2 (futur)

---

## Conventions

- Nommage : `_nom-satellite_/` (kebab-case + underscores)
- Chaque satellite a son README.md
- Chaque satellite peut avoir son CLAUDE.md
- Symlinks ou submodules recommandés pour repos séparés

---

## Quand Ajouter Satellite ?

**Ajouter satellite si** :
- ✅ Projet lié mais indépendant (propre lifecycle)
- ✅ Tech stack différent d'IMB principal
- ✅ Peut vivre indépendamment
- ✅ Nécessite son propre git repo

---

*Dernière mise à jour : 2026-01-01*
