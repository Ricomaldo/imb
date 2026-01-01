---
created: '2026-01-01'
updated: '2026-01-01'
status: active
type: documentation
---

# Inboxes - Communication Inter-Agents

## Principe

Système de communication asynchrone pour coordination projet IMB.

## Structure

- **[agent]-inbox.md** : 1 inbox par agent/composant
- **handoffs/** : Fichiers handoffs détaillés

## Agents IMB

- **Frontend** : React app (Vercel)
- **Companion** : PWA mobile
- **Sync** : GitHub Gist + encryption
- **MCP** : API endpoint (M2 futur)

## Workflow

1. Agent laisse message dans inbox
2. Cible lit message asynchrone
3. Respond dans handoffs/ ou inline
4. Archive après résolution

## Exemples

- `frontend-inbox.md` : Messages pour team frontend
- `sync-inbox.md` : Messages pour service sync
- `handoffs/` : Handoffs détaillés entre agents

---

*Dernière mise à jour : 2026-01-01*
