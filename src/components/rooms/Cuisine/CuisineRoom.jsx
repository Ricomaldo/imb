// src/components/rooms/Cuisine/CuisineRoom.jsx

import React from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import HydrationReminder from "../../room-modules/cuisine/HydrationReminder";

/**
 * Cuisine room component for cooking and wellness
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 * @renders HydrationReminder
 */
const CuisineRoom = () => {
  const theme = useTheme();

  return (
    <BaseRoom roomType="cuisine" layoutType="grid">
      <PanelGrid columns={5} rows={5}>
        {/* Widget Hydratation - Position centrale */}
        <Panel
          gridColumn="1 / 3"
          gridRow="1 / 4"
          title="Hydratation"
          icon="💧"
          texture="wood"
          accentColor={theme.colors.accents.cold}
          transparentContent={true}
          collapsible={false}
        >
          <HydrationReminder />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default CuisineRoom;
