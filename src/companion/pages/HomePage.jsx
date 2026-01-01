// src/companion/pages/HomePage.jsx

import React, { useState } from "react";
import styled from "styled-components";
import QuoteCarousel from "../../components/widgets/QuoteCarousel/QuoteCarousel";
import Diary from "../../components/widgets/Diary/Diary";
import Panel from "../../components/common/Panel/Panel";
import { MomentsOuiWidget } from "../../components/room-modules/sanctuaire/MomentsOui";
import HydrationReminder from "../../components/room-modules/cuisine/HydrationReminder";
import PauseCorps from "../../components/room-modules/cuisine/PauseCorps";
import { ZoneRouge } from "../../components/rooms/Comptoir/widgets/ZoneRouge";

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

/**
 * Page d'accueil Companion - Widgets bien-être quotidien
 * @renders PageContainer
 * @renders PageTitle
 * @renders Panel
 */
const HomePage = () => {
  // Gestion des états collapsed pour chaque panel
  const [collapsedStates, setCollapsedStates] = useState({
    mantras: true,
    journal: false,
    hydration: true,
    pauseCorps: true,
    momentsOui: true,
    zoneRouge: true
  });

  const toggleCollapse = (panelId) => {
    setCollapsedStates(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  return (
    <PageContainer>
      <PageTitle>🏠 IMB Companion</PageTitle>

      {/* Mantras */}
      <Panel
        title="Mantras"
        icon="🕉️"
        texture="fabric"
        accentColor="#B8860B"
        contentType="mantras"
        collapsible={true}
        collapsed={collapsedStates.mantras}
        onToggleCollapse={() => toggleCollapse('mantras')}
      >
        <QuoteCarousel showCategory={false} infinite={true} random={true} />
      </Panel>

      {/* Journal */}
      <Panel
        title="Journal"
        icon="📔"
        texture="leather"
        accentColor="#4A5568"
        contentType="markdown"
        collapsible={true}
        collapsed={collapsedStates.journal}
        onToggleCollapse={() => toggleCollapse('journal')}
      >
        <Diary />
      </Panel>

      {/* Hydratation */}
      <Panel
        title="Hydratation"
        icon="💧"
        texture="wood"
        accentColor="#3B82F6"
        collapsible={true}
        collapsed={collapsedStates.hydration}
        onToggleCollapse={() => toggleCollapse('hydration')}
      >
        <HydrationReminder />
      </Panel>

      {/* Pause Corps */}
      <Panel
        title="Pause Corps"
        icon="🧘"
        texture="wood"
        accentColor="#10B981"
        collapsible={true}
        collapsed={collapsedStates.pauseCorps}
        onToggleCollapse={() => toggleCollapse('pauseCorps')}
      >
        <PauseCorps />
      </Panel>

      {/* Moments OUI */}
      <Panel
        title="Moments OUI"
        icon="✨"
        texture="parchment"
        accentColor="#8B5CF6"
        collapsible={true}
        collapsed={collapsedStates.momentsOui}
        onToggleCollapse={() => toggleCollapse('momentsOui')}
      >
        <MomentsOuiWidget />
      </Panel>

      {/* Zone Rouge - En bas */}
      <Panel
        title="Zone Rouge"
        icon="🔴"
        texture="stone"
        accentColor="#EF4444"
        collapsible={true}
        collapsed={collapsedStates.zoneRouge}
        onToggleCollapse={() => toggleCollapse('zoneRouge')}
      >
        <ZoneRouge />
      </Panel>
    </PageContainer>
  );
};

export default HomePage;
