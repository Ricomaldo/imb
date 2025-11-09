// src/components/rooms/Scriptorium/ScriptoriumRoom.jsx

import React from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import { ScriptoriumGrid } from "./ScriptoriumRoom.styles";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import Diary from "../../widgets/Diary/Diary";
import DiaryArchive from "../../widgets/DiaryArchive/DiaryArchive";

/**
 * Scriptorium room component for writing and documentation
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 * @renders Diary
 */
const ScriptoriumRoom = () => {
  const theme = useTheme();

  return (
    <BaseRoom roomType="scriptorium" layoutType="grid">
      <PanelGrid columns={4} rows={4}>
        {/* Journal quotidien - côté droit */}
        <Panel
          gridColumn="1 / 3"
          gridRow="1 / 4"
          title="Journal Quotidien"
          icon="📖"
          texture="wood"
          contentType="markdown"
          collapsible={true}
          defaultCollapsed={false}
        >
          <Diary />
        </Panel>
        {/* Archives du Journal - Petit panneau en haut à gauche */}
        <Panel
          gridColumn="3 / 5"
          gridRow="1 / 4"
          title="Archives du Journal"
          icon="📚"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={false}
        >
          <DiaryArchive />
        </Panel>
        {/* Espace pour futurs widgets à gauche */}
      </PanelGrid>
    </BaseRoom>
  );
};

export default ScriptoriumRoom;
