// src/utils/assetMapping.js

export const roomBackgrounds = {
  // Ligne 0
  sanctuaire: "/src/assets/images/rooms/temple-lac.png",
  chambre: "/src/assets/images/rooms/chambre-cozy.jpg",
  cuisine: "/src/assets/images/rooms/cuisine.jpg",
  comptoir: "/src/assets/images/rooms/bureau_tresor.jpg",

  // Ligne 1
  jardin: "/src/assets/images/rooms/jardin.png",
  atelier: "/src/assets/images/rooms/atelier-workbench.jpg",
  forge: "/src/assets/images/rooms/forge-fire.jpg",
  boutique: "/src/assets/images/rooms/boutique-medieval.jpg",

  // Ligne 2
  scriptorium: "/src/assets/images/rooms/scriptorium_magique.jpg",
  bibliotheque: "/src/assets/images/rooms/bibliotheque_3.jpg",
  cave: "/src/assets/images/rooms/donjon.jpg",
  laboratoire: "/src/assets/images/rooms/labo-xxx.jpg",
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
export const textures = {
  parchment: "/src/assets/images/ui/parchment-texture.jpg",
  stone: "/src/assets/images/ui/stone-wall.jpg",
  wood: "/src/assets/images/ui/wood-grain.jpg",
  metal: "/src/assets/images/ui/metal-surface.jpg",
};

export const icons = {
  expand: "➡️",
  collapse: "⬇️",
  note: "📝",
};
