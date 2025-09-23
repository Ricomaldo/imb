// src/stores/useDiaryStore.js
// Store pour le journal personnel (Chambre) - MindLog et futures entrées

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDiaryStore = create(
  persist(
    (set, get) => ({
      // État actuel du MindLog personnel
      mindlog: {
        current: {
          mood: 3,
          energy: 3,
          focus: 3,
          note: ''
        },
        logs: [], // Historique des logs [{timestamp, mood, energy, focus, note}]
        markdownNotes: '' // Notes personnelles en markdown
      },

      // Actions MindLog
      updateMindLogCurrent: (updates) => set(state => ({
        mindlog: {
          ...state.mindlog,
          current: {
            ...state.mindlog.current,
            ...updates
          }
        }
      })),

      addMindLogEntry: (entry) => set(state => ({
        mindlog: {
          ...state.mindlog,
          logs: [
            ...state.mindlog.logs,
            {
              ...entry,
              timestamp: entry.timestamp || new Date().toISOString(),
              id: Date.now(),
              category: null, // Catégorie de tri mental
              categoryDate: null, // Date de catégorisation
              hidden: false // Visible par défaut
            }
          ].slice(-50) // Garder les 50 dernières entrées
        }
      })),

      updateMarkdownNotes: (notes) => set(state => ({
        mindlog: {
          ...state.mindlog,
          markdownNotes: notes
        }
      })),

      clearMindLogHistory: () => set(state => ({
        mindlog: {
          ...state.mindlog,
          logs: []
        }
      })),

      // Futures fonctionnalités journal
      entries: [], // Pour de futures entrées journal complètes

      addDiaryEntry: (entry) => set(state => ({
        entries: [
          ...state.entries,
          {
            ...entry,
            id: Date.now(),
            timestamp: new Date().toISOString()
          }
        ]
      })),

      // Getters
      getTodayLogs: () => {
        const today = new Date().toDateString();
        return get().mindlog.logs.filter(log =>
          new Date(log.timestamp).toDateString() === today
        );
      },

      getLastLog: () => {
        const logs = get().mindlog.logs;
        return logs[logs.length - 1] || null;
      },

      // Actions pour le tri mental
      updateLogCategory: (logId, category) => set(state => ({
        mindlog: {
          ...state.mindlog,
          logs: state.mindlog.logs.map(log =>
            log.id === logId
              ? {
                  ...log,
                  category,
                  categoryDate: category ? new Date().toISOString() : null
                }
              : log
          )
        }
      })),

      getUncategorizedLogs: () => {
        return get().mindlog.logs.filter(log => !log.category);
      },

      getCategorizedLogs: (category) => {
        return get().mindlog.logs.filter(log => log.category === category);
      },

      // Action pour cacher/montrer une entrée
      toggleLogVisibility: (logId) => set(state => ({
        mindlog: {
          ...state.mindlog,
          logs: state.mindlog.logs.map(log =>
            log.id === logId
              ? { ...log, hidden: !log.hidden }
              : log
          )
        }
      })),

      // Action pour supprimer définitivement une entrée
      deleteLog: (logId) => set(state => ({
        mindlog: {
          ...state.mindlog,
          logs: state.mindlog.logs.filter(log => log.id !== logId)
        }
      })),

      // Obtenir les logs visibles (pour MindLog dans Chambre)
      getVisibleLogs: () => {
        return get().mindlog.logs.filter(log => !log.hidden);
      },

      // Obtenir tous les logs incluant les cachés (pour Sanctuaire)
      getAllLogs: () => {
        return get().mindlog.logs;
      }
    }),
    {
      name: 'diary-storage',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migration future si nécessaire
        }
        return persistedState;
      }
    }
  )
);

export default useDiaryStore;