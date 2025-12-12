// src/components/rooms/Scriptorium/ScriptoriumRoom.jsx

import React from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import { ScriptoriumGrid } from "./ScriptoriumRoom.styles";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import MarkdownEditor from "../../common/MarkdownEditor";
import DiaryArchive from "../../widgets/DiaryArchive/DiaryArchive";
import useNotesStore from "../../../stores/useNotesStore";
import usePreferencesStore from "../../../stores/usePreferencesStore";

/**
 * Scriptorium room component for writing and documentation
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 * @renders MarkdownEditor
 * @renders DiaryArchive
 */
const ScriptoriumRoom = () => {
  const theme = useTheme();
  const { getRoomNote, updateRoomNote } = useNotesStore();
  const { getPanelState, updatePanelState } = usePreferencesStore();

  const brouillonNote = getRoomNote('scriptorium');

  return (
    <BaseRoom roomType="scriptorium" layoutType="grid">
      <PanelGrid columns={4} rows={4}>
        {/* Brouillon - côté gauche */}
        <Panel
          gridColumn="1 / 3"
          gridRow="1 / 5"
          title="Brouillon"
          icon="📝"
          texture="parchment"
          accentColor={theme.colors.accents.neutral}
          contentType="markdown"
          collapsible={true}
          collapsed={getPanelState("scriptorium", "brouillon").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("scriptorium", "brouillon", { collapsed: val })
          }
        >
          <MarkdownEditor
            value={brouillonNote}
            onChange={(value) => updateRoomNote('scriptorium', value)}
            placeholder="Brouillon de travail..."
            height="100%"
            variant="embedded"
          />
        </Panel>
        {/* Archives du Journal - côté droit */}
        <Panel
          gridColumn="3 / 5"
          gridRow="1 / 5"
          title="Archives du Journal"
          icon="📚"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={getPanelState("scriptorium", "archives").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("scriptorium", "archives", { collapsed: val })
          }
        >
          <DiaryArchive />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default ScriptoriumRoom;
