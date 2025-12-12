import { StudioContainer, SideTowerToggleButton } from './StudioHall.styles';
import RoomCanvas from '../RoomCanvas/RoomCanvas';
import SideTower from '../SideTower/SideTower';
import { useRoomNavigation } from '../../../hooks/useRoomNavigation';
import usePreferencesStore from '../../../stores/usePreferencesStore';

/**
 * Composant principal de l'application - Conteneur studio
 * @renders StudioContainer
 * @renders SideTowerToggleButton
 * @renders RoomCanvas
 * @renders SideTower
 */
const StudioHall = () => {
  const roomNavHook = useRoomNavigation();
  const { sideTowerCollapsed, toggleSideTowerCollapse } = usePreferencesStore();

  return (
    <>
      <SideTowerToggleButton
        onClick={toggleSideTowerCollapse}
        collapsed={sideTowerCollapsed}
        title={sideTowerCollapsed ? "Ouvrir SideTower" : "Fermer SideTower"}
      >
        {sideTowerCollapsed ? '◀' : '▶'}
      </SideTowerToggleButton>
      <StudioContainer sideTowerCollapsed={sideTowerCollapsed}>
        <RoomCanvas
          roomNavHook={roomNavHook}
        />
      </StudioContainer>
      <SideTower />
    </>
  );
};

export default StudioHall;
