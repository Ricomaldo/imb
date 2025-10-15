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

      // Moments OUI - Capture moments de plénitude (Widget Sanctuaire)
      momentsOui: {
        // Moments capturés
        moments: [],

        // Métadonnées et statistiques
        metadata: {
          totalMoments: 0,
          firstMomentDate: null,
          lastMomentDate: null,
          needsStats: {} // Format: { 'needId': count }
        },

        // Configuration du widget
        settings: {
          notificationEnabled: false,      // Toast 20h-22h
          showFloatingButton: true,        // FAB Sanctuaire
          autoSuggestTags: true            // Suggestions intelligentes
        }
      },

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
      },

      // ==================== ACTIONS MOMENTS OUI ====================

      /**
       * Ajouter un nouveau moment OUI
       * @param {Object} momentData - { quand, quoi, pourquoi, tags }
       * @returns {number} ID du moment créé
       */
      addMomentOui: (momentData) => {
        const momentId = Date.now();
        const now = new Date().toISOString();

        set(state => {
          const newMoment = {
            id: momentId,
            timestamp: momentData.quand || now,
            quoi: momentData.quoi || '',
            pourquoi: momentData.pourquoi || '',
            tags: momentData.tags || [],
            archived: false,
            createdAt: now,
            modifiedAt: now
          };

          // Mettre à jour les statistiques des besoins
          const updatedNeedsStats = { ...state.momentsOui.metadata.needsStats };
          momentData.tags?.forEach(tagId => {
            updatedNeedsStats[tagId] = (updatedNeedsStats[tagId] || 0) + 1;
          });

          return {
            momentsOui: {
              ...state.momentsOui,
              moments: [...state.momentsOui.moments, newMoment],
              metadata: {
                ...state.momentsOui.metadata,
                totalMoments: state.momentsOui.metadata.totalMoments + 1,
                firstMomentDate: state.momentsOui.metadata.firstMomentDate || now,
                lastMomentDate: now,
                needsStats: updatedNeedsStats
              }
            }
          };
        });

        return momentId;
      },

      /**
       * Mettre à jour un moment existant
       * @param {number} momentId - ID du moment
       * @param {Object} updates - Champs à mettre à jour
       */
      updateMomentOui: (momentId, updates) => set(state => {
        const momentIndex = state.momentsOui.moments.findIndex(m => m.id === momentId);
        if (momentIndex === -1) return state;

        const oldMoment = state.momentsOui.moments[momentIndex];
        const updatedMoment = {
          ...oldMoment,
          ...updates,
          modifiedAt: new Date().toISOString()
        };

        // Recalculer les stats si les tags ont changé
        let updatedNeedsStats = { ...state.momentsOui.metadata.needsStats };
        if (updates.tags && JSON.stringify(oldMoment.tags) !== JSON.stringify(updates.tags)) {
          // Retirer les anciens tags
          oldMoment.tags.forEach(tagId => {
            if (updatedNeedsStats[tagId] > 0) {
              updatedNeedsStats[tagId]--;
            }
          });
          // Ajouter les nouveaux tags
          updates.tags.forEach(tagId => {
            updatedNeedsStats[tagId] = (updatedNeedsStats[tagId] || 0) + 1;
          });
        }

        const updatedMoments = [...state.momentsOui.moments];
        updatedMoments[momentIndex] = updatedMoment;

        return {
          momentsOui: {
            ...state.momentsOui,
            moments: updatedMoments,
            metadata: {
              ...state.momentsOui.metadata,
              needsStats: updatedNeedsStats
            }
          }
        };
      }),

      /**
       * Supprimer définitivement un moment
       * @param {number} momentId - ID du moment
       */
      deleteMomentOui: (momentId) => set(state => {
        const moment = state.momentsOui.moments.find(m => m.id === momentId);
        if (!moment) return state;

        // Mettre à jour les stats des besoins
        const updatedNeedsStats = { ...state.momentsOui.metadata.needsStats };
        moment.tags.forEach(tagId => {
          if (updatedNeedsStats[tagId] > 0) {
            updatedNeedsStats[tagId]--;
          }
        });

        return {
          momentsOui: {
            ...state.momentsOui,
            moments: state.momentsOui.moments.filter(m => m.id !== momentId),
            metadata: {
              ...state.momentsOui.metadata,
              totalMoments: state.momentsOui.metadata.totalMoments - 1,
              needsStats: updatedNeedsStats
            }
          }
        };
      }),

      /**
       * Archiver/désarchiver un moment (masquer sans supprimer)
       * @param {number} momentId - ID du moment
       * @param {boolean} archived - true pour archiver, false pour désarchiver
       */
      archiveMomentOui: (momentId, archived = true) => set(state => ({
        momentsOui: {
          ...state.momentsOui,
          moments: state.momentsOui.moments.map(m =>
            m.id === momentId ? { ...m, archived, modifiedAt: new Date().toISOString() } : m
          )
        }
      })),

      /**
       * Obtenir les moments avec filtres optionnels
       * @param {Object} filters - { period, tags, keyword, includeArchived }
       * @returns {Array} Moments filtrés
       */
      getMomentsOui: (filters = {}) => {
        const state = get();
        let moments = [...state.momentsOui.moments];

        // Exclure archivés par défaut
        if (!filters.includeArchived) {
          moments = moments.filter(m => !m.archived);
        }

        // Filtrage par période
        if (filters.period) {
          const now = new Date();
          const periodMap = {
            today: 0,
            week: 7,
            month: 30,
            quarter: 90,
            semester: 180
          };
          const days = periodMap[filters.period];
          if (days !== undefined) {
            const cutoff = new Date(now - days * 24 * 60 * 60 * 1000);
            moments = moments.filter(m => new Date(m.timestamp) >= cutoff);
          }
        }

        // Filtrage par besoins (tags)
        if (filters.tags && filters.tags.length > 0) {
          moments = moments.filter(m =>
            m.tags.some(tag => filters.tags.includes(tag))
          );
        }

        // Filtrage par mot-clé
        if (filters.keyword) {
          const kw = filters.keyword.toLowerCase();
          moments = moments.filter(m =>
            m.quoi.toLowerCase().includes(kw) ||
            m.pourquoi.toLowerCase().includes(kw)
          );
        }

        // Tri chronologique inverse par défaut (plus récent en premier)
        return moments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      },

      /**
       * Obtenir les statistiques de la semaine courante
       * @returns {Object} { weekNumber, year, totalMoments, topNeeds }
       */
      getWeeklyStats: () => {
        const state = get();
        const now = new Date();

        // Calculer le numéro de semaine
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const daysSinceStart = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);

        // Obtenir le début de la semaine (lundi)
        const startOfWeek = new Date(now);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        // Filtrer les moments de cette semaine
        const weekMoments = state.momentsOui.moments.filter(m => {
          const momentDate = new Date(m.timestamp);
          return momentDate >= startOfWeek && !m.archived;
        });

        // Compter les besoins de la semaine
        const weekNeedsStats = {};
        weekMoments.forEach(m => {
          m.tags.forEach(tagId => {
            weekNeedsStats[tagId] = (weekNeedsStats[tagId] || 0) + 1;
          });
        });

        // Top 5 besoins de la semaine
        const topNeeds = Object.entries(weekNeedsStats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([needId, count]) => ({ needId, count }));

        return {
          weekNumber,
          year: now.getFullYear(),
          totalMoments: weekMoments.length,
          topNeeds
        };
      },

      /**
       * Obtenir les statistiques des besoins sur une période
       * @param {string} period - 'week' | 'month' | 'quarter' | 'semester' | 'all'
       * @returns {Array} Stats triées par fréquence { needId, count, percentage }
       */
      getNeedsStats: (period = 'all') => {
        const state = get();
        const moments = get().getMomentsOui({ period });

        const needsCount = {};
        let totalTags = 0;

        moments.forEach(m => {
          m.tags.forEach(tagId => {
            needsCount[tagId] = (needsCount[tagId] || 0) + 1;
            totalTags++;
          });
        });

        return Object.entries(needsCount)
          .map(([needId, count]) => ({
            needId,
            count,
            percentage: totalTags > 0 ? Math.round((count / totalTags) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count);
      },

      /**
       * Mettre à jour les settings du widget Moments OUI
       * @param {Object} updates - Settings à mettre à jour
       */
      updateMomentsOuiSettings: (updates) => set(state => ({
        momentsOui: {
          ...state.momentsOui,
          settings: {
            ...state.momentsOui.settings,
            ...updates
          }
        }
      })),

      /**
       * Obtenir un moment spécifique par ID
       * @param {number} momentId - ID du moment
       * @returns {Object|null} Moment ou null
       */
      getMomentOuiById: (momentId) => {
        const state = get();
        return state.momentsOui.moments.find(m => m.id === momentId) || null;
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