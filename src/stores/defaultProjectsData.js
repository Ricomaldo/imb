// src/stores/defaultProjectsData.js - Données par défaut pour l'initialisation des projets

export const defaultProjectsData = {
  // Métadonnées globales (pour useProjectMetaStore)
  meta: {
    selectedProject: "irimmetabrain",
    visibleProjects: ["irimmetabrain", "moodcycle", "pepetteszub", "echodesreves"],
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
    projects: {
      // Projet 1 : IRIMMetaBrain
      irimmetabrain: {
        id: "irimmetabrain",
        name: "IRIM MetaBrain",
        type: "tool",
        status: "dev_actif",
        category: "perso",
        subcategory: "outil",
        contractType: null,
        deploymentStatus: "local",
        projectNature: "fullstack",
        technologies: ["React", "Zustand", "Styled-Components", "Vite"],
        client: null,
        startDate: "2024-09-01",
        endDate: null,
        order: 0,
        // Nouveaux champs URLs et déploiement
        deployUrl: null,
        githubRepo: "irimwebforge/IRIMMetaBrain",
        frameworkVersion: "React 18.2, Node 20.11, Vite 5.0",
        deploymentNotes: "Application locale avec possibilité de sync GitHub Gist",
        environmentUrls: {
          staging: null,
          production: null,
          local: "http://localhost:5173"
        },
        created_at: "2024-09-01T00:00:00.000Z",
        updated_at: new Date().toISOString()
      },

      // Projet 2 : MoodCycle
      moodcycle: {
        id: "moodcycle",
        name: "MoodCycle",
        type: "wellness",
        status: "concept",
        category: "perso",
        subcategory: "speculatif",
        contractType: null,
        deploymentStatus: "local",
        projectNature: "mobile",
        technologies: ["React Native", "TypeScript", "Expo"],
        client: null,
        startDate: "2024-10-01",
        endDate: null,
        order: 1,
        // Nouveaux champs URLs et déploiement
        deployUrl: null,
        githubRepo: null,
        frameworkVersion: "React Native 0.72, Expo SDK 49",
        deploymentNotes: "App mobile pour tracking d'humeur - Phase concept",
        environmentUrls: {
          staging: null,
          production: null,
          local: null
        },
        created_at: "2024-10-01T00:00:00.000Z",
        updated_at: new Date().toISOString()
      },

      // Projet 3 : Les Pepettes Zub
      pepetteszub: {
        id: "pepetteszub",
        name: "Les Pepettes Zub",
        type: "finance",
        status: "dev_actif",
        category: "perso",
        subcategory: "demo",
        contractType: null,
        deploymentStatus: "production",
        projectNature: "webapp",
        technologies: ["React", "Node.js", "PostgreSQL"],
        client: null,
        startDate: "2024-06-01",
        endDate: null,
        order: 2,
        // Nouveaux champs URLs et déploiement
        deployUrl: "https://pepetteszub.com",
        githubRepo: "private/pepetteszub",
        frameworkVersion: "React 18.2, Node 20.11, PostgreSQL 15",
        deploymentNotes: "Déployé sur Vercel avec base de données Supabase",
        environmentUrls: {
          staging: "https://staging.pepetteszub.com",
          production: "https://pepetteszub.com",
          local: "http://localhost:3000"
        },
        created_at: "2024-06-01T00:00:00.000Z",
        updated_at: new Date().toISOString()
      },

      // Projet 4 : L'Echo des Rêves
      echodesreves: {
        id: "echodesreves",
        name: "L'Echo des Rêves",
        type: "creative",
        status: "vision",
        category: "perso",
        subcategory: "speculatif",
        contractType: null,
        deploymentStatus: "concept",
        projectNature: "ai",
        technologies: ["Python", "TensorFlow", "React"],
        client: null,
        startDate: "2024-11-01",
        endDate: null,
        order: 3,
        // Nouveaux champs URLs et déploiement
        deployUrl: null,
        githubRepo: null,
        frameworkVersion: "Python 3.11, TensorFlow 2.14, React 18.2",
        deploymentNotes: "Projet IA générative pour analyse et création artistique de rêves",
        environmentUrls: {
          staging: null,
          production: null,
          local: null
        },
        created_at: "2024-11-01T00:00:00.000Z",
        updated_at: new Date().toISOString()
      }
    }
  },

  // Données spécifiques par projet (pour useProjectDataStore)
  projectData: {
    irimmetabrain: {
      roadmapMarkdown: `# Roadmap - IRIM MetaBrain

## 🚀 Phase 1 - Architecture Fondamentale
- [x] Système de rooms 4x3
- [x] Navigation inter-rooms fluide
- [x] Stores Zustand pour état global
- [x] Système de notes par room

## 🔧 Phase 2 - Outils de Production
- [x] Atelier avec modules collapsibles
- [x] Système de projets multi-stores
- [x] ProjectCarousel pour navigation
- [ ] Intégration IA pour suggestions

## 🎨 Phase 3 - Polish & UX
- [ ] Animations de transition
- [ ] Thèmes personnalisables
- [ ] Mode sombre/clair
- [ ] Raccourcis clavier globaux

---

> *MetaBrain : Un second cerveau pour développeurs* 🧠`,

      todoMarkdown: `# Todo - Sprint Current

## 🔴 **Priorité Haute**
- [x] Migration vers architecture multi-stores
- [x] Créer ProjectOverviewModal
- [ ] Stabiliser synchronisation GitHub Gist
- [ ] Tests de migration données

## 🟡 **Priorité Moyenne**
- [ ] Améliorer drag & drop des cartes projet
- [ ] Ajouter animations de réorganisation
- [ ] Créer système de badges dynamiques

## 🟢 **Nice to Have**
- [ ] Export PDF des projets
- [ ] Timeline visuelle roadmap
- [ ] Statistiques d'utilisation

---

**Next:** Focus sur la stabilisation de la sync`,

      atelierModules: {
        roadmap: { collapsed: false },
        todo: { collapsed: false },
        mindlog: { collapsed: true, mood: "🚀", note: "Migration multi-stores en cours!" },
        actions: {
          collapsed: true,
          items: [
            { id: 1, text: "Review PR", completed: false },
            { id: 2, text: "Update docs", completed: true }
          ]
        },
        screentv: { collapsed: true, screenshots: [] }
      },

      // Legacy data (pour compatibilité)
      roadmap: [],
      todo: [],
      idees: [],
      prochaineAction: null
    },

    moodcycle: {
      roadmapMarkdown: `# Roadmap - MoodCycle

## Phase 1 - MVP
- [ ] Design système de tracking d'humeur
- [ ] Calendrier avec visualisation
- [ ] Export de données

## Phase 2 - Analytics
- [ ] Graphiques de tendances
- [ ] Corrélations avec activités
- [ ] Suggestions personnalisées

---

> *Track your mood, understand your patterns* 🌙`,

      todoMarkdown: `# Todo - MoodCycle

## 🔴 **Urgent**
- [ ] Définir schema de données
- [ ] Créer mockups UI
- [ ] Rechercher APIs météo pour corrélations

## 🟡 **Important**
- [ ] Benchmark apps similaires
- [ ] Définir palette de couleurs
- [ ] Créer logo

---

**Status:** Conceptualisation`,

      atelierModules: {
        roadmap: { collapsed: true },
        todo: { collapsed: true },
        mindlog: { collapsed: true, mood: "😊", note: "Idée prometteuse!" },
        actions: { collapsed: true, items: [] },
        screentv: { collapsed: true, screenshots: [] }
      },

      roadmap: [],
      todo: [],
      idees: [],
      prochaineAction: null
    },

    pepetteszub: {
      roadmapMarkdown: `# Roadmap - Les Pepettes Zub

## ✅ Phase 1 - Core Features
- [x] Système de comptes
- [x] Catégorisation dépenses
- [x] Dashboard avec graphiques
- [x] Export CSV

## 🚧 Phase 2 - Optimisations
- [ ] Prédictions ML dépenses
- [ ] Budgets par catégorie
- [ ] Alertes personnalisées
- [ ] App mobile

---

> *Gérez vos finances avec style* 💰`,

      todoMarkdown: `# Todo - Pepettes Zub

## 🔴 **Bugs à fixer**
- [ ] Fix calcul pourcentages dashboard
- [ ] Corriger timezone dates
- [ ] Optimiser requêtes DB

## 🟡 **Features**
- [ ] Ajouter dark mode
- [ ] Créer onboarding wizard
- [ ] Implémenter notifications push

---

**Déployé sur:** pepetteszub.com`,

      atelierModules: {
        roadmap: { collapsed: true },
        todo: { collapsed: true },
        mindlog: { collapsed: true, mood: "💪", note: "Prod stable!" },
        actions: { collapsed: true, items: [] },
        screentv: { collapsed: true, screenshots: [] }
      },

      roadmap: [],
      todo: [],
      idees: [],
      prochaineAction: null
    },

    echodesreves: {
      roadmapMarkdown: `# Roadmap - L'Echo des Rêves

## 🌟 Vision
- [ ] IA générative de récits de rêves
- [ ] Analyse symbolique jungienne
- [ ] Création d'artwork basé sur descriptions
- [ ] Communauté de partage

## 🔬 Recherche
- [ ] Dataset de symboles oniriques
- [ ] Fine-tuning modèle LLM
- [ ] Pipeline Stable Diffusion
- [ ] Architecture microservices

---

> *Où les rêves deviennent art* ✨`,

      todoMarkdown: `# Todo - Echo des Rêves

## 🔴 **Research**
- [ ] Compiler dataset symboles de rêves
- [ ] Tester APIs génération d'images
- [ ] Prototyper interface de saisie

## 🟡 **Exploration**
- [ ] Étudier psychologie des rêves
- [ ] Analyser concurrence
- [ ] Définir MVP features

---

**Status:** Vision & Exploration`,

      atelierModules: {
        roadmap: { collapsed: true },
        todo: { collapsed: true },
        mindlog: { collapsed: true, mood: "✨", note: "Projet ambitieux!" },
        actions: { collapsed: true, items: [] },
        screentv: { collapsed: true, screenshots: [] }
      },

      roadmap: [],
      todo: [],
      idees: [],
      prochaineAction: null
    }
  }
};

