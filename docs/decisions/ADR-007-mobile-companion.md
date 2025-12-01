---
type: decision
updated: 2025-10-01
---

# ADR-007: Architecture Mobile Companion PWA

**Date :** 1er octobre 2025
**Status :** Accepté
**Auteurs :** @Ricomaldo + Claude

## Contexte

IRIMMetaBrain était initialement conçu comme une interface desktop spatiale immersive (NavigationGrid 4x3, RoomCanvas). Le besoin d'accès mobile nomade s'est imposé pour :
- **Capture rapide** : Notes techniques en déplacement
- **Journal quotidien** : Diary et mantras hors bureau
- **Sync cross-device** : Cohérence données desktop ↔ mobile
- **PWA native** : Installation écran d'accueil iOS/Android

**Contrainte :** Éviter la duplication de code et maintenir la cohérence stores.

## Décision

### Architecture Parallèle PWA

**Principe :** Interface mobile autonome partageant les mêmes stores Zustand

```
🖥️ Desktop (/)               📱 Mobile (/companion)
├── StudioHall               ├── CompanionApp
│   ├── NavigationGrid       │   ├── HomePage (🏠)
│   ├── RoomCanvas            │   ├── AtelierPage (🔧)
│   └── SideTower            │   ├── DevPage (💻)
└── ControlTower             │   └── SettingsPage (⚙️)
                             └── TabBar (navigation)
```

### Routing Isolation
```javascript
<BrowserRouter>
  <Routes>
    {/* Desktop - Interface spatiale */}
    <Route path="/" element={
      <AccessGate><StudioHall /></AccessGate>
    } />

    {/* Mobile - Interface TabBar */}
    <Route path="/companion/*" element={
      <AccessGate><CompanionApp /></AccessGate>
    }>
      <Route path="home" element={<HomePage />} />
      <Route path="atelier" element={<AtelierPage />} />
      <Route path="dev" element={<DevPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### Stores Partagés (Zero Duplication)
```javascript
// 5 stores Zustand partagés desktop ↔ mobile
useNotesStore          // Notes rooms + companionNotes.devNote
useProjectMetaStore    // Métadonnées projets
useProjectDataStore    // Données par projet (dynamique)
useDiaryStore          // Journal personnel + mindlog
usePreferencesStore    // Préférences UI + états panels
```

### PWA Configuration
```json
{
  "name": "IRIM MetaBrain Companion",
  "start_url": "/companion",
  "display": "standalone",
  "scope": "/companion",
  "orientation": "portrait-primary",
  "theme_color": "#8B4513"
}
```

## Alternatives Considérées

### Alternative 1: Responsive Unique
- **Avantages :** Une seule interface, maintenance simplifiée
- **Inconvénients :** UX compromise mobile, navigation complexe
- **Rejeté :** NavigationGrid inadaptée mobile

### Alternative 2: App Native Séparée
- **Avantages :** Performance native, features OS
- **Inconvénients :** Duplication code, maintenance 2x, stores séparés
- **Rejeté :** Complexité excessive pour MVP

### Alternative 3: Iframe Embedded
- **Avantages :** Réutilisation composants facile
- **Inconvénients :** Performance, communication complexe, sécurité
- **Rejeté :** Anti-pattern moderne

### Alternative 4: Web Components
- **Avantages :** Encapsulation, réutilisabilité
- **Inconvénients :** Complexité intégration, états partagés difficiles
- **Rejeté :** Over-engineering pour scope actuel

## Conséquences

### ✅ Positives
- **Zero duplication** : Stores et logique métier partagés
- **UX optimisée** : Interface native mobile (TabBar, gestures)
- **PWA complète** : Installation, offline, push notifications futures
- **Sync transparent** : Même infrastructure que desktop
- **Maintenance simple** : Une seule base de code React
- **Performance** : Bundle partagé, lazy loading routes

### ⚠️ Négatives
- **Routing complexifié** : 2 interfaces dans même app
- **Bundle size** : Composants desktop chargés même sur mobile
- **Test matrix** : 2x scenarios (desktop + mobile)
- **SEO consideration** : URLs /companion/* séparées

### 🔄 Mitigations
- **Code splitting** : Routes lazy loaded
- **Breakpoint detection** : Redirect optionnel desktop ↔ mobile
- **Shared components** : Réutilisation QuoteCarousel, Diary, MarkdownEditor
- **Debug tools** : Commandes console partagées

## Implémentation

### Structure Code
```
src/
├── companion/              # Interface mobile
│   ├── CompanionApp.jsx    # Layout principal
│   ├── components/
│   │   └── TabBar.jsx      # Navigation mobile
│   └── pages/
│       ├── HomePage.jsx    # Mantras + Diary
│       ├── AtelierPage.jsx # Projets + Todo
│       ├── DevPage.jsx     # Notes techniques
│       └── SettingsPage.jsx # Config + Sync
├── components/             # Composants partagés
└── stores/                 # Stores Zustand partagés
```

### Composants Réutilisés
```javascript
// HomePage utilise widgets desktop
import QuoteCarousel from '../../components/widgets/QuoteCarousel'
import Diary from '../../components/diary/Diary'

