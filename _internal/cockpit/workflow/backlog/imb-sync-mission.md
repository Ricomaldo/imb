---
created: '2026-01-01'
updated: '2026-01-01'
status: active
type: mission
milestone: M1
priority: high
parent_operation: IMB Main
---

# M1 — IMB Sync : Auto-export Gist

## Objectif

Éliminer la friction Export/Import manuel. L'IMB sauvegarde automatiquement vers le Gist après modifications (debounce 30s), avec feedback UI visuel.

## Contexte

Actuellement, l'export/import du Gist est manuel via boutons. Cela crée de la friction et risque d'incohérence entre l'état local et le Gist. Cette mission automatise le flux pour que tout changement dans les 5 stores soit sauvegardé automatiquement.

**Dépendance pour Mission 2** (IMB Upgrade): Le Gist doit être frais en continu pour le MCP Endpoint.

## Tâches

### Phase A : Auto-export (Debounce)

- [ ] A.1 : Implémenter listener debounce (30s) sur mutations stores
  - Utiliser `useShallow()` de Zustand pour tracking changements
  - Appliqué à : useNotesStore, useProjectMetaStore, useProjectDataStore, useDiaryStore, usePreferencesStore

- [ ] A.2 : Créer fonction `autoSyncToGist()` dans SyncManager.js
  - Réutiliser logique export existante (refactor si nécessaire)
  - Ajouter gestion erreurs silencieuse (log warning, retry 1x après 5s)

- [ ] A.3 : Intégrer debounce dans composants racine (App.tsx / StudioHall)
  - Lancer le listener au mount
  - Cleanup au unmount

### Phase B : Indicateur Sync UI

- [ ] B.1 : Créer hook `useSyncStatus()` avec états : "synced" | "syncing" | "offline" | "error"
  - State global dans usePreferencesStore (ou nouveau micro-store)

- [ ] B.2 : Implémenter composant `SyncIndicator`
  - Position : coin supérieur droit (Atelier principal)
  - Icônes/labels : "✓ Synced", "⟳ Syncing...", "⚠ Offline", "✗ Error"
  - Animation: pulse quand syncing

- [ ] B.3 : Intégrer dans autoSyncToGist()
  - Trigger "syncing" avant requête
  - Trigger "synced" après succès (300ms delay pour visibilité)
  - Trigger "offline"/"error" si échec

### Phase C : Auto-import (Phase 2, NOT MVP)

- [ ] C.1 : Implémenter polling/WebSocket listener sur Gist (future)
- [ ] C.2 : Sync bidirectionnel si conflit détecté

## Critères de Succès

- ✅ Auto-export déclenché après 30s inactivité
- ✅ Tous les 5 stores triggent export si modifiés
- ✅ SyncIndicator visible et met à jour en temps réel
- ✅ Aucune erreur silencieuse (logging présent)
- ✅ Gist reflète l'état local dans les 35s max
- ✅ Offline handling (cache local, retry au reconnect)
- ✅ Tests manuels réussis sur web + companion

## Blocages

[À documenter si rencontrés]

## Learnings

[À completer lors de l'exécution]

## Notes

- **Stores impliqués** :
  - useNotesStore (notes par pièce)
  - useProjectMetaStore (métadonnées projets)
  - useProjectDataStore (roadmap, todo, mindlog, actions)
  - useDiaryStore (journal + archives mensuelles)
  - usePreferencesStore (UI states)

- **SyncManager.js** : Fichier existant qui contient la logique Gist (réutiliser `exportToGist()`)

- **Companion** : Le pattern mobile doit aussi tripper le debounce (shared Zustand stores)

- **Sécurité** : AES-256 encryption déjà en place, inchangé

---

*Dernière mise à jour : 2026-01-01*