// Fonction helper pour obtenir les données par défaut d'un projet
export const getDefaultProjectData = (projectId) => {
  return defaultProjectsData.projectData[projectId] || {
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

    atelierModules: {
      roadmap: { collapsed: true },
      todo: { collapsed: true },
      mindlog: { collapsed: true, mood: "😐", note: "" },
      actions: { collapsed: true, items: [] },
      screentv: { collapsed: true, screenshots: [] }
    },

    roadmap: [],
    todo: [],
    idees: [],
    prochaineAction: null
  };
};

// Fonction pour initialiser tous les stores avec les données par défaut
export const initializeWithDefaultData = async () => {
  const { default: useProjectMetaStore } = await import('./useProjectMetaStore');
  const { getProjectData } = await import('./useProjectDataStore');

  const metaStore = useProjectMetaStore.getState();
  const { meta, projectData } = defaultProjectsData;

  // Initialiser le meta store
  Object.entries(meta.projects).forEach(([projectId, projectMeta]) => {
    if (!metaStore.projects[projectId]) {
      metaStore.createProject(projectMeta);
    }
  });

  // Initialiser les visible projects
  if (metaStore.visibleProjects.length === 0) {
    meta.visibleProjects.forEach(projectId => {
      if (!metaStore.visibleProjects.includes(projectId)) {
        metaStore.toggleProjectVisibility(projectId);
      }
    });
  }

  // Initialiser le projet sélectionné
  if (!metaStore.selectedProject) {
    metaStore.selectProject(meta.selectedProject);
  }

  // Initialiser les données de chaque projet
  Object.entries(projectData).forEach(([projectId, data]) => {
    const projectDataStore = getProjectData(projectId);
    if (!projectDataStore.roadmapMarkdown || projectDataStore.roadmapMarkdown.includes('Commencez votre roadmap ici')) {
      // Le store semble vide ou a les données par défaut minimales
      const storeKey = `project-data-${projectId}`;
      const existingData = localStorage.getItem(storeKey);

      if (!existingData) {
        // Créer le store avec les données par défaut
        localStorage.setItem(storeKey, JSON.stringify({
          state: data,
          version: 1
        }));
      }
    }
  });

  return true;
};

export default defaultProjectsData;