// src/components/room-modules/sanctuaire/MomentsOui/NeedsSelector.jsx
// Sélecteur de besoins avec accordéon par famille

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Badge from '../../../common/Badge';
import { ROSENBERG_NEEDS } from '../../../../constants/rosenbergNeeds';
import {
  SelectorContainer,
  FamilySection,
  FamilyHeader,
  NeedsGrid,
  SelectedNeedsContainer
} from './MomentsOui.styles';

/**
 * NeedsSelector - Sélecteur multi-besoins avec accordéon par famille
 * @param {string[]} selectedNeeds - IDs des besoins sélectionnés
 * @param {Function} onChange - Callback appelé quand la sélection change
 * @param {number} maxSelection - Nombre max de besoins sélectionnables (default: 5)
 */
const NeedsSelector = ({ selectedNeeds = [], onChange, maxSelection = 5 }) => {
  // Familles expandées (par défaut aucune)
  const [expandedFamilies, setExpandedFamilies] = useState([]);

  /**
   * Toggle expand/collapse d'une famille
   */
  const toggleFamily = (familyId) => {
    setExpandedFamilies(prev =>
      prev.includes(familyId)
        ? prev.filter(id => id !== familyId)
        : [...prev, familyId]
    );
  };

  /**
   * Toggle sélection d'un besoin
   */
  const toggleNeed = (needId) => {
    const isSelected = selectedNeeds.includes(needId);

    if (isSelected) {
      // Désélectionner
      onChange(selectedNeeds.filter(id => id !== needId));
    } else {
      // Sélectionner (si pas de limite atteinte)
      if (selectedNeeds.length < maxSelection) {
        onChange([...selectedNeeds, needId]);
      }
    }
  };

  /**
   * Obtenir le nombre de besoins sélectionnés dans une famille
   */
  const getSelectedCountInFamily = (family) => {
    return family.needs.filter(need => selectedNeeds.includes(need.id)).length;
  };

  return (
    <>
      {/* Sélecteur par familles */}
      <SelectorContainer>
        {ROSENBERG_NEEDS.map(family => {
          const isExpanded = expandedFamilies.includes(family.id);
          const selectedCount = getSelectedCountInFamily(family);

          return (
            <FamilySection key={family.id}>
              <FamilyHeader
                onClick={() => toggleFamily(family.id)}
                $color={family.color}
                title={family.description}
              >
                <span>
                  {family.emoji} {family.label}
                  {selectedCount > 0 && ` (${selectedCount})`}
                </span>
                <span>{isExpanded ? '▲' : '▼'}</span>
              </FamilyHeader>

              {isExpanded && (
                <NeedsGrid>
                  {family.needs.map(need => {
                    const isSelected = selectedNeeds.includes(need.id);
                    const isMaxReached = selectedNeeds.length >= maxSelection && !isSelected;

                    return (
                      <Badge
                        key={need.id}
                        icon={need.emoji}
                        color={isSelected ? 'success' : 'secondary'}
                        variant={isSelected ? 'solid' : 'outline'}
                        size="sm"
                        shape="pill"
                        onClick={() => !isMaxReached && toggleNeed(need.id)}
                        style={{
                          cursor: isMaxReached ? 'not-allowed' : 'pointer',
                          opacity: isMaxReached ? 0.5 : 1,
                          color: isSelected ? 'white' : '#F7FAFC'
                        }}
                        title={isMaxReached ? `Max ${maxSelection} besoins` : need.label}
                      >
                        {need.label}
                      </Badge>
                    );
                  })}
                </NeedsGrid>
              )}
            </FamilySection>
          );
        })}
      </SelectorContainer>

      {/* Besoins sélectionnés (affichage compact) */}
      {selectedNeeds.length > 0 && (
        <SelectedNeedsContainer>
          {selectedNeeds.map(needId => {
            // Trouver le besoin dans la taxonomie
            const family = ROSENBERG_NEEDS.find(f =>
              f.needs.some(n => n.id === needId)
            );
            const need = family?.needs.find(n => n.id === needId);

            if (!need) return null;

            return (
              <Badge
                key={needId}
                icon={need.emoji}
                color="success"
                variant="solid"
                size="sm"
                shape="pill"
                onClick={() => toggleNeed(needId)}
                style={{ cursor: 'pointer', color: 'white' }}
                title="Cliquer pour retirer"
              >
                {need.label}
              </Badge>
            );
          })}
        </SelectedNeedsContainer>
      )}

      {/* Info limite */}
      {selectedNeeds.length === maxSelection && (
        <div style={{
          fontSize: '10px',
          color: '#F59E0B',
          textAlign: 'center',
          marginTop: '4px'
        }}>
          Maximum {maxSelection} besoins atteint
        </div>
      )}
    </>
  );
};

NeedsSelector.propTypes = {
  selectedNeeds: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  maxSelection: PropTypes.number
};

NeedsSelector.defaultProps = {
  selectedNeeds: [],
  maxSelection: 5
};

export default NeedsSelector;
