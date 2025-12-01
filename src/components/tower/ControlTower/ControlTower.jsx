// src/components/tower/ControlTower/ControlTower.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { TowerContainer, TopRow, BottomRow, CenterRect, TimeDisplay, DateDisplay, SyncIndicator } from './ControlTower.styles';
import IconButton from '../../common/IconButton/IconButton';
import { controlButtons, quickActions } from '../../../utils/buttonMapping';
import { useSyncStatus } from '../../../contexts/SyncContext';

/**
 * Tour de contrôle avec horloge et actions rapides
 * @renders TowerContainer
 * @renders TopRow
 * @renders IconButton
 * @renders CenterRect
 * @renders TimeDisplay
 * @renders DateDisplay
 * @renders BottomRow
 */
const ControlTower = React.memo(() => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { syncStatus, isConfigured } = useSyncStatus();

  // Helper pour afficher l'icône et texte du sync
  const getSyncDisplay = () => {
    if (!isConfigured) return { icon: '⚠️', text: 'No sync' };

    switch (syncStatus) {
      case 'syncing':
        return { icon: '🔄', text: 'Syncing' };
      case 'pending':
        return { icon: '⏳', text: 'Pending' };
      case 'success':
        return { icon: '✓', text: 'Synced' };
      case 'error':
        return { icon: '✗', text: 'Error' };
      case 'offline':
        return { icon: '📴', text: 'Offline' };
      default:
        return { icon: '☁️', text: 'Ready' };
    }
  };

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

  const calendarBtn = controlButtons.find(btn => btn.id === 'calendar');
  const timerBtn = controlButtons.find(btn => btn.id === 'timer');
  const syncDisplay = getSyncDisplay();

  return (
    <TowerContainer>
      <TopRow>
        <IconButton
          icon={calendarBtn?.icon}
          size="large"
          title={calendarBtn?.label}
          onClick={calendarBtn?.action}
        />
        <CenterRect>
          <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
          <DateDisplay>
            <span className="year">{formatDate(currentTime).year}</span>
            <span className="separator">-</span>
            <span className="month">{formatDate(currentTime).month}</span>
            <span className="separator">-</span>
            <span className="day">{formatDate(currentTime).day}</span>
          </DateDisplay>
          <SyncIndicator $status={syncStatus} title={`Sync: ${syncStatus}`}>
            <span className="sync-icon">{syncDisplay.icon}</span>
            <span className="sync-text">{syncDisplay.text}</span>
          </SyncIndicator>
        </CenterRect>
        <IconButton
          icon={timerBtn?.icon}
          size="large"
          title={timerBtn?.label}
          onClick={timerBtn?.action}
        />
      </TopRow>

      <BottomRow>
        {quickActions.map(action => (
          <IconButton
            key={action.id}
            icon={action.icon}
            size="medium"
            title={action.label}
            onClick={action.onClick}
          />
        ))}
      </BottomRow>
    </TowerContainer>
  );
});

ControlTower.displayName = 'ControlTower';

export default ControlTower;
