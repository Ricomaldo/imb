// App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import MainLayout from './components/layout/MainLayout/MainLayout';
import ModalManager from './components/modals/ModalManager';
import LoginPage from './components/auth/LoginPage';
import exposeStoresToWindow from './utils/exposeStores';
import { initializeStores, cleanupObsoleteStorage } from './stores/migrateProjectStores';
import CompanionApp from './companion/CompanionApp';
import { openModal } from './utils/buttonMapping';
import { SyncProvider } from './contexts/SyncContext';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import { logger } from './utils/logger';

function App() {
  const [initStatus, setInitStatus] = useState('loading');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier l'état de connexion au démarrage
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('irim-logged-in') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  // Initialisation robuste des stores au démarrage
  useEffect(() => {
    const init = async () => {
      logger.info('🚀 IRIM MetaBrain - Initializing...');

      try {
        // 1. Initialiser les stores (migration + données par défaut si nécessaire)
        const status = await initializeStores();

        logger.debug(`📊 Initialization status: ${status}`);
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
          logger.info('💡 Tip: You can sync your data with GitHub Gist using the sync button in Control Tower');
        }

        // Log success
        logger.info('✅ IRIM MetaBrain ready!');
      } catch (error) {
        logger.error('❌ Initialization error:', error);
        setInitStatus('error');
      }
    };

    init();
  }, []);

  // Fonction de connexion
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Si pas connecté, afficher la page de connexion
  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

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
      <SyncProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SyncProvider>
    </ThemeProvider>
  );
}

// Composant interne pour accéder au routing + responsive layout
function AppContent() {
  const layout = useResponsiveLayout();

  /**
   * Logique de sélection interface:
   * 1. Si préférence utilisateur sauvegardée → la respecter (user override)
   * 2. Sinon → utiliser auto-détection (répétable sur resize/orientation)
   *
   * Pas de modal: détection auto silencieuse, utilisateur peut change dans Settings
   */
  const savedPreference = localStorage.getItem('interface-preference');
  const shouldShowCompanion = savedPreference
    ? savedPreference === 'mobile'
    : layout.interface === 'companion';

  return (
    <>
      <Routes>
        {shouldShowCompanion ? (
          <Route path="*" element={<CompanionApp layout={layout} />} />
        ) : (
          <Route
            path="*"
            element={
              <MainLayout
                responsiveLevel={layout.responsiveLevel}
                layout={layout}
              />
            }
          />
        )}
      </Routes>
      <ModalManager />
    </>
  );
}

export default App;