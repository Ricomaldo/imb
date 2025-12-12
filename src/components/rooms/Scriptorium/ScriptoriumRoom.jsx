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
 * Layout 12x8 "effet bureau" - espacé et inspirant
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
      <PanelGrid columns={12} rows={8}>
        {/* Brouillon - comme un document posé sur le bureau (gauche haut) */}
        <Panel
          gridColumn="1 / 6"
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

        {/* Archives du Journal - comme un classeur/bibliothèque (droite) */}
        <Panel
          gridColumn="7 / 13"
          gridRow="1 / 7"
          title="Archives du Journal"
          icon="📚"
          texture="wood"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={getPanelState("scriptorium", "archives").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("scriptorium", "archives", { collapsed: val })
          }
        >
          <DiaryArchive />
        </Panel>

        {/* Espace vide pour inspiration - centre et bas du bureau
            Disponible pour futurs composants:
            - Notes rapides / Post-its
            - Planner hebdomadaire
            - Citations / inspiration
            - Outils d'écriture
            - etc.
        */}
      </PanelGrid>
    </BaseRoom>
  );
};

export default ScriptoriumRoom;
