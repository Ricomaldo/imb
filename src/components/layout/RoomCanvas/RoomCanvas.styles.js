// src/components/layout/RoomCanvas/RoomCanvas.styles.js

import styled from 'styled-components';
import { craftBorderHeavy, parchmentBg, medievalShadow, craftBorder } from '../../../styles/mixins';
import { alpha } from '../../../styles/color';

export const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  ${craftBorderHeavy}
  ${parchmentBg}
  cursor: crosshair;
  padding: ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;
`;

export const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  transition: transform 0.4s ease-out;
  width: 600%;
  height: 500%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const RoomSlot = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !['roomType', 'roomColors', 'background'].includes(prop)
})`
  ${craftBorder}
  background: ${({ roomColors, roomType, theme }) => roomColors?.[roomType] || theme.colors.text.primary};
  background-image: ${props => props.background ? `url(${props.background})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.spacing.lg};
  font-weight: bold;
  font-family: ${({ theme }) => theme.typography.families.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
  position: relative;
  margin: 2px;
  border-radius: ${({ theme }) => theme.radii.md};
  ${medievalShadow}
  /* Clip et laisser l'enfant scroller, ne pas pousser la grille */
  overflow: hidden;
  min-width: 0;
  min-height: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ background, theme }) => background
      ? `linear-gradient(${alpha(theme.colors.primary, 0.2)}, ${alpha(theme.colors.primary, 0.4)})`
      : 'none'};
    border-radius: ${({ theme }) => theme.radii.sm};
    pointer-events: none;
  }
`;

export const RoomTitleOverlay = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: ${({ theme }) => theme.zIndex.overlay || 15};
  
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
  user-select: none;
  
  background: ${() => alpha('#000000', 0.3)};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  backdrop-filter: blur(4px);
`;

export const NavigationZone = styled.div`
  position: absolute;
  background: ${({ theme }) => alpha(theme.colors.primary, 0.4)}; /* 40% opacity */
  border: ${({ theme }) => `${theme.borders.base} solid ${alpha(theme.colors.secondary, 0.6)}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  z-index: ${({ theme }) => theme.zIndex.navigation};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.light};
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  opacity: 0.7;
  transition: ${({ theme }) => `all ${theme.motion.durations.base} ${theme.motion.easings.standard}`};
  ${medievalShadow}

  &.zone-top {
    top: ${({ theme }) => theme.spacing.md};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 40px;
    cursor: n-resize;
  }

  &.zone-bottom {
    bottom: ${({ theme }) => theme.spacing.md};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 40px;
    cursor: s-resize;
  }

  &.zone-left {
    top: 50%;
    transform: translateY(-50%);
    left: ${({ theme }) => theme.spacing.md};
    width: 40px;
    height: 60px;
    cursor: w-resize;
  }

  &.zone-right {
    top: 50%;
    transform: translateY(-50%);
    right: ${({ theme }) => theme.spacing.md};
    width: 40px;
    height: 60px;
    cursor: e-resize;
  }

  &:hover {
    opacity: 1;
    background: ${({ theme }) => alpha(theme.colors.primary, 0.6)}; /* 60% opacity */
    border-color: ${({ theme }) => alpha(theme.colors.accent, 0.8)};
    transform: ${props => 
      props.className?.includes('zone-top') ? 'translateX(-50%) translateY(-2px)' :
      props.className?.includes('zone-bottom') ? 'translateX(-50%) translateY(2px)' :
      props.className?.includes('zone-left') ? 'translateY(-50%) translateX(-2px)' :
      'translateY(-50%) translateX(2px)'
    };
  }
`;
