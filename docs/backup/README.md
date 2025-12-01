# 📦 Documentation Backup

> Fichiers documentation obsolètes ou dépréciés conservés pour référence

**Créé le :** 1er octobre 2025
**Raison :** Nettoyage documentation après refonte architecture v3.0

## 📁 Contenu Backup

### `CHANGELOG-stores.md`
**Date :** 19 septembre 2024
**Statut :** ✨ Remplacé par `architecture/stores-architecture.md` v2.0
**Contenu :** Historique des changements stores Zustand
**Pourquoi backup :** Information historique intégrée dans la nouvelle doc architecture

### `components/` (dossier)
**Date :** Septembre 2024
**Statut :** 📝 Documentation composants spécifiques
**Contenu :**
- `badge-system.md` - Système de badges
- `kanban-architecture.md` - Architecture kanban
- `laboratoire-testing-system.md` - Système de tests
- `mindlog-compact.md` - Composant mindlog

**Pourquoi backup :** Docs composants spécifiques non intégrées à la navigation principale v3.0. Conservées pour référence développement.

### `keyboard-navigation-pattern.md`
**Date :** 18 septembre 2024
**Statut :** 📋 DevLog pattern navigation
**Contenu :** Patterns navigation clavier interface spatiale
**Pourquoi backup :** DevLog spécifique non intégré aux ADR principaux

## 🔄 Récupération

Ces fichiers peuvent être restaurés si nécessaire :

```bash
# Restaurer un fichier spécifique
mv backup/FILENAME.md destination/

# Restaurer le dossier components complet
mv backup/components/ ../
```

## 📚 Documentation Active

Pour la documentation à jour, consulter :
- **[📚 README Principal](../README.md)** - Navigation complète v3.0
- **[🏗️ Architecture](../architecture/)** - Documentation technique
- **[📋 ADR](../decisions/)** - Décisions architecturales
- **[📖 Guides](../guides/)** - Documentation utilisateur

---

**Nettoyage effectué dans le cadre de :** Refonte documentation architecture v3.0
**Responsable :** IRIM Team