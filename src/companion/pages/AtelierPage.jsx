// src/companion/pages/AtelierPage.jsx

import React from 'react';
import styled, { useTheme } from 'styled-components';
import useProjectMetaStore from '../../stores/useProjectMetaStore';
import { useProjectData } from '../../stores/useProjectDataStore';
import Panel from '../../components/common/Panel/Panel';
import MarkdownEditor from '../../components/common/MarkdownEditor/MarkdownEditor';
import MindLogCompact from '../../components/widgets/MindLog/MindLogCompact';
import MindLogToolbar from '../../components/common/MindLogToolbar';
import ProjectCarousel from '../../components/room-modules/atelier/ProjectCarousel';
import { usePanelContent } from '../../hooks/usePanelContent';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`;

const ProjectBadge = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.surfaces.muted};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.typography.families.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

/**
 * Page Atelier - Workspace projet mobile
 * @renders PageContainer
 * @renders PageTitle
 * @renders ProjectBadge
 * @renders Panel
 * @renders MarkdownEditor
 * @renders MindLogCompact
 */
const AtelierPage = () => {
  const { getCurrentProject, selectedProject } = useProjectMetaStore();
  const project = getCurrentProject();
  const projectData = useProjectData(selectedProject);
  const { updateModuleState, getModuleState } = projectData || {};
  const theme = useTheme();

  const {
    roadmapContent,
    todoContent,
    notesContent,
    updateRoadmapContent,
    updateTodoContent,
    updateNotesContent,
  } = usePanelContent(project?.id || 'default');

  // États collapse des modules
  const roadmapState = getModuleState ? getModuleState('roadmap') : { collapsed: true };
  const todoState = getModuleState ? getModuleState('todo') : { collapsed: true };
  const screentvState = getModuleState ? getModuleState('screentv') : { collapsed: true };
  const mindlogState = getModuleState ? getModuleState('mindlog') : { collapsed: true };
  const notesState = getModuleState ? getModuleState('notes') : { collapsed: true };

  // Référence pour le handler de log du MindLog
  const mindLogHandlerRef = React.useRef(null);

  if (!project) {
    return (
      <PageContainer>
        <PageTitle>🛠️ Atelier</PageTitle>
        <Panel title="Aucun projet" icon="⚠️" collapsible={false}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Aucun projet sélectionné. Créez un projet depuis la version desktop.
          </div>
        </Panel>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ProjectCarousel />

      {/* Roadmap */}
      <Panel
        title="Roadmap"
        icon="🗺️"
        texture="parchment"
        accentColor={theme.colors.accents.cold}
        contentType="markdown"
        collapsible={true}
        collapsed={roadmapState.collapsed}
        onToggleCollapse={(newCollapsed) =>
          updateModuleState && updateModuleState('roadmap', { collapsed: newCollapsed })
        }
      >
        <MarkdownEditor
          value={roadmapContent}
          onChange={updateRoadmapContent}
          placeholder="Définissez votre roadmap en markdown..."
          height="300px"
          compact={true}
          variant="embedded"
          accentColor={theme.colors.accents.cold}
        />
      </Panel>

      {/* Todo */}
      <Panel
        title="Todo"
        icon="✅"
        texture="parchment"
        accentColor={theme.colors.accents.success}
        contentType="markdown"
        collapsible={true}
        collapsed={todoState.collapsed}
        onToggleCollapse={(newCollapsed) =>
          updateModuleState && updateModuleState('todo', { collapsed: newCollapsed })
        }
      >
        <MarkdownEditor
          value={todoContent}
          onChange={updateTodoContent}
          placeholder="Gérez vos tâches en markdown..."
          height="300px"
          compact={true}
          variant="embedded"
          accentColor={theme.colors.accents.success}
        />
      </Panel>

      {/* MindLog */}
      <Panel
        title="MindLog"
        icon="🌈"
        texture="wood"
        accentColor={theme.colors.accents.warm}
        collapsible={true}
        collapsed={mindlogState.collapsed}
        onToggleCollapse={(newCollapsed) =>
          updateModuleState && updateModuleState('mindlog', { collapsed: newCollapsed })
        }
        customActions={
          <MindLogToolbar
            viewMode={mindLogHandlerRef.current?.viewMode || 'compact'}
            isEditing={mindLogHandlerRef.current?.isEditing || false}
            logsCount={mindLogHandlerRef.current?.logsCount || 0}
            onToggleView={() => mindLogHandlerRef.current?.handleToggleView?.()}
            onToggleEdit={() => mindLogHandlerRef.current?.handleToggleEdit?.()}
            onQuickLog={() => mindLogHandlerRef.current?.handleQuickLog?.()}
            onClearLogs={() => mindLogHandlerRef.current?.handleClearLogs?.()}
            showEditButton={true}
            showClearButton={false}
          />
        }
      >
        <MindLogCompact
          context="project"
          onMount={(handlers) => {
            mindLogHandlerRef.current = handlers;
          }}
          onLogSave={(log) => {
            console.log('📊 MindLog saved (project):', log);
          }}
        />
      </Panel>

      {/* ScreenTV */}
      <Panel
        title="ScreenTV"
        icon="📺"
        texture="metal"
        accentColor={theme.colors.accents.cold}
        collapsible={true}
        collapsed={screentvState.collapsed}
        onToggleCollapse={(newCollapsed) =>
          updateModuleState && updateModuleState('screentv', { collapsed: newCollapsed })
        }
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          📺 Upload screenshots (Phase 2)
        </div>
      </Panel>

      {/* Notes */}
      <Panel
        title="Notes"
        icon="📝"
        texture="parchment"
        accentColor={theme.colors.accents.neutral}
        contentType="markdown"
        collapsible={true}
        collapsed={notesState.collapsed}
        onToggleCollapse={(newCollapsed) =>
          updateModuleState && updateModuleState('notes', { collapsed: newCollapsed })
        }
      >
        <MarkdownEditor
          value={notesContent}
          onChange={updateNotesContent}
          placeholder="Capturez vos idées et notes importantes..."
          height="300px"
          compact={true}
          variant="embedded"
          accentColor={theme.colors.accents.neutral}
        />
      </Panel>
    </PageContainer>
  );
};

export default AtelierPage;
