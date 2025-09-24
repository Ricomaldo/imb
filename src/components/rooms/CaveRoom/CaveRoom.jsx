// src/components/rooms/CaveRoom/CaveRoom.jsx

import React from 'react';
import PanelGrid from '../../common/PanelGrid/PanelGrid';
import SlidingPuzzle from '../../games/SlidingPuzzle/SlidingPuzzle';
import Medieval2048 from '../../games/Medieval2048/Medieval2048';
import Mastermind from '../../games/Mastermind/Mastermind';
import { RoomContainer, RoomContent } from './CaveRoom.styles';

/**
 * Cave - Salle de jeux et détente
 * Grille 4x4 avec 3 jeux
 * @renders RoomContainer
 * @renders RoomContent
 * @renders PanelGrid
 * @renders SlidingPuzzle
 * @renders Medieval2048
 * @renders Mastermind
 */
const CaveRoom = () => {
  // Configuration 4x4 pour la Cave avec 3 jeux
  const gridConfig = {
    rows: 4,
    cols: 4,
    panels: [
      {
        id: 'puzzle',
        row: 1,
        col: 1,
        width: 2,
        height: 2,
        title: '⚔️ Puzzle Glissant',
        headerStyle: {
          background: 'linear-gradient(135deg, #4A4A4A, #2C2C2C)',
          borderBottom: '2px solid #666',
          color: '#C0C0C0'
        },
        style: {
          background: 'linear-gradient(135deg, #1A1A1A, #0D0D0D)',
          border: '2px solid #444'
        },
        children: <SlidingPuzzle />
      },
      {
        id: '2048',
        row: 1,
        col: 3,
        width: 2,
        height: 2,
        title: '👑 2048 Medieval',
        headerStyle: {
          background: 'linear-gradient(135deg, #5D4037, #3E2723)',
          borderBottom: '2px solid #8D6E63',
          color: '#D7CCC8'
        },
        style: {
          background: 'linear-gradient(135deg, #2E1A0F, #1A0F05)',
          border: '2px solid #5D4037'
        },
        children: <Medieval2048 />
      },
      {
        id: 'mastermind',
        row: 3,
        col: 1,
        width: 2,
        height: 2,
        title: '🔮 Mastermind',
        headerStyle: {
          background: 'linear-gradient(135deg, #4A148C, #311B92)',
          borderBottom: '2px solid #7B1FA2',
          color: '#E1BEE7'
        },
        style: {
          background: 'linear-gradient(135deg, #1A0033, #0D001A)',
          border: '2px solid #4A148C'
        },
        children: <Mastermind />
      },
      {
        id: 'scores',
        row: 3,
        col: 3,
        width: 2,
        height: 2,
        title: '🏆 Tableau des Scores',
        headerStyle: {
          background: 'linear-gradient(135deg, #B8860B, #8B6914)',
          borderBottom: '2px solid #FFD700',
          color: '#FFF8DC'
        },
        style: {
          background: 'linear-gradient(135deg, #1A1400, #0D0A00)',
          border: '2px solid #B8860B',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        },
        children: (
          <div style={{
            color: '#FFD700',
            textAlign: 'center',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            <div style={{ marginBottom: '12px', fontSize: '24px' }}>🎮</div>
            <div style={{ color: '#D2B48C', fontWeight: 'bold', marginBottom: '8px' }}>
              Records à battre
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              Puzzle: 15 coups<br/>
              2048: 2048 pts<br/>
              Mastermind: 4 essais
            </div>
            <div style={{ marginTop: '12px', fontSize: '11px', color: '#666' }}>
              Vos scores sont<br/>sauvegardés localement
            </div>
          </div>
        )
      }
    ]
  };

  return (
    <RoomContainer>
      <RoomContent>
        <PanelGrid
          rows={gridConfig.rows}
          cols={gridConfig.cols}
          panels={gridConfig.panels}
          roomType="cave"
        />
      </RoomContent>
    </RoomContainer>
  );
};

export default CaveRoom;