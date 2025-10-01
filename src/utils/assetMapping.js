// src/utils/assetMapping.js

// Import des backgrounds avec Vite (pour production)
import templeLac from '../assets/images/rooms/temple-lac.png';
import chambreCozy from '../assets/images/rooms/chambre-cozy.jpg';
import cuisine from '../assets/images/rooms/cuisine.jpg';
import bureauTresor from '../assets/images/rooms/bureau_tresor.jpg';
import jardin from '../assets/images/rooms/jardin.png';
import atelierWorkbench from '../assets/images/rooms/atelier-workbench.jpg';
import forgeFire from '../assets/images/rooms/forge-fire.jpg';
import boutiqueMedieval from '../assets/images/rooms/boutique-medieval.jpg';
import scriptoriumMagique from '../assets/images/rooms/scriptorium_magique.jpg';
import bibliotheque3 from '../assets/images/rooms/bibliotheque_3.jpg';
import donjon from '../assets/images/rooms/donjon.jpg';
import laboXxx from '../assets/images/rooms/labo-xxx.jpg';

export const roomBackgrounds = {
  // Ligne 0
  sanctuaire: templeLac,
  chambre: chambreCozy,
  cuisine: cuisine,
  comptoir: bureauTresor,

  // Ligne 1
  jardin: jardin,
  atelier: atelierWorkbench,
  forge: forgeFire,
  boutique: boutiqueMedieval,

  // Ligne 2
  scriptorium: scriptoriumMagique,
  bibliotheque: bibliotheque3,
  cave: donjon,
  laboratoire: laboXxx,
};

export const roomColors = {
  // Ligne 0 - Espaces nobles
  sanctuaire: "#4A4A6A",     // Violet pierre profond
  chambre: "#D4B896",        // Beige lin royal  
  cuisine: "#B8956B",        // Ocre terre cuite
  comptoir: "#9B7B9B",       // Mauve pierre noble

  // Ligne 1 - Espaces artisanaux
  jardin: "#7A8471",         // Vert mousse naturel
  atelier: "#A0826D",        // Bois patiné
  forge: "#8B4513",          // Brun rouillé (ton thème)
  boutique: "#D2B48C",       // Tan marchand (ton thème)

  // Ligne 2 - Espaces savants
  scriptorium: "#C8B99C",    // Parchemin ancien
  bibliotheque: "#8B7355",   // Cuir relié
  laboratoire: "#4A4A4A",    // Pierre sombre
  cave: "#5D4037",           // Terre battue

  empty: "#E8E2D6",          // Ton background thème
};
// Import des textures avec Vite (pour production)
import parchmentTexture from '../assets/images/ui/parchment-texture.jpg';
import stoneWall from '../assets/images/ui/stone-wall.jpg';
import woodGrain from '../assets/images/ui/wood-grain.jpg';
import metalSurface from '../assets/images/ui/metal-surface.jpg';

export const textures = {
  parchment: parchmentTexture,
  stone: stoneWall,
  wood: woodGrain,
  metal: metalSurface,
};

export const icons = {
  expand: "➡️",
  collapse: "⬇️",
  note: "📝",
};
