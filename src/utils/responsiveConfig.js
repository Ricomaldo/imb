/**
 * Responsive Config — Source Unique de Vérité
 *
 * Définit:
 * - Breakpoints système
 * - Règles de détection device (phone, iPad portrait, iPad landscape, tablet, desktop)
 * - Configuration de layout pour chaque mode
 * - Media queries CSS
 */

export const RESPONSIVE_CONFIG = {
  // Breakpoints système (en px)
  breakpoints: {
    mobile: 576,      // Very small phones (< 576px)
    tablet: 768,      // iPad portrait / small tablets (768-1024px)
    tabletWide: 1024, // iPad landscape / large tablets (1024-1440px)
    desktop: 1440,    // Desktop complet (≥ 1440px)
  },

  /**
   * Device detection rules
   * Ordre important: rules sont évaluées séquentiellement
   * La première règle qui match détermine le device et l'interface
   */
  deviceRules: [
    {
      name: 'phone',
      label: 'Téléphone',
      condition: (width, height, userAgent) => width < 768,
      forceInterface: 'companion',
      responsiveLevel: 'mobile',
      reason: 'Écran < 768px → Mobile UI uniquement',
    },
    {
      name: 'ipadPortrait',
      label: 'iPad Portrait',
      condition: (width, height, userAgent) => {
        const isIPad = /iPad/.test(userAgent);
        const isPortrait = height > width;
        const isTabletWidth = width >= 768 && width < 1024;
        return isIPad && isPortrait && isTabletWidth;
      },
      forceInterface: 'companion',
      responsiveLevel: 'mobile',
      reason: 'iPad portrait (768-1024px) → Mobile UI (SideTower trop étroite)',
    },
    {
      name: 'tabletLandscape',
      label: 'Tablette Landscape',
      condition: (width, height, userAgent) => {
        const isLandscape = height < width;
        const isTabletWidth = width >= 768 && width < 1024;
        return isTabletWidth && isLandscape;
      },
      forceInterface: 'studio',
      responsiveLevel: 'tablet',
      reason: 'Tablette 768-1024px landscape → Desktop responsive (SideTower 15%)',
    },
    {
      name: 'ipadLandscape',
      label: 'iPad Landscape',
      condition: (width, height, userAgent) => {
        const isIPad = /iPad/.test(userAgent);
        const isLandscape = height < width;
        const isTabletWideWidth = width >= 1024;
        return isIPad && isLandscape && isTabletWideWidth;
      },
      forceInterface: 'studio',
      responsiveLevel: 'tablet',
      reason: 'iPad landscape (≥1024px) → Desktop responsive (SideTower 15%)',
    },
    {
      name: 'desktop',
      label: 'Desktop',
      condition: (width, height, userAgent) => width >= 1440,
      forceInterface: 'studio',
      responsiveLevel: 'desktop',
      reason: 'Desktop ≥1440px → Layout optimal (SideTower 20%)',
    },
  ],

  /**
   * Layout configurations par interface et responsiveLevel
   * Utilisé dans StudioHall et SideTower pour adapter les dimensions
   */
  layouts: {
    companion: {
      containerWidth: '100%',
      hasFixedSideTower: false,
    },
    studio: {
      desktop: {
        roomCanvasWidth: '80%',
        sideTowerWidth: '20%',
        toggleButtonPosition: 'fixed-right-side',
        towerGridRows: 'auto 3fr 320px',
        towerGridGap: '8px',
      },
      tablet: {
        roomCanvasWidth: '85%',
        sideTowerWidth: '15%',
        toggleButtonPosition: 'fixed-bottom-right',
        towerGridRows: 'auto 2fr 280px',
        towerGridGap: '8px',
      },
    },
  },

  /**
   * Theme spacing pour les media queries
   * Correspond aux valeurs dans theme.js
   */
  spacing: {
    sm: '8px',
  },
};

/**
 * Media query strings
 * Utilisés dans styled-components pour responsive styling
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${RESPONSIVE_CONFIG.breakpoints.mobile - 1}px)`,
  tablet: `(min-width: ${RESPONSIVE_CONFIG.breakpoints.tablet}px) and (max-width: ${RESPONSIVE_CONFIG.breakpoints.tabletWide - 1}px)`,
  tabletWide: `(min-width: ${RESPONSIVE_CONFIG.breakpoints.tabletWide}px)`,
  tabletWideOnly: `(min-width: ${RESPONSIVE_CONFIG.breakpoints.tabletWide}px) and (max-width: ${RESPONSIVE_CONFIG.breakpoints.desktop - 1}px)`,
  notTablet: `(min-width: ${RESPONSIVE_CONFIG.breakpoints.tabletWide}px)`,
  desktop: `(min-width: ${RESPONSIVE_CONFIG.breakpoints.desktop}px)`,
};

/**
 * Helper: Trouver la règle qui match pour width/height/userAgent donnés
 * @returns {Object} La règle matchée (name, forceInterface, responsiveLevel, etc.)
 */
export const detectLayoutRule = (width, height, userAgent) => {
  for (const rule of RESPONSIVE_CONFIG.deviceRules) {
    if (rule.condition(width, height, userAgent)) {
      return rule;
    }
  }
  // Fallback (ne devrait jamais arriver)
  return RESPONSIVE_CONFIG.deviceRules[RESPONSIVE_CONFIG.deviceRules.length - 1];
};

/**
 * Helper: Obtenir la config de layout pour un interface + responsiveLevel
 * @param {string} interfaceType - 'companion' ou 'studio'
 * @param {string} responsiveLevel - 'mobile', 'tablet', 'desktop'
 * @returns {Object} Configuration de layout
 */
export const getLayoutConfig = (interfaceType, responsiveLevel) => {
  if (interfaceType === 'companion') {
    return RESPONSIVE_CONFIG.layouts.companion;
  }
  return RESPONSIVE_CONFIG.layouts.studio[responsiveLevel] || RESPONSIVE_CONFIG.layouts.studio.desktop;
};
