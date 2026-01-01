---
type: guide
updated: 2025-10-01
version: 3.0
---

# 🎓 Guide des Outils de Développement - IRIMMetaBrain

> Formation complète sur les outils de capitalisation et documentation

---

## 1. 🗺️ SystemOverview.jsx - Cartographie Vivante

### Concept Fondamental
L'introspection React permet de "lire" ton arbre de composants en temps réel et d'en extraire des informations structurelles.

### Approche 1: Runtime Introspection (Recommandée)

```javascript
// src/components/dev/SystemOverview.jsx

import React, { useEffect, useState } from 'react';
import { useComponentTree } from './hooks/useComponentTree';

/**
 * LOGIQUE:
 * 1. React._owner nous donne accès à l'arbre des composants
 * 2. On traverse récursivement pour mapper la structure
 * 3. On extrait: nom, props, children, location
 */

const useComponentTree = (rootElement) => {
  const [tree, setTree] = useState(null);

  useEffect(() => {
    if (!rootElement) return;

    const traverseTree = (element, depth = 0) => {
      if (!element) return null;

      // React Fiber nous donne accès à la structure interne
      const fiber = element._owner || element._debugOwner;

      return {
        name: element.type?.name || 'Unknown',
        props: Object.keys(element.props || {}),
        depth,
        children: React.Children.map(
          element.props?.children,
          child => traverseTree(child, depth + 1)
        )
      };
    };

    setTree(traverseTree(rootElement));
  }, [rootElement]);

  return tree;
};
```

### Approche 2: Static Analysis avec AST

```javascript
/**
 * LOGIQUE:
 * 1. Parser les fichiers .jsx avec @babel/parser
 * 2. Traverser l'AST (Abstract Syntax Tree)
 * 3. Identifier les imports et exports
 * 4. Construire le graphe de dépendances
 */

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const analyzeComponent = (sourceCode) => {
  const ast = parse(sourceCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });

  const imports = [];
  const exports = [];
  const components = [];

  traverse(ast, {
    ImportDeclaration(path) {
      imports.push({
        source: path.node.source.value,
        specifiers: path.node.specifiers.map(s => s.local.name)
      });
    },
    ExportDeclaration(path) {
      exports.push(path.node.declaration?.id?.name);
    },
    JSXElement(path) {
      components.push(path.node.openingElement.name.name);
    }
  });

  return { imports, exports, components };
};
```

### Visualisation Interactive

```javascript
// Utilise D3.js ou React Flow pour visualiser
const ComponentGraph = ({ tree }) => {
  return (
    <svg width="100%" height="600">
      {renderNodes(tree)}
      {renderConnections(tree)}
    </svg>
  );
};
```

**Pourquoi cette approche ?**
- Runtime = données réelles, état actuel
- Static = architecture complète, dépendances
- Combine les deux = vision complète du système

---

## 2. 📚 Storybook Léger Intégré

### Concept: Catalogue Interne vs External

**Option A: Intégré dans IRIMMetaBrain (Recommandé)**

```javascript
// src/components/dev/ComponentCatalog/index.jsx

/**
 * LOGIQUE:
 * 1. Scanner le dossier components/
 * 2. Auto-générer des "stories" pour chaque composant
 * 3. Permettre des variations interactives
 * 4. Intégrer dans une Room dédiée (Bibliothèque?)
 */

const ComponentCatalog = () => {
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [props, setProps] = useState({});

  useEffect(() => {
    // Auto-discovery des composants
    const context = require.context('../../', true, \/\.jsx$/);
    const comps = context.keys().map(path => ({
      path,
      name: path.split('/').pop().replace('.jsx', ''),
      component: context(path).default
    }));
    setComponents(comps);
  }, []);

  return (
    <CatalogContainer>
      <ComponentList>
        {components.map(comp => (
          <ComponentItem
            key={comp.path}
            onClick={() => setSelected(comp)}
          >
            {comp.name}
          </ComponentItem>
        ))}
      </ComponentList>

      <PreviewArea>
        {selected && (
          <>
            <ControlPanel>
              {/* Générer des contrôles depuis propTypes */}
              <PropsEditor
                component={selected.component}
                onChange={setProps}
              />
            </ControlPanel>

            <Preview>
              <selected.component {...props} />
            </Preview>

            <CodeView>
              {/* Afficher le code d'usage */}
              <pre>
                {`<${selected.name} ${generatePropsString(props)} />`}
              </pre>
            </CodeView>
          </>
        )}
      </PreviewArea>
    </CatalogContainer>
  );
};
```

### Structure des Stories Automatiques

