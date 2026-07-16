// src/components/rooms/Comptoir/ComptoirRoom.jsx
//
// Le Comptoir — le dashboard vivant de la Canopée, lu via canopee-api.
// Deux vues : Mandats (qui porte quoi, maintenant — la vue principale) et
// Scènes (la carte du monde). Le portail sages/questions (feu vault-api) est
// retiré. Panel en transparentContent : les vues portent leur propre surface
// lisible (le texture bois du Panel écrasait le texte).

import React, { useState } from "react";
import styled from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import MandatsPanel from "./widgets/MandatsPanel";
import ScenesPanel from "./widgets/ScenesPanel";
import usePreferencesStore from "../../../stores/usePreferencesStore";

const Tabs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`;

const Tab = styled.button`
  border: 1px solid #d8c9a8;
  background: ${({ $active }) => ($active ? "#8a6d4a" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#e8dcc0")};
  padding: 5px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  transition: background 0.15s ease;
  &:hover {
    background: ${({ $active }) => ($active ? "#8a6d4a" : "rgba(0,0,0,0.15)")};
  }
`;

const VIEWS = {
  mandats: { label: "🎭 Mandats", node: <MandatsPanel /> },
  scenes: { label: "🗺️ Scènes", node: <ScenesPanel /> },
};

/**
 * Comptoir — dashboard des registres de la Canopée.
 * @renders BaseRoom → PanelGrid → Panel(tabs: Mandats | Scènes)
 */
const ComptoirRoom = () => {
  const { getPanelState, updatePanelState } = usePreferencesStore();
  const [view, setView] = useState("mandats");

  return (
    <BaseRoom roomType="comptoir" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        <Panel
          gridColumn="1 / 13"
          gridRow="1 / 9"
          title="La Canopée vivante"
          icon="🏛️"
          texture="metal"
          transparentContent
          maxHeight="calc(100vh - 150px)"
          collapsible={true}
          collapsed={getPanelState("comptoir", "canopee")?.collapsed ?? false}
          onToggleCollapse={(collapsed) =>
            updatePanelState("comptoir", "canopee", { collapsed })
          }
        >
          <Tabs>
            {Object.entries(VIEWS).map(([key, v]) => (
              <Tab
                key={key}
                $active={view === key}
                onClick={() => setView(key)}
              >
                {v.label}
              </Tab>
            ))}
          </Tabs>
          {VIEWS[view].node}
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default ComptoirRoom;
