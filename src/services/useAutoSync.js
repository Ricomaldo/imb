// src/services/useAutoSync.js - Auto-sync vers GitHub Gist avec debounce
//
// Mission: imb-sync-mission - Chantier A
// Élimine la friction Export manuel en sauvegardant automatiquement après modifications
//
// Approche: S'abonne aux stores Zustand via subscribe() pour détecter les changements

import { useState, useEffect, useCallback, useRef } from 'react';
import CryptoJS from 'crypto-js';
import useNotesStore from '../stores/useNotesStore';
import useProjectMetaStore from '../stores/useProjectMetaStore';
import useDiaryStore from '../stores/useDiaryStore';
import usePreferencesStore from '../stores/usePreferencesStore';
import { subscribeToProjectData } from '../stores/useProjectDataStore';
import projectSyncAdapter from './ProjectSyncAdapter';

// Préfixe pour les stores projet dynamiques
const PROJECT_DATA_PREFIX = 'project-data-';

/**
 * Hook pour l'auto-sync vers GitHub Gist
 *
 * @param {Object} options
 * @param {number} options.debounceMs - Délai debounce en ms (défaut: 30000 = 30s)
 * @param {boolean} options.enabled - Activer/désactiver l'auto-sync (défaut: true)
 * @returns {Object} { syncStatus, lastSyncTime, error, triggerSync }
 */
