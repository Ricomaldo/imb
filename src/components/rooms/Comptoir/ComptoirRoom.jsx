// src/components/rooms/Comptoir/ComptoirRoom.jsx

import React from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import { SagesPortal } from "./widgets/SagesPortal";
import { ZoneRouge } from "./widgets/ZoneRouge";

/**
 * Comptoir room component for reception and counter services
 * @renders BaseRoom
 * @renders PanelGrid (12x8)
 * @renders Panel with SagesPortal (M1)
 */
const ComptoirRoom = () => {
  const theme = useTheme();

  return (
    <BaseRoom roomType="comptoir" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        {/* Zone Rouge - Protocole Urgence (left, medium size) */}
        <Panel
          gridColumn="1 / 4"
          gridRow="1 / 4"
          title="Zone Rouge"
          icon="🔴"
          texture="stone"
        >
          <ZoneRouge />
        </Panel>

        {/* Portail des 8 Sages - main area */}
        <Panel
          gridColumn="4 / 13"
          gridRow="1 / 7"
          title="Les 8 Sages"
          icon="🎭"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
        >
          <SagesPortal />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default ComptoirRoom;
