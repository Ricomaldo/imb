// src/components/room-modules/sanctuaire/MindLogSorter/MindLogSorter.jsx
// Widget de tri mental pour catégoriser les entrées MindLog par drag&drop

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useDiaryStore from '../../../../stores/useDiaryStore';
import { alpha } from '../../../../styles/color';

// Conteneur principal
const SorterContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

// Zones de tri
const ZonesContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
`;

const DropZone = styled.div`
  background: ${({ theme, $isOver, $category }) => {
    if ($isOver) {
      const colors = {
        digest: theme.colors.warning,
        insight: theme.colors.success,
        evacuate: theme.colors.danger,
        revisit: theme.colors.info
      };
      return alpha(colors[$category] || theme.colors.primary, 0.15);
    }
    return alpha(theme.colors.stone || '#708090', 0.05);
  }};
  border: 1px solid ${({ theme, $isOver, $category }) => {
    if ($isOver) {
      const colors = {
        digest: theme.colors.warning,
        insight: theme.colors.success,
        evacuate: theme.colors.danger,
        revisit: theme.colors.info
      };
      return alpha(colors[$category] || theme.colors.primary, 0.5);
    }
    return alpha(theme.colors.stone || '#708090', 0.2);
  }};
  border-radius: 6px;
  padding: ${({ theme }) => theme.spacing.xs};
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.2s ease;
  overflow-y: auto;
  position: relative;
`;

const ZoneLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme, $category }) => {
    const colors = {
      digest: theme.colors.warning,
      insight: theme.colors.success,
      evacuate: theme.colors.danger,
      revisit: theme.colors.info
    };
    return colors[$category] || theme.colors.text?.muted;
  }};
  padding: 4px;
  border-bottom: 1px solid ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.1)};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 1;
`;

const ZoneIcon = styled.span`
  font-size: 12px;
`;

// Zone des entrées non catégorisées
const EntriesZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.08)};
  border-radius: 6px;
  min-height: 60px;
  max-height: 100px;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  position: relative;

  &::before {
    content: '${({ $count }) => $count} à trier';
    position: sticky;
    top: 0;
    display: block;
    padding: 4px;
    background: inherit;
    font-size: 10px;
    color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
    text-align: center;
    opacity: 0.8;
    z-index: 1;
  }
`;

// Bouton de suppression sur les cartes
const DeleteButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  padding: 0;
  background: ${({ theme }) => alpha(theme.colors.accents?.danger || '#DC3545', 0.8)};
  border: none;
  border-radius: 3px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.colors.accents?.danger || '#DC3545'};
  }
`;

// Carte d'entrée draggable
const EntryCard = styled.div`
  position: relative;
  background: ${({ theme, $isDragging, $hidden }) => {
    if ($isDragging) return alpha(theme.colors.primary, 0.9);
    if ($hidden) return alpha(theme.colors.stone || '#708090', 0.05);
    return theme.colors.surface || '#1A202C';
  }};
  border: 1px solid ${({ theme, $isDragging, $hidden }) => {
    if ($isDragging) return theme.colors.primary;
    if ($hidden) return alpha(theme.colors.stone || '#708090', 0.2);
    return alpha(theme.colors.stone || '#708090', 0.3);
  }};
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  cursor: grab;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: ${({ $isDragging }) =>
    $isDragging ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)'
  };
  transform: ${({ $transform }) => $transform || 'none'};
  opacity: ${({ $isDragging, $hidden }) => {
    if ($isDragging) return 0.5;
    if ($hidden) return 0.5;
    return 1;
  }};

  &:active {
    cursor: grabbing;
  }

  &:hover {
    background: ${({ theme, $hidden }) =>
      $hidden
        ? alpha(theme.colors.stone || '#708090', 0.1)
        : alpha(theme.colors.primary, 0.1)
    };
    border-color: ${({ theme }) => alpha(theme.colors.primary, 0.5)};

    ${DeleteButton} {
      opacity: 1;
    }
  }
`;

const EntryDate = styled.div`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
  opacity: 0.8;
`;

const EntryText = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EntryEmoji = styled.span`
  margin-right: 4px;
`;

// Modal de confirmation
const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface || '#1A202C'};
  border: 2px solid ${({ theme }) => theme.colors.accents?.danger || '#DC3545'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 300px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};
  font-size: 16px;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const ModalText = styled.p`
  color: ${({ theme }) => theme.colors.text?.muted || '#E2E8F0'};
  font-size: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;

  &.confirm {
    background: ${({ theme }) => theme.colors.accents?.danger || '#DC3545'};
    border-color: ${({ theme }) => theme.colors.accents?.danger || '#DC3545'};
    color: white;

    &:hover {
      background: ${({ theme }) => alpha(theme.colors.accents?.danger || '#DC3545', 0.8)};
    }
  }

  &.cancel {
    background: transparent;
    border-color: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.3)};
    color: ${({ theme }) => theme.colors.text?.light || '#F7FAFC'};

    &:hover {
      background: ${({ theme }) => alpha(theme.colors.stone || '#708090', 0.1)};
    }
  }
`;

