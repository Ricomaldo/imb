// src/components/rooms/CaveRoom/CaveRoom.styles.js

import styled from 'styled-components';

export const RoomContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

export const RoomContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;