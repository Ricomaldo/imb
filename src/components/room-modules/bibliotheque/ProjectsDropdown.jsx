// src/components/room-modules/bibliotheque/ProjectsDropdown.jsx

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';
import { alpha } from '../../../styles/color';

const DropdownContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => alpha(theme.colors.primary, 0.1)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: ${({ theme }) => alpha(theme.colors.border, 0.2)};
  border-radius: ${({ theme }) => theme.radii.sm};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) =>
    props => props.$percentage > 75 ? theme.colors.accents.success :
    props.$percentage > 50 ? theme.colors.accents.gold :
    props.$percentage > 25 ? theme.colors.accents.warm :
    theme.colors.accents.danger
  };
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease, background-color 0.3s ease;
`;

const ProjectsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => alpha(theme.colors.border, 0.1)};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => alpha(theme.colors.border, 0.5)};
    border-radius: ${({ theme }) => theme.radii.sm};

    &:hover {
      background: ${({ theme }) => alpha(theme.colors.border, 0.7)};
    }
  }
`;

const ProjectItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) =>
    props => props.$isCurrent ? alpha(theme.colors.accent, 0.1) : 'white'
  };
  border: 1px solid ${({ theme }) =>
    props => props.$isCurrent ? theme.colors.accent : alpha(theme.colors.border, 0.3)
  };
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => alpha(theme.colors.secondary, 0.1)};
    transform: translateX(2px);
  }
`;

const StatusBadge = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $status }) => {
    switch($status) {
      case 'dev_actif': return theme.colors.accents.success;
      case 'concept': return theme.colors.accents.warm;
      case 'vision': return theme.colors.accents.cold;
      case 'pause': return theme.colors.accents.neutral;
      case 'maintenance': return theme.colors.primary;
      case 'archive': return theme.colors.stone;
      default: return theme.colors.accents.neutral;
    }
  }};
  flex-shrink: 0;
`;

const ProjectInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

