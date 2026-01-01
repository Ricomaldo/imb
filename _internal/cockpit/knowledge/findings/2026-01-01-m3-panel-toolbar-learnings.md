---
type: finding
date: 2026-01-01
mission: 2026-01-01-fusion-sages-m3
tags: [learnings, panel, markdown, toolbar, architecture, vault-integration]
---

# Learnings : M3 Handoff Opérationnel (Comptoir Questions)

**Mission** : `_internal/cockpit/workflow/active/2026-01-01-fusion-sages-m3.md`

**Contexte** : Intégration vault 8sages → Comptoir IMB via API REST VPS. Affichage questions par sage avec édition/sauvegarde.

---

## Ce qui a marché

✅ **Pattern Panel + MarkdownEditor + MarkdownToolbar**
- Réutilisation existante marche parfaitement une fois compris
- PanelContext synchronise automatiquement edit/preview/zoom/focus
- Pas besoin de réinventer boutons custom

✅ **Vault REST API integration**
- `readNote()` / `replaceNote()` via API VPS fonctionnent
- Extraction filepaths depuis index markdown réussie (après fix regex)
- localStorage sage selection persiste bien

✅ **forwardRef + useImperativeHandle pattern**
- Parent (ComptoirRoom) expose save handler
- Enfant (QuestionsPanel) expose `saveCurrentQuestion()` via ref
- Toolbar appelle parent via `onSave` prop

✅ **Design system compliance**
- Sage color sur titres seulement (pas backgrounds)
- Texture parchment visible avec `transparentContent={true}`
- Theme tokens utilisés partout

---

## Ce qui a coincé

❌ **Compréhension Panel system** (90min perdu)
- Pas immédiatement compris que Panel + contentType="markdown" = toolbar auto
- Ai créé custom SaveButton via `customActions` avant de comprendre
- Ai réinventé toolbar au lieu de réutiliser existant
- **Cause** : Documentation pattern manquante

❌ **Regex filepath extraction** (30min)
- Premier pattern `split()` retournait sections vides
- **Solution** : Passer à `matchAll()` avec lookahead proper
- Pattern final : `/###\s+\[([A-Z0-9]+)\]\s+([^\n]+)\n([\s\S]*?)(?=###\s+\[|$)/g`

❌ **Sage ID mismatch** (10min)
- sageConfig avait `"eleonore"` mais fichier vault = `eleo-questions.md`
- **Solution** : Aligner ID config sur convention vault (short IDs)

❌ **Mode focus affichage vide** (20min)
- MarkdownEditor ne montrait rien en focus mode
- **Solution** : Ajouter `key={activeQuestionId}` pour forcer re-render
- Simplifier return (pas de fragments inutiles)

❌ **Background couleur sage** (5min)
- PanelContent appliquait `accentColor` en background
- **Solution** : `transparentContent={true}` sur Panel

---

## À améliorer

📝 **Documentation manquante critique**
- Pattern Panel + MarkdownEditor + MarkdownToolbar n'était pas documenté
- Ai créé `_internal/docs/guides/panel-markdown-system.md` pour combler
- **Impact** : Toute intégration future sera 3x plus rapide

🎯 **Checklist intégration vault**
- Pattern extraction markdown répétable
- Pourrait devenir template pour autres rooms
- **Action** : Créer guide vault-integration.md si pattern réutilisé

🧹 **Workflow pollution**
- Ai créé 5 fichiers UPPERCASE temporaires dans workflow/active/
- **Leçon** : Notes/synthèses vont dans findings/, pas workflow/
- **Action** : Supprimer fichiers temp, garder seulement mission principale

---

## Patterns Découverts

### Pattern 1 : Panel Toolbar Integration

**Problème** : Comment ajouter save button dans toolbar markdown ?

**Solution** :
```jsx
// NE PAS FAIRE : custom actions
<Panel customActions={<SaveButton />}>

// FAIRE : Props toolbar
<Panel
  contentType="markdown"      // Active toolbar auto
  onSave={handleSave}         // Callback
  isSaving={isSaving}         // State loading
  showSaveButton={condition}  // Visibility
>
  <MarkdownEditor />
</Panel>
```

**Pourquoi** :
- Panel passe props à MarkdownToolbar automatiquement
- Toolbar affiche 💾 quand `showSaveButton && isEditing`
- Pas de props drilling, pattern cohérent

**Fichiers** :
- `src/components/common/Panel/Panel.jsx` (lignes 165-180, 228-240)
- `src/components/common/MarkdownToolbar/MarkdownToolbar.jsx`

**Documentation** : `_internal/docs/guides/panel-markdown-system.md`

---

### Pattern 2 : ForwardRef Save Handler

**Problème** : Comment exposer méthode save depuis enfant ?

**Solution** :
```jsx
// Enfant (QuestionsPanel)
export const QuestionsPanel = forwardRef(({ ... }, ref) => {
  useImperativeHandle(ref, () => ({
    saveCurrentQuestion: async (questionId) => {
      await replaceNote(path, content);
    }
  }));

  return <MarkdownEditor ... />;
});

// Parent (ComptoirRoom)
const questionsPanelRef = useRef(null);

const handleSaveQuestion = async () => {
  await questionsPanelRef.current.saveCurrentQuestion(activeQuestionId);
};

<Panel onSave={handleSaveQuestion}>
  <QuestionsPanel ref={questionsPanelRef} />
</Panel>
```

