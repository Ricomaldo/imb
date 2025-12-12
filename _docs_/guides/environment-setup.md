---
type: guide
updated: 2025-10-01
version: 1.0
---

# ⚙️ Guide de Configuration Environnement - IRIMMetaBrain

> Setup complet des variables d'environnement pour toutes les fonctionnalités

**Dernière mise à jour :** 1er octobre 2025
**Version :** 1.0.0

## 🎯 Vue d'ensemble

IRIMMetaBrain utilise des variables d'environnement pour configurer :
- **Synchronisation GitHub Gist** (export/import données)
- **Sécurité d'accès** (login symbolique)
- **Futures fonctionnalités** (auto-sync, etc.)

## 🚀 Setup Rapide (2 minutes)

### 1. Créer le fichier `.env.local`

À la racine du projet, créer `.env.local` :

```bash
# ===================================================================
# 🔐 CONFIGURATION IRIMET ABRAIN - Variables d'Environnement
# ===================================================================
# IMPORTANT: Ce fichier ne doit JAMAIS être committé!
# Copier depuis .env.example et adapter avec vos vraies valeurs
# ===================================================================

# ===== SYNCHRONISATION GITHUB GIST =====
# Token d'accès personnel GitHub (scope "gist" requis)
# Obtenir sur: https://github.com/settings/tokens
VITE_GITHUB_TOKEN=ghp_votre_token_github_ici

# Mot de passe pour chiffrement AES-256 des données
# Minimum 8 caractères, complexe recommandé
# IMPORTANT: Utilisez le MÊME mot de passe sur tous vos appareils!
VITE_SYNC_PASSWORD=VotreMotDePasseComplexe123!

# ID du Gist pour sync multi-device (optionnel)
# Sera créé automatiquement au premier export si absent
# Format: chaîne alphanumérique GitHub
VITE_SYNC_GIST_ID=

# ===== SÉCURITÉ D'ACCÈS =====
# Mot de passe pour accéder à l'application (sécurité symbolique)
# Fallback par défaut: "metabrain2024" si non défini
VITE_ACCESS_PASSWORD=votre_mot_de_passe_app

# ===== FONCTIONNALITÉS FUTURES =====
# Auto-sync activé (true/false) - FUTUR
VITE_AUTO_SYNC_ENABLED=false

# Intervalle auto-sync en minutes (défaut: 10) - FUTUR
VITE_AUTO_SYNC_INTERVAL=10
```

### 2. Redémarrer le serveur de développement

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

**Pourquoi ?** Vite charge les variables d'environnement uniquement au démarrage.

### 3. Vérifier la configuration

1. Ouvrir l'application
2. Cliquer **🔄** dans ControlTower → **Synchronisation**
3. **✅ Si configuré** : 2 boutons actifs (EXPORT/IMPORT)
4. **❌ Si manquant** : Message d'erreur spécifique

## 🔑 Obtenir un Token GitHub

### Étapes détaillées

