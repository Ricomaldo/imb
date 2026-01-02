// src/components/rooms/Cuisine/CuisineRoom.jsx

import React from "react";
import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import HydrationReminder from "../../room-modules/cuisine/HydrationReminder";
import PauseCorps from "../../room-modules/cuisine/PauseCorps";
import AnalogClock from "../../furniture/AnalogClock/AnalogClock";
import { ClockWrapper } from "./CuisineRoom.styles";

/**
 * Cuisine room component for cooking and wellness
 * @renders BaseRoom
 * @renders ClockWrapper
 * @renders AnalogClock
 * @renders PanelGrid
 * @renders Panel
 * @renders HydrationReminder
 * @renders PauseCorps
 */
const CuisineRoom = () => {
  const theme = useTheme();

  return (
    <BaseRoom roomType="cuisine" layoutType="grid">
      {/* Horloge murale */}
      <ClockWrapper>
        <AnalogClock size={180} showNumbers={true} showSeconds={true} />
      </ClockWrapper>

      <PanelGrid columns={5} rows={5}>
        {/* Widget Hydratation - Position centrale */}
        <Panel
          gridColumn="4 / 6"
          gridRow="4 / 6"
          title="Hydratation"
          icon="💧"
          texture="wood"
          accentColor={theme.colors.accents.cold}
          transparentContent={true}
          collapsible={true}
        >
          <HydrationReminder />
        </Panel>

        {/* Widget PauseCorps - Pour les micro-mouvements */}
        <Panel

                    gridColumn="1 / 3"
          gridRow="1 / 4"
          title="Pause Corps"
          icon="🧘"
          texture="wood"
          accentColor={theme.colors.accents.success}
          transparentContent={true}
          collapsible={true}
        >
          <PauseCorps />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default CuisineRoom;
