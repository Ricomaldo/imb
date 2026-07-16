// src/companion/pages/ComptoirPage.jsx
//
// Comptoir mobile — la Canopée vivante dans la poche. Mêmes vues que le
// desktop (Mandats | Scènes) lues via canopee-api. Le portail sages/questions
// (feu vault-api) est retiré.

import React, { useState } from "react";
import styled from "styled-components";
import Panel from "../../components/common/Panel/Panel";
import MandatsPanel from "../../components/rooms/Comptoir/widgets/MandatsPanel";
import ScenesPanel from "../../components/rooms/Comptoir/widgets/ScenesPanel";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes["2xl"]};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
`;

const Tabs = styled.div`
  display: flex;
  gap: 6px;
`;

const Tab = styled.button`
  flex: 1;
  border: 1px solid #d8c9a8;
  background: ${({ $active }) => ($active ? "#8a6d4a" : "transparent")};
  color: ${({ $active, theme }) =>
    $active ? "#fff" : theme.colors.text.primary};
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
`;

const VIEWS = {
  mandats: { label: "🎭 Mandats", node: <MandatsPanel /> },
  scenes: { label: "🗺️ Scènes", node: <ScenesPanel /> },
};

/**
 * Page Comptoir mobile — dashboard des registres de la Canopée.
 */
const ComptoirPage = () => {
  const [view, setView] = useState("mandats");

  return (
    <PageContainer>
      <PageTitle>🏛️ Comptoir</PageTitle>
      <Tabs>
        {Object.entries(VIEWS).map(([key, v]) => (
          <Tab key={key} $active={view === key} onClick={() => setView(key)}>
            {v.label}
          </Tab>
        ))}
      </Tabs>
      <Panel
        title="La Canopée vivante"
        icon="🏛️"
        texture="metal"
        transparentContent
        maxHeight="calc(100vh - 220px)"
        collapsible={false}
      >
        {VIEWS[view].node}
      </Panel>
    </PageContainer>
  );
};

export default ComptoirPage;
