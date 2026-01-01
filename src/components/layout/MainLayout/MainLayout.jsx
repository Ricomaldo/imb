import { useEffect } from 'react';
import { MainContent, SideTowerToggleButton, LayoutWrapper } from './MainLayout.styles';
import RoomCanvas from '../RoomCanvas/RoomCanvas';
import SideTower from '../SideTower/SideTower';
import { useRoomNavigation } from '../../../hooks/useRoomNavigation';
import usePreferencesStore from '../../../stores/usePreferencesStore';

/**
 * Composant principal de l'application - Layout MetaBrain
 * @param {string} responsiveLevel - 'mobile' | 'tablet' | 'desktop'
 * @param {Object} layout - Layout object from useResponsiveLayout()
 * @renders LayoutWrapper (conteneur principal)
 * @renders MainContent (zone contenu principale, 80%/85%)
 * @renders SideTower (tour latérale, 20%/15%)
 * @renders SideTowerToggleButton (bouton collapse, position fixe)
 * @renders RoomCanvas (navigation spatiale 4x3)
 */
const MainLayout = ({ responsiveLevel = 'desktop', layout }) => {
  const roomNavHook = useRoomNavigation();
  const { sideTowerCollapsed, toggleSideTowerCollapse, setSideTowerCollapsed } = usePreferencesStore();

  // Auto-collapse SideTower bidirectionnel à 1024px (resize only, pas de conflit avec toggle manuel)
  useEffect(() => {
    let previousWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;

      // Seulement agir si on traverse le seuil 1024px
      const crossedThreshold =
        (previousWidth < 1024 && currentWidth >= 1024) ||
        (previousWidth >= 1024 && currentWidth < 1024);

      if (crossedThreshold) {
        // Collapse si < 1024px, expand si >= 1024px
        setSideTowerCollapsed(currentWidth < 1024);
      }

      previousWidth = currentWidth;
    };

    // Check initial (une seule fois au mount)
    if (window.innerWidth < 1024) {
      setSideTowerCollapsed(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSideTowerCollapsed]);

  return (
    <>
      <LayoutWrapper>
        <MainContent
          sideTowerCollapsed={sideTowerCollapsed}
          responsiveLevel={responsiveLevel}
        >
          <RoomCanvas
            roomNavHook={roomNavHook}
          />
        </MainContent>
        <SideTower responsiveLevel={responsiveLevel} />
      </LayoutWrapper>
      <SideTowerToggleButton
        onClick={toggleSideTowerCollapse}
        collapsed={sideTowerCollapsed}
        title={sideTowerCollapsed ? "Ouvrir SideTower" : "Fermer SideTower"}
      >
        {sideTowerCollapsed ? '◀' : '▶'}
      </SideTowerToggleButton>
    </>
  );
};

export default MainLayout;
