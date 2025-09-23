// src/components/common/Panel/Panel.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  PanelWrapper,
  PanelContainer,
  PanelHeader,
  PanelContent,
  PanelBadge,
  ToggleButton,
  HeaderContent
} from './Panel.styles';
import { PanelProvider, usePanelContext } from './PanelContext';
import MarkdownToolbar from '../MarkdownToolbar';
import CategoryFilters from '../CategoryFilters/CategoryFilters.jsx';

/**
 * Internal panel component that renders the panel structure
 * @renders PanelWrapper
 * @renders PanelContainer
 * @renders PanelHeader
 * @renders HeaderContent
 * @renders PanelBadge
 * @renders ToggleButton
 * @renders MarkdownToolbar
 * @renders PanelContent
 */
const PanelInner = ({
  // CONTENU
  title,
  icon,
  children,

  // APPARENCE
  texture,
  accentColor,
  maxHeight,
  borderType,
  transparentContent,

  // LAYOUT
  gridColumn,
  gridRow,

  // COMPORTEMENT
  collapsible,
  collapsed,
  defaultCollapsed,
  onToggleCollapse,
  badge,

  // ÉVÉNEMENTS
  onClick,

  // ACTIONS CUSTOM
  customActions,
  hideHeaderTitleWhenCollapsed = false
}) => {
  const panelContext = usePanelContext();
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  // Utiliser l'état externe si fourni, sinon l'état interne
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!isCollapsed);
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };

  if (isCollapsed) {
    // Mode collapsed : fond texture + header simple (sans outils)
    return (
      <PanelWrapper
        $gridColumn={gridColumn}
        $gridRow={gridRow}
        onClick={onClick}
      >
        <PanelContainer $maxHeight={maxHeight} $collapsed={true} $texture={texture} $borderType={borderType}>
          <PanelHeader $accentColor={accentColor}>
            <HeaderContent>
              <span>{icon} {title}</span>
              {badge && (
                <PanelBadge >
                  {badge}
                </PanelBadge>
              )}
            </HeaderContent>

            {/* Pas d'actions custom en mode collapsed */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {collapsible && (
                <ToggleButton
                  onClick={handleToggleCollapse}
                  $active={false}
                  title="Développer"
                >
                  📂
                </ToggleButton>
              )}
            </div>
          </PanelHeader>
        </PanelContainer>
      </PanelWrapper>
    );
  }

  // Mode ouvert : panneau complet
  return (
    <PanelWrapper
      $gridColumn={gridColumn}
      $gridRow={gridRow}
      onClick={onClick}
    >
      <PanelContainer $maxHeight={maxHeight} $collapsed={false} $texture={texture} $borderType={borderType}>
        <PanelHeader $accentColor={accentColor}>
          <HeaderContent>
            {!hideHeaderTitleWhenCollapsed && <span>{icon} {title}</span>}
            {hideHeaderTitleWhenCollapsed && <span>{icon}</span>}
            {badge && (
              <PanelBadge >
                {badge}
              </PanelBadge>
            )}
          </HeaderContent>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {/* Toolbox selon le type de contenu */}
            {panelContext.contentType === 'markdown' && (
              <MarkdownToolbar
                zoomLevel={panelContext.zoom}
                onZoomIn={panelContext.handleZoomIn}
                onZoomOut={panelContext.handleZoomOut}
                isEditing={panelContext.editing}
                onToggleEdit={panelContext.handleToggleEdit}
                showEditButton={true}
              />
            )}

            {panelContext.contentType === 'mantras' && (
              <CategoryFilters
                categories={panelContext.categories || []}
                activeFilters={panelContext.activeFilters || []}
                onToggleFilter={panelContext.handleToggleFilter}
                onClearFilters={panelContext.handleClearFilters}
                iconsMap={panelContext.iconsMap}
              />
            )}

            {/* Actions custom toujours en mode ouvert */}
            {customActions && customActions}

            {collapsible && (
              <ToggleButton
                onClick={handleToggleCollapse}
                $active={false}
                title="Réduire"
              >
                📁
              </ToggleButton>
            )}
          </div>
        </PanelHeader>

        <PanelContent $accentColor={accentColor} $transparentContent={transparentContent}>
          {children}
        </PanelContent>
      </PanelContainer>
    </PanelWrapper>
  );
};

/**
 * Main Panel component that provides context and renders the panel
 * @renders PanelProvider
 * @renders PanelInner
 */
const Panel = (props) => {
  return (
    <PanelProvider contentType={props.contentType}>
      <PanelInner {...props} />
    </PanelProvider>
  );
};

// PropTypes pour le composant
Panel.propTypes = {
  // CONTENU
  title: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
  contentType: PropTypes.string,

  // APPARENCE
  texture: PropTypes.string,
  accentColor: PropTypes.string,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderType: PropTypes.oneOf(['default', 'blue', 'craft']),
  transparentContent: PropTypes.bool,

  // LAYOUT
  gridColumn: PropTypes.string,
  gridRow: PropTypes.string,

  // COMPORTEMENT
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // ÉVÉNEMENTS
  onClick: PropTypes.func
};

Panel.defaultProps = {
  collapsible: true,
  defaultCollapsed: false
};

export default Panel;