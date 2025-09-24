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

      // Daily Diary - Journal quotidien
      dailyDiary: {}, // Format: { 'YYYY-MM-DD': 'contenu markdown' }

      // Archives mensuelles - Format: { 'YYYY-MM': { 'YYYY-MM-DD': 'contenu' } }
      monthlyArchives: {},

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

      // Actions pour le journal quotidien
      getDailyEntry: (date) => {
        return get().dailyDiary[date] || '';
      },

      updateDailyEntry: (date, content) => set(state => ({
        dailyDiary: {
          ...state.dailyDiary,
          [date]: content
        }
      })),

      // Actions pour l'archivage quotidien (archive les jours passés)
      archiveMonthlyEntries: () => {
        const state = get();
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM

        // Trouver toutes les entrées qui ne sont pas d'aujourd'hui
        const entriesToArchive = {};
        const remainingEntries = {};

        Object.entries(state.dailyDiary).forEach(([date, content]) => {
          const entryMonth = date.slice(0, 7);

          if (date < todayStr && content.trim() !== '') {
            // Archiver toutes les entrées avant aujourd'hui qui ne sont pas vides
            if (!entriesToArchive[entryMonth]) {
              entriesToArchive[entryMonth] = {};
            }
            entriesToArchive[entryMonth][date] = content;
          } else if (date === todayStr) {
            // Garder uniquement l'entrée d'aujourd'hui
            remainingEntries[date] = content;
          }
        });

        // Mettre à jour le store avec les archives et nettoyer le journal quotidien
        if (Object.keys(entriesToArchive).length > 0) {
          set(state => ({
            monthlyArchives: {
              ...state.monthlyArchives,
              ...Object.entries(entriesToArchive).reduce((acc, [month, entries]) => {
                acc[month] = {
                  ...(state.monthlyArchives[month] || {}),
                  ...entries
                };
                return acc;
              }, {})
            },
            dailyDiary: remainingEntries
          }));
        }
      },

      // Récupérer les archives d'un mois spécifique
      getMonthlyArchive: (yearMonth) => {
        return get().monthlyArchives[yearMonth] || {};
      },

      // Récupérer la liste des mois archivés
      getArchivedMonths: () => {
        return Object.keys(get().monthlyArchives).sort((a, b) => b.localeCompare(a));
      },

      // Exporter un mois en markdown
      exportMonthToMarkdown: (yearMonth) => {
        const archive = get().monthlyArchives[yearMonth];
        if (!archive) return '';

        const monthName = new Date(yearMonth + '-01').toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long'
        });

        let markdown = `# Journal - ${monthName}\n\n`;

        Object.entries(archive)
          .sort(([a], [b]) => a.localeCompare(b))
          .forEach(([date, content]) => {
            const dateObj = new Date(date + 'T12:00:00');
            const dayName = dateObj.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            });
            markdown += `## ${dayName}\n\n${content}\n\n---\n\n`;
          });

        return markdown;
      },

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