```javascript
// src/utils/storyGenerator.js

/**
 * LOGIQUE:
 * 1. Lire les propTypes/TypeScript types
 * 2. Générer des variations automatiques
 * 3. Créer des cas d'usage standards
 */

export const generateStories = (Component) => {
  const stories = [];

  // Story par défaut
  stories.push({
    name: 'Default',
    props: {}
  });

  // Si le composant a des propTypes
  if (Component.propTypes) {
    Object.keys(Component.propTypes).forEach(prop => {
      // Générer des variations pour chaque prop
      stories.push({
        name: `With ${prop}`,
        props: { [prop]: getExampleValue(prop) }
      });
    });
  }

  // Variations de taille si applicable
  if (Component.propTypes?.size) {
    ['small', 'medium', 'large'].forEach(size => {
      stories.push({
        name: `Size: ${size}`,
        props: { size }
      });
    });
  }

  return stories;
};
```

**Avantages de l'intégration:**
- Pas de setup externe
- Cohérent avec ton univers
- Accessible depuis l'interface
- Peut utiliser ton thème directement

---

## 3. 📸 Tests Visuels & Capture d'État

### Architecture du Système

```javascript
// scripts/capture-state.js

/**
 * LOGIQUE:
 * 1. Puppeteer pour screenshots automatiques
 * 2. Extraction état Zustand via window.__ZUSTAND_STATE__
 * 3. Stockage organisé par date/heure
 * 4. Comparaison avec état précédent
 */

import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';

const captureState = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Configuration viewport
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2 // Retina quality
  });

  await page.goto('http://localhost:5173');

  // Attendre que l'app soit chargée
  await page.waitForSelector('#root');

  // Créer dossier avec timestamp
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const captureDir = `captures/${timestamp}`;
  await fs.ensureDir(captureDir);

  // 1. SCREENSHOTS PAR ROOM
  const rooms = ['atelier', 'forge', 'sanctuaire'];
  for (const room of rooms) {
    // Naviguer vers la room
    await page.evaluate((r) => {
      window.navigateToRoom?.(r);
    }, room);

    await page.waitForTimeout(500); // Animation

    await page.screenshot({
      path: `${captureDir}/${room}.png`,
      fullPage: false
    });
  }

  // 2. EXTRACTION ÉTAT ZUSTAND
  const storeState = await page.evaluate(() => {
    // Injecter un helper dans window pour accéder aux stores
    const stores = {};

    // Récupérer tous les stores Zustand
    if (window.__ZUSTAND_STORES__) {
      Object.keys(window.__ZUSTAND_STORES__).forEach(key => {
        stores[key] = window.__ZUSTAND_STORES__[key].getState();
      });
    }

    return stores;
  });

  // Sauvegarder l'état JSON
  await fs.writeJson(
    `${captureDir}/state.json`,
    storeState,
    { spaces: 2 }
  );

  // 3. GÉNÉRER RAPPORT DE COMPARAISON
  const previousCapture = await getPreviousCapture();
  if (previousCapture) {
    const diff = await compareStates(storeState, previousCapture);
    await fs.writeJson(
      `${captureDir}/diff.json`,
      diff,
      { spaces: 2 }
    );
  }

  // 4. MÉTRIQUES DE CODE
  const metrics = await collectMetrics();
  await fs.writeJson(
    `${captureDir}/metrics.json`,
    metrics,
    { spaces: 2 }
  );

  await browser.close();

  console.log(`✅ État capturé dans ${captureDir}`);
  return captureDir;
};
```

### Format JSON Optimal pour l'État

```javascript
// Format structuré et versionné
{
  "version": "1.0.0",
  "timestamp": "2024-09-16T15:30:00Z",
  "environment": {
    "node": "18.x",
    "react": "18.x",
    "browser": "Chrome 120"
  },
  "stores": {
    "projects": {
      "currentProject": "IRIMMetaBrain",
      "roadmap": "...",
      "todos": []
    },
    "notes": {
      "rooms": {
        "atelier": { "content": "..." }
      }
    }
  },
  "ui": {
    "currentRoom": "atelier",
    "modalsOpen": [],
    "theme": "default"
  },
  "performance": {
    "renderTime": 45,
    "bundleSize": 850000,
    "componentCount": 67
  }
}
```

### Intégration dans package.json

```json
{
  "scripts": {
    "capture-state": "node scripts/capture-state.js",
    "capture-diff": "node scripts/capture-state.js --compare",
    "capture-report": "node scripts/generate-report.js"
  }
}
```

---

## 4. 🔄 Workflow Complet

### Daily Workflow

```bash
# Début de session
npm run capture-state  # Snapshot initial

# Pendant le dev
# ... coding ...

# Fin de session
npm run capture-state  # Snapshot final
npm run capture-diff   # Voir les changements
git add captures/
git commit -m "📸 Session captures"
```

### Structure des Dossiers

