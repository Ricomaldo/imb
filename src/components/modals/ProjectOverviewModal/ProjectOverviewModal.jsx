// src/components/modals/ProjectOverviewModal/ProjectOverviewModal.jsx

import React, { useState, useMemo } from 'react';
import Modal from '../../common/Modal/Modal';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';
import ProjectForm from './ProjectForm';
import TabSelector from './TabSelector';
import KanbanView from './KanbanView';
import FormationView from './FormationView';
import { useProjectData } from '../../../stores/useProjectDataStore';
import {
  OverviewContainer,
  StatsBar,
  FloatingButtons,
  ActionButton
} from './ProjectOverviewModal.styles';

/**
 * Modal for managing projects overview with Kanban board
 * @renders Modal
 * @renders OverviewContainer
 * @renders ProjectForm - conditionally rendered when showNewProjectForm or editingProject
 * @renders TabSelector - conditionally rendered when not showing form
 * @renders FormationView - conditionally rendered when activeTab is 'formation'
 * @renders KanbanView - conditionally rendered when activeTab is 'pro' or 'perso'
 * @renders FloatingButtons
 * @renders ActionButton
 */
const ProjectOverviewModal = ({ isOpen, onClose }) => {
  const {
    projects,
    categories,
    visibleProjects,
    toggleProjectVisibility,
    selectProject,
    createProject,
    updateProjectMeta,
    deleteProject,
    reorderProjects,
    moveToColumn,
    getProjectsSortedByOrder
  } = useProjectMetaStore();

  const [activeTab, setActiveTab] = useState('pro');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeId, setActiveId] = useState(null);

  // Récupérer les projets triés par ordre
  // Utiliser directement la fonction sans mémorisation pour garantir la fraîcheur
  const sortedProjects = getProjectsSortedByOrder();

  // Filtrer les projets par catégorie
  const projectsByCategory = useMemo(() => {
    const result = {
      pro: [],
      perso: [],
      formation: []
    };

    sortedProjects.forEach(project => {
      const category = project.category || 'perso';
      if (result[category]) {
        result[category].push(project);
      }
    });

    return result;
  }, [sortedProjects]);

  // Compter les projets par catégorie
  const projectCounts = useMemo(() => ({
    pro: projectsByCategory.pro.length,
    perso: projectsByCategory.perso.length,
    formation: projectsByCategory.formation.length
  }), [projectsByCategory]);

  const handleCreateProject = (projectData) => {
    // Définir la colonne Kanban par défaut selon la catégorie
    const enrichedData = {
      ...projectData,
      kanbanColumn: projectData.category === 'formation' ? null : (projectData.kanbanColumn || 'inbox')
    };
    const projectId = createProject(enrichedData);
    setShowNewProjectForm(false);

    // Forcer la réactualisation des projets
    // Le store est déjà mis à jour via createProject,
    // l'interface se rafraîchira automatiquement grâce aux dépendances
  };

  const handleUpdateProject = (projectData) => {
    updateProjectMeta(projectData.id, projectData);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    deleteProject(projectId);
    setEditingProject(null);
  };

  const handleEditClick = (project, e) => {
    e.stopPropagation();
    setEditingProject(project);
    setShowNewProjectForm(false);
  };

  const handleApply = () => {
    // Sélectionner le premier projet visible s'il y en a
    if (visibleProjects.length > 0) {
      const currentSelected = useProjectMetaStore.getState().selectedProject;
      if (!visibleProjects.includes(currentSelected)) {
        selectProject(visibleProjects[0]);
      }
    }
    onClose();
  };

  const renderTabContent = () => {
    const currentProjects = projectsByCategory[activeTab] || [];

    if (activeTab === 'formation') {
      return (
        <FormationView
          projects={currentProjects}
          visibleProjects={visibleProjects}
          toggleProjectVisibility={toggleProjectVisibility}
          selectProject={selectProject}
          onEditProject={handleEditClick}
          reorderProjects={reorderProjects}
        />
      );
    }

    // Vue Kanban pour Pro et Perso
    return (
      <KanbanView
        projects={currentProjects}
        visibleProjects={visibleProjects}
        toggleProjectVisibility={toggleProjectVisibility}
        selectProject={selectProject}
        moveToColumn={moveToColumn}
        onEditProject={handleEditClick}
        activeId={activeId}
        setActiveId={setActiveId}
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📊 Gestion des Projets"
      size="fullscreen"
      variant="roomCanvas"
    >
      <OverviewContainer>
        {(showNewProjectForm || editingProject) ? (
          <ProjectForm
            project={editingProject}
            categories={categories}
            onSave={editingProject ? handleUpdateProject : handleCreateProject}
            onDelete={handleDeleteProject}
            onCancel={() => {
              setShowNewProjectForm(false);
              setEditingProject(null);
            }}
          />
        ) : (
          <>
            <TabSelector
              activeTab={activeTab}
              onTabChange={setActiveTab}
              projectCounts={projectCounts}
            />

            {renderTabContent()}

            <FloatingButtons>
              <ActionButton
                $variant="success"
                onClick={() => setShowNewProjectForm(true)}
              >
                ➕ Nouveau {activeTab === 'pro' ? 'Projet Pro' :
                          activeTab === 'perso' ? 'Projet Perso' :
                          'Projet Formation'}
              </ActionButton>

              <ActionButton onClick={handleApply}>
                ✓ Appliquer la sélection
              </ActionButton>
            </FloatingButtons>
          </>
        )}
      </OverviewContainer>
    </Modal>
  );
};

export default ProjectOverviewModal;