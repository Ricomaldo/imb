/**
 * Hook: useResponsiveLayout
 *
 * Détecte automatiquement le layout responsif basé sur:
 * - Window width & height
 * - Device type (iPhone, iPad, Android, Desktop)
 * - Orientation (portrait/landscape)
 *
 * Retourne un objet layout qui met à jour sur resize + orientation change
 */

import { useState, useEffect } from 'react';
import { RESPONSIVE_CONFIG, detectLayoutRule } from '../utils/responsiveConfig';

/**
 * @returns {Object} Layout object:
 *   - device: 'phone' | 'ipadPortrait' | 'tabletLandscape' | 'ipadLandscape' | 'desktop'
 *   - interface: 'companion' | 'studio'
 *   - responsiveLevel: 'mobile' | 'tablet' | 'desktop'
 *   - width: number (window.innerWidth)
 *   - height: number (window.innerHeight)
 *   - isPortrait: boolean (height > width)
 *   - isLandscape: boolean (height < width)
 *   - rule: Object (la règle matchée, avec reason, label, etc.)
 */
export const useResponsiveLayout = () => {
  const [layout, setLayout] = useState(() => detectLayout());

  useEffect(() => {
    /**
     * Mettre à jour le layout lors du resize
     * Utilise debounce implicite via un timeout court
     */
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newLayout = detectLayout();
        setLayout(newLayout);
      }, 50); // Délai court pour éviter les updates spam
    };

    /**
     * Mettre à jour le layout lors du changement d'orientation
     * iOS: orientationchange (meilleur timing que resize pour rotation)
     * Android: resize suffit généralement
     */
    const handleOrientationChange = () => {
      // Attendre légèrement le temps que les dimensions se mettent à jour
      setTimeout(() => {
        const newLayout = detectLayout();
        setLayout(newLayout);
      }, 100);
    };

    // Enregistrer les listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return layout;
};

/**
 * Fonction interne: Détecter le layout actuel
 * Parcourt les règles dans l'ordre et retourne le premier match
 */
function detectLayout() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const userAgent = navigator.userAgent;

  // Trouver la règle qui match
  const rule = detectLayoutRule(width, height, userAgent);

  // Construire l'objet layout
  return {
    device: rule.name,
    deviceLabel: rule.label,
    interface: rule.forceInterface,
    responsiveLevel: rule.responsiveLevel,
    width,
    height,
    isPortrait: height > width,
    isLandscape: height < width,
    rule, // Debug: inclure la règle complète
  };
}

/**
 * Hook optionnel: useMediaQueryMatch
 * Permet de tester si une media query est actuellement matchée
 *
 * Utile pour les décisions logiques complexes basées sur une media query spécifique
 */
export const useMediaQueryMatch = (mediaQueryString) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(mediaQueryString).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(mediaQueryString);
    const handleChange = (e) => setMatches(e.matches);

    // addEventListener pour meilleure compatibilité
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [mediaQueryString]);

  return matches;
};
