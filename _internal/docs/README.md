# 📚 Documentation IRIMMetaBrain v3.0

> Meta-cerveau spatial pour développeurs TDA/H avec architecture ultra-simple et mobile companion

**Version actuelle :** 3.0.0 (Production Ready)
**Dernière mise à jour :** 1er octobre 2025

## 🎯 Vue d'Ensemble

IRIMMetaBrain est un **meta-cerveau spatial** conçu pour les développeurs TDA/H, combinant :
- **Interface desktop** immersive avec navigation spatiale 4x3
- **Companion mobile** PWA avec synchronisation transparente
- **Sync ultra-simple** via GitHub Gist chiffré
- **Architecture multi-stores** Zustand modulaire

## 📋 Navigation Documentation

### 🏗️ Architecture

- **[🏗️ Architecture Stores v2.0](architecture/stores-architecture.md)** - Multi-stores Zustand (5 stores)
- **[🛡️ Système de Sécurité Symbolique](architecture/security-system.md)** - LoginPage/AccessGate
- **[📱 Architecture Mobile Companion](COMPANION_ARCHITECTURE.md)** - PWA avec stores partagés
- **[📐 Organisation des Composants](architecture/component-organization.md)** - Structure code
- **[🎨 Gestion du Thème](architecture/theme-management.md)** - Design system
- **[📁 Structure Dossiers](architecture/folder-structure.md)** - Organisation projet
- **[🎯 Vision Projet](architecture/project-vision.md)** - Meta-cerveau spatial

### 📋 Décisions Architecture (ADR)

- **[📋 Index Complet ADR](decisions/README.md)** - Toutes les décisions architecturales
- **[ADR-006: Sync Ultra-Simple v3.0](decisions/ADR-006-sync-ultra-simple.md)** - Architecture 2 boutons
- **[ADR-007: Mobile Companion PWA](decisions/ADR-007-mobile-companion.md)** - Interface mobile
- **[ADR-008: Sécurité Symbolique](decisions/ADR-008-securite-symbolique.md)** - Protection élégante
- **[ADR-005: Kanban Projets](decisions/ADR-005-architecture-kanban-projets.md)** - Gestion projets
- **[ADR-004: JSDoc Annotations](decisions/ADR-004-jsDoc-renders-annotation.md)** - Documentation code
- **[ADR-002: Architecture Composants](decisions/ADR-002-component-architecture-restructure.md)** - Restructuration
- **[ADR-001: Système Modales](decisions/ADR-001-modal-system-portals.md)** - React Portals

### 📖 Guides Utilisateur

- **Setup Essentiel**
  - **[⚙️ Configuration Environnement](guides/environment-setup.md)** - Variables d'env complètes
  - **[🔄 Système de Synchronisation v3.0](guides/sync-system.md)** - Export/Import ultra-simple
- **Développement**
  - **[🛠 Outils de Développement v3.0](guides/dev-tools.md)** - Debug tools multi-stores
  - **[🚀 Guide du Flux de Données](guides/data-flow-guide.md)** - Architecture données
  - **[📝 Système Auto-Documentation](guides/doc-workflow.md)** - Workflow documentation
- **Design & Assets**
  - **[🎨 Intégration UI Kits](guides/ui-kit-integration.md)** - Stratégie design
  - **[🖼️ Exploration Assets](guides/assets-exploration.md)** - Solutions payantes

### 🎯 Spécifications

- **[📋 Props & Hooks](specs/components-and-hooks.md)** - Documentation composants
- **[🤖 AI Cheatsheet](AI-cheatsheet.md)** - Guide IA développement

### 🚀 Milestones

- **[🗺️ Roadmap Vision](milestones/RoadMap.md)** - Vision révolutionnaire et phases projet
- **[📊 Phase -1: Wireframe & Assets](milestones/2025-09-phase-minus-one.md)** - Planification design
- **[🌱 Genèse du Projet](architecture/Genese.md)** - Évolution IRIM StudioHall → IRIMMetaBrain

---

## 🚀 Quick Start

### Setup Développement

```bash
# 1. Cloner et installer
git clone [repo-url]
npm install

# 2. Configurer variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos tokens GitHub

# 3. Lancer en développement
npm run dev
```

### Configuration Variables d'Environnement

```bash
# .env.local (requis)
VITE_GITHUB_TOKEN=ghp_votre_token_github     # Token GitHub scope "gist"
VITE_SYNC_PASSWORD=votre_password_complexe   # Mot de passe chiffrement
VITE_ACCESS_PASSWORD=password_app            # Mot de passe accès app
VITE_SYNC_GIST_ID=gist_id_optionnel         # ID Gist existant (auto-créé sinon)
```

**Guide complet :** [Configuration Environnement](guides/environment-setup.md)

## 📱 Interfaces Disponibles

### 🖥️ Desktop - Interface Spatiale
- **URL :** `/`
- **Navigation :** Grid 4x3 avec rooms immersives
- **Features :** Gestion projets, notes spatiales, sync, ControlTower

### 📱 Mobile - Companion PWA
- **URL :** `/companion`
- **Navigation :** TabBar 4 onglets (Home/Atelier/Dev/Settings)
- **Features :** Journal, notes techniques, sync partagée
- **Installation :** PWA installable iOS/Android

## 🔄 Synchronisation Cross-Device

### Architecture Ultra-Simple v3.0
```
📤 EXPORT  →  Sauvegarde TOUT vers GitHub Gist chiffré
📥 IMPORT  →  Restaure TOUT depuis GitHub Gist + reload
```

**Stores synchronisés :**
- `useNotesStore` - Notes transversales + mobile
- `useProjectMetaStore` - Métadonnées projets
- `useProjectDataStore` - Données par projet (dynamique)
- `useDiaryStore` - Journal personnel + mindlog
- `usePreferencesStore` - Préférences UI

**Guide complet :** [Système de Synchronisation](guides/sync-system.md)

## 🛠 Debug & Development

### Commandes Console Debug
```javascript
// Accès stores Zustand
window.__ZUSTAND_STORES__.notes()           // Notes complètes
window.__ZUSTAND_STORES__.projectMeta()     // Métadonnées projets
window.__ZUSTAND_STORES__.diary()           // Journal personnel

// Outils synchronisation
window.__SYNC_TOOLS__.collectAllStoreData()    // Collecte tous stores
window.__SYNC_TOOLS__.cleanupOrphanedProjects() // Nettoyage

// Debug sécurité
window.authDebug.status()                   // État authentification
window.authDebug.emergencyReset()           // Reset d'urgence
```

**Guide complet :** [Outils de Développement](guides/dev-tools.md)

## 📚 Scripts Documentation

```bash
# Capturer une pensée rapide
npm run doc:capture "Ma pensée brute"

# Promouvoir vers docs officiels
npm run doc:promote devlog/YYYY-MM-DD.md category/filename.md

# Régénérer cet index
npm run doc:index
```

---

## 🏗️ Architecture Technique

**Frontend :** React 19 + Vite + Styled Components
**State :** Zustand (5 stores modulaires)
**Sync :** GitHub Gist + AES-256 chiffrement
**Mobile :** PWA avec stores partagés
**Sécurité :** Symbolique (sessionStorage)
**Déploiement :** Vercel + variables d'env

**Status :** ✅ Production Ready v3.0

---

## 🤝 Contribution & Maintenance

**[📝 Guide de Contribution](CONTRIBUTING.md)** - Standards et workflow pour contribuer à la documentation

**Mainteneurs :** IRIM Team
**Support :** Issues GitHub ou documentation interne