1. **Se connecter à GitHub** → [github.com](https://github.com)

2. **Settings** → **Developer settings**
   ```
   Profile → Settings → Developer settings (en bas à gauche)
   ```

3. **Personal access tokens** → **Tokens (classic)**
   ```
   Personal access tokens → Tokens (classic) → Generate new token (classic)
   ```

4. **Configuration du token**
   ```
   Note: "IRIM MetaBrain Sync" (ou autre nom descriptif)
   Expiration: 90 days (recommandé)
   Scopes: ☑️ gist (Create gists)
   ```

5. **Générer et copier**
   ```
   Generate token → Copier le token (commence par ghp_)
   ⚠️ ATTENTION: Il ne sera affiché qu'une seule fois!
   ```

6. **Coller dans `.env.local`**
   ```bash
   VITE_GITHUB_TOKEN=ghp_VOTRE_TOKEN_COPIE_ICI
   ```

### Gestion des tokens

#### Rotation des tokens (tous les 90 jours)
1. Générer un nouveau token (même procédure)
2. Remplacer `VITE_GITHUB_TOKEN` dans `.env.local`
3. Redémarrer serveur dev
4. Sync fonctionne immédiatement

#### Révocation d'urgence
Si token compromis :
1. **GitHub** → Settings → Developer settings → Tokens
2. Cliquer **Delete** sur le token compromis
3. Générer nouveau token
4. Mettre à jour `.env.local`

## 🔒 Choisir un Mot de Passe de Chiffrement

### Bonnes pratiques

```bash
# ❌ FAIBLE
VITE_SYNC_PASSWORD=123456
VITE_SYNC_PASSWORD=password
VITE_SYNC_PASSWORD=irimmetabrain

# ✅ FORT (recommandé)
VITE_SYNC_PASSWORD=R3m!_M3t@Br@1n_2024!
VITE_SYNC_PASSWORD=My$uper$ecureP@ssw0rd789
VITE_SYNC_PASSWORD=IRM-Sync-Complex-2024-Key!
```

### Critères de sécurité
- **Minimum** : 8 caractères
- **Recommandé** : 12+ caractères
- **Complexité** : Majuscules + minuscules + chiffres + symboles
- **Unique** : Différent de vos autres mots de passe

### Multi-device CRITIQUE
⚠️ **MÊME MOT DE PASSE** sur tous vos appareils !

```
Appareil A: VITE_SYNC_PASSWORD=MonPassword123!
Appareil B: VITE_SYNC_PASSWORD=MonPassword123!  ← IDENTIQUE
Appareil C: VITE_SYNC_PASSWORD=MonPassword123!  ← IDENTIQUE
```

## 🛡️ Sécurité et Bonnes Pratiques

### Protection du fichier `.env.local`

#### Vérifier .gitignore
```bash
# Le fichier .gitignore DOIT contenir:
.env.local
.env*.local
```

#### Vérifier non-commité
```bash
# Vérifier que .env.local n'est pas tracké
git status
# Ne doit PAS apparaître dans les fichiers à committer
```

#### Backup sécurisé
```bash
# Option 1: Gestionnaire de mots de passe
# Sauvegarder les variables dans votre gestionnaire (Bitwarden, 1Password, etc.)

# Option 2: Fichier chiffré séparé (avancé)
# Créer backup chiffré du .env.local dans un dossier sécurisé
```

### Partage avec équipe

#### ❌ JAMAIS faire
- Envoyer `.env.local` par email/Slack/Teams
- Committer le fichier avec des vraies valeurs
- Partager tokens/passwords en clair

#### ✅ Méthodes sécurisées
```bash
# 1. Template public (.env.example)
# Créer .env.example avec des valeurs d'exemple
VITE_GITHUB_TOKEN=ghp_your_token_here
VITE_SYNC_PASSWORD=your_complex_password

# 2. Documentation setup
# Guider les développeurs vers ce guide

# 3. Outils secrets (production)
# Utiliser variables d'environnement serveur ou outils comme Vercel Env
```

## 🔧 Dépannage et Debug

### Messages d'erreur courants

#### "❌ Configuration manquante: Vérifiez VITE_GITHUB_TOKEN et VITE_SYNC_PASSWORD"

**Cause possible :**
- Variables manquantes dans `.env.local`
- Serveur dev pas redémarré après modification
- Erreur de syntaxe dans `.env.local`

**Solutions :**
```bash
# 1. Vérifier existence du fichier
ls -la .env.local

# 2. Vérifier contenu (sans afficher valeurs sensibles)
grep VITE_ .env.local

# 3. Redémarrer serveur dev
npm run dev
```

#### "❌ GitHub API error: 401 - Unauthorized"

**Cause :** Token invalide ou expiré

**Solutions :**
```bash
# Tester token manuellement
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/user
# Doit retourner vos infos GitHub, sinon token invalide
```

#### Variables non chargées

**Diagnostic :**
```javascript
// Console navigateur (dev uniquement)
console.log('Token présent:', !!import.meta.env.VITE_GITHUB_TOKEN)
console.log('Password présent:', !!import.meta.env.VITE_SYNC_PASSWORD)
```

**Solutions :**
1. Vérifier syntaxe `.env.local` (pas d'espaces autour du =)
2. Vérifier noms des variables (préfixe VITE_ obligatoire)
3. Redémarrer serveur dev

### Debug localStorage

```javascript
// Console navigateur - voir toutes les données stockées
Object.keys(localStorage).forEach(key => {
  const size = (localStorage.getItem(key)?.length || 0) / 1024
  console.log(`${key}: ${size.toFixed(1)} KB`)
})
```

### Reset complet

```javascript
// Console navigateur - ATTENTION: Supprime TOUTES les données!
localStorage.clear()
window.location.reload()
```

## 📱 Configuration Production/Déploiement

### Vercel
```bash
# Via CLI
vercel env add VITE_GITHUB_TOKEN
vercel env add VITE_SYNC_PASSWORD
vercel env add VITE_ACCESS_PASSWORD

# Via Dashboard
# Vercel Dashboard → Project → Settings → Environment Variables
```

### Netlify
```bash
# Via Dashboard
# Netlify Dashboard → Site → Settings → Environment Variables
```

### Variables requises en production
```bash
# Minimum pour fonctionnement complet
VITE_GITHUB_TOKEN=ghp_production_token
VITE_SYNC_PASSWORD=production_password
VITE_ACCESS_PASSWORD=production_app_password

# Optionnelles
VITE_SYNC_GIST_ID=existing_gist_id_for_prod
```

## 🚀 Template .env.local Complet

Copier-coller et adapter :

```bash
# ===================================================================
# 🔐 IRIM METABRAIN - Configuration Environnement
# ===================================================================
# ⚠️  FICHIER PRIVÉ - NE JAMAIS COMMITTER!
# 📝 Copié depuis docs/guides/environment-setup.md
# 📅 Configuré le: $(date)
# ===================================================================

# ===== SYNCHRONISATION GITHUB GIST =====
# Token GitHub avec scope "gist"
# Obtenir: https://github.com/settings/tokens
VITE_GITHUB_TOKEN=ghp_

# Mot de passe chiffrement (IDENTIQUE sur tous appareils!)
# Min 8 caractères, complexe recommandé
VITE_SYNC_PASSWORD=

# ID Gist (optionnel - créé automatiquement sinon)
VITE_SYNC_GIST_ID=

# ===== SÉCURITÉ APPLICATION =====
# Mot de passe accès app (défaut: metabrain2024)
VITE_ACCESS_PASSWORD=

# ===== FONCTIONNALITÉS EXPÉRIMENTALES =====
# Auto-sync (pas encore implémenté)
VITE_AUTO_SYNC_ENABLED=false
VITE_AUTO_SYNC_INTERVAL=10

# ===================================================================
# 🔗 LIENS UTILES
# ===================================================================
# • Documentation sync: docs/guides/sync-system.md
# • Architecture stores: docs/architecture/stores-architecture.md
# • Dépannage: docs/guides/environment-setup.md#depannage
# ===================================================================
```

## 📚 Liens Connexes

- **[🔄 Système de Synchronisation](sync-system.md)** - Guide utilisation sync
- **[🏗️ Architecture Stores](../architecture/stores-architecture.md)** - Détails techniques
- **[🛡️ Système de Sécurité](../architecture/security-system.md)** - Documentation sécurité

---

**Statut :** ✅ Production Ready
**Mainteneurs :** IRIM Team
**Support :** Voir section Dépannage ci-dessus