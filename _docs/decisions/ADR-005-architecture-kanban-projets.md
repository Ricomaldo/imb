# ADR-005 : Architecture Kanban pour Gestion Projets Freelance

**Date** : 2025-09-19
**Statut** : Accepté

---

## Contexte

Gestion de 20+ projets freelance web répartis en 3 catégories (Pro/Perso/Formation). Besoin de priorisation visuelle sans overhead mental.

## Décision

### Pour Pro & Perso : Kanban 3 colonnes
- **EN TÊTE** (max 3-5, auto-visible, priorité semaine)
- **ACTIF** (pipeline, checkbox visibilité manuelle)
- **PAUSE** (bloqués, jamais visibles)

### Pour Formation : Vue Portfolio statique
- Tri par complexité/date
- Pas de Kanban (projets terminés)
- Option flag "À réviser" simple

### Architecture technique
- Store : `kanbanColumn: 'entete' | 'actif' | 'pause'` par projet
- Drag = changement colonne + auto-visibilité EN TÊTE
- Formation : drag seulement pour tri visuel

## Alternatives rejetées
- Timeline 5 colonnes : trop complexe, maintenance lourde
- Kanban formation : inutile pour projets terminés
- Drag entre catégories : cas usage trop rare

## Conséquences
- Vision immédiate charge semaine
- Discipline requise pour maintenance board
- Simplicité = adoption réelle vs sophistication abandonnée