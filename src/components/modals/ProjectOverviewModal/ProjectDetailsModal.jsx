// src/components/modals/ProjectOverviewModal/ProjectDetailsModal.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../common/Modal/Modal';
import ProjectForm from './ProjectForm';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';
import { alpha } from '../../../styles/color';

const DetailsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ProjectHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ProjectTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
`;

const MetaInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => alpha(theme.colors.backgroundLight, 0.5)};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};

  .label {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .value {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $status }) => {
    switch($status) {
      case 'dev_actif': return alpha(theme.colors.success, 0.2);
      case 'concept': return alpha(theme.colors.warning, 0.2);
      case 'vision': return alpha(theme.colors.info, 0.2);
      case 'pause': return alpha(theme.colors.textSecondary, 0.2);
      case 'maintenance': return alpha(theme.colors.primary, 0.2);
      default: return alpha(theme.colors.textSecondary, 0.2);
    }
  }};
  color: ${({ theme, $status }) => {
    switch($status) {
      case 'dev_actif': return theme.colors.success;
      case 'concept': return theme.colors.warning;
      case 'vision': return theme.colors.info;
      case 'pause': return theme.colors.textSecondary;
      case 'maintenance': return theme.colors.primary;
      default: return theme.colors.textSecondary;
    }
  }};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.2)};
`;

const SectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  border-bottom: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.1)};

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
  }

  .value {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: ${({ theme }) => theme.typography.sizes.sm};
  }
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const TechBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => alpha(theme.colors.primary, 0.1)};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.2)};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.primary {
    background: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${({ theme }) => alpha(theme.colors.primary, 0.3)};
    }
  }

  &.secondary {
    background: ${({ theme }) => alpha(theme.colors.textSecondary, 0.1)};
    color: ${({ theme }) => theme.colors.text};

    &:hover {
      background: ${({ theme }) => alpha(theme.colors.textSecondary, 0.2)};
    }
  }
