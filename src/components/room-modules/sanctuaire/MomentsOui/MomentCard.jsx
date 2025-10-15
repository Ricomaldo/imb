// src/components/room-modules/sanctuaire/MomentsOui/MomentCard.jsx
// Carte d'affichage d'un moment OUI avec expand/collapse

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Badge from '../../../common/Badge';
import { getNeedById } from '../../../../constants/rosenbergNeeds';
import {
  CardContainer,
  CardHeader,
  CardDate,
  CardActions,
  ActionButton,
  CardQuoi,
  CardPourquoi,
  CardTags
} from './MomentsOui.styles';

/**
 * MomentCard - Affiche un moment OUI avec expand/collapse
 * @param {Object} moment - Données du moment
 * @param {Function} onEdit - Callback édition
 * @param {Function} onDelete - Callback suppression
 */
const MomentCard = ({ moment, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  /**
   * Formater la date/heure
   */
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Déterminer si c'est aujourd'hui, hier, ou autre
    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    let dayLabel;
    if (dateStr === todayStr) {
      dayLabel = "Aujourd'hui";
    } else if (dateStr === yesterdayStr) {
      dayLabel = 'Hier';
    } else {
      dayLabel = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }

    const timeLabel = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${dayLabel} ${timeLabel}`;
  };

  /**
   * Tronquer le texte si trop long
   */
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <CardContainer
      $archived={moment.archived}
      onClick={() => setExpanded(!expanded)}
    >
      <CardHeader>
        <CardDate>
          {formatDateTime(moment.timestamp)}
          {moment.archived && ' (archivé)'}
        </CardDate>

        <CardActions>
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit(moment);
            }}
            title="Modifier"
          >
            📝
          </ActionButton>
          <ActionButton
            $variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(moment);
            }}
            title="Supprimer"
          >
            🗑️
          </ActionButton>
        </CardActions>
      </CardHeader>

      <CardQuoi $expanded={expanded}>
        {expanded ? moment.quoi : truncateText(moment.quoi, 80)}
      </CardQuoi>

      {expanded && (
        <>
          <CardPourquoi>
            "{moment.pourquoi}"
          </CardPourquoi>

          {moment.tags && moment.tags.length > 0 && (
            <CardTags>
              {moment.tags.map(tagId => {
                const need = getNeedById(tagId);
                if (!need) return null;

                return (
                  <Badge
                    key={tagId}
                    icon={need.emoji}
                    color="primary"
                    variant="subtle"
                    size="sm"
                    shape="pill"
                  >
                    {need.label}
                  </Badge>
                );
              })}
            </CardTags>
          )}
        </>
      )}
    </CardContainer>
  );
};

MomentCard.propTypes = {
  moment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    timestamp: PropTypes.string.isRequired,
    quoi: PropTypes.string.isRequired,
    pourquoi: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    archived: PropTypes.bool,
    createdAt: PropTypes.string,
    modifiedAt: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default MomentCard;
