// src/styles/theme.js

export const theme = {
  colors: {
    // Neutres système
    white: '#FFFFFF',
    black: '#000000',
    gray: '#333333',     // Pour textes secondaires
    beige: '#F5F5DC',    // Pour blockquotes/code

    // Base existante (tons chauds)
    primary: '#8B4513',
    secondary: '#D2B48C',
    accent: '#CD853F',
    background: '#E8E2D6',
    border: '#A0522D',
    stone: '#708090',

    // Ajouts complémentaires (accents froids)
    accents: {
      cold: '#4A5568',         // Bleu ardoise - liens/boutons actifs
      success: '#68752C',      // Vert olive - validations/succès
      danger: '#8B3A3A',       // Rouge terre - alertes/erreurs
      gold: '#C9A96E',         // Or brillant - Navigation arrows
      warm: '#B8860B',         // Or brun - RoomNotes
      neutral: '#6B7280'       // Gris - SideTowerNotes
    },

    text: {
      primary: '#2F1B14',      // Brun très foncé
      secondary: '#5D4037',    // Brun moyen
      light: '#F7FAFC',        // Blanc cassé - texte sur fonds sombres
      muted: '#E2E8F0'         // Gris très clair - texte secondaire sur dark
    }
  },
  spacing: {
    '3xs': '2px',    // Micro-espacements (padding code, etc.)
    '2xs': '4px',    // Très petit (était xs)
    xs: '6px',       // Cave et espacements serrés
    sm: '8px',       // Standard small
    md: '12px',      // Ajusté pour remplacer les 12px hardcodés
    lg: '16px',      // Standard (était md)
    xl: '24px',      // Large (était lg)
    '2xl': '32px',   // Extra large (était xl)
    '3xl': '40px'    // Sanctuaire et sections hero
  },
  button: {
    small: '36px',
    medium: '48px',
    large: '60px',
    xlarge: '80px'
  },
  surfaces: {
    base: '#FFFFFF',
    muted: '#F7F4EF',
    overlay: 'rgba(0,0,0,0.3)'
  },
  radii: {
    xs: '3px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px'
  },
  borders: {
    thin: '1px',
    base: '2px',
    thick: '3px',
    heavy: '4px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.1)',
    md: '0 2px 4px rgba(0,0,0,0.2)',
    lg: '0 4px 8px rgba(0,0,0,0.3)'
  },
  motion: {
    durations: { fast: '120ms', base: '180ms', slow: '240ms' },
    easings: { standard: 'ease', emphasized: 'cubic-bezier(.2,.8,.2,1)' }
  },
  // Ancien système (deprecated)
  fonts: {
    main: '"Cinzel", serif',
    mono: '"Courier New", monospace'
  },

  // Nouveau système typographique scalable
  typography: {
    // Familles de polices spécialisées
    families: {
      primary: '"Cinzel", serif',        // Headers, titres nobles/médiévaux
      secondary: '"Crimson Text", serif', // Corps de texte, lecture longue
      mono: '"Courier New", monospace',   // Code, données techniques
      ui: '"Inter", sans-serif'           // UI moderne, labels, boutons
    },

    // Échelle typographique harmonieuse (ratio 1.25)
    sizes: {
      xs: '12px',     // Micro-infos, timestamps, badges
      sm: '14px',     // Textes secondaires, captions, meta
      base: '16px',   // Texte principal, contenu standard
      md: '18px',     // Textes importants, emphasis
      lg: '22px',     // Sous-titres, section headers
      xl: '28px',     // Titres de sections
      '2xl': '35px',  // Titres de pages
      '3xl': '44px'   // Titres principaux, hero
    },

    // Poids standardisés
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },

    // Line-heights optimisées par usage
    lineHeights: {
      tight: 1.2,    // Titres, headers courts
      normal: 1.4,   // Texte standard, UI
      relaxed: 1.6,  // Lecture longue, paragraphes
      loose: 1.8     // Espacement très aéré
    },

    // Letter-spacing pour différents contextes
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  zIndex: {
    base: 0,
    level1: 1,
    level2: 2,
    level3: 3,
    navigation: 10,
    overlay: 20,
    modal: 30
  },
  // Gradients UI Kit pour enrichissement visuel
  // Palettes de couleurs pour visualisations
  palettes: {
    // Gamme de bleus pour hiérarchies et arbres
    blues: {
      100: '#4a9eff',  // Bleu vif - Niveau 0/Root
      200: '#6ba3ff',  // Bleu moyen-vif - Niveau 1
      300: '#89b4ff',  // Bleu moyen - Niveau 2
      400: '#a7c5ff',  // Bleu clair - Niveau 3
      500: '#c5d6ff'   // Bleu très clair - Niveau 4+
    }
  },

  gradients: {
    // Or premium (flèches navigation, bordures spéciales)
    uiKitGold: 'linear-gradient(135deg, #f0deba 0%, #b1845a 100%)',

    // Bleu nuit profond (backgrounds premium, Sanctuaire)
    uiKitBlue: 'linear-gradient(135deg, #19253f 0%, #111629 100%)',

    // Effet brillance or (animations, hover states)
    goldShine: 'linear-gradient(90deg, #b1845a 0%, #f0deba 50%, #b1845a 100%)'
  }
};
