// src/components/rooms/Atelier/AtelierRoom.jsx

import React from "react";
import { useTheme } from "styled-components";
import useProjectMetaStore from "../../../stores/useProjectMetaStore";
import { useProjectData } from "../../../stores/useProjectDataStore";
import BaseRoom from "../../layout/BaseRoom";
import Panel from "../../common/Panel";
import MarkdownEditor from "../../common/MarkdownEditor";
import { usePanelContent } from "../../../hooks/usePanelContent";
import PanelGrid from "../../layout/PanelGrid";
import ProjectCarousel from "../../room-modules/atelier/ProjectCarousel";
import MindLogCompact from "../../widgets/MindLog/MindLogCompact";
import MindLogToolbar from "../../common/MindLogToolbar";
import { PanelTitle } from "./AtelierRoom.styles";

/**
 * Atelier - Espace de travail sur les projets
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 * @renders MarkdownEditor
 */
const AtelierRoom = () => {
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
  } = usePanelContent(project?.id || "default");

  // États collapse des modules
  const roadmapState = getModuleState
    ? getModuleState("roadmap")
    : { collapsed: true };
  const todoState = getModuleState
    ? getModuleState("todo")
    : { collapsed: true };
  // const screentvState = getModuleState
  //   ? getModuleState("screentv")
  //   : { collapsed: true };
  // const mindlogState = getModuleState
  //   ? getModuleState("mindlog")
  //   : { collapsed: false };
  const notesState = getModuleState
    ? getModuleState("notes")
    : { collapsed: false };

  // Référence pour le handler de log du MindLog
  // const mindLogHandlerRef = React.useRef(null);

  if (!project) {
    return (
      <BaseRoom roomType="atelier" layoutType="grid">
        <PanelGrid columns={1} rows={1}>
          <Panel
            gridColumn="1"
            gridRow="1"
            title="Aucun projet"
            icon="⚠️"
            collapsible={false}
          >
            <div style={{ padding: "20px", textAlign: "center" }}>
              Aucun projet sélectionné
            </div>
          </Panel>
        </PanelGrid>
      </BaseRoom>
    );
  }

  return (
    <BaseRoom roomType="atelier" layoutType="grid">
      {/* Carrousel de navigation entre projets */}
      <ProjectCarousel />
      <PanelGrid columns={5} rows={5}>
        {/* Roadmap */}
        <Panel
          gridColumn="3 / 6"
          gridRow="1 / 6"
          title="Roadmap"
          icon="🗺️"
          texture="parchment"
          accentColor={theme.colors.accents.cold}
          contentType="markdown"
          collapsible={true}
          collapsed={roadmapState.collapsed ?? true}
          onToggleCollapse={(newCollapsed) =>
            updateModuleState &&
            updateModuleState("roadmap", { collapsed: newCollapsed })
          }
        >
          <MarkdownEditor
            value={roadmapContent}
            onChange={updateRoadmapContent}
            placeholder="Définissez votre roadmap en markdown..."
            height="100%"
            compact={true}
            variant="embedded"
            accentColor={theme.colors.accents.cold}
          />
        </Panel>

        {/* Todo */}
        <Panel
          gridColumn="1 / 3"
          gridRow="3 / 6"
          title="Todo"
          icon="✅"
          texture="parchment"
          accentColor={theme.colors.accents.success}
          contentType="markdown"
          collapsible={true}
          collapsed={todoState.collapsed ?? true}
          onToggleCollapse={(newCollapsed) =>
            updateModuleState &&
            updateModuleState("todo", { collapsed: newCollapsed })
          }
        >
          <MarkdownEditor
            value={todoContent}
            onChange={updateTodoContent}
            placeholder="Gérez vos tâches en markdown..."
            height="100%"
            compact={true}
            variant="embedded"
            accentColor={theme.colors.accents.success}
          />
        </Panel>

        {/* Notes */}
        <Panel
          gridColumn="1 / 3"
          gridRow="1 / 3"
          title="Notes"
          icon="📝"
          texture="parchment"
          accentColor={theme.colors.accents.neutral}
          contentType="markdown"
          collapsible={true}
          collapsed={notesState.collapsed ?? false}
          onToggleCollapse={(newCollapsed) =>
            updateModuleState &&
            updateModuleState("notes", { collapsed: newCollapsed })
          }
        >
          <MarkdownEditor
            value={notesContent}
            onChange={updateNotesContent}
            placeholder="Capturez vos idées et notes importantes..."
            height="100%"
            compact={true}
            variant="embedded"
            accentColor={theme.colors.accents.neutral}
          />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default AtelierRoom;
