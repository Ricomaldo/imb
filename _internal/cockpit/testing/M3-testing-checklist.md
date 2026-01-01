---
type: testing-checklist
mission: M3
title: Handoff Opérationnel - Testing Checklist
created: 2025-01-01
updated: 2025-01-01
---

# M3 Testing Checklist

## Pre-Test Setup
- [ ] Ensure vault API is running on VPS: `pm2 status` on VPS
- [ ] Ensure IMB app is running locally: `npm run dev` (http://localhost:5173)
- [ ] Open browser DevTools (F12)
- [ ] Open Network tab (for debugging API calls)
- [ ] Open Console tab (for error messages)

---

## Test 1: Page Load & Initial State
```
✓ Navigate to Comptoir room
✓ SagesKnowledge component renders WITHOUT errors in console
✓ "📚 Questions liées (X)" header appears with question count
✓ List of questions is visible with badges
```

**Expected UI**:
- Question list shows: `[ID]` title `[DOMAIN]` `[STATUS]`
- Example: `[IDE01] Autonomie yin incarnee [IDE] [ENC]`
- Hover effects work (slight color change)

---

## Test 2: List View Navigation
```
✓ Click on first question in list
✓ View switches to detail mode (same modal, different content)
✓ Detail header shows: "← Retour" | "[ID]" title
✓ Question content displays in markdown format (NOT edited)
✓ Two buttons appear: "✏️ Éditer" and (no save button yet)
```

**Expected behavior**:
- Smooth transition from list → detail
- Question content is readable
- Back button is functional

---

## Test 3: Edit Mode Toggle (KEY TEST - THIS WAS BROKEN)
```
✓ In detail view, click "✏️ Éditer" button
✓ Button text changes to "👁️ Consulter"
✓ "💾 Sauvegarder" button APPEARS
✓ **CRITICAL**: Textarea becomes EDITABLE (you can type in it)
   → This was the issue! The key prop should fix it.
```

**Expected behavior**:
- MarkdownEditor component remounts with fresh state
- Textarea is active and accepts input
- Edit button toggles back to "Consulter" when in edit mode

**If textarea is STILL read-only**:
1. Check browser console for errors
2. Check if MarkdownEditor has additional props
3. Consider fallback solutions in status doc

---

## Test 4: Edit & Modify Content
```
✓ Type some text into the textarea (add a word, change something)
✓ Text appears in editor (not read-only)
✓ "💾 Sauvegarder" button should now be ENABLED (not greyed out)
```

**Expected behavior**:
- contentModified flag tracks changes
- Save button reflects state accurately

---

## Test 5: Save Workflow
```
✓ Click "💾 Sauvegarder" button
✓ Loading state appears: "⏳ Sauvegarde..."
✓ Button is disabled during save
✓ API call succeeds (check Network tab for POST to /replace-note)
   → Should be 200 OK response
✓ Success alert appears: "✅ Question sauvegardée"
✓ Button returns to normal "💾 Sauvegarder"
✓ isEditing resets to false (button becomes "✏️ Éditer" again)
```

**Debug Network Tab**:
- URL: `https://mcp.irimwebforge.com/vault-api/replace-note`
- Method: `POST`
- Status: `200` (success) or `500` (error)
- Body: Should contain vault, path, content

---

## Test 6: Verify Save Persisted
```
✓ Click "← Retour" to return to list view
✓ Click on the SAME question again
✓ Detail view loads
✓ Your edited content is still there (changes persisted)
✓ Back button and edit mode work again
```

**Expected behavior**:
- vault file was actually updated
- Next load shows the modified content

---

## Test 7: Edit Mode Exit (Read-Only Return)
```
✓ While in edit mode, click "👁️ Consulter" button
✓ Textarea becomes READ-ONLY again
✓ "💾 Sauvegarder" button disappears
✓ Button text returns to "✏️ Éditer"
✓ You cannot type in textarea anymore
```

**Expected behavior**:
- Toggle is clean and bidirectional
- State management is correct

---

## Test 8: Unsaved Changes Warning
```
✓ Enter edit mode
✓ Make some changes (type something)
✓ Click "← Retour" WITHOUT saving
✓ Confirmation dialog appears: "Des modifications non sauvegardées. Quitter quand même ?"
✓ Click "Cancel" → stays in detail view
✓ Click "OK" → returns to list view (changes discarded)
```

**Expected behavior**:
- Prevents accidental data loss
- contentModified flag is tracked correctly

---

## Test 9: Different Questions
```
✓ Go back to list view
✓ Click on a DIFFERENT question
✓ Detail loads for that question
✓ Edit/save/back workflow works
✓ No state bleed from previous question
```

**Expected behavior**:
- Each question is independent
- State resets properly when switching questions

---

## Test 10: Error Handling
```
✓ Stop the vault API (pm2 stop vault-8sages-api on VPS)
✓ Try to load a question (should show error in alert)
✓ Try to save a question (should show error alert)
✓ Restart the API (pm2 start vault-8sages-api)
✓ Should work again
```

**Expected behavior**:
- Graceful error messages
- User knows what went wrong

---

## Issues Found & Troubleshooting

### Issue: "Textarea stays read-only even after clicking Éditer"
**This is the key fix being tested.**

**Debug steps**:
1. Open console: `window.__ZUSTAND_STORES__` (check if ZUSTAND is available)
2. Look for errors mentioning MarkdownEditor
3. Check if key prop is actually on the element (React DevTools)
4. If key={isEditing} not working, try:
   - Alternative: `key={`${sageId}-${selectedQuestion?.id}-${isEditing}`}`
   - Or: Add explicit mode prop to MarkdownEditor if available

### Issue: "Save fails with 500 error"
**Check VPS logs**:
```bash
ssh root@mcp.irimwebforge.com
cd /srv/apis/vault-8sages-api
pm2 logs vault-8sages-api | tail -100
```

**Common issues**:
- replaceNote() not implemented on VPS
- filepath doesn't exist in vault
- MCP connection lost

### Issue: "Question doesn't load from vault"
**Debug**:
1. Check Network tab for GET to `/read-note`
2. Look for filepath in question object
3. Verify that 1-knowledge-base/ prefix is being added

---

## Success Criteria ✅
- [ ] List/detail switching works
- [ ] Textarea becomes editable in edit mode (KEY FIX)
- [ ] Save persists changes to vault
- [ ] All error scenarios handled gracefully
- [ ] Unsaved changes warning works

**Once ALL tests pass**: Ready to commit M3 and move to M4.

---

## Quick Restart Commands

```bash
# On your machine (IMB dev)
npm run dev

# On VPS (if needed)
ssh root@mcp.irimwebforge.com
pm2 status
pm2 restart vault-8sages-api
pm2 logs vault-8sages-api
```

