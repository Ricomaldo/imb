---
type: quick-reference
mission: M3
title: M3 Quick Reference Card
created: 2025-01-01
---

# M3 Quick Reference

## Current Status
✅ **Code Implementation**: COMPLETE
🔄 **Browser Testing**: NEXT STEP
📚 **Documentation**: COMPLETE

---

## What's Staged & Ready

```bash
git status
# On branch feature/fusion-sages-m1
# Changes to be committed:
#   - src/components/rooms/Comptoir/widgets/SagesKnowledge.jsx
#   - src/services/vaultApi.js
```

---

## What to Test

### 🎯 THE KEY FIX
When you click "✏️ Éditer" button, does the textarea become editable?

**This is the critical test.** The fix is:
```javascript
key={`editor-${isEditing}`}  // Line 361 in SagesKnowledge.jsx
```

### Test Sequence (Use Checklist)
1. Comptoir → Click Sage → Questions load (list view)
2. Click question → Detail view loads
3. Click "✏️ Éditer" → **Textarea should become EDITABLE**
4. Type something → Should appear in textarea
5. Click "💾 Sauvegarder" → Should save to vault
6. Navigate away/back → Changes should persist

---

## Files to Know

| Path | Purpose |
|------|---------|
| `src/components/rooms/Comptoir/widgets/SagesKnowledge.jsx` | Main component (redesigned) |
| `src/services/vaultApi.js` | REST client (enhanced with replaceNote) |
| `_internal/cockpit/testing/M3-testing-checklist.md` | 10-scenario test plan |
| `_internal/cockpit/workflow/active/M3-handoff-operationnel-status.md` | Detailed status |
| `_internal/cockpit/workflow/active/M3-IMPLEMENTATION-SUMMARY.md` | Full technical summary |

---

## Commands Cheat Sheet

```bash
# Run app locally
npm run dev

# Stage changes
git add src/components/rooms/Comptoir/widgets/SagesKnowledge.jsx \
         src/services/vaultApi.js

# Commit when ready
git commit -m "feat(M3): Dynamic sage questions with edit workflow"

# Check VPS API (if needed)
ssh root@mcp.irimwebforge.com
pm2 status
pm2 logs vault-8sages-api
```

---

## Browser Developer Tools

**To Debug**:
1. Open DevTools: F12
2. Go to **Network** tab
3. Try list/detail/edit operations
4. Watch for API calls to: `https://mcp.irimwebforge.com/vault-api/*`
5. Check **Console** for errors

**Network Expected Behavior**:
- `GET /read-note` → Load question
- `POST /replace-note` → Save question
- Status should be `200` (success) or `500` (error)

---

## If Textarea Still Not Editable

**Troubleshooting** (in order):
1. Check browser console for error messages
2. Verify `key={editor-${isEditing}}` is actually in the code (line 361)
3. Check if MarkdownEditor component has additional mode props
4. Debug React DevTools to see if component is actually remounting
5. Check `_internal/cockpit/workflow/active/M3-handoff-operationnel-status.md` for fallback solutions

---

## Success Criteria

All of these need to work:
- [ ] Questions load dynamically from vault
- [ ] List → Detail switching works
- **[ ] Textarea becomes editable (KEY FIX)**
- [ ] Save persists to vault
- [ ] Unsaved changes warning shows

---

## Next After Testing

### If All Tests Pass
```bash
git commit -m "feat(M3): Dynamic sage questions + edit workflow"
git push origin feature/fusion-sages-m1
# Move to M4
```

### If Issues Found
1. Document issue in console
2. Check troubleshooting section above
3. Try fallback solutions
4. Update this document

---

## Key Insight

The **key prop fix** works by leveraging React's component lifecycle:

```javascript
// When isEditing changes (true → false or false → true):
// Old element tree: <MarkdownEditor key="editor-false" ... />
// New element tree: <MarkdownEditor key="editor-true" ... />
//                   ^ Different key = unmount old, mount new
//
// Result: Fresh component instance, no stale internal state
```

This solves the "textarea won't become editable" problem that was blocking M3.

---

## Documents for Reference

- 📄 Full test plan: `_internal/cockpit/testing/M3-testing-checklist.md`
- 📄 Status tracker: `_internal/cockpit/workflow/active/M3-handoff-operationnel-status.md`
- 📄 Technical deep dive: `_internal/cockpit/workflow/active/M3-IMPLEMENTATION-SUMMARY.md`
- 📄 This document: `_internal/cockpit/workflow/active/M3-QUICK-REFERENCE.md`

---

## Timeline
- ✅ REST wrapper API deployed to VPS
- ✅ Frontend service layer created
- ✅ Dynamic question loading implemented
- ✅ UI redesigned (list/detail)
- ✅ Edit/save workflow coded
- ✅ Key fix for textarea editability applied
- 🔄 **Testing in browser** ← YOU ARE HERE
- ⏳ Commit to git
- ⏳ M4: Zone Rouge protocol

---

**TL;DR**: Code is done, key prop fix is in place, now test if textarea becomes editable when clicking "Éditer". Use the checklist to validate all scenarios.

