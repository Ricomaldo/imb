# 📱 IMB Companion - Guide de Démarrage Rapide

## Vue d'Ensemble

**IMB Companion** est l'interface mobile optimisée de IRIMMetaBrain, permettant d'accéder à vos mantras, notes et synchronisation en déplacement.

## Accès

- **URL Desktop** : `http://localhost:5173/`
- **URL Mobile** : `http://localhost:5173/companion`

## Fonctionnalités MVP

### 🏠 Home
- **Mantras** : Carrousel de citations inspirantes
- **Journal** : Diary avec historique

### 💡 Dev Notes
- Éditeur Markdown complet
- Sauvegarde automatique en LocalStorage
- Synchronisation Gist (via Settings)

### ⚒️ Atelier
- Placeholder pour Phase 2
- Fonctionnalités futures : Todo, MindLog, Roadmap

### ⚙️ Settings
- **Synchronisation** : Configuration GitHub Gist
- **Infos App** : Version, plateforme, stockage
- **État** : Dernière synchronisation

## Installation PWA

### Sur iOS (Safari)
1. Accéder à `/companion`
2. Appuyer sur le bouton "Partager" (icône carré avec flèche)
3. Sélectionner "Sur l'écran d'accueil"
4. Confirmer

### Sur Android (Chrome)
1. Accéder à `/companion`
2. Menu ⋮ → "Ajouter à l'écran d'accueil"
3. Confirmer

## Architecture Technique

### Stack
- **React 19** + Vite
- **React Router** v6 (routing `/companion/*`)
- **Styled Components** (thème réutilisé)
- **Zustand** (store `companionNotes`)

### Composants Réutilisés
- `QuoteCarousel` (widgets)
- `Diary` (widgets)
- `MarkdownEditor` (common)
- `Button` (common)
- `Modal` système (via `useModal`)

### Store Extension

```javascript
// useNotesStore.js
companionNotes: {
  devNote: string,
  lastSync: ISO 8601 timestamp
}

// Actions
updateCompanionNote(key, value)
getCompanionNote(key)
```

### Routes

```
/                     → Desktop (StudioHall)
/companion            → Mobile Companion
/companion/home       → Home (Mantras + Diary)
/companion/atelier    → Atelier (Placeholder)
/companion/dev        → Dev Notes (MarkdownEditor)
/companion/settings   → Settings (Sync + Infos)
```

## Synchronisation Gist

1. Accéder à **Settings** (`/companion/settings`)
2. Cliquer sur "Configurer la synchronisation"
3. Modal SyncModal s'ouvre (réutilisé de desktop)
4. Entrer GitHub Personal Access Token
5. Entrer mot de passe chiffrement (min 8 caractères)
6. Export/Import via Gist

Les notes `companionNotes` sont incluses dans l'export complet.

## Développement

### Démarrer le serveur
```bash
npm run dev
```

### Tester mobile en local
1. Trouver IP locale : `ifconfig` (macOS) ou `ipconfig` (Windows)
2. Sur mobile, accéder à `http://<IP>:5173/companion`
3. Exemple : `http://192.168.1.100:5173/companion`

### Mode responsive
Le navigateur desktop permet de tester le mode responsive :
- Chrome DevTools : Cmd+Shift+M (macOS)
- Firefox : Cmd+Opt+M (macOS)

## Limitations MVP

### Phase 1 (Actuelle - 2h)
✅ Routing + Layout mobile
✅ Tab bar navigation
✅ Page Home (Mantras + Diary)
✅ Page Dev (Notes markdown)
✅ Page Settings (Sync Gist)
✅ Store extension `companionNotes`
✅ PWA manifest + meta tags

### Phase 2 (Future)
⏳ Atelier complet (Todo, MindLog, Actions)
⏳ Optimisation assets mobile (lazy loading, WebP)
⏳ Service Worker offline
⏳ Push notifications
⏳ Détection automatique mobile → redirect

## Fichiers Créés

```
src/
├── hooks/
│   └── useDeviceDetect.js          # Hook détection mobile
├── companion/
│   ├── CompanionApp.jsx            # Layout principal
│   ├── components/
│   │   └── TabBar.jsx              # Navigation bottom
│   └── pages/
│       ├── HomePage.jsx            # Home (Mantras + Diary)
│       ├── DevPage.jsx             # Dev Notes
│       ├── AtelierPage.jsx         # Placeholder
│       └── SettingsPage.jsx        # Settings + Sync

public/
├── manifest.json                   # PWA manifest
├── icon-192.svg                    # Icône PWA 192×192
└── icon-512.svg                    # Icône PWA 512×512
```

## Fichiers Modifiés

- `src/App.jsx` : Routing React Router + routes `/companion/*`
- `src/stores/useNotesStore.js` : Extension `companionNotes` + actions
- `src/stores/defaultData.js` : Données initiales `companionNotes`
- `index.html` : Meta tags PWA + viewport mobile
- `package.json` : Ajout `react-router-dom`

## Prochaines Étapes

1. **Tester en conditions réelles** : Installer PWA sur smartphone
2. **Configurer Gist** : Tester synchronisation complète
3. **Enrichir Dev Notes** : Capturer idées en déplacement
4. **Feedback UX** : Identifier améliorations Phase 2

## Support

Pour toute question ou bug :
1. Vérifier console navigateur (erreurs JS)
2. Vérifier LocalStorage : DevTools → Application → Local Storage
3. Tester sync Gist via desktop d'abord (interface complète)

---

**Version** : 1.0.0-mvp
**Temps développement** : ~2h
**Compatibilité** : iOS 12+, Android 5+, navigateurs modernes
