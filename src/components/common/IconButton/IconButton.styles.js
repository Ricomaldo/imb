// src/components/common/IconButton/IconButton.styles.js

import styled from 'styled-components';
import { squareButton, tertiaryLevel } from '../../../styles/mixins';
import { alpha } from '../../../styles/color';
import { MEDIA_QUERIES } from '../../../utils/responsiveConfig';

export const ButtonContainer = styled.button.withConfig({
  shouldForwardProp: (prop) =>
    !['active', '$active', '$disabled', 'variant', 'size'].includes(prop)
})`
  ${props => squareButton(props.size)}
  background: ${props => {
    if (props.variant === 'tab') {
      return props.$active ? props.theme.colors.secondary : props.theme.colors.primary;
    }
    if (props.variant === 'secondary') {
      return props.theme.colors.stone;
    }
    if (props.variant === 'ghost') {
      return 'rgba(255,255,255,0.2)';
    }
    return props.theme.colors.secondary;
  }};

  /* Disabled state */
  ${({ $disabled }) => $disabled && `
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  `}

  /* Responsive sizing - Tablet (768-1023px) */
  @media ${MEDIA_QUERIES.tablet} {
    width: ${({ size, theme }) => {
      if (size === 'large') return theme.button.medium;
      if (size === 'medium') return theme.button.small;
      return '40px';
    }};
    height: ${({ size, theme }) => {
      if (size === 'large') return theme.button.medium;
      if (size === 'medium') return theme.button.small;
      return '40px';
    }};
    font-size: ${({ size }) => {
      if (size === 'large') return '16px';
      if (size === 'medium') return '14px';
      return '12px';
    }};
  }

  /* Responsive sizing - iPad Horizontal / TabletWide (1024-1439px) */
  @media ${MEDIA_QUERIES.tabletWideOnly} {
    width: ${({ size, theme }) => {
      if (size === 'large') return '56px';
      if (size === 'medium') return '44px';
      return '36px';
    }};
    height: ${({ size, theme }) => {
      if (size === 'large') return '56px';
      if (size === 'medium') return '44px';
      return '36px';
    }};
    font-size: ${({ size }) => {
      if (size === 'large') return '18px';
      if (size === 'medium') return '16px';
      return '13px';
    }};
  }

  ${props => {
    if (props.variant === 'ghost') {
      return `
        border: none;
        color: white;
        transition: background 0.2s;
        &:hover:not(:disabled) {
          background: rgba(255,255,255,0.3);
          transform: none;
        }
        &:active:not(:disabled) {
          transform: scale(0.95);
        }
      `;
    }
    if (props.variant === 'tab') {
      return `
        transition: all ${props.theme.motion.durations.fast} ${props.theme.motion.easings.standard};
        border: ${props.theme.borders.base} solid ${props.theme.colors.border};
        border-bottom: none;
        border-radius: ${props.theme.radii.md} ${props.theme.radii.md} 0 0;
        position: relative;
        z-index: ${props.theme.zIndex.level3};
        color: ${props.$active ? props.theme.colors.text.primary : props.theme.colors.secondary};
        /* TEST-MEDIEVAL-UI: Outline doré pour tab actif (au lieu de border qui se fait recouvrir) */
        ${props.$active ? `
          box-shadow:
            inset 0 0 0 2px ${props.theme.colors.secondary},
            inset 0 0 0 4px #b1845a,
            0 0 10px rgba(240, 222, 186, 0.3);
        ` : ''}
        &:hover:not(:disabled) {
          transform: none;
          box-shadow: none;
          background: ${props.theme.colors.accent};
          color: ${props.theme.colors.secondary};
        }
        &:active:not(:disabled) {
          transform: translateY(1px);
          box-shadow: inset 0 2px 4px ${alpha(props.theme.colors.black, 0.2)};
        }
      `;
    }
    if (props.variant === 'secondary') {
      return `
        ${tertiaryLevel}
        border-color: ${props.theme.colors.text.secondary};
        transition: all ${props.theme.motion.durations.fast} ${props.theme.motion.easings.standard};
        &:hover:not(:disabled) {
          background: ${props.theme.colors.text.secondary};
          color: ${props.theme.colors.background};
        }
        &:active:not(:disabled) {
          transform: scale(0.96);
          box-shadow: inset 0 2px 4px ${alpha(props.theme.colors.black, 0.2)};
        }
      `;
    }
    return `
      transition: all ${props.theme.motion.durations.fast} ${props.theme.motion.easings.standard};
      &:hover:not(:disabled) {
        background: ${props.theme.colors.accent};
      }
      &:active:not(:disabled) {
        transform: scale(0.95);
        box-shadow: inset 0 2px 4px ${alpha(props.theme.colors.black, 0.3)};
      }
    `;
  }}
`;

export const IconWrapper = styled.div`
  font-size: inherit;
  line-height: 1;
`;

export const Label = styled.span`
  font-size: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing['3xs']};
  text-align: center;
  font-weight: 500;
`;
