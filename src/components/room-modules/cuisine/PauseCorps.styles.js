// src/components/room-modules/cuisine/PauseCorps.styles.js

import styled, { keyframes } from 'styled-components';

const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const PauseCorpsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  position: relative;
`;

export const CorpsIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.light};
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  filter: drop-shadow(0 4px 8px rgba(104, 117, 44, 0.3));

  svg {
    filter: drop-shadow(0 2px 4px ${({ theme }) => `${theme.colors.black}20`});
  }
`;

export const MysteryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const MysteryText = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.light};
  font-style: italic;
  opacity: 0.9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const RevealButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.accents.success};
  color: ${({ theme }) => theme.colors.text.light};
  border: 2px solid rgba(104, 117, 44, 0.3);
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: ${({ theme }) => `all ${theme.motion.durations.base} ${theme.motion.easings.standard}`};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    background: #7a8f3c;
    border-color: ${({ theme }) => theme.colors.accents.warm};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ExerciceCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  text-align: center;
  width: 100%;
  max-width: 260px;

  &.revealed {
    animation: ${fadeInScale} 0.3s ease-out;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ExerciceTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.light};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const ExerciceDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  line-height: 1.5;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid rgba(104, 117, 44, 0.2);
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const ExerciceDuration = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing['3xs']} ${theme.spacing.xs}`};
  margin-left: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.normal};
  opacity: 0.9;
`;

export const TargetsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  justify-content: center;
`;

export const TargetBadge = styled.span`
  padding: ${({ theme }) => `${theme.spacing['3xs']} ${theme.spacing.xs}`};
  background: ${({ theme }) => `${theme.colors.text.secondary}10`};
  border: ${({ theme }) => `${theme.borders.thin} solid ${theme.colors.text.secondary}20`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

export const ActionButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.accents.success};
  color: ${({ theme }) => theme.colors.text.light};
  border: 2px solid rgba(104, 117, 44, 0.3);
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: ${({ theme }) => `all ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};
  min-width: 100px;
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    background: #7a8f3c;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const EncouragementMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.light};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  background: rgba(104, 117, 44, 0.9);
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px solid rgba(104, 117, 44, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &.animate {
    animation:
      ${fadeInScale} 0.5s ease-out,
      ${shimmer} 2s ease-in-out;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => `${theme.colors.white}50`} 50%,
      transparent 100%
    );
    background-size: 200% 100%;
  }
`;