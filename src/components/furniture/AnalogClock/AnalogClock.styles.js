// src/components/furniture/AnalogClock/AnalogClock.styles.js

import styled from 'styled-components';

export const ClockContainer = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  position: relative;
  filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const ClockFace = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(250, 250, 248, 0.9) 50%,
    rgba(245, 243, 240, 1) 100%
  );
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 8px 20px rgba(139, 115, 85, 0.1);
`;

export const HourHand = styled.line`
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
  transition: transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
`;

export const MinuteHand = styled.line`
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
  transition: transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
`;

export const SecondHand = styled.line`
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2));
  transform-origin: 100px 100px;
`;

export const ClockCenter = styled.circle`
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
`;

export const HourMark = styled.line`
  opacity: 0.8;
`;

export const HourNumber = styled.text`
  user-select: none;
  filter: drop-shadow(0px 1px 1px rgba(255, 255, 255, 0.8));
`;