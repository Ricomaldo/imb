// src/stores/migrateProjectStores.js - Gestion de la migration et initialisation des stores

import { initializeWithDefaultData } from './defaultProjectsData';
import { logger } from '../utils/logger';

// Fonction de migration depuis l'ancien format (v1 vers v2)
export const migrateProjectStores = () => {
  // Vérifier si la migration a déjà été effectuée
  const migrationFlag = localStorage.getItem('store-migrated-v2');
  if (migrationFlag === 'true') {
    logger.debug('Migration already completed');
    return false;
  }

  logger.debug('Starting migration to multi-store architecture...');

  try {
    // 1. Lire l'ancien store
    const oldStoreKey = 'irim-projects-store';
    const oldStoreData = localStorage.getItem(oldStoreKey);

    if (!oldStoreData) {
      logger.debug('No old store data found, skipping migration');
      localStorage.setItem('store-migrated-v2', 'true');
      return false;
    }

    const parsedOldStore = JSON.parse(oldStoreData);
    const oldState = parsedOldStore.state;

    // 2. Backup de l'ancien store
    localStorage.setItem('projects-backup-v1', oldStoreData);
    logger.debug('Backup created: projects-backup-v1');

    // 3. Extraire et migrer les métadonnées vers ProjectMetaStore
    const metaData = {
      selectedProject: oldState.selectedProject || 'irimmetabrain',
      visibleProjects: oldState.visibleProjects || [],
      categories: oldState.categories || {
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
      projects: {}
    };

    // 4. Migrer chaque projet
    if (oldState.projects) {
      let orderIndex = 0;
      Object.entries(oldState.projects).forEach(([projectId, projectData]) => {
        // Extraire les métadonnées
        metaData.projects[projectId] = {
          id: projectData.id,
          name: projectData.name,
          type: projectData.type,
          status: projectData.status,
          category: projectData.category,
          subcategory: projectData.subcategory,
          created_at: projectData.created_at,
          updated_at: projectData.updated_at,
          // Nouvelles propriétés (avec valeurs par défaut)
          contractType: projectData.contractType || null,
          deploymentStatus: projectData.deploymentStatus || 'local',
          projectNature: projectData.projectNature || projectData.subcategory,
          technologies: projectData.technologies || [],
          client: projectData.client || null,
          startDate: projectData.startDate || null,
          endDate: projectData.endDate || null,
          order: projectData.order !== undefined ? projectData.order : orderIndex++
        };

        // Créer un store de données pour ce projet
        const projectDataStore = {
          state: {
            roadmapMarkdown: projectData.roadmapMarkdown || '',
            todoMarkdown: projectData.todoMarkdown || '',
            atelierModules: projectData.atelierModules || {
              roadmap: { collapsed: true },
              todo: { collapsed: true },
              mindlog: { collapsed: true, mood: "😐", note: "" },
              actions: { collapsed: true, items: [] },
              screentv: { collapsed: true, screenshots: [] }
            },
            roadmap: projectData.roadmap || [],
            todo: projectData.todo || [],
            idees: projectData.idees || [],
            prochaineAction: projectData.prochaineAction || null
          },
          version: 1
        };

        // Sauvegarder dans localStorage avec la clé spécifique au projet
        localStorage.setItem(
          `project-data-${projectId}`,
          JSON.stringify(projectDataStore)
        );
        logger.debug(`Migrated data for project: ${projectId}`);
      });
    }

    // 5. Sauvegarder les métadonnées dans le nouveau store
    const metaStoreData = {
      state: metaData,
      version: 2
    };
    localStorage.setItem('project-meta-store', JSON.stringify(metaStoreData));
    logger.debug('Meta store created successfully');

    // 6. Marquer la migration comme complète
    localStorage.setItem('store-migrated-v2', 'true');

    // 7. Optionnel : Supprimer l'ancien store (commenté pour sécurité)
    // localStorage.removeItem(oldStoreKey);

    logger.debug('Migration completed successfully!');
    return true;

  } catch (error) {
    logger.error('Migration failed:', error);

    // En cas d'erreur, essayer de restaurer depuis le backup
    const backup = localStorage.getItem('projects-backup-v1');
    if (backup) {
      localStorage.setItem('irim-projects-store', backup);
      logger.debug('Restored from backup due to migration error');
    }

    return false;
  }
};

// Fonction d'initialisation principale appelée au démarrage de l'application
export const initializeStores = async () => {
  logger.debug('🚀 Initializing stores...');

  // Vérifier l'état actuel des stores
  const metaStoreExists = localStorage.getItem('project-meta-store');
  const oldStoreExists = localStorage.getItem('irim-projects-store');
  const migrationDone = localStorage.getItem('store-migrated-v2') === 'true';

  // Migration depuis l'ancien format si nécessaire
  if (oldStoreExists && !migrationDone) {
    logger.debug('📦 Old store detected, starting migration...');
    const migrationSuccess = migrateProjectStores();
    if (migrationSuccess) {
      logger.debug('✅ Migration completed successfully');
      return 'migrated';
    } else {
      logger.error('❌ Migration failed');
      // Continuer avec initialisation par défaut
    }
  }

  // Première utilisation : initialiser avec les données par défaut
  if (!metaStoreExists && !oldStoreExists) {
    logger.debug('🆕 First time usage detected, initializing with default data...');
    await initializeWithDefaultData();
    localStorage.setItem('store-migrated-v2', 'true');
    localStorage.setItem('stores-initialized', 'true');
    logger.debug('✅ Default data initialized');
    return 'initialized';
  }

  // Vérification et réparation des stores corrompus
  if (metaStoreExists) {
    try {
      const metaData = JSON.parse(metaStoreExists);
      const hasProjects = metaData.state &&
                         metaData.state.projects &&
                         Object.keys(metaData.state.projects).length > 0;

      if (!hasProjects) {
        logger.debug('🔄 Empty meta store detected, reinitializing...');
        await initializeWithDefaultData();
        localStorage.setItem('stores-initialized', 'true');
        logger.debug('✅ Reinitialized with default data');
        return 'reinitialized';
      }
    } catch (error) {
      logger.error('❌ Error parsing meta store:', error);
      // Store corrompu, réinitialiser
      logger.debug('🔧 Corrupted store detected, reinitializing...');
      await initializeWithDefaultData();
      localStorage.setItem('stores-initialized', 'true');
      return 'recovered';
    }
  }

  logger.debug('✅ Stores already initialized and valid');
  return 'existing';
};

// Vérifier si les stores ont besoin d'initialisation
export const needsInitialization = () => {
  const metaStore = localStorage.getItem('project-meta-store');

  if (!metaStore) return true;

  try {
    const parsed = JSON.parse(metaStore);
    const hasProjects = parsed.state?.projects &&
                       Object.keys(parsed.state.projects).length > 0;
    return !hasProjects;
  } catch {
    return true;
  }
};

// Nettoyer les clés obsolètes du localStorage
export const cleanupObsoleteStorage = () => {
  logger.debug('🧹 Cleaning up obsolete localStorage keys...');

  // Supprimer l'ancien store monolithique
  if (localStorage.getItem('irim-projects-store')) {
    localStorage.removeItem('irim-projects-store');
    logger.debug('✅ Removed obsolete key: irim-projects-store');
  }

  // Supprimer le backup de migration qui n'est plus nécessaire
  const obsoleteKeys = ['projects-backup-v1'];
  obsoleteKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      logger.debug(`✅ Removed obsolete key: ${key}`);
    }
  });

  logger.debug('✅ LocalStorage cleanup completed');
};