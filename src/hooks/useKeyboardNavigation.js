// src/hooks/useKeyboardNavigation.js

import { useEffect, useRef } from 'react';
import usePreferencesStore from '../stores/usePreferencesStore';

/**
 * Hook pour gérer les raccourcis clavier de navigation
 * @param {Object} options - Configuration du hook
 * @param {Function} options.onNavigate - Callback appelé avec la direction ('up', 'down', 'left', 'right')
 * @param {Object} options.availableDirections - Objet indiquant les directions disponibles
 * @param {boolean} options.isNavigating - État de navigation en cours (pour éviter les conflits)
 * @param {boolean} options.enabled - Active/désactive l'écoute des événements (défaut: true)
 * @param {Object} options.customKeys - Mapping personnalisé des touches (optionnel)
 * 
 * @example
 * // Usage basique
 * useKeyboardNavigation({
 *   onNavigate: (direction) => console.log(direction),
 *   availableDirections: { up: true, down: true, left: true, right: true }
 * });
 * 
 * @example
 * // Usage avec touches personnalisées (WASD)
 * useKeyboardNavigation({
 *   onNavigate: handleMove,
 *   availableDirections: directions,
 *   customKeys: { 'KeyW': 'up', 'KeyS': 'down', 'KeyA': 'left', 'KeyD': 'right' }
 * });
 */
export const useKeyboardNavigation = ({
  onNavigate,
  availableDirections = {},
  isNavigating = false,
  enabled = true,
  customKeys = null,
  currentPosition = null,
  stepDelayMs = 550,
  enableEscapeToDefault = true
}) => {
  const defaultRoom = usePreferencesStore((state) => state.defaultRoom);

  // Refs pour disposer de valeurs fraîches dans les timeouts
  const availableRef = useRef(availableDirections);
  const navigatingRef = useRef(isNavigating);
  const positionRef = useRef(currentPosition);
  const returningRef = useRef(false);
  const pathQueueRef = useRef([]);

  useEffect(() => { availableRef.current = availableDirections; }, [availableDirections]);
  useEffect(() => { navigatingRef.current = isNavigating; }, [isNavigating]);
  useEffect(() => { positionRef.current = currentPosition; }, [currentPosition]);

  const stepTowards = (from, to) => {
    if (!from || !to) return null;
    if (from.x < to.x) return 'right';
    if (from.x > to.x) return 'left';
    if (from.y < to.y) return 'down';
    if (from.y > to.y) return 'up';
    return null;
  };

  const buildPath = (from, to) => {
    const path = [];
    if (!from || !to) return path;
    let cursor = { x: from.x, y: from.y };

    // D'abord X, puis Y (chemin Manhattan simple)
    while (cursor.x !== to.x) {
      path.push(cursor.x < to.x ? 'right' : 'left');
      cursor.x += cursor.x < to.x ? 1 : -1;
    }
    while (cursor.y !== to.y) {
      path.push(cursor.y < to.y ? 'down' : 'up');
      cursor.y += cursor.y < to.y ? 1 : -1;
    }
    return path;
  };

  const runQueuedReturn = () => {
    if (pathQueueRef.current.length === 0) {
      returningRef.current = false;
      return;
    }

    // Si une navigation est en cours, on attend la prochaine fenêtre
    if (navigatingRef.current) {
      setTimeout(runQueuedReturn, stepDelayMs);
      return;
    }

    const nextDir = pathQueueRef.current.shift();
    if (!nextDir) {
      returningRef.current = false;
      return;
    }

    // On déclenche la navigation d'un pas
    onNavigate && onNavigate(nextDir);
    setTimeout(runQueuedReturn, stepDelayMs);
  };

  const returnToDefault = () => {
    if (!enableEscapeToDefault || returningRef.current) return;
    const start = positionRef.current;
    const target = defaultRoom;
    if (!start || !target) return;
    if (start.x === target.x && start.y === target.y) return;

    // Construire le chemin complet une fois pour toutes puis exécuter
    pathQueueRef.current = buildPath(start, target);
    returningRef.current = true;
    runQueuedReturn();
  };
  useEffect(() => {
    if (!enabled || !onNavigate) return;

    const handleKeyDown = (event) => {
      // Vérifier si on est dans un éditeur (textarea, input, ou contenteditable)
      const activeElement = document.activeElement;
      const isInEditor =
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'INPUT' ||
        activeElement.contentEditable === 'true' ||
        activeElement.closest('[contenteditable="true"]');

      // Si on est dans un éditeur, ne pas intercepter les touches
      if (isInEditor) {
        return;
      }

      // Si navigation en cours, ignorer
      if (isNavigating) {
        return;
      }

      // Empêcher le scroll par défaut des flèches
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(event.key)) {
        event.preventDefault();
      }

      // Raccourci: Échap → retour vers la pièce par défaut
      if (event.key === 'Escape') {
        returnToDefault();
        return;
      }

      let direction = null;
      
      // Support des touches personnalisées
      if (customKeys && customKeys[event.code]) {
        direction = customKeys[event.code];
      } else {
        // Mapping par défaut (flèches)
        switch (event.key) {
          case 'ArrowUp':
            direction = 'up';
            break;
          case 'ArrowDown':
            direction = 'down';
            break;
          case 'ArrowLeft':
            direction = 'left';
            break;
          case 'ArrowRight':
            direction = 'right';
            break;
          default:
            return; // Touche non gérée, sortir sans appeler onNavigate
        }
      }

      // Vérifier si la direction est disponible
      if (direction && availableDirections[direction]) {
        onNavigate(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigate, availableDirections, isNavigating, enabled, customKeys, enableEscapeToDefault, stepDelayMs, defaultRoom, currentPosition]);
};

export default useKeyboardNavigation;