// DevPage utilise MarkdownEditor desktop
import MarkdownEditor from '../../components/ui/MarkdownEditor'

// SettingsPage utilise SyncModal desktop
import SyncModal from '../../components/modals/SyncModal/SyncModal'
```

### Stores Extension
```javascript
// useNotesStore étendu pour mobile
{
  roomNotes: { chambre: '', atelier: '', ... },      // Desktop
  sideTowerNotes: { general: '' },                   // Desktop
  companionNotes: {                                  // Mobile
    devNote: '',                    // Notes techniques mobiles
    lastSync: '2025-10-01T10:00:00Z'
  }
}
```

### Layout Mobile
```css
.companion-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* TabBar space */
}

.tab-bar {
  position: fixed;
  bottom: 0;
  height: 64px;
  z-index: 1000;
}
```

## Métriques de Succès

### Performance
- **Bundle mobile** : < 80KB gzip
- **Time to Interactive** : < 3s (3G)
- **PWA score** : > 90 (Lighthouse)
- **Load time** : < 2s (4G)

### Adoption
- **Installation rate** : > 40% visiteurs mobile
- **Retention D7** : > 60%
- **Cross-device usage** : > 30% utilisateurs

### Technique
- **Code duplication** : < 5% (composants spécifiques mobile)
- **Store consistency** : 100% fidélité sync
- **Bug rate mobile** : < 2% sessions

## Roadmap Mobile

### v3.0 MVP (Actuel)
- ✅ 4 pages principales (Home, Atelier, Dev, Settings)
- ✅ TabBar navigation
- ✅ PWA installable
- ✅ Sync ultra-simple partagée

### v3.1 - UX Mobile (T1 2025)
- [ ] **Gestures** : Swipe navigation entre tabs
- [ ] **Offline mode** : Service Worker cache
- [ ] **Push notifications** : Sync background
- [ ] **Share API** : Partage notes système

### v3.2 - Features Avancées (T2 2025)
- [ ] **Voice input** : Dictée vocale notes
- [ ] **Camera integration** : Screenshots automatiques
- [ ] **Location aware** : Context géographique
- [ ] **Widget iOS/Android** : Shortcuts native

### v4.0 - Native Bridge (Future)
- [ ] **Capacitor integration** : Features natives
- [ ] **Biometric auth** : TouchID/FaceID
- [ ] **Background sync** : Sync automatique OS
- [ ] **Deep linking** : URLs custom scheme

## Tests Compatibilité

### Devices Testés
- ✅ **iPhone 12+ (Safari)** - PWA installation
- ✅ **Android 10+ (Chrome)** - PWA installation
- ✅ **iPad (Safari)** - Layout responsive
- ✅ **Desktop responsive** - Breakpoint 768px

### Features PWA
- ✅ **Manifest.json** - Métadonnées app
- ✅ **Service Worker** - Cache statique (futur)
- ✅ **App icons** - 192px + 512px château 🏰
- ✅ **Add to homescreen** - iOS + Android

## Sécurité Mobile

### Authentification
- **AccessGate partagé** : Même LoginPage desktop/mobile
- **Session temporaire** : sessionStorage par onglet
- **Variables d'env** : Configuration sécurisée

### Données Locales
```javascript
// localStorage mobile (identique desktop)
{
  "project-meta-store": {...},      // Métadonnées projets
  "irim-notes-store": {...},        // Notes + companionNotes
  "diary-storage": {...},           // Journal personnel
  "irim-preferences-store": {...},  // Préférences UI
  "irim-logged-in": "true"          // Session temporaire
}
```

### Sync Sécurisée
- **Chiffrement AES-256** : Même infrastructure desktop
- **GitHub Gist privé** : Données jamais en clair
- **Variables d'env** : Tokens jamais exposés client

## Liens

- **[COMPANION_ARCHITECTURE.md](../COMPANION_ARCHITECTURE.md)** - Documentation technique complète
- **[Sync System Guide](../guides/sync-system.md)** - Infrastructure sync partagée
- **[Security System](../architecture/security-system.md)** - Authentification commune

---

**Décision validée le :** 1er octobre 2025
**Implémentation :** ✅ MVP Complet (v3.0)
**Review prévue :** T1 2025 (roadmap v3.1)