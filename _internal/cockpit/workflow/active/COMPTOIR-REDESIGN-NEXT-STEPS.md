---
type: action-plan
mission: Comptoir Redesign
status: in-progress
created: 2025-01-01
updated: 2025-01-01
phase: Grid Migration → Widget Implementation
---

# Comptoir Redesign - Next Steps (Gridified)

## Current State ✅

Tu as déjà migré vers **PanelGrid 12x8** dans ComptoirRoom.jsx :

```jsx
<PanelGrid columns={12} rows={8}>
  {/* Zone Rouge - cols 1/4, rows 1/4 */}
  {/* SagesPortal - cols 4/13, rows 1/7 */}
</PanelGrid>
```

**Parfait alignement avec le plan!**

---

## Architecture Cible (du Plan)

```jsx
<PanelGrid columns={12} rows={8}>
  {/* Zone Rouge - cols 1/4, rows 1/4 */}
  <Panel gridColumn="1 / 4" gridRow="1 / 4">
    <ZoneRouge />
  </Panel>

  {/* Sage Selector - cols 4/13, rows 1/2 */}
  <Panel gridColumn="4 / 13" gridRow="1 / 2">
    <SageSelector activeSageId={...} onSelect={...} />
  </Panel>

  {/* Question Selector - cols 4/13, rows 2/3 */}
  <Panel gridColumn="4 / 13" gridRow="2 / 3">
    <QuestionSelector sageId={...} questionsIndex={...} />
  </Panel>

  {/* Questions Panel - cols 4/13, rows 3/8 */}
  <Panel gridColumn="4 / 13" gridRow="3 / 8">
    <QuestionsPanel sageId={...} questionIds={...} />
  </Panel>
</PanelGrid>
```

**Changement clé** : Remplacer le gros SagesPortal modale (cols 4/13, rows 1/7) par 3 panels spécialisés empilés verticalement.

---

## Step-by-Step Implementation

### STEP 1: Créer SageSelector.jsx (30 min)

**Fichier** : `src/components/rooms/Comptoir/widgets/SageSelector.jsx`

**Code Template** :

```jsx
import React from 'react';
import styled from 'styled-components';
import sagesConfig from '../../../data/sagesConfig.json';

const SageSelectorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;
`;

const SageButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, $active }) =>
    $active ? `${theme.colors.background}CC` : 'rgba(0, 0, 0, 0.2)'};
  border: 2px solid ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radii.md};
  color: #fff;
  cursor: pointer;
  transition: ${({ theme }) =>
    `all ${theme.motion.durations.base} ${theme.motion.easings.standard}`};

  span:first-child {
    font-size: 20px;
  }

  span:last-child {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    text-align: center;
    word-break: break-word;
    text-overflow: ellipsis;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 12px ${({ $color }) => $color}77;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SageSelector = ({ activeSageId, onSelect }) => {
  const nonMetaSages = sagesConfig.sages.filter(s => !s.isMeta);
  const gouvernail = sagesConfig.sages.find(s => s.isMeta);

  return (
    <SageSelectorContainer>
      {nonMetaSages.map(sage => (
        <SageButton
          key={sage.id}
          $color={sage.color}
          $active={activeSageId === sage.id}
          onClick={() => onSelect(sage.id)}
          title={sage.specialty}
        >
          <span>{sage.emoji}</span>
          <span>{sage.name}</span>
        </SageButton>
      ))}

      {gouvernail && (
        <SageButton
          key={gouvernail.id}
          $color={gouvernail.color}
          $active={activeSageId === gouvernail.id}
          onClick={() => onSelect(gouvernail.id)}
          title={`${gouvernail.name} - ${gouvernail.specialty}`}
          style={{ gridColumn: '1 / -1' }}
        >
          <span>{gouvernail.emoji}</span>
          <span>{gouvernail.name}</span>
        </SageButton>
      )}
    </SageSelectorContainer>
  );
};
```

**À faire** :
- [ ] Créer le fichier
- [ ] Copier le code ci-dessus
- [ ] Tester la grille responsive (auto-fit)
- [ ] Vérifier theme styling (colors, spacing, motion)

---

### STEP 2: Créer QuestionSelector.jsx (45 min)

**Fichier** : `src/components/rooms/Comptoir/widgets/QuestionSelector.jsx`

**Code Template** :

```jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { readNote } from '../../../services/vaultApi';

const QuestionSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;
  max-height: 200px;
  overflow-y: auto;
`;

const QuestionItemLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: ${({ theme }) =>
    `background ${theme.motion.durations.fast} ${theme.motion.easings.standard}`};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  input[type='checkbox'] {
    cursor: pointer;
  }

  span {
    font-size: ${({ theme }) => theme.typography.sizes.base};
    color: #fff;
    flex: 1;
  }
`;

export const QuestionSelector = ({
  sageId,
  questionsIndex,
  selectedQuestionIds,
  onSelect
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleQuestion = (questionId) => {
    if (selectedQuestionIds.includes(questionId)) {
      onSelect(selectedQuestionIds.filter(id => id !== questionId));
    } else {
      onSelect([...selectedQuestionIds, questionId]);
    }
  };

  if (loading) {
    return <QuestionSelectorContainer>Chargement questions...</QuestionSelectorContainer>;
  }

  if (error) {
    return (
      <QuestionSelectorContainer style={{ color: '#ff9999' }}>
        Erreur : {error}
      </QuestionSelectorContainer>
    );
  }

  if (!questionsIndex || questionsIndex.length === 0) {
    return <QuestionSelectorContainer>Aucune question pour ce sage.</QuestionSelectorContainer>;
  }

  return (
    <QuestionSelectorContainer>
      {questionsIndex.map(question => (
        <QuestionItemLabel key={question.id}>
          <input
            type="checkbox"
            checked={selectedQuestionIds.includes(question.id)}
            onChange={() => toggleQuestion(question.id)}
          />
          <span>{question.id}</span>
          <span style={{ flex: 2, fontSize: '0.9em' }}>{question.title}</span>
        </QuestionItemLabel>
      ))}
    </QuestionSelectorContainer>
  );
};
```

**À faire** :
- [ ] Créer le fichier
- [ ] Copier le code
- [ ] Intégrer `readNote()` pour charger index sage (optionnel pour now - mock d'abord)
- [ ] Tester multi-select checkboxes

---

### STEP 3: Adapter QuestionsPanel (ExistingMarkdownEditor) (1h)

**Fichier** : `src/components/rooms/Comptoir/widgets/SagesKnowledge.jsx` → **RENOMMER** ou **REFACTOR**

**Option A: Refactor existing SagesKnowledge en QuestionsPanel**

```jsx
// Remplacer le détail-view modal par un container de panels collapsables

export const QuestionsPanel = ({ sageId, questionIds, sageColor }) => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = usePreferencesStore();

  const [questionsContent, setQuestionsContent] = useState({});
  const [editingMode, setEditingMode] = useState({});

  // Charger chaque question sélectionnée
  useEffect(() => {
    questionIds.forEach(qId => {
      if (!questionsContent[qId]) {
        // Load from vault
        loadQuestionContent(sageId, qId).then(content => {
          setQuestionsContent(prev => ({
            ...prev,
            [qId]: content
          }));
        });
      }
    });
  }, [questionIds, sageId]);

  const handleSave = async (questionId, content) => {
    try {
      await replaceNote(getQuestionPath(sageId, questionId), content);
      setEditingMode(prev => ({ ...prev, [questionId]: false }));
    } catch (error) {
      console.error('Save failed:', error);
      alert(`❌ Erreur sauvegarde: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {questionIds.length === 0 ? (
        <p>Sélectionnez une question pour voir le contenu.</p>
      ) : (
        questionIds.map(questionId => {
          const isPanelCollapsed = getPanelState('comptoir', `q-${questionId}`)?.collapsed ?? false;
          const isEditing = editingMode[questionId] || false;
          const content = questionsContent[questionId] || '';

          return (
            <Panel
              key={questionId}
              gridColumn="1 / -1"
              gridRow="auto"
              title={`Q: ${questionId}`}
              icon="📄"
              texture="parchment"
              accentColor={sageColor}
              collapsible={true}
              collapsed={isPanelCollapsed}
              onToggleCollapse={(collapsed) =>
                updatePanelState('comptoir', `q-${questionId}`, { collapsed })
              }
            >
              <MarkdownEditor
                key={`editor-${questionId}-${isEditing}`}
                value={content}
                onChange={newContent =>
                  setQuestionsContent(prev => ({
                    ...prev,
                    [questionId]: newContent
                  }))
                }
                readOnly={!isEditing}
                height="300px"
                compact={true}
                variant="embedded"
                accentColor={sageColor}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() =>
                    setEditingMode(prev => ({
                      ...prev,
                      [questionId]: !prev[questionId]
                    }))
                  }
                  style={{
                    padding: '6px 12px',
                    background: isEditing ? '#666' : '#888',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isEditing ? '👁️ Lire' : '✏️ Éditer'}
                </button>
                {isEditing && (
                  <button
                    onClick={() => handleSave(questionId, questionsContent[questionId])}
                    style={{
                      padding: '6px 12px',
                      background: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Sauvegarder
                  </button>
                )}
              </div>
            </Panel>
          );
        })
      )}
    </div>
  );
};
```

**À faire** :
- [ ] Refactor SagesKnowledge ou créer QuestionsPanel.jsx
- [ ] Remplacer gros MarkdownEditor unique par array de panels collapsables
- [ ] Adapter hauteur panels (ex: 200px vs 100% précédent)
- [ ] Tester avec key={editor} pour toggle readOnly

---

### STEP 4: Update ComptoirRoom.jsx avec new layout (30 min)

**Fichier** : `src/components/rooms/Comptoir/ComptoirRoom.jsx`

**Code cible** :

```jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import BaseRoom from '../../layout/BaseRoom';
import PanelGrid from '../../layout/PanelGrid';
import Panel from '../../common/Panel';
import { ZoneRouge } from './widgets/ZoneRouge';
import { SageSelector } from './widgets/SageSelector';
import { QuestionSelector } from './widgets/QuestionSelector';
import { QuestionsPanel } from './widgets/QuestionsPanel';
import { readNote } from '../../../services/vaultApi';
import sagesConfig from '../../../data/sagesConfig.json';
import usePreferencesStore from '../../../stores/usePreferencesStore';

const ComptoirRoom = () => {
  const theme = useTheme();
  const { getPanelState, updatePanelState } = usePreferencesStore();

  // État principal
  const [activeSageId, setActiveSageId] = useState(() => {
    return localStorage.getItem('comptoir-active-sage') || 'eleonore';
  });

  const [questionsIndex, setQuestionsIndex] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  const activeSage = sagesConfig.sages.find(s => s.id === activeSageId);

  // Persist sage selection
  useEffect(() => {
    localStorage.setItem('comptoir-active-sage', activeSageId);
  }, [activeSageId]);

  // Load questions index when sage changes
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const indexPath = `1-knowledge-base/index-sages/${activeSageId}-questions.md`;
        const content = await readNote(indexPath);
        // Parse questions from markdown
        const questions = parseQuestionsFromMarkdown(content);
        setQuestionsIndex(questions);
        setSelectedQuestionIds([]); // Reset selection on sage change
      } catch (error) {
        console.error('[Comptoir] Error loading questions:', error);
        setQuestionsIndex([]);
      }
    };

    if (activeSageId) {
      loadQuestions();
    }
  }, [activeSageId]);

  // Parse markdown index
  const parseQuestionsFromMarkdown = (content) => {
    // Extraire questions depuis le markdown de l'index
    // Format: ### [QID] Title - Description
    const questions = [];
    const questionRegex = /###\s+\[([A-Z0-9]+)\]\s+(.+?)(?:\n|$)/g;
    let match;

    while ((match = questionRegex.exec(content)) !== null) {
      const questionId = match[1];
      const title = match[2].split(' - ')[0].trim();
      questions.push({
        id: questionId,
        title: title,
        domaine: questionId.substring(0, questionId.search(/\d/)) || 'unknown'
      });
    }

    return questions;
  };

  return (
    <BaseRoom roomType="comptoir" layoutType="grid">
      <PanelGrid columns={12} rows={8}>
        {/* Zone Rouge */}
        <Panel
          gridColumn="1 / 4"
          gridRow="1 / 4"
          title="Zone Rouge"
          icon="🔴"
          texture="stone"
          collapsible={true}
          collapsed={getPanelState('comptoir', 'zone-rouge')?.collapsed ?? false}
          onToggleCollapse={(collapsed) =>
            updatePanelState('comptoir', 'zone-rouge', { collapsed })
          }
        >
          <ZoneRouge />
        </Panel>

        {/* Sage Selector */}
        <Panel
          gridColumn="4 / 13"
          gridRow="1 / 2"
          title="Choisir un Sage"
          icon="🎭"
          texture="parchment"
          accentColor={theme.colors.accents.warm}
          collapsible={true}
          collapsed={getPanelState('comptoir', 'sage-selector')?.collapsed ?? false}
          onToggleCollapse={(collapsed) =>
            updatePanelState('comptoir', 'sage-selector', { collapsed })
          }
        >
          <SageSelector activeSageId={activeSageId} onSelect={setActiveSageId} />
        </Panel>

        {/* Question Selector */}
        <Panel
          gridColumn="4 / 13"
          gridRow="2 / 3"
          title="Questions"
          icon="❓"
          texture="parchment"
          accentColor={activeSage?.color}
          collapsible={true}
          collapsed={getPanelState('comptoir', 'question-selector')?.collapsed ?? false}
          onToggleCollapse={(collapsed) =>
            updatePanelState('comptoir', 'question-selector', { collapsed })
          }
        >
          <QuestionSelector
            sageId={activeSageId}
            questionsIndex={questionsIndex}
            selectedQuestionIds={selectedQuestionIds}
            onSelect={setSelectedQuestionIds}
          />
        </Panel>

        {/* Questions Panel */}
        <Panel
          gridColumn="4 / 13"
          gridRow="3 / 8"
          title={`Questions - ${activeSage?.name}`}
          icon="📖"
          texture="parchment"
          accentColor={activeSage?.color}
          collapsible={true}
          collapsed={getPanelState('comptoir', 'questions-panel')?.collapsed ?? false}
          onToggleCollapse={(collapsed) =>
            updatePanelState('comptoir', 'questions-panel', { collapsed })
          }
        >
          <QuestionsPanel
            sageId={activeSageId}
            questionIds={selectedQuestionIds}
            sageColor={activeSage?.color}
          />
        </Panel>
      </PanelGrid>
    </BaseRoom>
  );
};

export default ComptoirRoom;
```

**À faire** :
- [ ] Remplacer SagesPortal import par 3 nouveaux widgets
- [ ] Ajouter state activeSageId + selectedQuestionIds
- [ ] Ajouter localStorage persist
- [ ] Ajouter loadQuestions useEffect
- [ ] Adapter panel positions (4 panels empilés)

---

## Ordre Optimal d'Exécution

**Phase 1 (30 min)** - Widgets créés manuellement (code templates fournis)
1. ✅ SageSelector.jsx → Copy/paste template
2. ✅ QuestionSelector.jsx → Copy/paste template

**Phase 2 (1h)** - QuestionsPanel refactor
3. ✅ Refactor SagesKnowledge en QuestionsPanel (ou nouveau fichier)
4. ✅ Passer de 1 gros panel à array de collapsables
5. ✅ Adapter MarkdownEditor avec key toggle

**Phase 3 (30 min)** - Mise à jour ComptoirRoom
6. ✅ Update imports
7. ✅ Adapter PanelGrid layout (4 panels)
8. ✅ Ajouter state + useEffect
9. ✅ localStorage persist

**Phase 4 (Test & Polish)** - Test & debugging
10. ✅ Test load sage selector
11. ✅ Test load questions index
12. ✅ Test multi-select questions
13. ✅ Test edit/save workflow
14. ✅ Vérifier theme styling

---

## Git Status

**Actuellement staged** (M3 old code):
```
src/components/rooms/Comptoir/widgets/SagesKnowledge.jsx
src/services/vaultApi.js
```

**À faire avant commit M3 final**:
1. Décider: garder SagesKnowledge ou remplacer par QuestionsPanel?
2. Si remplacer: supprimer SagesKnowledge.jsx des staged changes
3. Si garder: documenter pourquoi (legacy, autre usage?)

**Recommandation**: Supprimer SagesKnowledge (remplacé par QuestionsPanel) et committer le nouveau Comptoir redesigné comme "feat(M3-Final)".

---

## Success Criteria

- ✅ PanelGrid 12x8 comme Chambre
- ✅ Zone Rouge intact (cols 1/4, rows 1/4)
- ✅ SageSelector - buttonbar avec localStorage persist
- ✅ QuestionSelector - multi-select avec index vault
- ✅ QuestionsPanel - collapsables avec edit/save
- ✅ Theme styling cohérent (spacing, colors, motion)
- ✅ Test workflow complet (select sage → select questions → edit → save)

---

## Questions à clarifier

1. **Vault index format** : Vérifier exact structure de `{sageId}-questions.md`
   - Actuellement j'assume: `### [QID] Title - Description`
   - À confirmer par lecture réelle du fichier

2. **Question filepath** : Confirmer chemin exact
   - Actuellement j'assume: `1-knowledge-base/questions/domaines-v4/{domaine}/{ID}-titre.md`
   - À confirmer par vérif vault réel

3. **localStorage vs store** : Suffisant localStorage ou passer par useSagesStore Zustand?
   - Recommandation plan: localStorage pour sage actif (simple, rapide)
   - Pour questions content: Zustand store (meilleure intégration sync)

---

**Next action**: Commencer par STEP 1 (SageSelector) → crée le fichier et teste.

Veux-tu que je crée les 3 fichiers directement ou tu préfères les faire toi-même?
