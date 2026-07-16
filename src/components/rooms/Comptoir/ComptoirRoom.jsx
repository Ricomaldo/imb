// src/components/rooms/Comptoir/ComptoirRoom.jsx
//
// Le Comptoir — la carte vivante de la Canopée. Lit les registres via
// canopee-api (scenes + mandats) et les affiche par strate. Le portail des
// sages/questions (feu vault-api) est retiré : le Comptoir montre désormais
// le monde tel que les registres le portent, pas un board de questions.

import React from "react";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import ScenesPanel from "./widgets/ScenesPanel";
import usePreferencesStore from "../../../stores/usePreferencesStore";
import { woodBg } from "../../../styles/mixins";

/**
 * Comptoir room — carte des scènes de la Canopée.
 * @renders BaseRoom → PanelGrid → Panel(ScenesPanel)
 */
const ComptoirRoom = () => {
  const { getPanelState, updatePanelState } = usePreferencesStore();

  return (
    <BaseRoom roomType="comptoir" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        <Panel
          gridColumn="1 / 13"
          gridRow="1 / 9"
          title="Les scènes de la Canopée"
          icon="🗺️"
          texture="wood"
          accentColor={woodBg}
          collapsible={true}
          collapsed={getPanelState("comptoir", "scenes")?.collapsed ?? false}
          onToggleCollapse={(collapsed) =>
            updatePanelState("comptoir", "scenes", { collapsed })
          }
        >
          <ScenesPanel />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default ComptoirRoom;
