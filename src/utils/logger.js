// src/utils/logger.js

/**
 * Logger centralisé avec niveaux de verbosité
 * MODE_DEBUG = true : Tous les logs affichés
 * MODE_DEBUG = false : Seulement errors et warnings critiques
 */

const MODE_DEBUG = import.meta.env.DEV && false; // Change to true pour debug complet

export const logger = {
  /**
   * Info (affiché seulement en mode DEBUG)
   */
  info: (...args) => {
    if (MODE_DEBUG) {
      console.log(...args);
    }
  },

  /**
   * Debug (affiché seulement en mode DEBUG)
   */
  debug: (...args) => {
    if (MODE_DEBUG) {
      console.log(...args);
    }
  },

  /**
   * Warning (toujours affiché)
   */
  warn: (...args) => {
    console.warn(...args);
  },

  /**
   * Error (toujours affiché)
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Success (affiché seulement en mode DEBUG ou si critique)
   */
  success: (...args) => {
    if (MODE_DEBUG) {
      console.log(...args);
    }
  }
};
