// src/components/rooms/Sanctuaire/SanctuaireRoom.jsx

import React from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import MindLogSorter from "../../widgets/MindLogSorter";
import useRoomsUIStore from "../../../stores/useRoomsUIStore";

/**
 * Sanctuaire room component for spiritual and meditation activities
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 */
const SanctuaireRoom = () => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = useRoomsUIStore();

  return (
    <BaseRoom roomType="sanctuaire" layoutType="grid">
      <PanelGrid columns={5} rows={5}>
        {/* Widget Tri Mental - 2x2 en haut à gauche */}
        <Panel
          gridColumn="2 / 4"
          gridRow="2 / 4"
          title="Tri Mental"
          icon="🧘"
          texture="stone"
          accentColor={theme.colors.accents.cold}
          collapsible={true}
          collapsed={getPanelState("sanctuaire", "trimental").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("sanctuaire", "trimental", { collapsed: val })
          }
        >
          <MindLogSorter />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default SanctuaireRoom;