const TechStack = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetadataIndicators = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const Indicator = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  opacity: ${props => {
    switch(props.$status) {
      case 'complete': return 1;
      case 'partial': return 0.7;
      case 'missing': return 0.3;
      default: return 0.3;
    }
  }};
  filter: ${props => {
    switch(props.$status) {
      case 'complete': return 'hue-rotate(90deg) brightness(1.2)'; // Vert
      case 'partial': return 'hue-rotate(30deg) brightness(1.1)'; // Orange
      case 'missing': return 'grayscale(1) brightness(0.7)'; // Gris
      default: return 'grayscale(1)';
    }
  }};
  transition: all 0.2s ease;
  cursor: help;

  &:hover {
    transform: scale(1.2);
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const IconButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.xs};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => alpha(theme.colors.primary, 0.1)};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => alpha(theme.colors.primary, 0.05)};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
`;

const FooterButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.light};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

/**
 * Widget dropdown pour afficher tous les projets avec indicateurs de complétude
 * Gamification visuelle pour encourager la documentation complète
 * @renders DropdownContainer
 * @renders Header
 * @renders StatsBar
 * @renders StatLabel
 * @renders ProgressBar
 * @renders ProgressFill
 * @renders ProjectsList
 * @renders ProjectItem
 * @renders StatusBadge
 * @renders ProjectInfo
 * @renders ProjectName
 * @renders TechStack
 * @renders MetadataIndicators
 * @renders Indicator
 * @renders QuickActions
 * @renders IconButton
 * @renders Footer
 * @renders FooterButton
 * @renders EmptyState
 */
const ProjectsDropdown = ({ onOpenModal }) => {
  const {
    projects,
    selectedProject,
    selectProject,
    getProjectsSortedByOrder
  } = useProjectMetaStore();

  // Calculer la complétude de chaque projet
  const projectsWithCompleteness = useMemo(() => {
    const sortedProjects = getProjectsSortedByOrder();

    return sortedProjects.map(project => {
      // Calculer les indicateurs
      const indicators = {
        deploy: project.deployUrl ? 'complete' : 'missing',
        github: project.githubRepo ? 'complete' : 'missing',
        framework: project.frameworkVersion ? 'complete' : 'missing',
        env: (() => {
          if (!project.environmentUrls) return 'missing';
          const urls = project.environmentUrls;
          const count = [urls.local, urls.staging, urls.production].filter(Boolean).length;
          if (count === 0) return 'missing';
          if (count === 3) return 'complete';
          return 'partial';
        })(),
        notes: project.deploymentNotes && project.deploymentNotes.length > 50 ? 'complete' : 'missing'
      };

      // Calculer le score de complétude (0-100)
      const scores = Object.values(indicators).map(status =>
        status === 'complete' ? 20 : status === 'partial' ? 10 : 0
      );
      const completeness = scores.reduce((a, b) => a + b, 0);

      return {
        ...project,
        indicators,
        completeness
      };
    });
  }, [getProjectsSortedByOrder, projects]);

  // Trier par complétude puis par ordre
  const sortedProjects = useMemo(() => {
    return [...projectsWithCompleteness].sort((a, b) => {
      // D'abord par complétude (moins complets en premier pour encourager)
      if (a.completeness !== b.completeness) {
        return a.completeness - b.completeness;
      }
      // Puis par ordre original
      return (a.order || 0) - (b.order || 0);
    });
  }, [projectsWithCompleteness]);

  // Calculer les statistiques globales
  const stats = useMemo(() => {
    const total = sortedProjects.length;
    const documented = sortedProjects.filter(p => p.completeness >= 80).length;
    const percentage = total > 0 ? (documented / total) * 100 : 0;

    return { total, documented, percentage };
  }, [sortedProjects]);

  const handleSelectProject = (projectId) => {
    selectProject(projectId);
  };

  const handleEditProject = (projectId) => {
    if (onOpenModal) {
      selectProject(projectId);
      onOpenModal(projectId);
    }
  };

  if (sortedProjects.length === 0) {
    return (
      <DropdownContainer>
        <EmptyState>
          Aucun projet disponible
        </EmptyState>
      </DropdownContainer>
    );
  }

  return (
    <DropdownContainer>
      <Header>
        <StatsBar>
          <StatLabel>
            📚 {stats.documented}/{stats.total} projets documentés
          </StatLabel>
          <StatLabel>
            {Math.round(stats.percentage)}%
          </StatLabel>
        </StatsBar>
        <ProgressBar>
          <ProgressFill $percentage={stats.percentage} />
        </ProgressBar>
      </Header>

      <ProjectsList>
        {sortedProjects.map(project => (
          <ProjectItem
            key={project.id}
            $isCurrent={project.id === selectedProject}
          >
            <StatusBadge $status={project.status} />

            <ProjectInfo>
              <ProjectName>{project.name}</ProjectName>
              <TechStack>
                {project.technologies?.length > 0
                  ? project.technologies.join(', ')
                  : 'Aucune technologie renseignée'
                }
              </TechStack>
            </ProjectInfo>

            <MetadataIndicators>
              <Indicator
                $status={project.indicators.deploy}
                title={`URL de déploiement ${project.indicators.deploy === 'complete' ? '✓' : '✗'}`}
              >
                🌐
              </Indicator>
              <Indicator
                $status={project.indicators.github}
                title={`Dépôt GitHub ${project.indicators.github === 'complete' ? '✓' : '✗'}`}
              >
                📁
              </Indicator>
              <Indicator
                $status={project.indicators.framework}
                title={`Versions frameworks ${project.indicators.framework === 'complete' ? '✓' : '✗'}`}
              >
                ⚙️
              </Indicator>
              <Indicator
                $status={project.indicators.env}
                title={`URLs environnements ${
                  project.indicators.env === 'complete' ? '✓' :
                  project.indicators.env === 'partial' ? '~' : '✗'
                }`}
              >
                🔗
              </Indicator>
              <Indicator
                $status={project.indicators.notes}
                title={`Notes de déploiement ${project.indicators.notes === 'complete' ? '✓' : '✗'}`}
              >
                📝
              </Indicator>
            </MetadataIndicators>

            <QuickActions>
              <IconButton
                onClick={() => handleSelectProject(project.id)}
                title="Sélectionner ce projet"
              >
                👆
              </IconButton>
              <IconButton
                onClick={() => handleEditProject(project.id)}
                title="Éditer ce projet"
              >
                ✏️
              </IconButton>
            </QuickActions>
          </ProjectItem>
        ))}
      </ProjectsList>

      {onOpenModal && (
        <Footer>
          <FooterButton onClick={() => onOpenModal()}>
            📊 Gestion complète des projets
          </FooterButton>
        </Footer>
      )}
    </DropdownContainer>
  );
};

ProjectsDropdown.propTypes = {
  /**
   * Fonction appelée pour ouvrir la modal de gestion des projets
   * @param {string} projectId - ID du projet à éditer (optionnel)
   */
  onOpenModal: PropTypes.func
};

ProjectsDropdown.defaultProps = {
  onOpenModal: null
};

export default ProjectsDropdown;