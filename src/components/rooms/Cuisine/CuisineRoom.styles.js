// src/components/rooms/Cuisine/CuisineRoom.styles.js

import styled from 'styled-components';

export const CuisineGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 2fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ClockWrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 60px;
  z-index: 10;
  filter: drop-shadow(4px 6px 12px rgba(0, 0, 0, 0.15));

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, #8b7355 0%, #6d5a45 100%);
    border-radius: 50%;
    box-shadow:
      inset 0 2px 3px rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 10px;
    background: linear-gradient(to bottom, #6d5a45 0%, transparent 100%);
  }
`;
