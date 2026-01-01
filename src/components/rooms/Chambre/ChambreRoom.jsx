// src/components/rooms/Chambre/ChambreRoom.jsx

import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import usePreferencesStore from "../../../stores/usePreferencesStore";
import NavigationGrid from "../../room-modules/chambre/NavigationGrid";
import Diary from "../../widgets/Diary/Diary";
import { ZoneRouge } from "../Comptoir/widgets/ZoneRouge";

/**
 * Chambre room component for personal space
 * @renders BaseRoom
 * @renders PanelGrid (12x8)
 * @renders Panel with Zone Rouge, Diary, Navigation
 */
const ChambreRoom = () => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = usePreferencesStore();

  return (
    <BaseRoom roomType="chambre" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        {/* Zone Rouge - Protocole d'urgence (left, rows 1-4) */}
        <Panel
          gridColumn="1 / 4"
          gridRow="1 / 4"
          title="Zone Rouge"
          icon="🔴"
          texture="stone"
          collapsible={true}
          collapsed={getPanelState("chambre", "zone-rouge")?.collapsed ?? false}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "zone-rouge", { collapsed: val })
          }
        >
          <ZoneRouge />
        </Panel>

        {/* Journal Quotidien - right side (unchanged) */}
        <Panel
          gridColumn="7 / 13"
          gridRow="1 / 5"
          title="Journal Quotidien"
          icon="📖"
          texture="wood"
          accentColor={theme.colors.accents.cold}
          contentType="markdown"
          collapsible={true}
          collapsed={getPanelState("chambre", "diary")?.collapsed ?? false}
          onToggleCollapse={(val) =>
            updatePanelState("chambre", "diary", { collapsed: val })
          }
        >
          <Diary />
        </Panel>

        {/* Navigation - right side, bottom (unchanged) */}
        <Panel
          gridColumn="7 / 13"
          gridRow="5 / 9"
          title="Navigation"
          icon="🧭"
          texture="metal"
          accentColor={theme.colors.accents.neutral}
          collapsible={true}
          collapsed={getPanelState("chambre", "navigation")?.collapsed ?? false}
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