```
captures/
├── 2024-09-16T10-00-00/
│   ├── atelier.png
│   ├── forge.png
│   ├── state.json
│   └── metrics.json
├── 2024-09-16T18-00-00/
│   ├── atelier.png
│   ├── forge.png
│   ├── state.json
│   ├── diff.json       # Comparaison avec 10h00
│   └── metrics.json
└── index.html          # Visualiseur de captures
```

---

## 💡 Logique Globale

**Pourquoi ces outils ?**

1. **SystemOverview** = Comprendre les connexions
2. **Catalog** = Tester les variations
3. **Captures** = Tracer l'évolution
4. **devlog/** = Raconter l'histoire

Ensemble, ils forment un **système de mémoire augmentée** pour ton développement.

**Le pattern Mental Model:**
```
Code → Introspection → Visualisation → Documentation → Mémoire
```

C'est transformer ton processus de dev en système d'apprentissage continu !

---

## 5. 🛠 Debug Tools Architecture v3.0

### Commandes Debug Console

Avec l'architecture multi-stores v3.0, de nouvelles commandes de debug sont disponibles dans la console navigateur :

#### Accès aux Stores Zustand
```javascript
// STORES PRINCIPAUX (Architecture v2.0)
window.__ZUSTAND_STORES__.notes()           // useNotesStore complet
window.__ZUSTAND_STORES__.projectMeta()     // useProjectMetaStore
window.__ZUSTAND_STORES__.diary()           // useDiaryStore (nouveau)
window.__ZUSTAND_STORES__.preferences()     // usePreferencesStore (nouveau)

// STORES DYNAMIQUES
window.__ZUSTAND_STORES__.projectData('irimmetabrain')  // Par projet
window.__ZUSTAND_STORES__.projectData('moodcycle')     // Autre projet

// ÉTAT COMPLET
Object.keys(window.__ZUSTAND_STORES__).forEach(store => {
  console.log(`${store}:`, window.__ZUSTAND_STORES__[store]())
})
```

#### Outils de Synchronisation v3.0
```javascript
// DEBUG SYNC ULTRA-SIMPLE
window.__SYNC_TOOLS__.collectAllStoreData()    // Collecte tous stores
window.__SYNC_TOOLS__.cleanupOrphanedProjects() // Nettoie projets orphelins

// DIAGNOSTIC CONFIGURATION
console.log('GitHub Token:', !!import.meta.env.VITE_GITHUB_TOKEN)
console.log('Sync Password:', !!import.meta.env.VITE_SYNC_PASSWORD)
console.log('Gist ID:', import.meta.env.VITE_SYNC_GIST_ID || 'Auto-generated')

// ÉTAT SESSION
console.log('Logged in:', sessionStorage.getItem('irim-logged-in'))
console.log('Last sync:', localStorage.getItem('last-sync-timestamp'))
```

#### Debug Multi-Stores
```javascript
// STATISTIQUES STORES
const getStoreStats = () => {
  const stats = {}

  // Taille localStorage par store
  const stores = [
    'project-meta-store',
    'irim-notes-store',
    'diary-storage',
    'irim-preferences-store'
  ]

  stores.forEach(key => {
    const data = localStorage.getItem(key)
    stats[key] = {
      exists: !!data,
      size: data ? `${(data.length / 1024).toFixed(1)} KB` : '0 KB',
      lastModified: 'N/A' // Peut être étendu
    }
  })

  // Stores projets dynamiques
  Object.keys(localStorage)
    .filter(key => key.startsWith('project-data-'))
    .forEach(key => {
      const data = localStorage.getItem(key)
      stats[key] = {
        exists: true,
        size: `${(data.length / 1024).toFixed(1)} KB`
      }
    })

  return stats
}

window.getStoreStats = getStoreStats
```

#### Commandes de Maintenance
```javascript
// RESET SÉLECTIF
const resetStore = (storeName) => {
  const storeKeys = {
    'notes': 'irim-notes-store',
    'projectMeta': 'project-meta-store',
    'diary': 'diary-storage',
    'preferences': 'irim-preferences-store'
  }

  if (storeKeys[storeName]) {
    localStorage.removeItem(storeKeys[storeName])
    console.log(`✅ Store ${storeName} reset`)
    window.location.reload()
  }
}

// BACKUP MANUEL
const backupStores = () => {
  const backup = {}

  Object.keys(localStorage).forEach(key => {
    if (key.includes('store') || key.includes('storage')) {
      backup[key] = JSON.parse(localStorage.getItem(key))
    }
  })

  console.log('📦 Backup stores:', backup)
  return backup
}

// RESTORE BACKUP
const restoreStores = (backup) => {
  Object.keys(backup).forEach(key => {
    localStorage.setItem(key, JSON.stringify(backup[key]))
  })
  console.log('✅ Stores restored')
  window.location.reload()
}

// EXPOSE GLOBALEMENT
window.resetStore = resetStore
window.backupStores = backupStores
window.restoreStores = restoreStores
```

### Scripts NPM Debug

Ajout de nouveaux scripts dans package.json pour automatiser le debug :

```json
{
  "scripts": {
    "dev:debug": "npm run dev && open http://localhost:5173/?debug=true",
    "capture:state": "node scripts/capture-state.js",
    "debug:stores": "node scripts/debug-stores.js",
    "debug:sync": "node scripts/test-sync.js"
  }
}
```

### Logs de Debug Architecture

#### Format Debug Logs v3.0
```javascript
// Logs structurés pour debugging
const debugLog = (category, action, data) => {
  const timestamp = new Date().toISOString()
  const log = {
    timestamp,
    category,    // 'STORE', 'SYNC', 'AUTH', 'UI'
    action,      // 'UPDATE', 'LOAD', 'ERROR', 'SUCCESS'
    data
  }

  console.log(`[${category}] ${action}:`, data)

  // Optionnel: Stockage logs pour debugging avancé
  const logs = JSON.parse(localStorage.getItem('debug-logs') || '[]')
  logs.push(log)

  // Garder seulement 100 derniers logs
  if (logs.length > 100) {
    logs.splice(0, logs.length - 100)
  }

  localStorage.setItem('debug-logs', JSON.stringify(logs))
}

window.debugLog = debugLog

// USAGE EXEMPLES
debugLog('STORE', 'UPDATE', { store: 'notes', key: 'chambre' })
debugLog('SYNC', 'EXPORT', { success: true, gistId: 'abc123' })
debugLog('AUTH', 'LOGIN', { success: true })
```

#### Debug Interface Mobile
```javascript
// Console spécifique mobile companion
if (window.location.pathname.startsWith('/companion')) {
  console.log('📱 Mobile Companion Debug Mode')

  // Stats spécifiques mobile
  window.mobileDebug = {
    stores: () => window.__ZUSTAND_STORES__,
    viewport: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768
    }),
    pwa: () => ({
      standalone: window.navigator.standalone,
      installed: window.matchMedia('(display-mode: standalone)').matches
    })
  }
}
```

### Debug Sécurité Symbolique

```javascript
// Debug système authentification
window.authDebug = {
  // État session
  status: () => ({
    loggedIn: sessionStorage.getItem('irim-logged-in') === 'true',
    passwordConfigured: !!import.meta.env.VITE_ACCESS_PASSWORD,
    fallbackPassword: import.meta.env.VITE_ACCESS_PASSWORD || 'metabrain2024'
  }),

  // Forcer connexion (dev only)
  forceLogin: () => {
    sessionStorage.setItem('irim-logged-in', 'true')
    window.location.reload()
  },

  // Forcer déconnexion
  forceLogout: () => {
    sessionStorage.removeItem('irim-logged-in')
    window.location.reload()
  },

  // Reset d'urgence
  emergencyReset: () => {
    sessionStorage.clear()
    localStorage.clear()
    window.location.reload()
  }
}
```

### Performance Monitoring

```javascript
// Monitoring performance stores
window.performanceDebug = {
  // Mesurer temps accès store
  measureStoreAccess: (storeName) => {
    const start = performance.now()
    const data = window.__ZUSTAND_STORES__[storeName]()
    const end = performance.now()

    console.log(`⏱️ ${storeName} access: ${(end - start).toFixed(2)}ms`)
    return data
  },

  // Taille mémoire stores
  getMemoryUsage: () => {
    const usage = {}

    Object.keys(window.__ZUSTAND_STORES__).forEach(store => {
      const data = JSON.stringify(window.__ZUSTAND_STORES__[store]())
      usage[store] = `${(data.length / 1024).toFixed(1)} KB`
    })

    return usage
  }
}
```

---

## 6. 🔗 Liens Documentation v3.0

### Architecture Actuelle
- **[Stores Architecture v2.0](../architecture/stores-architecture.md)** - Multi-stores détaillé
- **[Sync System v3.0](sync-system.md)** - Synchronisation ultra-simple
- **[Security System](../architecture/security-system.md)** - Authentification symbolique
- **[Companion Architecture](../COMPANION_ARCHITECTURE.md)** - Interface mobile PWA

### ADR Décisions
- **[ADR-006](../decisions/ADR-006-sync-ultra-simple.md)** - Architecture sync v3.0
- **[ADR-007](../decisions/ADR-007-mobile-companion.md)** - PWA mobile
- **[ADR-008](../decisions/ADR-008-securite-symbolique.md)** - Sécurité symbolique

### Setup et Configuration
- **[Environment Setup](environment-setup.md)** - Variables d'environnement complètes
