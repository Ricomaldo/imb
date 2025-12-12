// src/components/common/Panel/Panel.styles.js

import styled from 'styled-components';
import { textures } from '../../../utils/assetMapping';
import { alpha } from '../../../styles/color';
import { blueBorder, craftBorderHeavy } from '../../../styles/mixins';

export const PanelWrapper = styled.div`
  grid-column: ${props => props.$gridColumn};
  grid-row: ${props => props.$gridRow};
  position: relative;
  /* Important en Grid: autoriser l'enfant à rétrécir et scroller */
  min-width: 0;
  min-height: 0;
`;

export const PanelContainer = styled.div`
  width: 100%;
  height: ${props => props.$collapsed ? 'auto' : '100%'};
  max-height: ${props => props.$collapsed ? 'none' : props.$maxHeight};
  background-image: url(${props => textures[props.$texture] || textures.parchment});
  background-size: cover;
  background-attachment: local;
  border-radius: ${({ theme }) => theme.radii.xl};
  ${props => props.$borderType === 'blue' ? blueBorder :
            props.$borderType === 'craft' ? craftBorderHeavy :
            `border: ${props.theme.borders.thick} solid ${props.theme.colors.border};`}
  padding: ${({ theme }) => theme.spacing.sm};
  position: relative;
  display: flex;
  flex-direction: column;
  transition: height 0.3s ease, max-height 0.3s ease;
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  background: ${props => props.$accentColor || props.theme.colors.accents.cold};
  color: ${({ theme }) => theme.colors.text.light};
  border-radius: 6px 6px 0 0;
  position: relative;
  z-index: 1;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PanelBadge = styled.span`
  background: ${({ theme }) => theme.surfaces.base};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => `${theme.spacing['3xs']} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radii.xl};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  border: 1px solid ${({ theme }) => theme.colors.border};
  min-width: 20px;
  text-align: center;
`;

export const ToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop)
})`
  background: ${props => props.$active ? props.theme.colors.white : `${props.theme.colors.white}E6`}; /* E6 = 90% opacity */
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
  box-shadow: 0 1px 3px ${({ theme }) => alpha(theme.colors.black, 0.2)};

  &:hover {
    background: ${props => props.theme.colors.white};
    transform: translateY(-1px);
    box-shadow: 0 2px 6px ${({ theme }) => alpha(theme.colors.black, 0.3)};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PanelContent = styled.div`
  flex: 1;
  background: ${props => props.$transparentContent ? 'transparent' : (props.$accentColor || props.theme.colors.accents.cold)};
  border-radius: 0 0 ${({ theme }) => theme.radii.sm} ${({ theme }) => theme.radii.sm};
  /* Autoriser le scroll interne du contenu */
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  padding-top: 0;
  min-height: 0;

`;

// ============================================
// Focus Mode Styles (Mode plein écran)
// ============================================

export const FocusOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => alpha(theme.colors.black, 0.9)};
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px; /* Desktop: padding confortable */
  animation: fadeIn 0.2s ease-out;

  /* Mobile: padding minimal */
  @media (max-width: 768px) {
    padding: 8px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const FocusContainer = styled.div`
  /* Desktop: taille raisonnable, centrée */
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  max-height: 85vh;

  /* Mobile: plein écran */
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  background-image: url(${textures.parchment});
  background-size: cover;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 10px 30px ${({ theme }) => alpha(theme.colors.black, 0.5)};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const FocusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${props => props.$accentColor || props.theme.colors.accents.cold};
  color: ${({ theme }) => theme.colors.text.light};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;

  /* Mobile: header plus compact */
  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};

    span {
      font-size: 1em;
    }
  }
`;

export const FocusContent = styled.div`
  flex: 1;
  overflow: hidden; /* Pas auto, le MarkdownEditor gère son scroll */
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important pour flexbox */

  /* Zoom boost: augmente la taille de base */
  font-size: 2.5em;
  line-height: 1.6;

  /* Mobile: zoom moins agressif */
  @media (max-width: 768px) {
    font-size: 1.8em;
    padding: ${({ theme }) => theme.spacing.xs};
  }

  /* Force toute la chaîne flex à prendre 100% de hauteur */
  & > * {
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  /* Forcer les enfants imbriqués (EditorContent, Textarea, Preview) */
  & > * > *,
  & > * > * > * {
    flex: 1 1 auto;
    min-height: 0;
  }

  /* Textarea spécifique: forcer 100% hauteur */
  textarea {
    flex: 1 1 auto !important;
    height: 100% !important;
    min-height: 200px;
  }
`;

export const FocusCloseButton = styled.button`
  background: ${({ theme }) => theme.colors.accents.danger};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;

  &:hover {
    opacity: 0.9;
  }
`;