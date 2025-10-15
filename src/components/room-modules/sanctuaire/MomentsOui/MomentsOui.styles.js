// src/components/room-modules/sanctuaire/MomentsOui/MomentsOui.styles.js
// Styled-components pour le widget Moments OUI

import styled from 'styled-components';
import { alpha } from '../../../../styles/color';

// ==================== CONTAINER PRINCIPAL ====================

export const WidgetContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
`;

// ==================== STATS RAPIDES ====================

export const StatsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.05)};
  border-radius: 6px;
  flex-shrink: 0;
`;

export const StatBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
`;

export const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
  opacity: 0.8;
  font-size: 10px;
`;

export const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  font-weight: 600;
  font-size: 14px;
`;

// ==================== NEEDS SELECTOR ====================

export const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  max-height: 300px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.05)};
  border-radius: 6px;
`;

export const FamilySection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FamilyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
  user-select: none;

  background: ${({ theme, $color }) => alpha($color || theme.colors.primary, 0.1)};
  border: 1px solid ${({ theme, $color }) => alpha($color || theme.colors.primary, 0.3)};

  &:hover {
    background: ${({ theme, $color }) => alpha($color || theme.colors.primary, 0.15)};
  }

  span:first-child {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: ${({ $color }) => $color};
  }

  span:last-child {
    font-size: 10px;
    opacity: 0.7;
  }
`;

export const NeedsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
  padding-left: 16px;
`;

export const SelectedNeedsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => alpha(theme.colors.primary, 0.05)};
  border-radius: 4px;
  min-height: 32px;
`;

// ==================== MOMENT CARD ====================

export const CardContainer = styled.div`
  background: ${({ theme, $archived }) =>
    $archived
      ? alpha(theme.colors.stone || '#708090', 0.05)
      : theme.colors.surface || '#1A202C'
  };
  border: 1px solid ${({ theme, $archived }) =>
    $archived
      ? alpha(theme.colors.stone || '#708090', 0.2)
      : alpha(theme.colors.stone || '#708090', 0.3)
  };
  border-radius: 6px;
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  opacity: ${({ $archived }) => ($archived ? 0.6 : 1)};

  &:hover {
    background: ${({ theme }) => alpha(theme.colors.primary, 0.1)};
    border-color: ${({ theme }) => alpha(theme.colors.primary, 0.5)};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const CardDate = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
  opacity: 0.8;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

export const ActionButton = styled.button`
  background: ${({ theme, $variant }) => {
    if ($variant === 'danger') return alpha(theme.colors.accents?.danger || '#DC3545', 0.8);
    return alpha(theme.colors.primary, 0.8);
  }};
  border: none;
  border-radius: 3px;
  padding: 4px 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;

  &:hover {
    background: ${({ theme, $variant }) => {
      if ($variant === 'danger') return theme.colors.accents?.danger || '#DC3545';
      return theme.colors.primary;
    }};
    transform: scale(1.05);
  }
`;

export const CardQuoi = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.4;

  ${({ $expanded }) => !$expanded && `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`;

export const CardPourquoi = styled.div`
  font-size: 11px;
  font-style: italic;
  color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.5;
  opacity: 0.9;
`;

export const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

// ==================== TIMELINE ====================

export const TimelineContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xs};

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.1)};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.3)};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.5)};
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
  text-align: center;
  opacity: 0.6;

  p {
    margin: 0;
    font-size: 12px;
  }
`;

// ==================== WEEKLY COUNTER ====================

export const CounterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CounterText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  display: flex;
  align-items: center;
  gap: 6px;
`;

// ==================== HEATMAP ====================

export const HeatmapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const HeatmapRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
`;

export const HeatmapLabel = styled.div`
  min-width: 60px;
  color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
`;

export const HeatmapBar = styled.div`
  flex: 1;
  height: 12px;
  background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.1)};
  border-radius: 2px;
  position: relative;
  overflow: hidden;
`;

export const HeatmapFill = styled.div`
  height: 100%;
  background: ${({ $color }) => $color};
  width: ${({ $percentage }) => $percentage}%;
  transition: width 0.3s ease;
  border-radius: 2px;
`;

export const HeatmapCount = styled.div`
  min-width: 20px;
  text-align: right;
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  font-weight: 600;
  font-size: 10px;
`;

// ==================== MODAL CONFIRMATION ====================

export const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface || '#1A202C'};
  border: 2px solid ${({ theme }) => theme.colors.accents?.danger || '#DC3545'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 400px;
  text-align: center;
`;

export const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  font-size: 16px;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

export const ModalText = styled.p`
  color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
  font-size: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.5;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

// ==================== BOUTON PRINCIPAL ====================

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 10px;
  background: ${({ theme }) => alpha(theme.colors.primary, 0.9)};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// ==================== FORM INPUTS ====================

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const FormInput = styled.input`
  padding: 8px 10px;
  background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.1)};
  border: 1px solid ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.3)};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  font-size: 12px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => alpha(theme.colors.primary, 0.05)};
  }

  &::placeholder {
    color: ${({ theme }) => alpha(theme.colors.text?.muted || '#E2E8F0', 0.5)};
  }
`;

export const FormTextarea = styled.textarea`
  padding: 8px 10px;
  background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.1)};
  border: 1px solid ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.3)};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  font-size: 12px;
  font-family: inherit;
  resize: vertical;
  min-height: ${({ $minHeight }) => $minHeight || '60px'};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => alpha(theme.colors.primary, 0.05)};
  }

  &::placeholder {
    color: ${({ theme }) => alpha(theme.colors.text?.muted || '#E2E8F0', 0.5)};
  }
`;

export const CharCount = styled.div`
  font-size: 10px;
  color: ${({ theme, $over }) =>
    $over
      ? theme.colors.accents?.danger || '#DC3545'
      : theme.colors.text?.muted || '#E2E8F0'
  };
  text-align: right;
  opacity: 0.8;
`;
