// src/stores/useNotesStore.js - Store Notes/Dev (Infrastructure/méta-développement)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { debounce } from '../utils/debounce';
import { defaultNotesData } from './defaultData';

// Vérifier si c'est la première utilisation
const isFirstRun = () => {
  const initialized = localStorage.getItem('irim-initialized');
  return !initialized;
};

// Récupérer les données initiales
const getInitialData = () => {
  if (isFirstRun()) {
    // Première utilisation : données de démo riches
    localStorage.setItem('irim-initialized', 'true');
    return defaultNotesData;
  }
  // Utilisations suivantes : chaînes vides (les vraies données viendront du localStorage)
  return {
    roomNotes: {
      sanctuaire: '',
      chambre: '',
      cuisine: '',
      comptoir: '',
      jardin: '',
      atelier: '',
      forge: '',
      boutique: '',
      scriptorium: '',
      bibliotheque: '',
      cave: ''
    },
    sideTowerNotes: {
      general: ''
    },
    companionNotes: {
      devNote: '',
      lastSync: null
    }
  };
};

const initialData = getInitialData();

const useNotesStore = create(
  persist(
    (set, get) => ({
      // État des notes avec données initiales
      roomNotes: initialData.roomNotes,
      sideTowerNotes: initialData.sideTowerNotes,
      companionNotes: initialData.companionNotes,

      // Actions pour room notes
      updateRoomNote: (roomType, content) => {
        set((state) => ({
          roomNotes: {
            ...state.roomNotes,
            [roomType]: content
          }
        }));
      },

      // Actions pour side tower notes
      updateSideTowerNote: (content) => {
        set((state) => ({
          sideTowerNotes: {
            ...state.sideTowerNotes,
            general: content
          }
        }));
      },

      // Helper pour récupérer une note spécifique
      getRoomNote: (roomType) => {
        return get().roomNotes[roomType] || '';
      },

      getSideTowerNote: () => {
        return get().sideTowerNotes.general || '';
      },

      // Actions pour companion notes
      updateCompanionNote: (key, value) => {
        set((state) => ({
          companionNotes: {
            ...state.companionNotes,
            [key]: value,
            lastSync: new Date().toISOString()
          }
        }));
      },

      getCompanionNote: (key) => {
        return get().companionNotes[key] || '';
      },

      // Actions de maintenance
      clearAllNotes: () => {
        set({
          roomNotes: {
            sanctuaire: '', chambre: '', cuisine: '', comptoir: '',
            jardin: '', atelier: '', forge: '', boutique: '',
            scriptorium: '', bibliotheque: '', cave: ''
          },
          sideTowerNotes: { general: '' },
          companionNotes: { devNote: '', lastSync: null }
        });
      },

      // Export/Import pour migration
      exportNotes: () => {
        const state = get();
        return {
          roomNotes: state.roomNotes,
          sideTowerNotes: state.sideTowerNotes,
          companionNotes: state.companionNotes,
          exported_at: new Date().toISOString()
        };
      },

      importNotes: (data) => {
        if (data.roomNotes) {
          set((state) => ({
            roomNotes: { ...state.roomNotes, ...data.roomNotes }
          }));
        }
        if (data.sideTowerNotes) {
          set((state) => ({
            sideTowerNotes: { ...state.sideTowerNotes, ...data.sideTowerNotes }
          }));
        }
        if (data.companionNotes) {
          set((state) => ({
            companionNotes: { ...state.companionNotes, ...data.companionNotes }
          }));
        }
      },

      // Import complet pour synchronisation (remplace tout)
      importData: (data) => {
        set({
          roomNotes: data.roomNotes || {},
          sideTowerNotes: data.sideTowerNotes || {},
          companionNotes: data.companionNotes || { devNote: '', lastSync: null }
        });
      }
    }),
    {
      name: 'irim-notes-store', // localStorage key
      version: 1,
      // Migration des anciennes données si nécessaire
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migration depuis l'ancien format (4 pièces seulement)
          const oldRoomNotes = persistedState.roomNotes || {};

          return {
            ...persistedState,
            roomNotes: {
              // Préserver les anciennes notes
              chambre: oldRoomNotes.chambre || '',
              atelier: oldRoomNotes.atelier || '',
              forge: oldRoomNotes.forge || '',
              boutique: oldRoomNotes.boutique || '',

              // Ajouter les nouvelles pièces vides
              sanctuaire: '',
              cuisine: '',
              comptoir: '',
              jardin: '',
              scriptorium: '',
              bibliotheque: '',
              cave: ''
            }
          };
        }
        return persistedState;
      }
    }
  )
);

// Helper avec debounce pour les updates fréquentes
export const debouncedUpdateRoomNote = debounce((roomType, content) => {
  useNotesStore.getState().updateRoomNote(roomType, content);
}, 500);

export const debouncedUpdateSideTowerNote = debounce((content) => {
  useNotesStore.getState().updateSideTowerNote(content);
}, 500);

// Exposer le store pour les outils de développement
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.__ZUSTAND_STORES__ = window.__ZUSTAND_STORES__ || {};
  window.__ZUSTAND_STORES__.notes = useNotesStore;
}

export default useNotesStore;