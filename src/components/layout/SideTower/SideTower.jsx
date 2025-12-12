// src/components/layout/SideTower/SideTower.jsx

import {
  TowerWrapper,
  TowerContainer,
  TopTowerFloor,
  MiddleTowerFloor,
  BottomTowerFloor
} from './SideTower.styles';
import { ControlTower, WorkbenchDrawer, SideTowerNotes } from '../../tower';
import usePreferencesStore from '../../../stores/usePreferencesStore';

/**
 * Tour latérale contenant les contrôles et outils
 * @renders TowerWrapper
 * @renders TowerContainer
 * @renders TopTowerFloor
 * @renders ControlTower
 * @renders MiddleTowerFloor
 * @renders WorkbenchDrawer
 * @renders BottomTowerFloor
 * @renders SideTowerNotes
 */
const SideTower = () => {
  const sideTowerCollapsed = usePreferencesStore((state) => state.sideTowerCollapsed);

  return (
    <TowerWrapper collapsed={sideTowerCollapsed}>
      <TowerContainer>
        <TopTowerFloor id="control-tower-floor">
          <ControlTower />
        </TopTowerFloor>

        <MiddleTowerFloor id="workbench-floor">
          <WorkbenchDrawer />
        </MiddleTowerFloor>

        <BottomTowerFloor id="notes-floor">
          <SideTowerNotes />
        </BottomTowerFloor>
      </TowerContainer>
    </TowerWrapper>
  );
};

export default SideTower;
