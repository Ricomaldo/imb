// src/components/furniture/AnalogClock/AnalogClock.jsx

import React, { useState, useEffect } from 'react';
import {
  ClockContainer,
  ClockFace,
  ClockCenter,
  HourHand,
  MinuteHand,
  SecondHand,
  HourMark,
  HourNumber
} from './AnalogClock.styles';

/**
 * Analog Clock component - A realistic wall clock for room decoration
 * @renders SVG clock with moving hands
 */
const AnalogClock = ({ size = 150, showNumbers = true, showSeconds = true }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = (seconds * 6) - 90; // 6 degrees per second
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90; // 6 degrees per minute + smooth movement
  const hourAngle = (hours * 30 + minutes * 0.5) - 90; // 30 degrees per hour + smooth movement

  return (
    <ClockContainer size={size}>
      <ClockFace>
        <svg width={size} height={size} viewBox="0 0 200 200">
          {/* Clock border */}
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="#fafaf8"
            stroke="#8b7355"
            strokeWidth="4"
          />
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="#d4c5b9"
            strokeWidth="1"
          />

          {/* Hour marks */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30);
            const isMainHour = i % 3 === 0;
            const x1 = 100 + 85 * Math.cos((angle - 90) * Math.PI / 180);
            const y1 = 100 + 85 * Math.sin((angle - 90) * Math.PI / 180);
            const x2 = 100 + (isMainHour ? 75 : 80) * Math.cos((angle - 90) * Math.PI / 180);
            const y2 = 100 + (isMainHour ? 75 : 80) * Math.sin((angle - 90) * Math.PI / 180);

            return (
              <HourMark
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#8b7355"
                strokeWidth={isMainHour ? 3 : 1.5}
                strokeLinecap="round"
              />
            );
          })}

          {/* Hour numbers */}
          {showNumbers && [...Array(12)].map((_, i) => {
            const hour = i === 0 ? 12 : i;
            const angle = (i * 30);
            const x = 100 + 65 * Math.cos((angle - 90) * Math.PI / 180);
            const y = 100 + 65 * Math.sin((angle - 90) * Math.PI / 180);

            return (
              <HourNumber
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
                fontWeight="600"
                fill="#5a4a3a"
                fontFamily="Georgia, serif"
              >
                {hour}
              </HourNumber>
            );
          })}

          {/* Hour hand */}
          <HourHand
            x1="100"
            y1="100"
            x2={100 + 50 * Math.cos(hourAngle * Math.PI / 180)}
            y2={100 + 50 * Math.sin(hourAngle * Math.PI / 180)}
            stroke="#3a3a3a"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Minute hand */}
          <MinuteHand
            x1="100"
            y1="100"
            x2={100 + 70 * Math.cos(minuteAngle * Math.PI / 180)}
            y2={100 + 70 * Math.sin(minuteAngle * Math.PI / 180)}
            stroke="#3a3a3a"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Second hand */}
          {showSeconds && (
            <SecondHand
              x1="100"
              y1="100"
              x2={100 + 75 * Math.cos(secondAngle * Math.PI / 180)}
              y2={100 + 75 * Math.sin(secondAngle * Math.PI / 180)}
              stroke="#d4534a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Center dot */}
          <ClockCenter
            cx="100"
            cy="100"
            r="8"
            fill="#3a3a3a"
          />
          <circle
            cx="100"
            cy="100"
            r="5"
            fill="#8b7355"
          />
        </svg>
      </ClockFace>
    </ClockContainer>
  );
};

export default AnalogClock;