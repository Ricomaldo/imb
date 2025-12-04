// src/components/common/Panel/PanelContext.jsx

import React, { createContext, useContext, useState } from 'react';

const PanelContext = createContext();

/**
 * Provider component for panel context state
 * @renders PanelContext.Provider
 */
export const PanelProvider = ({ children, contentType = "default" }) => {
  // États selon le type de contenu
  const [zoom, setZoom] = useState(0);
  const [editing, setEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // États spécifiques mantras (filtres)
  const [activeFilters, setActiveFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [iconsMap, setIconsMap] = useState({});

  // Fonctions zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, -2));
  };

  // Fonction edit toggle
  const handleToggleEdit = () => {
    setEditing(!editing);
  };

  // Fonction expand toggle (mode focus)
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const value = {
    // États
    zoom,
    editing,
    isExpanded,
    contentType,
    activeFilters,
    categories,
    iconsMap,

    // Actions
    setZoom,
    setEditing,
    setIsExpanded,
    handleZoomIn,
    handleZoomOut,
    handleToggleEdit,
    handleToggleExpand,

    // Actions mantras
    setCategories,
    setIconsMap,
    handleToggleFilter: (category) => {
      setActiveFilters(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    },
    handleClearFilters: () => setActiveFilters([])
  };

  return (
    <PanelContext.Provider value={value}>
      {children}
    </PanelContext.Provider>
  );
};

export const usePanelContext = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanelContext must be used within PanelProvider');
  }
  return context;
};

export default PanelContext;