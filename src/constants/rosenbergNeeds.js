// src/constants/rosenbergNeeds.js
// Taxonomie complète des besoins selon Marshall Rosenberg (CNV)
// 7 familles de besoins fondamentaux pour le widget Moments OUI

/**
 * ROSENBERG_NEEDS - Structure hiérarchique des besoins fondamentaux
 *
 * Chaque famille contient:
 * - id: identifiant unique
 * - label: nom de la famille
 * - emoji: représentation visuelle
 * - color: couleur distinctive (format hex)
 * - description: explication du besoin
 * - needs: array de besoins spécifiques
 */
export const ROSENBERG_NEEDS = [
  {
    id: 'autonomie',
    label: 'Autonomie',
    emoji: '🦅',
    color: '#F59E0B',
    description: 'Liberté de choisir et agir selon ses valeurs',
    needs: [
      { id: 'autonomie_choix', label: 'Choix', emoji: '🎯' },
      { id: 'autonomie_independance', label: 'Indépendance', emoji: '🗽' },
      { id: 'autonomie_espace', label: 'Espace', emoji: '🌌' },
      { id: 'autonomie_spontaneite', label: 'Spontanéité', emoji: '✨' }
    ]
  },
  {
    id: 'celebration',
    label: 'Célébration',
    emoji: '🎉',
    color: '#EC4899',
    description: 'Joie de vivre et appréciation de la beauté',
    needs: [
      { id: 'celebration_beaute', label: 'Beauté', emoji: '🌸' },
      { id: 'celebration_joie', label: 'Joie', emoji: '😊' },
      { id: 'celebration_gratitude', label: 'Gratitude', emoji: '🙏' },
      { id: 'celebration_inspiration', label: 'Inspiration', emoji: '💡' },
      { id: 'celebration_amour', label: 'Amour', emoji: '❤️' }
    ]
  },
  {
    id: 'integrite',
    label: 'Intégrité',
    emoji: '🧭',
    color: '#8B5CF6',
    description: 'Cohérence entre valeurs et actions',
    needs: [
      { id: 'integrite_authenticite', label: 'Authenticité', emoji: '🔍' },
      { id: 'integrite_creativite', label: 'Créativité', emoji: '🎨' },
      { id: 'integrite_sens', label: 'Sens', emoji: '🧩' },
      { id: 'integrite_estime', label: 'Estime de soi', emoji: '💪' }
    ]
  },
  {
    id: 'interdependance',
    label: 'Interdépendance',
    emoji: '🤝',
    color: '#10B981',
    description: 'Connection et contribution mutuelle',
    needs: [
      { id: 'interdependance_acceptation', label: 'Acceptation', emoji: '🫂' },
      { id: 'interdependance_appreciation', label: 'Appréciation', emoji: '👏' },
      { id: 'interdependance_consideration', label: 'Considération', emoji: '👁️' },
      { id: 'interdependance_contribution', label: 'Contribution', emoji: '🎁' },
      { id: 'interdependance_soutien', label: 'Soutien mutuel', emoji: '🤲' }
    ]
  },
  {
    id: 'jeu',
    label: 'Jeu',
    emoji: '🎮',
    color: '#06B6D4',
    description: 'Légèreté et stimulation ludique',
    needs: [
      { id: 'jeu_humour', label: 'Humour', emoji: '😄' },
      { id: 'jeu_detente', label: 'Détente', emoji: '🏖️' },
      { id: 'jeu_stimulation', label: 'Stimulation', emoji: '⚡' }
    ]
  },
  {
    id: 'communion_spirituelle',
    label: 'Communion spirituelle',
    emoji: '🕊️',
    color: '#A855F7',
    description: 'Connection au transcendant et à l\'harmonie',
    needs: [
      { id: 'communion_harmonie', label: 'Harmonie', emoji: '☯️' },
      { id: 'communion_ordre', label: 'Ordre', emoji: '📐' },
      { id: 'communion_paix', label: 'Paix', emoji: '🕊️' },
      { id: 'communion_beaute', label: 'Beauté', emoji: '🌺' }
    ]
  },
  {
    id: 'besoins_physiques',
    label: 'Besoins physiques',
    emoji: '💪',
    color: '#EF4444',
    description: 'Vitalité et bien-être corporel',
    needs: [
      { id: 'physique_air', label: 'Air', emoji: '🌬️' },
      { id: 'physique_eau', label: 'Eau', emoji: '💧' },
      { id: 'physique_nourriture', label: 'Nourriture', emoji: '🍎' },
      { id: 'physique_mouvement', label: 'Mouvement', emoji: '🏃' },
      { id: 'physique_repos', label: 'Repos', emoji: '😴' },
      { id: 'physique_securite', label: 'Sécurité', emoji: '🛡️' },
      { id: 'physique_toucher', label: 'Toucher', emoji: '🤗' }
    ]
  }
];

/**
 * Obtenir tous les besoins individuels avec leurs infos de famille
 * @returns {Array} Array de besoins avec métadonnées famille
 */
export const getAllNeedsFlat = () => {
  return ROSENBERG_NEEDS.flatMap(family =>
    family.needs.map(need => ({
      ...need,
      familyId: family.id,
      familyLabel: family.label,
      familyEmoji: family.emoji,
      familyColor: family.color
    }))
  );
};

/**
 * Obtenir un besoin spécifique par son ID
 * @param {string} needId - ID du besoin
 * @returns {Object|undefined} Besoin avec métadonnées ou undefined
 */
export const getNeedById = (needId) => {
  const allNeeds = getAllNeedsFlat();
  return allNeeds.find(n => n.id === needId);
};

/**
 * Obtenir la famille d'un besoin par l'ID du besoin
 * @param {string} needId - ID du besoin
 * @returns {Object|undefined} Famille ou undefined
 */
export const getFamilyByNeedId = (needId) => {
  return ROSENBERG_NEEDS.find(family =>
    family.needs.some(n => n.id === needId)
  );
};

/**
 * Obtenir tous les besoins d'une famille spécifique
 * @param {string} familyId - ID de la famille
 * @returns {Array} Array de besoins ou array vide
 */
export const getNeedsByFamily = (familyId) => {
  const family = ROSENBERG_NEEDS.find(f => f.id === familyId);
  return family ? family.needs : [];
};

/**
 * Compter le nombre total de besoins disponibles
 * @returns {number} Nombre total de besoins
 */
export const getTotalNeedsCount = () => {
  return ROSENBERG_NEEDS.reduce((total, family) => total + family.needs.length, 0);
};

/**
 * Obtenir un résumé des statistiques de la taxonomie
 * @returns {Object} Stats { families: number, totalNeeds: number, avgPerFamily: number }
 */
export const getTaxonomyStats = () => {
  const totalNeeds = getTotalNeedsCount();
  return {
    families: ROSENBERG_NEEDS.length,
    totalNeeds,
    avgPerFamily: Math.round(totalNeeds / ROSENBERG_NEEDS.length * 10) / 10
  };
};

export default ROSENBERG_NEEDS;
