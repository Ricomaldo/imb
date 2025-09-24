// src/components/rooms/Bibliotheque/BibliothequeRoom.styles.js

import styled from 'styled-components';

export const BibliothequeGrid = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${({ theme }) => theme.spacing.md};

  > * {
    flex: 1;
    max-width: 100%;
    height: 100%;
  }
`;
