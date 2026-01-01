// src/components/tower/TowerHeader/TowerHeader.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { TowerContainer, DateTimeSection, TimeDisplay, DateDisplay, GlobalActionsRow } from './TowerHeader.styles';
import IconButton from '../../common/IconButton/IconButton';
import { globalActions } from '../../../utils/buttonMapping';

/**
 * TowerHeader: Date/Heure + Actions Globales (Sync, Settings)
 * @renders TowerContainer
 * @renders DateTimeSection
 * @renders TimeDisplay
 * @renders DateDisplay
 * @renders GlobalActionsRow
 * @renders IconButton
 */
const TowerHeader = React.memo(() => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fonction de formatage optimisée
  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return { year, month, day };
  }, []);

  // Mise à jour de l'heure chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, []);

  return (
    <TowerContainer>
      {/* Date + Heure (pleine largeur) */}
      <DateTimeSection>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        <DateDisplay>
          <span className="year">{formatDate(currentTime).year}</span>
          <span className="separator">-</span>
          <span className="month">{formatDate(currentTime).month}</span>
          <span className="separator">-</span>
          <span className="day">{formatDate(currentTime).day}</span>
        </DateDisplay>
      </DateTimeSection>

      {/* Actions Globales (Sync + Settings) */}
      <GlobalActionsRow>
        {globalActions.map(action => (
          <IconButton
            key={action.id}
            icon={action.icon}
            size="medium"
            title={action.placeholder ? `${action.label} (WIP)` : action.label}
            onClick={action.onClick}
            disabled={action.placeholder}
          />
        ))}
      </GlobalActionsRow>
    </TowerContainer>
  );
});

TowerHeader.displayName = 'TowerHeader';

export default TowerHeader;
