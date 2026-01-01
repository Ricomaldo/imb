// src/components/tower/TowerToolbar/TowerToolbar.jsx

import React, { useState, useMemo } from 'react';
import { ToolbarContainer, TabsHeader, TabButton, TabContent, ItemsGrid } from './TowerToolbar.styles';
import IconButton from '../../common/IconButton/IconButton';
import { toolbarTabs, toolbarItemsByTab } from '../../../utils/buttonMapping';
import usePreferencesStore from '../../../stores/usePreferencesStore';

/**
 * TowerToolbar: Actions thématiques par onglets (Temps, Projets, Test UI, WIP)
 * @renders ToolbarContainer
 * @renders TabsHeader
 * @renders TabButton
 * @renders TabContent
 * @renders ItemsGrid
 * @renders IconButton
 */
const TowerToolbar = () => {
  const [activeTab, setActiveTab] = useState('viewer');
  const items = useMemo(() => toolbarItemsByTab[activeTab] || [], [activeTab]);
  const setTowerViewerContent = usePreferencesStore((state) => state.setTowerViewerContent);

  const handleItemClick = (item) => {
    if (item.placeholder) return;

    // Si l'item a un viewerType, on change le contenu du viewer
    if (item.viewerType) {
      setTowerViewerContent(item.viewerType);
    }

    // Sinon on exécute l'action normale (modale, etc.)
    if (item.action || item.onClick) {
      (item.action || item.onClick)();
    }
  };

  return (
    <ToolbarContainer>
      <TabsHeader>
        {toolbarTabs.map(tab => (
          <TabButton
            key={tab.id}
            $active={tab.id === activeTab}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            {tab.id === activeTab && (
              <span style={{
                position: 'absolute',
                bottom: '-1px',
                left: '0',
                right: '0',
                height: '3px',
                background: 'transparent'
              }} />
            )}
          </TabButton>
        ))}
      </TabsHeader>

      <TabContent>
        <ItemsGrid>
          {items.map(item => (
            <IconButton
              key={item.id}
              icon={item.icon}
              title={item.placeholder ? `${item.label} (WIP)` : item.label}
              onClick={() => handleItemClick(item)}
              size="medium"
              disabled={item.placeholder}
            />
          ))}
        </ItemsGrid>
      </TabContent>

    </ToolbarContainer>
  );
};

export default TowerToolbar;
