// src/components/rooms/Cave/CaveRoom.jsx

import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import BaseRoom from '../../layout/BaseRoom/BaseRoom';
import PanelGrid from '../../layout/PanelGrid/PanelGrid';
import Panel from "../../common/Panel";
import SlidingPuzzle from '../../games/SlidingPuzzle/SlidingPuzzle';
import Medieval2048 from '../../games/Medieval2048/Medieval2048';
import Mastermind from '../../games/Mastermind/Mastermind';
import usePreferencesStore from '../../../stores/usePreferencesStore';

// Styled component pour le levier secret
const SecretLever = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 80px;
  background: linear-gradient(180deg, #4a4a4a, #2a2a2a);
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3);
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 6px 12px rgba(0,0,0,0.5);
  }
`;

const LeverHandle = styled.div`
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #8b7355, #5c4a3a);
  border-radius: 50%;
  position: relative;
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);

  ${props => props.$activated && `
    transform: translateY(-20px);
  `}

  &::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 30px;
    background: linear-gradient(180deg, #6b5a4a, #4a3a2a);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -10px);
    border-radius: 2px;
  }
`;

const GameGridWrapper = styled.div`
  animation: fadeInSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;

  @keyframes fadeInSlide {
    0% {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
      filter: blur(4px);
    }
    50% {
      filter: blur(2px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }
`;

/**
 * Cave - Salle de jeux et détente
 * Grille 4x4 avec 4 jeux en 2x2 chacun
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 * @renders SlidingPuzzle
 * @renders Medieval2048
 * @renders Mastermind
 */
const CaveRoom = () => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = usePreferencesStore();
  const [gamesRevealed, setGamesRevealed] = useState(false);

  return (
    <BaseRoom roomType="cave" layoutType="grid">
      {/* Levier secret */}
      <SecretLever
        onClick={() => setGamesRevealed(!gamesRevealed)}
      >
        <LeverHandle $activated={gamesRevealed} />
      </SecretLever>

      {/* Grille de jeux - visible seulement si le levier est activé */}
      {gamesRevealed && (
        <PanelGrid columns={5} rows={5}>
        {/* Puzzle Glissant - 2x2 en haut à gauche */}
        <Panel
          gridColumn="1 / 3"
          gridRow="1 / 4"
          title="⚔️ Puzzle Glissant"
          icon="🧩"
          texture="stone"
          accentColor={theme.colors.accents.neutral}
          collapsible={true}
          collapsed={getPanelState("cave", "puzzle").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("cave", "puzzle", { collapsed: val })
          }
        >
          <SlidingPuzzle />
        </Panel>

        {/* 2048 Medieval - 2x2 en bas à gauche */}
        <Panel
          gridColumn="1 / 3"
          gridRow="4 / 6"
          title="👑 2048 Medieval"
          icon="👑"
          texture="wood"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={getPanelState("cave", "medieval2048").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("cave", "medieval2048", { collapsed: val })
          }
        >
          <Medieval2048 />
        </Panel>

        {/* Mastermind - 2x2 en haut à droite */}
        <Panel
          gridColumn="3 / 5"
          gridRow="1 / 4"
          title="🔮 Mastermind"
          icon="🔮"
          texture="fabric"
          accentColor={theme.colors.accents.cold}
          collapsible={true}
          collapsed={getPanelState("cave", "mastermind").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("cave", "mastermind", { collapsed: val })
          }
        >
          <Mastermind />
        </Panel>

        {/* Tableau des Scores - 2x2 en bas à droite */}
        <Panel
          gridColumn="3 / 5"
          gridRow="4 / 6"
          title="🏆 Tableau des Scores"
          icon="🏆"
          texture="metal"
          accentColor={theme.colors.accents.nature}
          collapsible={true}
          collapsed={getPanelState("cave", "scores").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("cave", "scores", { collapsed: val })
          }
        >
          <div style={{
            color: theme.colors.text.primary,
            textAlign: 'center',
            fontSize: '13px',
            lineHeight: '1.6',
            padding: theme.spacing.md
          }}>
            <div style={{ marginBottom: '12px', fontSize: '24px' }}>🎮</div>
            <div style={{ 
              color: theme.colors.text.secondary, 
              fontWeight: 'bold', 
              marginBottom: '8px' 
            }}>
              Records à battre
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.text.muted }}>
              Puzzle: 200 coups<br/>
              2048: 2048 pts<br/>
              Mastermind: 4 essais
            </div>
            <div style={{ 
              marginTop: '12px', 
              fontSize: '11px', 
              color: theme.colors.text.muted 
            }}>
              Vos scores sont<br/>sauvegardés localement
            </div>
          </div>
        </Panel>
      </PanelGrid>
      )}
    </BaseRoom>
  );
};

export default CaveRoom;