# 📐 IMB Companion - Documentation Architecture

## Vue d'Ensemble

IMB Companion est une **interface mobile parallèle** au desktop IRIMMetaBrain, conçue pour une utilisation nomade optimisée.

## Principes de Conception

### 1. Réutilisation Maximale
- **Composants existants** : QuoteCarousel, Diary, MarkdownEditor, Button, Modal
- **Store Zustand** : Extension légère (`companionNotes`) sans duplication
- **Theme** : Réutilisation complète du système de design

### 2. Architecture Parallèle
```
Desktop (/):                  Mobile (/companion):
├── StudioHall               ├── CompanionApp
│   ├── RoomCanvas           │   ├── HomePage
│   └── SideTower            │   ├── DevPage
│                            │   ├── AtelierPage
│                            │   └── SettingsPage
│                            └── TabBar (navigation)
```

### 3. Isolation des Contextes
- **Routing séparé** : `/` vs `/companion/*`
- **Layout dédié** : CompanionApp vs StudioHall
- **Navigation** : TabBar vs NavigationArrows
- **Store partagé** : Synchronisation transparente

## Flux de Données

### Store Zustand (useNotesStore)

```javascript
// Structure complète
{
  roomNotes: { chambre: '', atelier: '', ... },      // Desktop
  sideTowerNotes: { general: '' },                   // Desktop
  companionNotes: {                                  // Mobile
    devNote: '',
    lastSync: ISO 8601
  }
}

// Actions Companion
updateCompanionNote(key, value)  // Mise à jour + timestamp
getCompanionNote(key)             // Lecture
```

### Synchronisation Gist

```
Desktop                           Gist Cloud                    Mobile
   ↓                                  ↓                           ↓
exportNotes() ──────────────> Upload chiffré ←────────────── exportNotes()
                                     ↓
importData()  <────────────── Download + decrypt ───────────> importData()
   ↓                                                            ↓
All stores updated                                      All stores updated
```

**Inclusion automatique** : `companionNotes` dans l'export/import complet

## Navigation Mobile

### Tab Bar Architecture

```
TabBarContainer (fixed bottom, z-index navigation)
├── TabButton (Home)      → /companion/home
├── TabButton (Atelier)   → /companion/atelier
├── TabButton (Dev)       → /companion/dev
└── TabButton (Settings)  → /companion/settings
```

**Indicateur actif** : Barre dorée top + couleur accentuée

### Routing Structure

```javascript
<BrowserRouter>
  <Routes>
    {/* Desktop */}
    <Route path="/" element={<StudioHall />} />

    {/* Mobile Companion */}
    <Route path="/companion/*" element={<CompanionApp />}>
      <Route path="home" />
      <Route path="atelier" />
      <Route path="dev" />
      <Route path="settings" />
    </Route>
  </Routes>
</BrowserRouter>
```

## Pages Détaillées

### HomePage (`/companion/home`)

**Composants** :
- `QuoteCarousel` (mantras/quotes aléatoires)
- `Diary` (journal quotidien)

**Layout** :
```
┌─────────────────────────┐
│  🏠 IMB Companion       │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ QuoteCarousel       │ │
│ │ (Mantras)           │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Diary               │ │
│ │ (Journal)           │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### DevPage (`/companion/dev`)

**Composants** :
- `MarkdownEditor` (fullscreen, variant embedded)

**Store** :
- Lecture : `companionNotes.devNote`
- Écriture : `updateCompanionNote('devNote', value)`

**Features** :
- Markdown GitHub Flavored
- Sauvegarde auto LocalStorage
- Sync Gist manuel

### AtelierPage (`/companion/atelier`)

**État actuel** : Placeholder Phase 2

**Roadmap Phase 2** :
- Todo list (réutiliser `ActionList`)
- MindLog compact (réutiliser `MindLogCompact`)
- Roadmap projet actif (nouveau widget mobile)

### SettingsPage (`/companion/settings`)

**Sections** :
1. **Synchronisation** :
   - Bouton "Configurer" → ouvre `SyncModal` (desktop)
   - État dernier sync
   - Badge status

2. **Application** :
   - Version MVP
   - Mode Companion
   - Détection plateforme

3. **Stockage** :
   - Type : LocalStorage
   - Description persistance

## PWA Configuration

### Manifest (`public/manifest.json`)

```json
{
  "name": "IMB Companion",
  "start_url": "/companion",
  "display": "standalone",
  "scope": "/companion",
  "orientation": "portrait-primary"
}
```

**Shortcuts** :
- Home (`/companion/home`)
- Dev Notes (`/companion/dev`)
- Settings (`/companion/settings`)

### Meta Tags (`index.html`)

```html
<!-- Viewport mobile optimisé -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

