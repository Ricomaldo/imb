// src/stores/useProjectMetaStore.js - Store des métadonnées globales des projets

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProjectMetaStore = create(
  persist(
    (set, get) => ({
      // Projet actuellement sélectionné
      selectedProject: "irimmetabrain",

      // Liste des projets visibles dans le carrousel
      visibleProjects: ["irimmetabrain", "moodcycle", "pepetteszub", "echodesreves"],

      // Catégories et sous-catégories disponibles
      categories: {
        pro: {
          label: "Professionnel",
          subcategories: ["contrat", "maintenance", "consultation"]
        },
        perso: {
          label: "Personnel",
          subcategories: ["demo", "speculatif", "apprentissage", "outil"]
        },
        formation: {
          label: "Formation",
          subcategories: ["cours", "exercice", "certification"]
        }
      },

      // Métadonnées légères des projets (sans contenu lourd)
      projects: {},

      // Actions - Navigation
      selectProject: (projectId) => {
        set({ selectedProject: projectId });
      },

      selectNextProject: () => {
        const state = get();
        const visibleProjects = state.visibleProjects;
        if (visibleProjects.length === 0) return;

        const currentIndex = visibleProjects.indexOf(state.selectedProject);
        const nextIndex = (currentIndex + 1) % visibleProjects.length;
        set({ selectedProject: visibleProjects[nextIndex] });
      },

      selectPreviousProject: () => {
        const state = get();
        const visibleProjects = state.visibleProjects;
        if (visibleProjects.length === 0) return;

        const currentIndex = visibleProjects.indexOf(state.selectedProject);
        const prevIndex = currentIndex === 0 ? visibleProjects.length - 1 : currentIndex - 1;
        set({ selectedProject: visibleProjects[prevIndex] });
      },

      // Actions - Visibilité
      toggleProjectVisibility: (projectId) => {
        set((state) => {
          const isVisible = state.visibleProjects.includes(projectId);
          return {
            visibleProjects: isVisible
              ? state.visibleProjects.filter(id => id !== projectId)
              : [...state.visibleProjects, projectId]
          };
        });
      },

      // Actions - CRUD Métadonnées
      createProject: (projectData) => {
        const projectId = projectData.id || Date.now().toString();
        const state = get();

        // Calculer l'ordre pour le nouveau projet (max + 1)
        const maxOrder = Math.max(
          0,
          ...Object.values(state.projects).map(p => p.order || 0)
        );

        const newProject = {
          id: projectId,
          name: projectData.name,
          type: projectData.type || "tool",
          status: projectData.status || "concept",
          category: projectData.category || "perso",
          subcategory: projectData.subcategory,
          contractType: projectData.contractType,
          deploymentStatus: projectData.deploymentStatus,
          projectNature: projectData.projectNature,
          technologies: projectData.technologies || [],
          client: projectData.client,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          order: projectData.order !== undefined ? projectData.order : maxOrder + 1,
          kanbanColumn: projectData.kanbanColumn !== undefined ? projectData.kanbanColumn : (projectData.category === 'formation' ? null : 'inbox'),
          // Nouveaux champs pour URLs et déploiement
          deployUrl: projectData.deployUrl || null,
          githubRepo: projectData.githubRepo || null,
          frameworkVersion: projectData.frameworkVersion || null,
          deploymentNotes: projectData.deploymentNotes || "",
          environmentUrls: projectData.environmentUrls || {
            staging: null,
            production: null,
            local: null
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set((state) => ({
          projects: {
            ...state.projects,
            [projectId]: newProject
          }
        }));

        return projectId;
      },

      updateProjectMeta: (projectId, updates) => {
        set((state) => ({
          projects: {
            ...state.projects,
            [projectId]: {
              ...state.projects[projectId],
              ...updates,
              updated_at: new Date().toISOString()
            }
          }
        }));
      },

      deleteProject: (projectId) => {
        set((state) => {
          const { [projectId]: _, ...remainingProjects } = state.projects;
          const visibleProjects = state.visibleProjects.filter(id => id !== projectId);

          // Si le projet supprimé était sélectionné, sélectionner le premier visible
          let selectedProject = state.selectedProject;
          if (selectedProject === projectId && visibleProjects.length > 0) {
            selectedProject = visibleProjects[0];
          }

          return {
            projects: remainingProjects,
            visibleProjects,
            selectedProject
          };
        });

        // Nettoyer aussi le store de données du projet
        localStorage.removeItem(`project-data-${projectId}`);
      },

      // Actions - Catégories
      updateProjectCategory: (projectId, category, subcategory) => {
        set((state) => ({
          projects: {
            ...state.projects,
            [projectId]: {
              ...state.projects[projectId],
              category,
              subcategory,
              updated_at: new Date().toISOString()
            }
          }
        }));
      },

      // Actions - Kanban
      moveToColumn: (projectId, column) => {
        set((state) => ({
          projects: {
            ...state.projects,
            [projectId]: {
              ...state.projects[projectId],
              kanbanColumn: column,
              updated_at: new Date().toISOString()
            }
          }
        }));

        // Si on déplace vers EN TÊTE, rendre automatiquement visible
        if (column === 'entete') {
          const state = get();
          if (!state.visibleProjects.includes(projectId)) {
            set((state) => ({
              visibleProjects: [...state.visibleProjects, projectId]
            }));
          }
        }
        // Si on déplace vers PAUSE, retirer de la visibilité
        else if (column === 'pause') {
          set((state) => ({
            visibleProjects: state.visibleProjects.filter(id => id !== projectId)
          }));
        }
      },

      // Actions - Réorganisation
      reorderProjects: (activeId, overId) => {
        if (activeId === overId) return;

        set((state) => {
          const projects = { ...state.projects };
          const projectIds = Object.keys(projects);

          // Trouver les indices actuels
          const oldIndex = projectIds.indexOf(activeId);
          const newIndex = projectIds.indexOf(overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          // Récupérer tous les projets triés par ordre
          const sortedProjects = Object.values(projects).sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          );

          // Trouver les positions dans le tableau trié
          const activeProject = sortedProjects.find(p => p.id === activeId);
          const overProject = sortedProjects.find(p => p.id === overId);

          if (!activeProject || !overProject) return state;

          // Retirer le projet de sa position actuelle
          const filtered = sortedProjects.filter(p => p.id !== activeId);
          const overIndex = filtered.findIndex(p => p.id === overId);

          // Insérer le projet à sa nouvelle position
          filtered.splice(
            overIndex + (activeProject.order > overProject.order ? 0 : 1),
            0,
            activeProject
          );

          // Recalculer les ordres
          const updatedProjects = {};
          filtered.forEach((project, index) => {
            updatedProjects[project.id] = {
              ...project,
              order: index,
              updated_at: new Date().toISOString()
            };
          });

          return { projects: updatedProjects };
        });
      },

      // Helpers
      getCurrentProject: () => {
        const state = get();
        return state.projects[state.selectedProject] || null;
      },

      getVisibleProjects: () => {
        const state = get();
        return state.visibleProjects
          .map(id => state.projects[id])
          .filter(Boolean);
      },

      getAllProjects: () => {
        return get().projects;
      },

      getProjectsSortedByOrder: () => {
        const projects = Object.values(get().projects);
        return projects.sort((a, b) => {
          // Utiliser order si disponible, sinon fallback sur created_at
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return new Date(a.created_at) - new Date(b.created_at);
        });
      }
    }),
    {
      name: "project-meta-store",
      version: 2
    }
  )
);

export default useProjectMetaStore;