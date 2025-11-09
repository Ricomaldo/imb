// src/components/rooms/Laboratoire/LaboratoireRoom.styles.js

import styled from "styled-components";
import {
  metalBg,
  primaryLevel,
  tertiaryLevel,
} from "../../../styles/mixins";

// Composants non utilisés - supprimés pour éviter la redondance

// Barre de contrôles simplifiée
export const ControlHeader = styled.div`
  ${primaryLevel}
  ${metalBg}
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px;
  margin-bottom: 12px;

  button {
    flex-shrink: 0;
  }
`;

// Titre du labo
export const LaboTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  font-family: ${({ theme }) => theme.typography.families.ui};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0 16px 0 0;
  white-space: nowrap;
`;

// Contenu welcome pour Panel
export const WelcomeContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

// Emoji de bienvenue
export const WelcomeEmoji = styled.div`
  font-size: 60px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// Titre de bienvenue
export const WelcomeTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

// Description de bienvenue
export const WelcomeDescription = styled.p`
  opacity: 0.7;
  margin: ${({ theme }) => `${theme.spacing.sm} 0`};
`;

// Hint de bienvenue
export const WelcomeHint = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 215, 0, 0.1);
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

// Contenu sans panel - tertiaryLevel
export const NoPanelContent = styled.div`
  ${tertiaryLevel}
  grid-column: 1 / 6;
  grid-row: 1 / 6;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 215, 0, 0.05);
  padding: ${({ theme }) => theme.spacing.xl};
`;

// Emoji grand pour sans panel
export const LargeEmoji = styled.div`
  font-size: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// Sous-titre sans panel
export const NoPanelSubtitle = styled.p`
  opacity: 0.7;
`;


// Grille principale qui prend toute la place disponible
export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

// Conteneur pour le mode sans panel
export const NoPanelCenter = styled.div`
  text-align: center;
`;
