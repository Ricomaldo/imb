// src/services/useAutoSync.js - Auto-sync vers GitHub Gist avec debounce
//
// Mission: imb-sync-mission - Chantier A
// Élimine la friction Export manuel en sauvegardant automatiquement après modifications
//
// Approche: S'abonne aux stores Zustand via subscribe() pour détecter les changements

import { useState, useEffect, useCallback, useRef } from 'react';
import useNotesStore from '../stores/useNotesStore';
import useProjectMetaStore from '../stores/useProjectMetaStore';
import useDiaryStore from '../stores/useDiaryStore';
import usePreferencesStore from '../stores/usePreferencesStore';
import { subscribeToProjectData } from '../stores/useProjectDataStore';
import projectSyncAdapter from './ProjectSyncAdapter';
import { logger } from '../utils/logger';

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
   * Configure le projectSyncAdapter avec les credentials
   */
  const configureSyncAdapter = useCallback(() => {
    projectSyncAdapter.configure(githubToken, gistId);
    projectSyncAdapter.setPassword(encryptionPassword);
  }, [githubToken, gistId, encryptionPassword]);

  /**
   * Exécute la synchronisation via projectSyncAdapter
   */
  const performSync = useCallback(async () => {
    if (!isConfigured) {
      logger.debug('[AutoSync] Not configured, skipping sync');
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

      // Configurer et utiliser projectSyncAdapter pour l'export
      // (même chiffrement que l'import = compatible)
      configureSyncAdapter();
      const result = await projectSyncAdapter.exportToGist(true);

      if (!result.success) {
        throw new Error(result.error || 'Export failed');
      }

      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('last-sync', now.toISOString());

      setSyncStatus('success');
      logger.debug('[AutoSync] ✅ Sync successful at', now.toLocaleTimeString());

      // Revenir à idle après 3 secondes
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);

    } catch (err) {
      logger.error('[AutoSync] ❌ Sync failed:', err);
      setError(err.message);
      setSyncStatus('error');

      // Revenir à idle après 5 secondes
      setTimeout(() => {
        setSyncStatus('idle');
      }, 5000);
    }
  }, [isConfigured, configureSyncAdapter]);

  /**
   * Déclenche un sync avec debounce
   */
  const triggerDebouncedSync = useCallback(() => {
    if (!enabled || !isConfigured) return;

    // Clear le timer précédent
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    logger.debug('[AutoSync] ⏳ Pending - will sync in', debounceMs / 1000, 'seconds');
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
      logger.debug('[AutoSync] Auto-import skipped: not configured or no gistId');
      return;
    }

    try {
      logger.debug('[AutoSync] 🔍 Checking Gist for newer data...');

      // Configurer le syncAdapter
      configureSyncAdapter();

      // Récupérer les données du Gist
      const gistData = await projectSyncAdapter.syncManager.downloadGist(gistId, true);

      if (!gistData || !gistData.timestamp) {
        logger.debug('[AutoSync] No valid data in Gist');
        return;
      }

      const gistTimestamp = new Date(gistData.timestamp);
      const lastLocalSync = localStorage.getItem('last-sync');
      const localTimestamp = lastLocalSync ? new Date(lastLocalSync) : null;

      logger.debug('[AutoSync] Gist timestamp:', gistTimestamp.toISOString());
      logger.debug('[AutoSync] Local timestamp:', localTimestamp?.toISOString() || 'none');

      // Si le Gist est plus récent, importer
      if (!localTimestamp || gistTimestamp > localTimestamp) {
        logger.debug('[AutoSync] 📥 Gist is newer, importing...');
        setSyncStatus('syncing');

        const result = await projectSyncAdapter.importFromGist(gistId, true);

        if (result.success) {
          logger.debug('[AutoSync] ✅ Auto-import successful!');
          localStorage.setItem('last-sync', gistData.timestamp);
          setLastSyncTime(new Date(gistData.timestamp));
          setSyncStatus('success');

          // Recharger la page pour appliquer les données importées
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          logger.error('[AutoSync] ❌ Auto-import failed:', result.error);
          setSyncStatus('error');
        }
      } else {
        logger.debug('[AutoSync] ✅ Local data is up to date');
      }
    } catch (err) {
      logger.error('[AutoSync] Auto-import error:', err);
      // Ne pas bloquer l'app si l'import échoue (ex: format incompatible)
      logger.debug('[AutoSync] ⚠️ Will re-sync with correct format on next change');
    }
  }, [isConfigured, gistId, configureSyncAdapter]);

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

    logger.debug('[AutoSync] Setting up store subscriptions...');

    const unsubscribers = [];

    // S'abonner à chaque store - utiliser triggerRef pour éviter les problèmes de closure
    const notesUnsub = useNotesStore.subscribe(() => {
      logger.debug('[AutoSync] 📝 Notes store changed');
      triggerRef.current?.();
    });
    unsubscribers.push(notesUnsub);

    const metaUnsub = useProjectMetaStore.subscribe(() => {
      logger.debug('[AutoSync] 📋 Project meta store changed');
      triggerRef.current?.();
    });
    unsubscribers.push(metaUnsub);

    const diaryUnsub = useDiaryStore.subscribe(() => {
      logger.debug('[AutoSync] 📔 Diary store changed');
      triggerRef.current?.();
    });
    unsubscribers.push(diaryUnsub);

    const prefsUnsub = usePreferencesStore.subscribe(() => {
      logger.debug('[AutoSync] ⚙️ Preferences store changed');
      triggerRef.current?.();
    });
    unsubscribers.push(prefsUnsub);

    logger.debug('[AutoSync] ✅ Initialized - subscribed to 4 Zustand stores');

    // Charger le dernier sync time
    const lastSync = localStorage.getItem('last-sync');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }

    // Cleanup
    return () => {
      logger.debug('[AutoSync] Cleaning up subscriptions...');
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
      logger.debug('[AutoSync] No project selected, skipping project data subscription');
      return;
    }

    logger.debug('[AutoSync] 📁 Subscribing to project data:', selectedProject);

    const unsub = subscribeToProjectData(selectedProject, () => {
      logger.debug('[AutoSync] 📁 Project data changed:', selectedProject);
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
        logger.debug('[AutoSync] 🔄 Project changed to:', state.selectedProject);
        setCurrentProject(state.selectedProject);
      }
    });

    return () => unsub();
  }, [enabled, currentProject]);

  // Quand le projet change, re-subscribe
  useEffect(() => {
    if (!enabled || !currentProject) return;

    logger.debug('[AutoSync] 📁 Subscribing to new project:', currentProject);

    const unsub = subscribeToProjectData(currentProject, () => {
      logger.debug('[AutoSync] 📁 Project data changed:', currentProject);
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
