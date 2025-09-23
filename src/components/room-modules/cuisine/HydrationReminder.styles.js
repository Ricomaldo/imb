// src/components/room-modules/cuisine/HydrationReminder.styles.js

import styled, { keyframes, css } from 'styled-components';
import { metalBg } from '../../../styles/mixins';

// Animation de paillettes qui montent et disparaissent
const sparkleAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(0deg) scale(0);
    opacity: 1;
  }
  20% {
    transform: translateY(-20px) rotate(180deg) scale(1);
    opacity: 1;
  }
  80% {
    transform: translateY(-80px) rotate(360deg) scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-120px) rotate(540deg) scale(0);
    opacity: 0;
  }
`;

// Animation de pulsation pour le bouton
const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Animation de vague d'eau
const waveAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  overflow: hidden;
`;

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export const Icon = styled.div`
  font-size: 48px;
  animation: ${pulseAnimation} 4s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(74, 85, 104, 0.3));
  will-change: transform;
`;

export const Message = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.light};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: ${({ theme }) => theme.typography.families.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};

  span {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    opacity: 0.8;
    font-weight: ${({ theme }) => theme.typography.weights.normal};
    font-family: ${({ theme }) => theme.typography.families.ui};
  }
`;

export const Button = styled.button`
  position: relative;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['3xl']};
  background: ${({ theme }) => theme.colors.accents.cold};
  color: ${({ theme }) => theme.colors.text.light};
  border: 2px solid ${({ theme }) => theme.colors.accents.gold};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-family: ${({ theme }) => theme.typography.families.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  overflow: visible;
  transform: translateZ(0);
  will-change: transform;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    background: ${({ theme }) => theme.colors.accents.success};
    border-color: ${({ theme }) => theme.colors.accents.warm};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.9;
  }

  ${({ $isAnimating }) =>
    $isAnimating &&
    css`
      animation: ${pulseAnimation} 0.5s ease-in-out 3;
      background: ${({ theme }) => theme.colors.accents.success};
      border-color: ${({ theme }) => theme.colors.accents.gold};

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 215, 0, 0.3),
          transparent
        );
        animation: ${waveAnimation} 1s ease-in-out;
      }
    `}

  span {
    position: relative;
    z-index: 1;
  }
`;

export const SparkleContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  pointer-events: none;
  z-index: 10;
`;

export const Sparkle = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ $left }) => $left}%;
  transform: translate(-50%, -50%);
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.accents.gold};
  animation: ${sparkleAnimation} ${({ $duration }) => $duration}s ease-out;
  animation-delay: ${({ $delay }) => $delay}s;
  animation-fill-mode: forwards;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
  will-change: transform, opacity;

  &:nth-child(odd) {
    color: ${({ theme }) => theme.colors.accents.cold};
    filter: drop-shadow(0 0 4px rgba(74, 85, 104, 0.8));
  }

  &:nth-child(3n) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }

  &:nth-child(5n) {
    font-size: ${({ theme }) => theme.typography.sizes.xl};
  }
`;