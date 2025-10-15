// src/components/common/Button/Button.styles.js

import styled from 'styled-components';
import {
  primaryLevel,
  secondaryLevel,
  tertiaryLevel,
  woodBg,
  stoneBg,
  metalBg,
  parchmentBg
} from '../../../styles/mixins';
import { alpha } from '../../../styles/color';

const sizeMap = {
  small: {
    padding: '6px 12px',
    fontSize: '12px',
    minWidth: '60px',
  },
  medium: {
    padding: '8px 16px',
    fontSize: '14px',
    minWidth: '80px',
  },
  large: {
    padding: '12px 24px',
    fontSize: '16px',
    minWidth: '100px',
  },
};

export const StyledButton = styled.button`
  padding: ${({ $size }) => sizeMap[$size || 'medium'].padding};
  font-size: ${({ $size }) => sizeMap[$size || 'medium'].fontSize};
  min-width: ${({ $size }) => sizeMap[$size || 'medium'].minWidth};
  font-family: ${({ theme }) => theme.typography.families.ui};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: pointer;
  border: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.md};

  // Couleur de fond par défaut
  background: ${props => {
    if (props.$variant === 'tab') {
      return props.$active ? props.theme.colors.secondary : props.theme.colors.primary;
    }
    if (props.$variant === 'secondary') {
      return props.theme.colors.stone;
    }
    // Variants avec textures
    if (props.$variant === 'wood') return 'transparent';
    if (props.$variant === 'stone') return 'transparent';
    if (props.$variant === 'metal') return 'transparent';
    if (props.$variant === 'parchment') return 'transparent';

    // Variants niveau
    if (props.$variant === 'primary-level') return 'transparent';
    if (props.$variant === 'secondary-level') return 'transparent';
    if (props.$variant === 'tertiary-level') return 'transparent';

    // Variants colorés
    if (props.$variant === 'cool') {
      return props.$active ? props.theme.colors.accents.cool : props.theme.colors.secondary;
    }
    if (props.$variant === 'warm') {
      return props.$active ? props.theme.colors.accents.warm : props.theme.colors.secondary;
    }
    if (props.$variant === 'nature') {
      return props.$active ? props.theme.colors.accents.nature : props.theme.colors.secondary;
    }
    if (props.$variant === 'primary-colored') {
      return props.$active ? props.theme.colors.primary : props.theme.colors.secondary;
    }
    return props.theme.colors.secondary;
  }};

  // Couleur de bordure
  border-color: ${props => {
    if (props.$variant === 'cool') return props.theme.colors.accents.cool;
    if (props.$variant === 'warm') return props.theme.colors.accents.warm;
    if (props.$variant === 'nature') return props.theme.colors.accents.nature;
    if (props.$variant === 'primary-colored') return props.theme.colors.primary;
    return props.theme.colors.border;
  }};

  // Couleur du texte
  color: ${props => {
    if (props.$variant === 'tab') {
      return props.$active ? props.theme.colors.text.primary : props.theme.colors.secondary;
    }
    // Pour les variants colorés
    if (['cool', 'warm', 'nature', 'primary-colored'].includes(props.$variant)) {
      // Texte de la couleur du variant quand inactif, blanc/noir quand actif
      if (props.$active) {
        return props.theme.colors.background.default;
      }
      // Utilise la couleur de bordure pour le texte quand inactif
      if (props.$variant === 'cool') return props.theme.colors.accents.cool;
      if (props.$variant === 'warm') return props.theme.colors.accents.warm;
      if (props.$variant === 'nature') return props.theme.colors.accents.nature;
      if (props.$variant === 'primary-colored') return props.theme.colors.primary;
    }
    return props.theme.colors.text.primary;
  }};

  ${props => {
    // Variant Tab (comme IconButton)
    if (props.$variant === 'tab') {
      return `
        transition: all ${props.theme.motion.durations.fast} ${props.theme.motion.easings.standard};
        border: ${props.theme.borders.base} solid ${props.theme.colors.border};
        border-bottom: none;
        border-radius: ${props.theme.radii.md} ${props.theme.radii.md} 0 0;
        position: relative;
        z-index: ${props.theme.zIndex.level3};
        color: ${props.$active ? props.theme.colors.text.primary : props.theme.colors.secondary};
        ${props.$active ? `
          box-shadow:
            inset 0 0 0 2px ${props.theme.colors.secondary},
            inset 0 0 0 4px #b1845a,
            0 0 10px rgba(240, 222, 186, 0.3);
        ` : ''}
        &:hover {
          transform: none;
          box-shadow: none;
          background: ${props.theme.colors.accent};
          color: ${props.theme.colors.secondary};
        }
        &:active {
          transform: translateY(1px);
          box-shadow: inset 0 2px 4px ${alpha(props.theme.colors.black, 0.2)};
        }
      `;
    }

    // Variant Secondary (comme IconButton)
    if (props.$variant === 'secondary') {
      return `
        ${tertiaryLevel}
        border-color: ${props.theme.colors.text.secondary};
        transition: all ${props.theme.motion.durations.fast} ${props.theme.motion.easings.standard};
        &:hover {
          background: ${props.theme.colors.text.secondary};
          color: ${props.theme.colors.background};
        }
        &:active {
          transform: scale(0.96);
          box-shadow: inset 0 2px 4px ${alpha(props.theme.colors.black, 0.2)};
        }
      `;
    }

    // Variant Wood
    if (props.$variant === 'wood') {
      return `
        ${woodBg}
        ${secondaryLevel}
        color: ${props.$active ? props.theme.colors.primary : props.theme.colors.text.primary};
        font-weight: ${props.$active ? '600' : '400'};
        &:hover {
          transform: translateY(-2px);
          box-shadow: ${props.theme.shadows.lg};
        }
      `;
    }

    // Variant Stone
    if (props.$variant === 'stone') {
      return `
        ${stoneBg}
        ${tertiaryLevel}
        color: ${props.$active ? props.theme.colors.primary : props.theme.colors.text.primary};
        font-weight: ${props.$active ? '600' : '400'};
        &:hover {
          filter: brightness(1.1);
        }
      `;
    }

    // Variant Metal
    if (props.$variant === 'metal') {
      return `
        ${metalBg}
        ${primaryLevel}
        color: ${props.$active ? props.theme.colors.primary : props.theme.colors.text.primary};
        font-weight: ${props.$active ? '600' : '400'};
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        &:hover {
          filter: brightness(1.2);
          box-shadow: 0 0 10px ${props.theme.colors.primary};
        }
      `;
    }

    // Variant Parchment
    if (props.$variant === 'parchment') {
      return `
        ${parchmentBg}
        color: ${props.$active ? props.theme.colors.accent : props.theme.colors.text.primary};
        font-weight: ${props.$active ? '600' : '400'};
        &:hover {
          filter: sepia(0.3);
        }
      `;
    }

    // Variant Primary Level
    if (props.$variant === 'primary-level') {
      return `
        ${primaryLevel}
        background: ${props.$active ? props.theme.colors.primary : props.theme.colors.secondary};
        &:hover {
          background: ${props.theme.colors.primary};
          transform: translateY(-2px);
        }
      `;
    }

    // Variant Secondary Level
    if (props.$variant === 'secondary-level') {
      return `
        ${secondaryLevel}
        background: ${props.$active ? props.theme.colors.accent : props.theme.colors.secondary};
        &:hover {
          background: ${props.theme.colors.accent};
        }
      `;
    }

    // Variant Tertiary Level
    if (props.$variant === 'tertiary-level') {
      return `
        ${tertiaryLevel}
        background: ${props.$active ? props.theme.colors.stone : 'transparent'};
        &:hover {
          background: ${props.theme.colors.stone};
        }
      `;
    }

    // Variant Primary (bouton d'action principal)
    if (props.$variant === 'primary') {
      return `
        ${primaryLevel}
        background: ${props.theme.colors.accents.primary};
        color: ${props.theme.colors.text.light};
        font-weight: 600;
        transition: all ${props.theme.motion.durations.fast} ${props.theme.motion.easings.standard};
        &:hover {
          background: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${alpha(props.theme.colors.accents.primary, 0.4)};
        }
        &:active {
          transform: translateY(0);
          box-shadow: inset 0 2px 4px ${alpha(props.theme.colors.black, 0.3)};
        }
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          &:hover {
            transform: none;
            box-shadow: none;
          }
        }
      `;
    }

    // Variant Danger (bouton destructif)
    if (props.$variant === 'danger') {
      return `
        ${primaryLevel}
        background: ${props.theme.colors.accents.danger};
        color: ${props.theme.colors.text.light};
        font-weight: 600;
        transition: all ${props.theme.motion.durations.fast} ${props.theme.motion.easings.standard};
        &:hover {
          background: ${alpha(props.theme.colors.accents.danger, 0.8)};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${alpha(props.theme.colors.accents.danger, 0.4)};
        }
        &:active {
          transform: translateY(0);
          box-shadow: inset 0 2px 4px ${alpha(props.theme.colors.black, 0.3)};
        }
      `;
    }

    // Variant Default (comme IconButton default)
    return `
      transition: all ${props.theme.motion.durations.fast} ${props.theme.motion.easings.standard};
      &:hover {
        background: ${props.theme.colors.accent};
        transform: scale(1.05);
        box-shadow: ${props.theme.shadows.md};
      }
      &:active {
        transform: scale(0.95);
        box-shadow: inset 0 2px 4px ${alpha(props.theme.colors.black, 0.3)};
      }
    `;
  }}
`;