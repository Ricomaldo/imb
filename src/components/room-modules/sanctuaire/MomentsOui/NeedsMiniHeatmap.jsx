// src/components/room-modules/sanctuaire/MomentsOui/NeedsMiniHeatmap.jsx
// Mini heatmap des top 3-5 besoins satisfaits

import React from 'react';
import PropTypes from 'prop-types';
import useDiaryStore from '../../../../stores/useDiaryStore';
import { getNeedById } from '../../../../constants/rosenbergNeeds';
import {
  HeatmapContainer,
  HeatmapRow,
  HeatmapLabel,
  HeatmapBar,
  HeatmapFill,
  HeatmapCount
} from './MomentsOui.styles';

/**
 * NeedsMiniHeatmap - Top 3-5 besoins satisfaits cette semaine
 * @param {number} limit - Nombre de besoins à afficher (default: 3)
 */
const NeedsMiniHeatmap = ({ limit = 3 }) => {
  const getWeeklyStats = useDiaryStore(state => state.getWeeklyStats);

  const stats = getWeeklyStats();
  const topNeeds = stats.topNeeds.slice(0, limit);

  // Calculer le max pour les pourcentages de barres
  const maxCount = topNeeds.length > 0 ? topNeeds[0].count : 1;

  if (topNeeds.length === 0) {
    return (
      <HeatmapContainer>
        <div style={{
          fontSize: '10px',
          color: '#E2E8F0',
          opacity: 0.6,
          textAlign: 'center',
          padding: '8px'
        }}>
          Aucun besoin satisfait cette semaine
        </div>
      </HeatmapContainer>
    );
  }

  return (
    <HeatmapContainer>
      {topNeeds.map(({ needId, count }) => {
        const need = getNeedById(needId);
        if (!need) return null;

        const percentage = (count / maxCount) * 100;

        return (
          <HeatmapRow key={needId}>
            <HeatmapLabel title={`${need.familyLabel} - ${need.label}`}>
              <span>{need.emoji}</span>
              <span>{need.label}</span>
            </HeatmapLabel>
            <HeatmapBar>
              <HeatmapFill
                $percentage={percentage}
                $color={need.familyColor}
              />
            </HeatmapBar>
            <HeatmapCount>{count}</HeatmapCount>
          </HeatmapRow>
        );
      })}
    </HeatmapContainer>
  );
};

NeedsMiniHeatmap.propTypes = {
  limit: PropTypes.number
};

NeedsMiniHeatmap.defaultProps = {
  limit: 3
};

export default NeedsMiniHeatmap;