export function useAutoSync({ debounceMs = 30000, enabled = true } = {}) {
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'pending' | 'syncing' | 'success' | 'error' | 'offline'
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [error, setError] = useState(null);

  const debounceTimerRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Config depuis variables d'environnement
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
  const encryptionPassword = import.meta.env.VITE_SYNC_PASSWORD;
  const gistId = import.meta.env.VITE_SYNC_GIST_ID;

  const isConfigured = !!(githubToken && encryptionPassword);

  /**
   * Collecte tous les stores depuis localStorage
   */
  const collectAllStores = useCallback(() => {
    const data = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      architecture: 'multi-store',
      stores: {}
    };

    try {
      // Notes Store
      const notesData = localStorage.getItem('irim-notes-store');
      if (notesData) {
        data.stores.notes = JSON.parse(notesData).state;
      }

      // Project Meta Store
      const metaData = localStorage.getItem('project-meta-store');
      if (metaData) {
        data.stores.projectMeta = JSON.parse(metaData).state;
      }

      // Diary Store
      const diaryData = localStorage.getItem('diary-storage');
      if (diaryData) {
        data.stores.diary = JSON.parse(diaryData).state;
      }

      // Preferences Store
      const preferencesData = localStorage.getItem('irim-preferences-store');
      if (preferencesData) {
        data.stores.preferences = JSON.parse(preferencesData).state;
      }

      // Project Data Stores (tous les project-data-*)
      data.stores.projectData = {};
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(PROJECT_DATA_PREFIX)) {
          const projectId = key.replace(PROJECT_DATA_PREFIX, '');
          const projectData = localStorage.getItem(key);
          if (projectData) {
            data.stores.projectData[projectId] = JSON.parse(projectData).state;
          }
        }
      });

      return data;
    } catch (err) {
      console.error('[AutoSync] Error collecting stores:', err);
      throw new Error('Failed to collect store data');
    }
  }, []);

  /**
   * Chiffre les données avec AES
   */
  const encryptData = useCallback((data) => {
    if (!encryptionPassword) {
      throw new Error('Encryption password not configured');
    }
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, encryptionPassword).toString();
  }, [encryptionPassword]);

  /**
   * Upload vers GitHub Gist
   */
  const uploadToGist = useCallback(async (data) => {
    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    const encryptedData = encryptData(data);

    const gistData = {
      description: 'IRIM MetaBrain Sync Data',
      public: false,
      files: {
        'irim-sync.json': {
          content: encryptedData
        }
      }
    };

    const url = gistId
      ? `https://api.github.com/gists/${gistId}`
      : 'https://api.github.com/gists';

    const method = gistId ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gistData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  }, [githubToken, gistId, encryptData]);

  /**
   * Exécute la synchronisation
   */
  const performSync = useCallback(async () => {
    if (!isConfigured) {
      console.log('[AutoSync] Not configured, skipping sync');
      return;
    }

    // Vérifier la connexion réseau
    if (!navigator.onLine) {
      setSyncStatus('offline');
      return;
    }

    try {
      setSyncStatus('syncing');
      setError(null);

      const data = collectAllStores();
      await uploadToGist(data);

      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('last-sync', now.toISOString());

      setSyncStatus('success');
      console.log('[AutoSync] ✅ Sync successful at', now.toLocaleTimeString());

      // Revenir à idle après 3 secondes
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);

    } catch (err) {
      console.error('[AutoSync] ❌ Sync failed:', err);
      setError(err.message);
      setSyncStatus('error');

      // Revenir à idle après 5 secondes
      setTimeout(() => {
        setSyncStatus('idle');
      }, 5000);
    }
  }, [isConfigured, collectAllStores, uploadToGist]);

  /**
   * Déclenche un sync avec debounce
   */
  const triggerDebouncedSync = useCallback(() => {
    if (!enabled || !isConfigured) return;

    // Clear le timer précédent
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    console.log('[AutoSync] ⏳ Pending - will sync in', debounceMs / 1000, 'seconds');
    setSyncStatus('pending');

    // Nouveau timer
    debounceTimerRef.current = setTimeout(() => {
      performSync();
    }, debounceMs);

  }, [enabled, isConfigured, debounceMs, performSync]);

  /**
   * Force un sync immédiat (bypass debounce)
   */
  const triggerSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSync();
  }, [performSync]);

  /**
   * Auto-import au démarrage si le Gist est plus récent
   */
  const checkAndImportFromGist = useCallback(async () => {
    if (!isConfigured || !gistId) {
      console.log('[AutoSync] Auto-import skipped: not configured or no gistId');
      return;
    }

    try {
      console.log('[AutoSync] 🔍 Checking Gist for newer data...');

      // Configurer le syncAdapter
      projectSyncAdapter.configure(githubToken, gistId);
      projectSyncAdapter.setPassword(encryptionPassword);

      // Récupérer les données du Gist
      const gistData = await projectSyncAdapter.syncManager.downloadGist(gistId, true);

      if (!gistData || !gistData.timestamp) {
        console.log('[AutoSync] No valid data in Gist');
        return;
      }

      const gistTimestamp = new Date(gistData.timestamp);
      const lastLocalSync = localStorage.getItem('last-sync');
      const localTimestamp = lastLocalSync ? new Date(lastLocalSync) : null;

      console.log('[AutoSync] Gist timestamp:', gistTimestamp.toISOString());
      console.log('[AutoSync] Local timestamp:', localTimestamp?.toISOString() || 'none');

      // Si le Gist est plus récent, importer
      if (!localTimestamp || gistTimestamp > localTimestamp) {
        console.log('[AutoSync] 📥 Gist is newer, importing...');
        setSyncStatus('syncing');

        const result = await projectSyncAdapter.importFromGist(gistId, true);

        if (result.success) {
          console.log('[AutoSync] ✅ Auto-import successful!');
          localStorage.setItem('last-sync', gistData.timestamp);
          setLastSyncTime(new Date(gistData.timestamp));
          setSyncStatus('success');

          // Recharger la page pour appliquer les données importées
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.error('[AutoSync] ❌ Auto-import failed:', result.error);
          setSyncStatus('error');
        }
      } else {
        console.log('[AutoSync] ✅ Local data is up to date');
      }
    } catch (err) {
      console.error('[AutoSync] Auto-import error:', err);
      // Ne pas bloquer l'app si l'import échoue
    }
  }, [isConfigured, gistId, githubToken, encryptionPassword]);

  // Ref pour le trigger (évite les problèmes de closure)
  const triggerRef = useRef(triggerDebouncedSync);
  useEffect(() => {
    triggerRef.current = triggerDebouncedSync;
  }, [triggerDebouncedSync]);

  /**
   * Auto-import au montage initial
   */
  const hasCheckedImportRef = useRef(false);
  useEffect(() => {
    if (enabled && isConfigured && !hasCheckedImportRef.current) {
      hasCheckedImportRef.current = true;
      checkAndImportFromGist();
    }
  }, [enabled, isConfigured, checkAndImportFromGist]);

  /**
   * S'abonner aux changements des stores Zustand
   */
  useEffect(() => {
    if (!enabled) return;

    console.log('[AutoSync] Setting up store subscriptions...');

    const unsubscribers = [];

    // S'abonner à chaque store - utiliser triggerRef pour éviter les problèmes de closure
    const notesUnsub = useNotesStore.subscribe(() => {
      console.log('[AutoSync] 📝 Notes store changed');
      triggerRef.current?.();
    });
    unsubscribers.push(notesUnsub);

    const metaUnsub = useProjectMetaStore.subscribe(() => {
      console.log('[AutoSync] 📋 Project meta store changed');
      triggerRef.current?.();
    });
    unsubscribers.push(metaUnsub);

    const diaryUnsub = useDiaryStore.subscribe(() => {
      console.log('[AutoSync] 📔 Diary store changed');
      triggerRef.current?.();
    });
    unsubscribers.push(diaryUnsub);

    const prefsUnsub = usePreferencesStore.subscribe(() => {
      console.log('[AutoSync] ⚙️ Preferences store changed');
      triggerRef.current?.();
    });
    unsubscribers.push(prefsUnsub);

    console.log('[AutoSync] ✅ Initialized - subscribed to 4 Zustand stores');

    // Charger le dernier sync time
    const lastSync = localStorage.getItem('last-sync');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }

    // Cleanup
    return () => {
      console.log('[AutoSync] Cleaning up subscriptions...');
      unsubscribers.forEach(unsub => unsub());
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [enabled]); // Seulement enabled comme dépendance

  /**
   * S'abonner au store du projet actuellement sélectionné
   */
  useEffect(() => {
    if (!enabled) return;

    // Récupérer le projet sélectionné
    const selectedProject = useProjectMetaStore.getState().selectedProject;
    if (!selectedProject) {
      console.log('[AutoSync] No project selected, skipping project data subscription');
      return;
    }

    console.log('[AutoSync] 📁 Subscribing to project data:', selectedProject);

    const unsub = subscribeToProjectData(selectedProject, () => {
      console.log('[AutoSync] 📁 Project data changed:', selectedProject);
      triggerRef.current?.();
    });

    return () => {
      unsub();
    };
  }, [enabled]);

  /**
   * Ré-abonner quand le projet sélectionné change
   */
  const [currentProject, setCurrentProject] = useState(
    useProjectMetaStore.getState().selectedProject
  );

  useEffect(() => {
    if (!enabled) return;

    // Écouter les changements de projet sélectionné
    const unsub = useProjectMetaStore.subscribe((state) => {
      if (state.selectedProject !== currentProject) {
        console.log('[AutoSync] 🔄 Project changed to:', state.selectedProject);
        setCurrentProject(state.selectedProject);
      }
    });

    return () => unsub();
  }, [enabled, currentProject]);

  // Quand le projet change, re-subscribe
  useEffect(() => {
    if (!enabled || !currentProject) return;

    console.log('[AutoSync] 📁 Subscribing to new project:', currentProject);

    const unsub = subscribeToProjectData(currentProject, () => {
      console.log('[AutoSync] 📁 Project data changed:', currentProject);
      triggerRef.current?.();
    });

    return () => unsub();
  }, [enabled, currentProject]);

  /**
   * Écouter les changements de connexion réseau
   */
  useEffect(() => {
    const handleOnline = () => {
      if (syncStatus === 'offline') {
        setSyncStatus('idle');
        // Tenter un sync au retour en ligne
        triggerDebouncedSync();
      }
    };

    const handleOffline = () => {
      setSyncStatus('offline');
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial
    if (!navigator.onLine) {
      setSyncStatus('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncStatus, triggerDebouncedSync]);

  return {
    syncStatus,
    lastSyncTime,
    error,
    isConfigured,
    triggerSync // Pour forcer un sync manuel
  };
}

export default useAutoSync;
