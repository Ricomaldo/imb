// src/services/useAutoSync.js - Auto-sync vers GitHub Gist avec debounce
//
// Mission: imb-sync-mission - Chantier A
// Élimine la friction Export manuel en sauvegardant automatiquement après modifications

import { useState, useEffect, useCallback, useRef } from 'react';
import CryptoJS from 'crypto-js';

// Clés localStorage des stores IMB à surveiller
const IMB_STORE_KEYS = [
  'irim-notes-store',
  'project-meta-store',
  'diary-storage',
  'irim-preferences-store'
];

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
  const originalSetItemRef = useRef(null);
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
      console.log('[AutoSync] Sync successful at', now.toLocaleTimeString());

      // Revenir à idle après 3 secondes
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);

    } catch (err) {
      console.error('[AutoSync] Sync failed:', err);
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
   * Vérifie si une clé localStorage est un store IMB
   */
  const isIMBStoreKey = useCallback((key) => {
    return IMB_STORE_KEYS.includes(key) || key.startsWith(PROJECT_DATA_PREFIX);
  }, []);

  /**
   * Setup: Intercepter localStorage.setItem pour détecter les changements
   */
  useEffect(() => {
    if (!enabled || isInitializedRef.current) return;

    // Sauvegarder la référence originale
    originalSetItemRef.current = localStorage.setItem.bind(localStorage);

    // Intercepter setItem
    localStorage.setItem = function(key, value) {
      // Appeler l'original
      originalSetItemRef.current(key, value);

      // Si c'est un store IMB, déclencher le sync
      if (isIMBStoreKey(key)) {
        triggerDebouncedSync();
      }
    };

    isInitializedRef.current = true;
    console.log('[AutoSync] Initialized - watching localStorage changes');

    // Charger le dernier sync time
    const lastSync = localStorage.getItem('last-sync');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }

    // Cleanup
    return () => {
      if (originalSetItemRef.current) {
        localStorage.setItem = originalSetItemRef.current;
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      isInitializedRef.current = false;
    };
  }, [enabled, isIMBStoreKey, triggerDebouncedSync]);

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
