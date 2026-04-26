---
type: guide
created: 2026-01-01
updated: 2026-01-01
tags: [react, modal, portal, ui-patterns, z-index]
---

# Pattern : Modal avec createPortal

**Origine** : M1 Fusion Sages - `SagesPortal.jsx`

**Statut** : Validé production ✅

---

## 🎯 Problème

Quand une modal est rendue **inline dans un composant avec `overflow: hidden`**, elle peut être clippée.

**Exemple du problème** :
```jsx
// ❌ PROBLÈME
<Panel> {/* overflow: hidden sur Panel */}
  <SagesPortal>
    {selectedSage && (
      <ModalOverlay> {/* ← CLIPPED par Panel overflow */}
        <ModalContent>...</ModalContent>
      </ModalOverlay>
    )}
  </SagesPortal>
</Panel>
```

**Symptôme** :
- Modal partiellement visible
- Contenu coupé aux bords
- Backdrop overlay ne couvre pas l'écran complet

---

## ✅ Solution : createPortal

Utiliser React's `createPortal` pour rendre la modal sur `document.body` au lieu d'inline.

```jsx
import { createPortal } from 'react-dom';

export const SagesPortal = () => {
  const [selectedSage, setSelectedSage] = useState(null);

  return (
    <>
      {/* Grid de cartes visible */}
      <SagesGrid>
        {sages.map(sage => (
          <Card
            key={sage.id}
            onClick={() => setSelectedSage(sage)}
          >
            {sage.emoji}
          </Card>
        ))}
      </SagesGrid>

      {/* Modal PORTALE vers document.body */}
      {selectedSage && createPortal(
        <ModalOverlay onClick={() => setSelectedSage(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>{selectedSage.name}</h2>
            {/* Contenu modal */}
          </ModalContent>
        </ModalOverlay>,
        document.body
      )}
    </>
  );
};
```

---

## 🔧 Détails Implémentation

### 1. Import createPortal
```jsx
import { createPortal } from 'react-dom';
```

### 2. Condition d'Affichage
```jsx
{selectedSage && createPortal(/* ... */, document.body)}
```
- `selectedSage` : condition détermine si modal rendue
- `createPortal()` : deuxième paramètre = `document.body`

### 3. ModalOverlay (Backdrop)
```jsx
const ModalOverlay = styled.div`
  position: fixed;          /* ← IMPORTANT: fixed, pas absolute */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;            /* Au-dessus du reste */
`;
```

### 4. ModalContent (Modal Box)
```jsx
const ModalContent = styled.div`
  background: #2a2a2a;
  border: 3px solid ${props => props.color};
  border-radius: 12px;
  max-height: 80vh;
  width: 90vw;
  max-width: 1000px;
  overflow-y: auto;         /* Scroll si contenu long */
  z-index: 1001;            /* Au-dessus overlay */
`;
```

### 5. Event Propagation
```jsx
<ModalOverlay onClick={() => setSelectedSage(null)}>
  {/* ✅ Click overlay ferme modal */}

  <ModalContent onClick={e => e.stopPropagation()}>
    {/* ✅ Click contenu ne ferme PAS */}
  </ModalContent>
</ModalOverlay>
```

**Important** : `stopPropagation()` empêche fermeture accidentelle

---

## 📐 Layout Responsif (Bonus)

Si modal a contenu multi-colonne :

```jsx
const ModalBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Desktop: 2 colonnes */
  gap: 30px;
  flex: 1;
  overflow-y: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;    /* Mobile: 1 colonne */
    gap: 20px;
  }
`;
```

**Résultat** :
- 🖥️ Desktop : Contenu côte à côte
- 📱 Mobile : Contenu empilé verticalement

---

## 🎨 Animations (Optional)

Pour fade-in modal :

```jsx
const ModalOverlay = styled.div`
  /* ... base styles ... */
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
```

---

## 🚀 Checklist Implémentation

- [x] `import { createPortal } from 'react-dom'`
- [x] Modal rendue avec `{condition && createPortal(...)}`
- [x] ModalOverlay a `position: fixed` + `inset: 0`
- [x] ModalOverlay a `z-index: 1000+`
- [x] ModalContent a `onClick={e => e.stopPropagation()}`
- [x] ModalOverlay a `onClick={() => close()}`
- [x] Responsive media queries pour contenus larges
- [x] Test : Modal visible full screen sans clip

---

## 📚 Implémentations Actuelles

| Composant | Fichier | Statut |
|-----------|---------|--------|
| **SagesPortal** | `src/components/rooms/Comptoir/widgets/SagesPortal.jsx` | ✅ Production |
| [À ajouter] | | |

---

## 🔗 Références

| Doc | Lien |
|-----|------|
| **React createPortal** | https://react.dev/reference/react-dom/createPortal |
| **Mission Origine** | `_internal/cockpit/workflow/done/2026-01-01-fusion-sages-m1.md` |
| **Learnings** | `_internal/cockpit/knowledge/findings/2026-01-01-fusion-sages-m1-learnings.md` |

---

## 💡 Pourquoi Ça Marche

| Aspect | Raison |
|--------|--------|
| **Position fixed** | Overlay référence viewport, pas parent |
| **z-index haut** | Au-dessus de tout contenu page |
| **document.body** | Échappe overflow:hidden du parent Panel |
| **stopPropagation** | Fermeture contrôlée, pas accidentelle |

---

## ⚠️ Attention Commune

### ❌ Ne pas faire

```jsx
// ❌ Oublier stopPropagation
<ModalContent onClick={e => /* rien */}>
  {/* Click ferme modal accidentellement */}
</ModalContent>

// ❌ Position absolute
const ModalOverlay = styled.div`
  position: absolute;  /* ← Mauvais, référence parent */
`;

// ❌ z-index trop bas
z-index: 10;  /* ← Dépassé par autres éléments */
```

### ✅ À faire

```jsx
// ✅ Toujours stopPropagation
<ModalContent onClick={e => e.stopPropagation()}>

// ✅ Position fixed
position: fixed;

// ✅ z-index haut
z-index: 1000;
```

---

**Créé** : 1er janvier 2026
**Validé** : M1 Fusion Sages en production
**Réutilisable** : OUI - Pattern applicable tous composants IMB
