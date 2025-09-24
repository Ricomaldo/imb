// src/components/rooms/Scriptorium/ScriptoriumRoom.jsx

import React from 'react';
import BaseRoom from '../../layout/BaseRoom';
import { ScriptoriumGrid } from './ScriptoriumRoom.styles';
import PanelGrid from '../../layout/PanelGrid';
import Panel from '../../common/Panel';
import Diary from '../../widgets/Diary/Diary';

/**
 * Scriptorium room component for writing and documentation
 * @renders BaseRoom
 * @renders PanelGrid
 * @renders Panel
 * @renders Diary
 */
const ScriptoriumRoom = () => {
  return (
    <BaseRoom roomType="scriptorium" layoutType="grid">
      <PanelGrid columns={4} rows={4}>
        {/* Journal quotidien - côté droit */}
        <Panel
          gridColumn="1 / 3"
          gridRow="1 / 4"
          title="Journal Quotidien"
          icon="📖"
          texture="wood"
          contentType="markdown"
          collapsible={true}
          defaultCollapsed={false}
        >
          <Diary />
        </Panel>

        {/* Espace pour futurs widgets à gauche */}
      </PanelGrid>
    </BaseRoom>
  );
};

export default ScriptoriumRoom;
