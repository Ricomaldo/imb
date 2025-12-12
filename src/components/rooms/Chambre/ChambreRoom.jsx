// src/components/rooms/Chambre/ChambreRoom.jsx

import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import usePreferencesStore from "../../../stores/usePreferencesStore";
import NavigationGrid from "../../room-modules/chambre/NavigationGrid";
import Diary from "../../widgets/Diary/Diary";

/**
 * Chambre room component for personal space
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 */
const ChambreRoom = () => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = usePreferencesStore();

  return (
    <BaseRoom roomType="chambre" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        {/* Journal Quotidien - toute la largeur en haut */}
        <Panel
          gridColumn="7 / 13"
          gridRow="1 / 5"
          title="Journal Quotidien"
          icon="📖"
          texture="wood"
          accentColor={theme.colors.accents.cold}
          contentType="markdown"
          collapsible={true}
          collapsed={getPanelState("chambre", "diary").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "diary", { collapsed: val })
          }
        >
          <Diary />
        </Panel>

        {/* Navigation - pleine largeur en bas, ratio 4:3 (8 colonnes × 6 lignes) */}
        <Panel
          gridColumn="7 / 13"
          gridRow="5 / 9"
          title="Navigation"
          icon="🧭"
          texture="metal"
          accentColor={theme.colors.accents.neutral}
          collapsible={true}
          collapsed={getPanelState("chambre", "navigation").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "navigation", { collapsed: val })
          }
        >
          <NavigationGrid />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default ChambreRoom;
