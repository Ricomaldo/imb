// src/components/rooms/Sanctuaire/SanctuaireRoom.jsx

import { useTheme } from "styled-components";
import BaseRoom from "../../layout/BaseRoom";
import PanelGrid from "../../layout/PanelGrid";
import Panel from "../../common/Panel";
import MindLogSorter from "../../room-modules/sanctuaire/MindLogSorter/MindLogSorter";
import MomentsOuiWidget from "../../room-modules/sanctuaire/MomentsOui";
import ImageDisplay from "../../widgets/ImageDisplay/ImageDisplay";
import QuoteCarousel from "../../widgets/QuoteCarousel/QuoteCarousel";
import usePreferencesStore from "../../../stores/usePreferencesStore";
import lionImage from "../../../assets/images/totems/Lion.png";

/**
 * Sanctuaire room component for spiritual and meditation activities
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 */
const SanctuaireRoom = () => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = usePreferencesStore();

  return (
    <BaseRoom roomType="sanctuaire" layoutType="grid">
      <PanelGrid columns={5} rows={5}>
        {/* Totem - haut gauche */}
        <Panel
          gridColumn="1 / 3"
          gridRow="1 / 3"
          title="Totem"
          icon="🗿"
          texture="stone"
          accentColor={theme.colors.accents.nature}
          collapsible={true}
          collapsed={getPanelState("sanctuaire", "totem").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("sanctuaire", "totem", { collapsed: val })
          }
        >
          <ImageDisplay src={lionImage} alt="Lion Totem" hoverEffect={true} />
        </Panel>

        {/* Mantras - haut droite */}
        <Panel
          gridColumn="3 / 6"
          gridRow="1 / 3"
          title="Mantras"
          icon="🕉️"
          texture="fabric"
          accentColor={theme.colors.accents.warm}
          contentType="mantras"
          collapsible={true}
          collapsed={getPanelState("sanctuaire", "mantra").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("sanctuaire", "mantra", { collapsed: val })
          }
        >
          <QuoteCarousel showCategory={false} infinite={true} random={true} />
        </Panel>

        {/* Widget Tri Mental - milieu gauche */}
        <Panel
          gridColumn="1 / 3"
          gridRow="3 / 6"
          title="Tri Mental"
          icon="🧘"
          texture="stone"
          accentColor={theme.colors.accents.cold}
          collapsible={true}
          collapsed={getPanelState("sanctuaire", "trimental").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("sanctuaire", "trimental", { collapsed: val })
          }
        >
          <MindLogSorter />
        </Panel>

        {/* Widget Moments OUI - milieu/bas droite */}
        <Panel
          gridColumn="3 / 6"
          gridRow="3 / 6"
          title="Moments OUI"
          icon="✨"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={getPanelState("sanctuaire", "moments_oui").collapsed}
          onToggleCollapse={(val) =>
            updatePanelState("sanctuaire", "moments_oui", { collapsed: val })
          }
        >
          <MomentsOuiWidget />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default SanctuaireRoom;