`;

const ProjectDetailsModal = ({ isOpen, onClose, project: initialProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { projects, categories, updateProjectMeta, deleteProject } = useProjectMetaStore();

  // Toujours utiliser les données actuelles du store
  const project = initialProject ? projects[initialProject.id] : null;

  if (!project) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedData) => {
    updateProjectMeta(project.id, updatedData);
    setIsEditing(false);
  };

  const handleDelete = (projectId) => {
    deleteProject(projectId);
    onClose();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getCategoryLabel = () => {
    if (!project.category) return '-';
    return categories[project.category]?.label || project.category;
  };

  const getKanbanColumnLabel = () => {
    switch(project.kanbanColumn) {
      case 'entete': return '🎯 En tête';
      case 'actif': return '⚡ Actif';
      case 'pause': return '⏸️ Pause';
      case 'inbox': return '📥 Réserve';
      default: return '-';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Édition : ${project.name}` : `Projet : ${project.name}`}
      size="large"
      variant="overlay"
    >
      <DetailsContainer>
        {isEditing ? (
          <ProjectForm
            project={project}
            categories={categories}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <ProjectHeader>
              <ProjectTitle>{project.name}</ProjectTitle>
              <MetaInfo>
                <StatusBadge $status={project.status}>
                  {project.status || 'actif'}
                </StatusBadge>
                <MetaItem>
                  <span className="label">ID:</span>
                  <span className="value">{project.id}</span>
                </MetaItem>
                <MetaItem>
                  <span className="label">Type:</span>
                  <span className="value">{project.type || 'tool'}</span>
                </MetaItem>
              </MetaInfo>
            </ProjectHeader>

            <InfoGrid>
              <InfoSection>
                <SectionTitle>Catégorisation</SectionTitle>
                <InfoRow>
                  <span className="label">Catégorie</span>
                  <span className="value">{getCategoryLabel()}</span>
                </InfoRow>
                <InfoRow>
                  <span className="label">Sous-catégorie</span>
                  <span className="value">{project.subcategory || '-'}</span>
                </InfoRow>
                <InfoRow>
                  <span className="label">Colonne Kanban</span>
                  <span className="value">{getKanbanColumnLabel()}</span>
                </InfoRow>
                <InfoRow>
                  <span className="label">Nature</span>
                  <span className="value">{project.projectNature || '-'}</span>
                </InfoRow>
              </InfoSection>

              <InfoSection>
                <SectionTitle>Informations</SectionTitle>
                <InfoRow>
                  <span className="label">Client</span>
                  <span className="value">{project.client || '-'}</span>
                </InfoRow>
                <InfoRow>
                  <span className="label">Type de contrat</span>
                  <span className="value">{project.contractType || '-'}</span>
                </InfoRow>
                <InfoRow>
                  <span className="label">Déploiement</span>
                  <span className="value">{project.deploymentStatus || 'local'}</span>
                </InfoRow>
                <InfoRow>
                  <span className="label">Créé le</span>
                  <span className="value">{formatDate(project.created_at)}</span>
                </InfoRow>
              </InfoSection>
            </InfoGrid>

            {/* Nouveaux champs : URLs et Déploiement */}
            <InfoGrid>
              <InfoSection>
                <SectionTitle>URLs & Déploiement</SectionTitle>
                {project.deployUrl && (
                  <InfoRow>
                    <span className="label">URL Production</span>
                    <span className="value">
                      <a href={project.deployUrl} target="_blank" rel="noopener noreferrer"
                         style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {project.deployUrl}
                      </a>
                    </span>
                  </InfoRow>
                )}
                {project.githubRepo && (
                  <InfoRow>
                    <span className="label">GitHub</span>
                    <span className="value">
                      <a href={`https://github.com/${project.githubRepo}`}
                         target="_blank" rel="noopener noreferrer"
                         style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {project.githubRepo}
                      </a>
                    </span>
                  </InfoRow>
                )}
                {project.frameworkVersion && (
                  <InfoRow>
                    <span className="label">Versions</span>
                    <span className="value">{project.frameworkVersion}</span>
                  </InfoRow>
                )}
              </InfoSection>

              <InfoSection>
                <SectionTitle>Environnements</SectionTitle>
                {project.environmentUrls?.local && (
                  <InfoRow>
                    <span className="label">Local</span>
                    <span className="value">
                      <a href={project.environmentUrls.local}
                         target="_blank" rel="noopener noreferrer"
                         style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {project.environmentUrls.local}
                      </a>
                    </span>
                  </InfoRow>
                )}
                {project.environmentUrls?.staging && (
                  <InfoRow>
                    <span className="label">Staging</span>
                    <span className="value">
                      <a href={project.environmentUrls.staging}
                         target="_blank" rel="noopener noreferrer"
                         style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {project.environmentUrls.staging}
                      </a>
                    </span>
                  </InfoRow>
                )}
                {project.environmentUrls?.production && (
                  <InfoRow>
                    <span className="label">Production</span>
                    <span className="value">
                      <a href={project.environmentUrls.production}
                         target="_blank" rel="noopener noreferrer"
                         style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {project.environmentUrls.production}
                      </a>
                    </span>
                  </InfoRow>
                )}
              </InfoSection>
            </InfoGrid>

            {project.technologies && project.technologies.length > 0 && (
              <InfoSection style={{ marginTop: '24px' }}>
                <SectionTitle>Technologies</SectionTitle>
                <TechList>
                  {project.technologies.map(tech => (
                    <TechBadge key={tech}>{tech}</TechBadge>
                  ))}
                </TechList>
              </InfoSection>
            )}

            <ActionButtons>
              <Button className="primary" onClick={handleEdit}>
                ✏️ Modifier
              </Button>
              <Button className="secondary" onClick={onClose}>
                Fermer
              </Button>
            </ActionButtons>
          </>
        )}
      </DetailsContainer>
    </Modal>
  );
};

export default ProjectDetailsModal;