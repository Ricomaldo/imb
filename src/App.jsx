// App.jsx
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import StudioHall from './components/layout/StudioHall/StudioHall';
import ModalManager from './components/modals/ModalManager';
import exposeStoresToWindow from './utils/exposeStores';
import { initializeStores, cleanupObsoleteStorage } from './stores/migrateProjectStores';

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
      <StudioHall />
      <ModalManager />
    </ThemeProvider>
  );
}

export default App;