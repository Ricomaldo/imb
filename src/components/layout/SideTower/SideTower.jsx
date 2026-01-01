// src/components/layout/SideTower/SideTower.jsx

import {
  TowerWrapper,
  TowerContainer,
  TopTowerFloor,
  MiddleTowerFloor,
  BottomTowerFloor
} from './SideTower.styles';
import { TowerHeader, TowerToolbar, TowerViewer } from '../../tower';
import usePreferencesStore from '../../../stores/usePreferencesStore';

/**
 * Tour latérale contenant les contrôles et outils
 * @param {string} responsiveLevel - 'mobile' | 'tablet' | 'desktop'
 * @renders TowerWrapper
 * @renders TowerContainer
 * @renders TopTowerFloor
 * @renders TowerHeader
 * @renders MiddleTowerFloor
 * @renders TowerToolbar
 * @renders BottomTowerFloor
 * @renders TowerViewer
 */
const SideTower = ({ responsiveLevel = 'desktop' }) => {
  const sideTowerCollapsed = usePreferencesStore((state) => state.sideTowerCollapsed);

  return (
    <TowerWrapper collapsed={sideTowerCollapsed} responsiveLevel={responsiveLevel}>
      <TowerContainer responsiveLevel={responsiveLevel}>
        <TopTowerFloor id="header-floor">
          <TowerHeader />
        </TopTowerFloor>

        <MiddleTowerFloor id="toolbar-floor">
          <TowerToolbar />
        </MiddleTowerFloor>

        <BottomTowerFloor id="viewer-floor">
          <TowerViewer />
        </BottomTowerFloor>
      </TowerContainer>
    </TowerWrapper>
  );
};

export default SideTower;
