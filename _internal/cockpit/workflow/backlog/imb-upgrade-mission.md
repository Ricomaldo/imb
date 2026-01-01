---
created: '2026-01-01'
updated: '2026-01-01'
status: backlog
type: mission
milestone: M2
priority: high
parent_operation: IMB Main
depends_on: M1
---

# M2 — IMB Upgrade : MCP Endpoint + Sages Portal

## Objectif

Transformer IMB en source de vérité fiable accessible via API pour agents externes. Ajouter "Portail Sages" (Comptoir) pour communication avec Meridian et Eléonore.

## Contexte

**Prérequis** : M1 doit être complétée (Gist toujours frais)

IMB est actuellement isolée (données locales + Gist). Cette mission ouvre 2 directions :
1. **MCP Endpoint** : API Vercel Serverless qui lit le Gist → agents externes accèdent données IMB
2. **Sages Portal** : Nouvelle UI "Comptoir" pour discussions structurées

## Tâches

### A. MCP Endpoint IMB (Dépend de M1)

- [ ] A.1 : Créer fonction Vercel Serverless `/api/imb-gist` (GET)
  - Authentification : API key ou GitHub Gist token
  - Retourne : Gist content (parsé JSON)
  - Caching : 5min avec revalidate tag

- [ ] A.2 : Documenter schema réponse API
  - Structure des 5 stores + métadonnées (last_sync, version)
  - Format d'erreur standardisé (P0/P1/P2 errors)

- [ ] A.3 : Tester avec MCP client (local + staging)
  - Latence < 200ms
  - Reliability 99.9%

### B. Comptoir = Portail Sages

- [ ] B.1 : Créer composant `ComptirRoom`
  - Layout : 3 colonnes (Sages en ligne, conversation principale, actions panel)
  - Sages profilés : Meridian, Eléonore, Autres TBD

- [ ] B.2 : Implémenter conversation thread
  - Messages structurés (timestamp, speaker, context, actions)
  - Markdown support
  - Thread pinning / archiving

- [ ] B.3 : Intégrer avec `useDiaryStore` pour archivage
  - Discussions > monthly archives
  - Searchable par period/sage

### C. iOS/macOS Notifications (PWA Push)

- [ ] C.1 : Implémenter Service Worker notifications
  - Déclencheurs : nouveau message Sages, alerte sync
  - Permission check au first launch

- [ ] C.2 : Tester sur iOS/macOS avec PWA

### D. Protocole Zone Rouge (Future)

- [ ] D.1 : Définir "Zone Rouge" = données sensibles
  - Critères : identifiants, secrets, données santé sensibles
  - Encryption layer séparé (optionnel dans M2)

### E. Diary Upgrade — Amorces Cathartiques

- [ ] E.1 : Ajouter structure "Amorces Cathartiques" dans Diary
  - Templates pour journaling émotionnel
  - Lien avec Moments OUI (Sanctuaire)

- [ ] E.2 : Archivage mensuel automatisé

## Critères de Succès

- ✅ MCP Endpoint accessible et répond < 200ms
- ✅ Comptoir affiche Sages profil + conversation thread
- ✅ Messages Sages archivés en monthly logs
- ✅ Notifications PWA fonctionnent iOS/macOS
- ✅ Protocole Zone Rouge documenté
- ✅ Diary templates ajoutés et fonctionnels

## Blocages

[À documenter]

## Learnings

[À completer lors de l'exécution]

## Notes

- **Dépendance** : Ne peut commencer que si M1 terminée (Gist sync stable)
- **Sages identité** : Meridian (analyste), Eléonore (mentor) — personas TBD dans zone docs
- **Architecture** : MCP endpoint peut être versioned (v1 → v2 future)
- **Privacy** : Gist est publique par défaut, évaluer stockage sensible

---

*Dernière mise à jour : 2026-01-01*
