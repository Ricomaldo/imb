// src/stores/usePreferencesStore.js - Store unifié pour toutes les préférences utilisateur
// Fusion de useSettingsStore et useRoomsUIStore

import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePreferencesStore = create(
  persist(
    (set, get) => ({
      // === PRÉFÉRENCES APPLICATION (ancien useSettingsStore) ===

      // Pièce de démarrage par défaut (Atelier au centre de la grille 6x5)
      defaultRoom: { x: 2, y: 2 },

      // Disposition personnalisée des pièces (null = utiliser la disposition par défaut)
      customRoomLayout: null,

      // === ÉTATS UI DES ROOMS (ancien useRoomsUIStore) ===

      // État UI par room et par panel
      roomUIStates: {
        chambre: {
          timer: { collapsed: false },
          totem: { collapsed: false },
          mindlog: { collapsed: false },
          mantra: { collapsed: false },
          notes: { collapsed: false },
          navigation: { collapsed: false },
        },
        forge: {
          mainPanel: { collapsed: false },
          notes: { collapsed: false },
        },
        cuisine: {},
        jardin: {},
        boutique: {},
        scriptorium: {},
        bibliotheque: {},
        cave: {},
        sanctuaire: {
          trimental: { collapsed: false }
        },
        comptoir: {},
        laboratoire: {},
      },

      // === ACTIONS POUR PRÉFÉRENCES APPLICATION ===

      // Mettre à jour la pièce de démarrage
      setDefaultRoom: (position) => {
        set({ defaultRoom: position });
      },

      // Récupérer la pièce de démarrage
      getDefaultRoom: () => {
        return get().defaultRoom;
      },

      // Mettre à jour la disposition personnalisée des pièces
      setCustomRoomLayout: (layout) => {
        set({ customRoomLayout: layout });
      },

      // Récupérer la disposition personnalisée
      getCustomRoomLayout: () => {
        return get().customRoomLayout;
      },

      // === ACTIONS POUR ÉTATS UI DES ROOMS ===

      // Récupérer l'état d'un panel (compatible avec ancien useRoomsUIStore)
      getPanelState: (roomId, panelId) => {
        const roomUIStates = get().roomUIStates;

        // Initialiser la room si elle n'existe pas
        if (!roomUIStates[roomId]) {
          set((state) => ({
            roomUIStates: {
              ...state.roomUIStates,
              [roomId]: {},
            },
          }));
          return { collapsed: false }; // État par défaut
        }

        // Initialiser le panel si il n'existe pas
        if (!roomUIStates[roomId][panelId]) {
          return { collapsed: false }; // État par défaut
        }

        return roomUIStates[roomId][panelId];
      },

      // Mettre à jour l'état d'un panel (compatible avec ancien useRoomsUIStore)
      updatePanelState: (roomId, panelId, stateUpdate) => {
        set((state) => {
          const currentRoomState = state.roomUIStates[roomId] || {};
          const currentPanelState = currentRoomState[panelId] || {};

          return {
            roomUIStates: {
              ...state.roomUIStates,
              [roomId]: {
                ...currentRoomState,
                [panelId]: {
                  ...currentPanelState,
                  ...stateUpdate,
                },
              },
            },
          };
        });
      },

      // Réinitialiser une room complète
      resetRoomState: (roomId) => {
        set((state) => ({
          roomUIStates: {
            ...state.roomUIStates,
            [roomId]: {},
          },
        }));
      },

      // Toggle collapse d'un panel (helper pratique)
      togglePanelCollapse: (roomId, panelId) => {
        const currentState = get().getPanelState(roomId, panelId);
        get().updatePanelState(roomId, panelId, {
          collapsed: !currentState.collapsed,
        });
      },

      // === MIGRATION DES DONNÉES ===

      // Fonction pour migrer les anciennes données au premier chargement
      migrateFromOldStores: () => {
        // Migration depuis l'ancien useSettingsStore
        const oldSettingsData = localStorage.getItem("irim-settings-store");
        if (oldSettingsData) {
          try {
            const parsed = JSON.parse(oldSettingsData);
            if (parsed.state?.defaultRoom) {
              set({ defaultRoom: parsed.state.defaultRoom });
            }
            // Supprimer l'ancienne clé après migration
            localStorage.removeItem("irim-settings-store");
          } catch (e) {
            console.error("Erreur migration settings:", e);
          }
        }

        // Migration depuis l'ancien useRoomsUIStore
        const oldRoomsUIData = localStorage.getItem("irim-rooms-ui-store");
        if (oldRoomsUIData) {
          try {
            const parsed = JSON.parse(oldRoomsUIData);
            if (parsed.state?.roomStates) {
              set({ roomUIStates: parsed.state.roomStates });
            }
            // Supprimer l'ancienne clé après migration
            localStorage.removeItem("irim-rooms-ui-store");
          } catch (e) {
            console.error("Erreur migration rooms UI:", e);
          }
        }
      }
    }),
    {
      name: "irim-preferences-store", // Nouvelle clé unifiée
      version: 1,
      // Migrer les données au chargement initial
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.migrateFromOldStores();
        }
      }
    }
  )
);

export default usePreferencesStore;