// src/components/common/Badge/Badge.jsx

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { alpha } from '../../../styles/color';

const BadgeContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme, $size }) => {
    switch($size) {
      case 'sm': return `2px 6px`;
      case 'lg': return `6px 12px`;
      default: return `4px 8px`;
    }
  }};
  border-radius: ${({ theme, $variant }) => {
    switch($variant) {
      case 'rounded': return theme.radii.xl;
      case 'pill': return '999px';
      default: return theme.radii.sm;
    }
  }};
  font-size: ${({ theme, $size }) => {
    switch($size) {
      case 'sm': return '11px';
      case 'lg': return '14px';
      default: return '12px';
    }
  }};
  font-weight: ${({ $variant }) => $variant === 'outline' ? 500 : 600};
  line-height: 1.4;
  transition: all 0.2s ease;

  ${({ theme, $color, $variant }) => {
    // Définir les couleurs selon le type
    let bgColor;

    switch($color) {
      // Status colors
      case 'success':
      case 'dev_actif':
        bgColor = theme.colors.accents?.success || '#68752C';
        break;
      case 'warning':
      case 'concept':
      case 'staging':
        bgColor = theme.colors.accents?.warm || '#B8860B';
        break;
      case 'info':
      case 'vision':
      case 'dev':
        bgColor = theme.colors.accents?.cold || '#4A5568';
        break;
      case 'danger':
      case 'archive':
        bgColor = theme.colors.accents?.danger || '#8B3A3A';
        break;
      case 'muted':
      case 'pause':
      case 'local':
        bgColor = theme.colors.stone || '#708090';
        break;

      // Type colors
      case 'tool':
      case 'outil':
        bgColor = theme.colors.primary;
        break;
      case 'app':
      case 'application':
        bgColor = theme.colors.accent;
        break;
      case 'website':
      case 'site':
        bgColor = theme.colors.secondary;
        break;
      case 'api':
        bgColor = theme.colors.accents?.cold || '#4A5568';
        break;
      case 'library':
      case 'librairie':
        bgColor = theme.colors.accents?.success || '#68752C';
        break;

      // Tech/default
      case 'tech':
      case 'secondary':
        bgColor = theme.colors.secondary;
        break;

      default:
        bgColor = theme.colors.primary;
    }

    // Appliquer les variantes
    if ($variant === 'solid') {
      return `
        background: ${bgColor};
        color: white;
        border: 1px solid ${bgColor};
      `;
    } else if ($variant === 'outline') {
      return `
        background: transparent;
        color: ${bgColor};
        border: 1px solid ${bgColor};
      `;
    } else {
      // Default: subtle variant
      return `
        background: ${alpha(bgColor, 0.15)};
        color: ${bgColor};
        border: 1px solid ${alpha(bgColor, 0.3)};
      `;
    }
  }}

  ${({ $clickable }) => $clickable && `
    cursor: pointer;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `}
`;

const BadgeIcon = styled.span`
  font-size: ${({ $size }) => {
    switch($size) {
      case 'sm': return '10px';
      case 'lg': return '14px';
      default: return '12px';
    }
  }};
`;

/**
 * Badge component for displaying status, categories, or labels
 * Supports multiple colors, variants, and sizes with customizable shape
 * @renders BadgeContainer
 * @renders BadgeIcon
 */
const Badge = ({
  children,
  color = 'primary',
  variant = 'subtle', // 'subtle' | 'solid' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  shape = 'default', // 'default' | 'rounded' | 'pill'
  icon,
  onClick,
  ...props
}) => {
  return (
    <BadgeContainer
      $color={color}
      $variant={variant}
      $size={size}
      $shape={shape}
      $clickable={!!onClick}
      onClick={onClick}
      {...props}
    >
      {icon && <BadgeIcon $size={size}>{icon}</BadgeIcon>}
      {children}
    </BadgeContainer>
  );
};

Badge.propTypes = {
  /** Contenu du badge */
  children: PropTypes.node.isRequired,
  /** Couleur du badge : status colors (success, warning, info, danger, muted) ou type colors (tool, app, website, api, library) */
  color: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'warning', 'info', 'danger', 'muted',
    'dev_actif', 'concept', 'vision', 'pause', 'archive',
    'tool', 'outil', 'app', 'application', 'website', 'site', 'api', 'library', 'librairie',
    'tech', 'local', 'staging', 'dev'
  ]),
  /** Variante du badge affectant le style de fond */
  variant: PropTypes.oneOf(['subtle', 'solid', 'outline']),
  /** Taille du badge */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Forme du badge */
  shape: PropTypes.oneOf(['default', 'rounded', 'pill']),
  /** Icône optionnelle à afficher à gauche du texte */
  icon: PropTypes.node,
  /** Fonction appelée au clic (rend le badge cliquable) */
  onClick: PropTypes.func
};

Badge.defaultProps = {
  color: 'primary',
  variant: 'subtle',
  size: 'md',
  shape: 'default',
  icon: null,
  onClick: null
};

export default Badge;