**Fichiers** :
- `src/components/rooms/Comptoir/widgets/QuestionsPanel.jsx`
- `src/components/rooms/Comptoir/ComptoirRoom.jsx`

---

### Pattern 3 : Markdown Index Parsing (Vault)

**Problème** : Extraire questions + filepaths depuis index markdown

**Format vault** :
```markdown
### [ACC01] Titre question

Description...

- **Fichier** : `path/to/question.md`
- Tags: #tag1

---

### [ACC02] Autre question
...
```

**Solution regex** :
```javascript
const questionRegex = /###\s+\[([A-Z0-9]+)\]\s+([^\n]+)\n([\s\S]*?)(?=###\s+\[|$)/g;
let match;
while ((match = questionRegex.exec(content)) !== null) {
  const questionId = match[1];        // ACC01
  const title = match[2];             // Titre question
  const sectionContent = match[3];    // Tout jusqu'au prochain ###

  // Extraire filepath
  const filepathMatch = sectionContent.match(/\-\s*\*\*Fichier\s*\*\*\s*:\s*`([^`]+)`/);
  const filepath = filepathMatch ? filepathMatch[1] : null;
}
```

**Fichiers** :
- `src/components/rooms/Comptoir/ComptoirRoom.jsx` (lignes 95-125)

**Réutilisable** : OUI → Si autres rooms lisent indexes vault

---

### Pattern 4 : Single-Select avec Visual Feedback

**Problème** : Sélection question sans checkbox, avec feedback visuel

**Solution** :
```jsx
const QuestionItemLabel = styled.div`
  border-left: 2px solid transparent;

  ${({ $isSelected, $sageColor }) => $isSelected && `
    border-left-color: ${$sageColor};
    background: rgba(255, 255, 255, 0.08);
  `}
`;

<QuestionItemLabel
  $isSelected={selectedIds.includes(id)}
  $sageColor={sageColor}
  onClick={() => onSelect([id])}  // Single select
>
  <span className="title">{title}</span>
</QuestionItemLabel>
```

**Fichiers** :
- `src/components/rooms/Comptoir/widgets/QuestionSelector.jsx`

---

## Métriques

**Temps total M3** : ~4h (plusieurs sessions)
- Exploration patterns : 90min
- Implémentation : 90min
- Debug/fixes : 60min
- Documentation : 30min

**Effort gaspillé** :
- Réinvention toolbar : 60min → économisé si doc existait
- Debug regex : 30min → normal (découverte pattern)

**ROI Documentation** :
- Guide panel-markdown-system.md créé (30min)
- Économie future estimée : 60min par intégration similaire
- Break-even : 2ème utilisation du pattern

---

## Commits Clés

```
fb01c1e feat(Comptoir): Apply sage color to question titles only
9ca4ec6 feat(Comptoir): Integrate save functionality with Panel toolbar system
83e9422 refactor(M3): Clean architecture - reuse MarkdownEditor, fix styling
2676a48 fix(M3): Correct sage ID mismatch - eleonore → eleo
a35edd0 fix(Comptoir): Extract correct filepath from vault index
```

**Branch** : `feature/fusion-sages-m1`

---

## Réutilisable

### Guide Projet Créé

✅ **`_internal/docs/guides/panel-markdown-system.md`**
- Documentation complète Panel + MarkdownEditor + MarkdownToolbar
- Exemples code complets
- Checklist intégration
- Pièges courants + solutions

**Impact** : Toute future room avec markdown sera 3x plus rapide à implémenter

---

### Patterns Candidats Guides Futurs

🔄 **vault-integration.md** (si pattern réutilisé)
- REST API vaultApi.js usage
- Markdown index parsing
- Question extraction + filepath resolution

🔄 **single-select-ui.md** (si pattern généralisé)
- Visual feedback sans checkbox
- Styled components dynamic props
- Sage color theming

---

## Prochaines Actions

### Immédiat

- [x] Créer finding learnings (ce fichier)
- [x] Créer guide panel-markdown-system.md
- [ ] Mettre à jour CHANGELOG.md avec M3 features
- [ ] Supprimer fichiers temporaires UPPERCASE workflow/active/
- [ ] Marquer mission M3 status=done

### Futur (M4/M5)

- [ ] Tester save questions multi-sages (actuellement single-sage testé)
- [ ] Implémenter M4 (portail navigation sages)
- [ ] Implémenter M5 (transition smooth sage modal → questions)

---

## Validation Checklist

✅ **Code**
- [x] Tous commits propres avec messages clairs
- [x] Design system respecté (colors, textures, theme)
- [x] Pattern Panel réutilisé (pas custom)
- [x] Architecture cohérente avec existant

✅ **Documentation**
- [x] Guide panel-markdown-system.md créé
- [x] Finding learnings créé (ce fichier)
- [ ] CHANGELOG.md mis à jour (à faire)

✅ **Tests manuels**
- [x] Sélection sage persiste (localStorage)
- [x] Questions chargent correctement
- [x] Édition markdown fonctionne
- [x] Mode focus affiche contenu
- [x] Save questions fonctionne (API vault)
- [x] Couleur sage appliquée titres seulement

---

**Conclusion** : M3 fonctionnel ✅. Pattern Panel compris et documenté. ROI documentation positif dès 2ème usage.
