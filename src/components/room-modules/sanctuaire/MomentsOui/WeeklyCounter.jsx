// src/components/room-modules/sanctuaire/MomentsOui/WeeklyCounter.jsx
// Compteur de moments OUI pour la semaine courante

import React from 'react';
import PropTypes from 'prop-types';
import useDiaryStore from '../../../../stores/useDiaryStore';
import {
  CounterContainer,
  CounterText
} from './MomentsOui.styles';

/**
 * WeeklyCounter - Affiche le nombre de moments OUI cette semaine
 */
const WeeklyCounter = () => {
  const getWeeklyStats = useDiaryStore(state => state.getWeeklyStats);

  const stats = getWeeklyStats();

  return (
    <CounterContainer>
      <CounterText>
        <span>Cette semaine :</span>
        <span style={{ color: '#10B981', fontWeight: 700 }}>
          {stats.totalMoments} moment{stats.totalMoments > 1 ? 's' : ''} OUI ✨
        </span>
      </CounterText>
    </CounterContainer>
  );
};

WeeklyCounter.propTypes = {};

export default WeeklyCounter;
