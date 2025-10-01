// App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import StudioHall from './components/layout/StudioHall/StudioHall';
import ModalManager from './components/modals/ModalManager';
import exposeStoresToWindow from './utils/exposeStores';
import { initializeStores, cleanupObsoleteStorage } from './stores/migrateProjectStores';
import CompanionApp from './companion/CompanionApp';
import { openModal } from './utils/buttonMapping';

function App() {
  const [initStatus, setInitStatus] = useState('loading');

  // Initialisation robuste des stores au démarrage
  useEffect(() => {
    const init = async () => {
      console.log('🚀 IRIM MetaBrain - Initializing...');

      try {
        // 1. Initialiser les stores (migration + données par défaut si nécessaire)
        const status = await initializeStores();

        console.log(`📊 Initialization status: ${status}`);
        setInitStatus(status);

        // 1.5. Nettoyer les clés obsolètes du localStorage
        cleanupObsoleteStorage();

        // 2. Exposer les stores pour debug (dev uniquement)
        if (import.meta.env.DEV) {
          exposeStoresToWindow();
        }

        // 3. Vérifier si une sync cloud est disponible
        const lastSync = localStorage.getItem('last-sync');
        if (!lastSync && status === 'initialized') {
          console.log('💡 Tip: You can sync your data with GitHub Gist using the sync button in Control Tower');
        }

        // Log success
        console.log('✅ IRIM MetaBrain ready!');
      } catch (error) {
        console.error('❌ Initialization error:', error);
        setInitStatus('error');
      }
    };

    init();
  }, []);

  // Afficher un loader pendant l'initialisation
  if (initStatus === 'loading') {
    return (
      <ThemeProvider theme={theme}>
        <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.colors.background,
          color: theme.colors.text
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2>IRIM MetaBrain</h2>
            <p>Initializing...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Composant interne pour accéder au routing
function AppContent() {
  useEffect(() => {
    // Vérifier si on doit afficher la modale de choix
    const hasPreference = localStorage.getItem('interface-preference');
    const isMobile = window.innerWidth < 768;
    const isRootPath = window.location.pathname === '/';

    // Afficher la modale uniquement si :
    // 1. Pas de préférence sauvegardée
    // 2. Détecté comme mobile
    // 3. Sur la route racine
    if (!hasPreference && isMobile && isRootPath) {
      // Attendre que le ModalManager soit monté
      setTimeout(() => {
        openModal('device-choice');
      }, 500);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<StudioHall />} />
        <Route path="/companion/*" element={<CompanionApp />} />
      </Routes>
      <ModalManager />
    </>
  );
}

export default App;