<!-- PWA -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#8B4513" />

<!-- iOS -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

## Responsive Design

### Breakpoint Mobile

```javascript
// useDeviceDetect.js
isMobile = window.innerWidth < 768px
```

**Usage** : Détection optionnelle pour redirect/notifications

### Layout Mobile

```javascript
// CompanionApp.jsx
display: flex;
flex-direction: column;
height: 100vh;

ContentArea {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; // Tab bar space
}

TabBar {
  position: fixed;
  bottom: 0;
  height: 64px;
}
```

## Performance

### Bundle Optimization

**Stratégie actuelle (MVP)** :
- Réutilisation widgets desktop → **Pas de duplication code**
- Lazy loading routes → **React Router code splitting**

**Phase 2** :
- Assets WebP pour images
- Service Worker cache agressif
- Virtualization longues listes

### Store Persistence

```javascript
// Zustand persist middleware
{
  name: 'irim-notes-store',
  version: 1,
  migrate: (persistedState, version) => { ... }
}
```

**Avantages** :
- Sync transparent desktop ↔ mobile
- Migration automatique versions futures
- Backup localStorage natif

## Sécurité

### Gist Sync Encryption

**Flow** :
1. User entre password (min 8 chars)
2. Chiffrement AES-256 via `SyncManager`
3. Upload Gist chiffré
4. Download + déchiffrement local

**Important** : Password jamais stocké, dérivation PBKDF2

### LocalStorage

**Données stockées** :
- `irim-notes-store` (notes chiffrées si sync activée)
- `last-sync` (timestamp ISO 8601)
- `irim-initialized` (flag première utilisation)

## Extension Future

### Phase 2 Roadmap

**Atelier complet** :
```javascript
// Nouvelles clés store
companionNotes: {
  devNote: '',
  todo: [],
  mindlog: [],
  lastSync: ''
}
```

**Nouveaux widgets** :
- `TodoCompact` (liste simple)
- `MindLogMobile` (capture rapide humeur)
- `RoadmapMini` (timeline projet actif)

### PWA Advanced

**Service Worker** :
```javascript
// Cache strategy
- Stale-while-revalidate: UI components
- Network-first: API Gist
- Cache-first: Assets statiques
```

**Offline Mode** :
- Queue sync requests
- Background sync API
- Conflict resolution UI

## Migration Guide

### Ajout nouvelle page Companion

1. **Créer page** : `src/companion/pages/NewPage.jsx`
2. **Ajouter route** : `CompanionApp.jsx`
3. **Ajouter tab** : `TabBar.jsx` (icône + path)
4. **Étendre store** (si nécessaire) : `useNotesStore.js`

### Réutiliser widget desktop

```javascript
// HomePage.jsx
import WidgetDesktop from '../../components/widgets/WidgetDesktop';

<WidgetDesktop
  compact={true}        // Mode mobile
  variant="embedded"    // Style intégré
/>
```

## Tests Recommandés

### Checklist MVP

- [ ] Navigation TabBar fonctionne
- [ ] HomePage affiche Mantras + Diary
- [ ] DevPage sauvegarde notes LocalStorage
- [ ] SettingsPage ouvre SyncModal
- [ ] PWA installable sur iOS/Android
- [ ] Routing `/` et `/companion` isolés
- [ ] Store `companionNotes` persiste
- [ ] Sync Gist inclut `companionNotes`

### Tests Device

- iPhone 12+ (Safari)
- Android 10+ (Chrome)
- iPad (Safari)
- Desktop responsive mode

## Dépendances

### Nouvelles (Phase 1)
```json
{
  "react-router-dom": "^6.30.1"
}
```

### Réutilisées Desktop
- React 19
- Zustand + persist
- Styled Components
- Crypto-js (Gist encryption)

## Métriques Développement

**Temps Phase 1** : ~2h
- Routing + hooks : 30min
- TabBar + layout : 30min
- Pages (4) : 40min
- Store + PWA : 20min

**Fichiers créés** : 9
**Fichiers modifiés** : 4
**Lignes code** : ~800 (hors docs)

## Conclusion

IMB Companion démontre une **architecture extensible** permettant d'ajouter une interface mobile complète en **réutilisant au maximum** l'infrastructure desktop existante.

**Principes clés** :
✅ Isolation contextes (routing séparé)
✅ Réutilisation composants
✅ Store unique partagé
✅ PWA standard moderne
✅ Synchronisation transparente

**Résultat** : Interface mobile native en **2h** sans compromettre l'expérience desktop.
