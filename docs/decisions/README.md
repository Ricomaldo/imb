# 📋 Architecture Decision Records (ADR)

> Décisions d'architecture documentées pour IRIMMetaBrain v3.0

## Index des Décisions

### 🏗️ Architecture Système v3.0 (2025)

#### **[ADR-008: Système de Sécurité Symbolique](ADR-008-securite-symbolique.md)**
**Date :** 1er octobre 2025 | **Status :** ✅ Accepté
- **Protection élégante** non-intrusive contre accès accidentel
- **LoginPage + AccessGate** avec sessionStorage temporaire
- **Variables d'environnement** pour configuration simple

#### **[ADR-007: Architecture Mobile Companion PWA](ADR-007-mobile-companion.md)**
**Date :** 1er octobre 2025 | **Status :** ✅ Accepté
- **Interface mobile** autonome avec stores Zustand partagés
- **PWA installable** iOS/Android avec TabBar navigation
- **Zero duplication** code avec architecture parallèle

#### **[ADR-006: Synchronisation Ultra-Simple v3.0](ADR-006-sync-ultra-simple.md)**
**Date :** 1er octobre 2025 | **Status :** ✅ Accepté
- **2 boutons uniquement** : EXPORT/IMPORT vers GitHub Gist
- **Variables d'environnement** pour configuration robuste
- **Multi-stores** complet (5 stores synchronisés)

### 🔧 Architecture Système v2.0 (2024)

#### **[ADR-005: Architecture Kanban Projets](ADR-005-architecture-kanban-projets.md)**
**Date :** 19 septembre 2024 | **Status :** ✅ Accepté
- **Gestion projets** avec métadonnées et données séparées
- **Navigation carousel** projets avec visibilité configurable

#### **[ADR-004: Annotations JSDoc pour Rendus](ADR-004-jsDoc-renders-annotation.md)**
**Date :** 18 septembre 2024 | **Status :** ✅ Accepté
- **Documentation composants** avec annotations @renders
- **Introspection automatique** structure React

#### **[ADR-002: Restructuration Architecture Composants](ADR-002-component-architecture-restructure.md)**
**Date :** 18 septembre 2024 | **Status :** ✅ Accepté
- **Réorganisation** dossiers composants par fonctionnalité
- **Séparation concerns** UI, business logic, et data

#### **[ADR-001: Système de Modales avec React Portals](ADR-001-modal-system-portals.md)**
**Date :** 16 septembre 2024 | **Status :** ✅ Accepté
- **React Portals** pour modales flexibles
- **Z-index management** cohérent
- **Multi-zones** d'affichage (overlay, RoomCanvas, SideTower)

### 📝 DevLogs & Patterns

#### **[Keyboard Navigation Pattern](keyboard-navigation-pattern.md)**
**Date :** 18 septembre 2024
- **Navigation clavier** pour interface spatiale
- **Patterns UX** pour développeurs TDA/H

---

## 📊 Statistiques ADR

**Total ADR :** 8 décisions documentées
**Status :**
- ✅ **Acceptés :** 7 ADR
- 📝 **DevLogs :** 1 pattern

**Couverture :**
- **Architecture système :** 100%
- **Synchronisation :** 100%
- **Mobile/PWA :** 100%
- **Sécurité :** 100%
- **UI/UX :** 85%

---

## 🎯 Format ADR Standard

Chaque ADR suit cette structure :

```markdown
---
type: decision
updated: YYYY-MM-DD
---

# ADR-XXX: Titre de la Décision

**Date :** Date de la décision
**Status :** Accepté/Rejeté/Superseded
**Auteurs :** @username + collaborateurs

## Contexte
Problème ou besoin qui nécessite une décision

## Décision
Solution choisie avec justification

## Alternatives Considérées
Options évaluées et pourquoi elles ont été rejetées

## Conséquences
- ✅ Positives
- ⚠️ Négatives
- 🔄 Mitigations

## Liens
- Documentation liée
- ADR connexes
```

---

## 🔗 Liens Documentation

- **[📚 Documentation Principale](../README.md)** - Navigation complète
- **[🏗️ Architecture Stores](../architecture/stores-architecture.md)** - Détails techniques
- **[📱 Companion Architecture](../COMPANION_ARCHITECTURE.md)** - Interface mobile
- **[🛡️ Security System](../architecture/security-system.md)** - Système sécurité

---

**Mainteneurs :** IRIM Team
**Dernière mise à jour :** 1er octobre 2025