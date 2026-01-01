// Helper pour exposer les stores Zustand en développement
// Cela permet aux outils de dev de capturer l'état

import useNotesStore from '../stores/useNotesStore';
import useProjectMetaStore from '../stores/useProjectMetaStore';
import { getProjectData } from '../stores/useProjectDataStore';
import useDiaryStore from '../stores/useDiaryStore';
import usePreferencesStore from '../stores/usePreferencesStore';
import ProjectSyncAdapter from '../services/ProjectSyncAdapter';
import { logger } from './logger';

// Fonction pour exposer les stores et helpers
export const exposeStoresToWindow = (navigationHook = null) => {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    // Créer l'objet global si il n'existe pas
    window.__ZUSTAND_STORES__ = window.__ZUSTAND_STORES__ || {};

    // Exposer TOUS les stores
    window.__ZUSTAND_STORES__.notes = useNotesStore;
    window.__ZUSTAND_STORES__.projectMeta = useProjectMetaStore;
    window.__ZUSTAND_STORES__.getProjectData = getProjectData;
    window.__ZUSTAND_STORES__.diary = useDiaryStore;
    window.__ZUSTAND_STORES__.preferences = usePreferencesStore;

    // Exposer la navigation si fournie
    if (navigationHook) {
      window.__NAVIGATION__ = navigationHook;
      window.__NAVIGATE_TO_ROOM__ = (x, y) => {
        if (window.__NAVIGATION__ && window.__NAVIGATION__.setCurrentRoom) {
          window.__NAVIGATION__.setCurrentRoom({ x, y });
          return true;
        }
        return false;
      };
    }

    // Helper pour récupérer tout l'état actuel
    window.__GET_ALL_STATE__ = () => {
      const state = {};
      Object.keys(window.__ZUSTAND_STORES__).forEach(key => {
        const store = window.__ZUSTAND_STORES__[key];
        if (store && typeof store.getState === 'function') {
          state[key] = store.getState();
        }
      });
      return state;
    };

    // Helper pour debug
    window.__DEBUG_STORES__ = () => {
      logger.debug('🔍 Stores disponibles:');
      Object.keys(window.__ZUSTAND_STORES__).forEach(key => {
        logger.debug(`  - ${key}:`, window.__ZUSTAND_STORES__[key].getState());
      });
      if (window.__NAVIGATION__) {
        logger.debug('  - Navigation:', window.__NAVIGATION__.currentRoom);
      }
    };

    // Alias plus simple pour accès rapide
    window.stores = {
      notes: useNotesStore.getState,
      projectMeta: useProjectMetaStore.getState,
      projectData: (projectId) => getProjectData(projectId),
      diary: useDiaryStore.getState,
      preferences: usePreferencesStore.getState,
      // Alias pour actions communes
      selectProject: (id) => useProjectMetaStore.getState().selectProject(id),
      getCurrentProject: () => useProjectMetaStore.getState().getCurrentProject(),
      getVisibleProjects: () => useProjectMetaStore.getState().getVisibleProjects(),
      // Alias Moments OUI
      momentsOui: {
        getAll: () => useDiaryStore.getState().getMomentsOui(),
        getById: (id) => useDiaryStore.getState().getMomentOuiById(id),
        add: (data) => useDiaryStore.getState().addMomentOui(data),
        update: (id, updates) => useDiaryStore.getState().updateMomentOui(id, updates),
        delete: (id) => useDiaryStore.getState().deleteMomentOui(id),
        getWeeklyStats: () => useDiaryStore.getState().getWeeklyStats(),
        getNeedsStats: (period) => useDiaryStore.getState().getNeedsStats(period)
      }
    };

    // Exposer les outils de maintenance
    // ProjectSyncAdapter est déjà une instance singleton exportée
    window.__SYNC_TOOLS__ = {
      cleanupOrphanedProjects: () => ProjectSyncAdapter.cleanupOrphanedProjects(),
      collectAllStoreData: () => ProjectSyncAdapter.collectAllStoreData()
    };

    logger.debug('✅ Stores exposés dans window.__ZUSTAND_STORES__');
    logger.debug('💡 Utilise window.__DEBUG_STORES__() pour voir l\'état');
    logger.debug('🚀 Accès rapide: window.stores.projectMeta() ou window.stores.projectData("irimmetabrain")');
    logger.debug('🧹 Maintenance: window.__SYNC_TOOLS__.cleanupOrphanedProjects()');
  }
};

export default exposeStoresToWindow;