// Composant d'entrée draggable
const DraggableEntry = ({ entry, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'Sans note';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(entry);
  };

  return (
    <EntryCard
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      $hidden={entry.hidden}
      $transform={style.transform}
      {...attributes}
      {...listeners}
    >
      <DeleteButton onClick={handleDelete} title="Supprimer définitivement">
        ×
      </DeleteButton>
      <EntryDate>
        {formatDate(entry.timestamp)}
        {entry.hidden && ' 👁️'}
      </EntryDate>
      <EntryText>
        {entry.emoji && <EntryEmoji>{entry.emoji}</EntryEmoji>}
        {truncateText(entry.notes || entry.note)}
      </EntryText>
    </EntryCard>
  );
};

// Zone de drop pour catégories
const DroppableZone = ({ category, entries, label, icon, onDeleteEntry }) => {
  const { setNodeRef, isOver, active } = useSortable({
    id: category,
    data: {
      type: 'category',
      category
    },
    disabled: true // Désactiver le drag de la zone elle-même
  });

  // Vérifier si l'élément actif est une entrée (pas une zone)
  const isDroppingEntry = active && !active.data?.current?.type;

  return (
    <DropZone ref={setNodeRef} $isOver={isOver} $category={category}>
      <ZoneLabel $category={category}>
        <ZoneIcon>{icon}</ZoneIcon>
        {label}
      </ZoneLabel>
      <SortableContext
        items={entries.map(e => e.id)}
        strategy={verticalListSortingStrategy}
      >
        {entries.map(entry => (
          <DraggableEntry
            key={entry.id}
            entry={entry}
            onDelete={onDeleteEntry}
          />
        ))}
      </SortableContext>
    </DropZone>
  );
};

// Composant principal
const MindLogSorter = () => {
  const { getAllLogs, updateLogCategory, deleteLog } = useDiaryStore();
  const logs = useDiaryStore(state => state.mindlog.logs); // Écouter directement les logs pour le re-render
  const [activeId, setActiveId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Catégories de tri
  const categories = [
    { id: 'digest', label: 'À digérer', icon: '🔥' },
    { id: 'insight', label: 'Insights', icon: '💡' },
    { id: 'evacuate', label: 'Évacué', icon: '🗑️' },
    { id: 'revisit', label: 'À revisiter', icon: '🔄' }
  ];

  // Filtrage et organisation des entrées
  const organizedEntries = useMemo(() => {
    const result = {
      uncategorized: [],
      digest: [],
      insight: [],
      evacuate: [],
      revisit: []
    };

    // Utiliser getAllLogs pour inclure les entrées cachées
    const allLogs = getAllLogs();
    // Ne prendre que les 10 dernières entrées
    const recentLogs = allLogs.slice(-10).reverse();

    recentLogs.forEach(log => {
      if (!log.category) {
        result.uncategorized.push(log);
      } else if (result[log.category]) {
        result[log.category].push(log);
      }
    });

    return result;
  }, [logs]); // Utiliser logs au lieu de getAllLogs pour détecter les changements

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Si on drop sur une zone de catégorie
    if (over.data?.current?.type === 'category') {
      const category = over.data.current.category;
      updateLogCategory(active.id, category);
    }

    setActiveId(null);
  };

  const handleDeleteEntry = (entry) => {
    setDeleteConfirm(entry);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteLog(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const activeEntry = activeId
    ? getAllLogs().find(log => log.id === activeId)
    : null;

  return (
    <SorterContainer>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Zone des entrées non catégorisées */}
        {organizedEntries.uncategorized.length > 0 && (
          <EntriesZone $count={organizedEntries.uncategorized.length}>
            <SortableContext
              items={organizedEntries.uncategorized.map(e => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {organizedEntries.uncategorized.map(entry => (
                <DraggableEntry
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </SortableContext>
          </EntriesZone>
        )}

        {/* Zones de catégories */}
        <ZonesContainer>
          {categories.map(cat => (
            <DroppableZone
              key={cat.id}
              category={cat.id}
              entries={organizedEntries[cat.id]}
              label={cat.label}
              icon={cat.icon}
              onDeleteEntry={handleDeleteEntry}
            />
          ))}
        </ZonesContainer>

        {/* Overlay de drag */}
        <DragOverlay>
          {activeEntry && (
            <EntryCard $isDragging={true}>
              <EntryDate>
                {new Date(activeEntry.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </EntryDate>
              <EntryText>
                {activeEntry.emoji && <EntryEmoji>{activeEntry.emoji}</EntryEmoji>}
                {activeEntry.notes || activeEntry.note || 'Sans note'}
              </EntryText>
            </EntryCard>
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <ConfirmModal onClick={cancelDelete}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>⚠️ Supprimer l'entrée ?</ModalTitle>
            <ModalText>
              Cette action est définitive. L'entrée sera supprimée de l'historique.
            </ModalText>
            <ModalButtons>
              <ModalButton className="cancel" onClick={cancelDelete}>
                Annuler
              </ModalButton>
              <ModalButton className="confirm" onClick={confirmDelete}>
                Supprimer
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmModal>
      )}
    </SorterContainer>
  );
};

export default MindLogSorter;