// src/stores/useProjectDataStore.js - Store dynamique pour les données spécifiques d'un projet

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Cache des stores pour éviter de recréer à chaque appel
const storeCache = {};

// Factory pour créer un store de données pour un projet spécifique
const createProjectDataStore = (projectId) => {
  return create(
    persist(
      (set, get) => ({
        // Contenu markdown des panneaux
        roadmapMarkdown: `# Roadmap

## Phase 1 - Setup
- [ ] Initialiser le projet
- [ ] Configurer l'architecture

---

> *Commencez votre roadmap ici* 🚀`,

        todoMarkdown: `# Todo

## 🔴 **Priorité Haute**
- [ ] Première tâche importante

## 🟡 **Priorité Moyenne**
- [ ] Tâche de priorité moyenne

---

**Next:** Définir les prochaines étapes`,

        notesMarkdown: `# Notes du projet

## Contexte
> *Décrivez ici le contexte et les objectifs du projet*

## Idées et réflexions
-

## Documentation
-

---

*Utilisez cet espace pour capturer toutes vos pensées et notes importantes liées au projet* 📝`,

        // État des modules Atelier
        atelierModules: {
          roadmap: { collapsed: true },
          todo: { collapsed: true },
          mindlog: { collapsed: true, mood: "😐", note: "" },
          actions: {
            collapsed: true,
            items: []
          },
          screentv: { collapsed: true, screenshots: [] },
          notes: { collapsed: false }
        },

        // Données structurées legacy (pour compatibilité)
        roadmap: [],
        todo: [],
        idees: [],
        prochaineAction: null,

        // Actions - Contenu Markdown
        updateRoadmapMarkdown: (content) => {
          set({ roadmapMarkdown: content });
        },

        updateTodoMarkdown: (content) => {
          set({ todoMarkdown: content });
        },

        updateNotesMarkdown: (content) => {
          set({ notesMarkdown: content });
        },

        // Actions - Modules Atelier
        updateModuleState: (moduleName, stateUpdate) => {
          set((state) => ({
            atelierModules: {
              ...state.atelierModules,
              [moduleName]: {
                ...state.atelierModules[moduleName],
                ...stateUpdate
              }
            }
          }));
        },

        getModuleState: (moduleName) => {
          const state = get();
          if (!state.atelierModules?.[moduleName]) {
            const defaultModules = {
              roadmap: { collapsed: true },
              todo: { collapsed: true },
              mindlog: { collapsed: true, mood: "😐", note: "" },
              actions: { collapsed: true, items: [] },
              screentv: { collapsed: true, screenshots: [] },
              notes: { collapsed: false }
            };
            return defaultModules[moduleName] || { collapsed: true };
          }
          return state.atelierModules[moduleName];
        },

        // Actions - Legacy (pour compatibilité)
        addRoadmapItem: (milestone) => {
          set((state) => ({
            roadmap: [...state.roadmap, {
              id: Date.now(),
              ...milestone,
              created_at: new Date().toISOString()
            }]
          }));
        },

        addTodoItem: (task) => {
          set((state) => ({
            todo: [...state.todo, {
              id: Date.now(),
              status: "pending",
              ...task,
              created_at: new Date().toISOString()
            }]
          }));
        },

        updateTodoStatus: (todoId, status) => {
          set((state) => ({
            todo: state.todo.map(item =>
              item.id === todoId
                ? { ...item, status, updated_at: new Date().toISOString() }
                : item
            )
          }));
        },

        addIdea: (idea) => {
          set((state) => ({
            idees: [...state.idees, {
              id: Date.now(),
              status: "new",
              ...idea,
              created_at: new Date().toISOString()
            }]
          }));
        },

        updateNextAction: (action) => {
          set({
            prochaineAction: {
              ...action,
              updated_at: new Date().toISOString()
            }
          });
        },

        // Helper pour obtenir les stats
        getProjectStats: () => {
          const state = get();
          return {
            totalTodos: state.todo.length,
            completedTodos: state.todo.filter(t => t.status === "completed").length,
            totalIdeas: state.idees.length,
            roadmapItems: state.roadmap.length,
            hasNextAction: !!state.prochaineAction
          };
        },

        // Initialisation avec des données existantes
        initializeWithData: (data) => {
          set({
            roadmapMarkdown: data.roadmapMarkdown || get().roadmapMarkdown,
            todoMarkdown: data.todoMarkdown || get().todoMarkdown,
            notesMarkdown: data.notesMarkdown || get().notesMarkdown,
            atelierModules: data.atelierModules || get().atelierModules,
            roadmap: data.roadmap || [],
            todo: data.todo || [],
            idees: data.idees || [],
            prochaineAction: data.prochaineAction || null
          });
        }
      }),
      {
        name: `project-data-${projectId}`,
        version: 1
      }
    )
  );
};

// Hook principal pour accéder au store d'un projet
export const useProjectData = (projectId) => {
  if (!projectId) {
    throw new Error("projectId is required for useProjectData");
  }

  // Utiliser le cache ou créer un nouveau store
  if (!storeCache[projectId]) {
    storeCache[projectId] = createProjectDataStore(projectId);
  }

  return storeCache[projectId]();
};

// Fonction utilitaire pour nettoyer le cache d'un projet
export const clearProjectDataCache = (projectId) => {
  if (storeCache[projectId]) {
    delete storeCache[projectId];
  }
};

// Fonction pour obtenir directement les données d'un projet (sans hook)
export const getProjectData = (projectId) => {
  if (!storeCache[projectId]) {
    storeCache[projectId] = createProjectDataStore(projectId);
  }
  return storeCache[projectId].getState();
};

// Fonction pour s'abonner aux changements d'un store projet
export const subscribeToProjectData = (projectId, callback) => {
  if (!projectId) return () => {};

  if (!storeCache[projectId]) {
    storeCache[projectId] = createProjectDataStore(projectId);
  }

  return storeCache[projectId].subscribe(callback);
};

// Fonction pour obtenir tous les IDs de projets dans le cache
export const getCachedProjectIds = () => Object.keys(storeCache);

export default useProjectData;