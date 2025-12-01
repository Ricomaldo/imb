// src/contexts/SyncContext.jsx - Contexte pour l'état de synchronisation
//
// Permet à ControlTower d'accéder à l'état du sync sans prop drilling

import React, { createContext, useContext } from 'react';
import { useAutoSync } from '../services/useAutoSync';

const SyncContext = createContext(null);

/**
 * Provider pour l'état de synchronisation
 */
export function SyncProvider({ children }) {
  const syncState = useAutoSync({
    debounceMs: 30000, // 30 secondes
    enabled: true
  });

  return (
    <SyncContext.Provider value={syncState}>
      {children}
    </SyncContext.Provider>
  );
}

/**
 * Hook pour accéder à l'état de sync
 */
export function useSyncStatus() {
  const context = useContext(SyncContext);
  if (!context) {
    // Retourner un état par défaut si hors du provider
    return {
      syncStatus: 'idle',
      lastSyncTime: null,
      error: null,
      isConfigured: false,
      triggerSync: () => {}
    };
  }
  return context;
}

export default SyncContext;
