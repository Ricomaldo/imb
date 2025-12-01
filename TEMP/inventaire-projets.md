# 📦 Inventaire des 20 Projets (22 avec services)

## 🎯 Vue d'ensemble
- **Total projets**: 20 (22 avec Affine + n8n)
- **Période**: 18 mois (nov 2023 - mai 2025)
- **Localisation**: ~/Projets + VPS + Wix externes

---

## 🎓 FORMATION (9 projets OpenClassrooms)

### 1. Riding Cities (OC_IW_P2)
```yaml
id: oc-p2-riding-cities
name: Riding Cities
type: website
status: deployed
category: formation
subcategory: cours
technologies: [HTML, CSS]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: landing-page
```

### 2. Booki (OC_IW_P3)
```yaml
id: oc-p3-booki
name: Booki
type: website
status: deployed
category: formation
subcategory: cours
technologies: [HTML, CSS]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: integration
```

### 3. Ohmyfood (OC_IW_P4)
```yaml
id: oc-p4-ohmyfood
name: Ohmyfood
type: website
status: deployed
category: formation
subcategory: cours
technologies: [HTML, CSS, SASS]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: animations
```

### 4. Print-it (OC_IW_P5)
```yaml
id: oc-p5-printit
name: Print-it
type: website
status: deployed
category: formation
subcategory: cours
technologies: [HTML, CSS, JavaScript]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: carousel
```

### 5. Sophie Bluel (OC_IW_P6)
```yaml
id: oc-p6-sophie-bluel
name: Sophie Bluel
type: fullstack
status: deployed
category: formation
subcategory: cours
technologies: [HTML, CSS, JavaScript, Node.js, Express]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: portfolio-backend
deploymentStatus: production
deploymentNotes: API via PM2 (stable 3 mois)
```

### 6. Kasa (OC_IW_P7)
```yaml
id: oc-p7-kasa
name: Kasa
type: webapp
status: deployed
category: formation
subcategory: cours
technologies: [React]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: spa
```

### 7. Nina Carducci (OC_IW_P8)
```yaml
id: oc-p8-nina-carducci
name: Nina Carducci
type: website
status: deployed
category: formation
subcategory: cours
technologies: [HTML, CSS, SEO]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: optimization
```

### 8. 724Events (OC_IW_P9)
```yaml
id: oc-p9-724events
name: 724Events
type: webapp
status: deployed
category: formation
subcategory: cours
technologies: [React]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: debugging
```

### 9. Portfolio Formation
```yaml
id: portfolio-formation
name: Portfolio Formation
type: website
status: deployed
category: formation
subcategory: cours
technologies: [HTML, CSS, JavaScript]
deployUrl: https://portfolio.irimwebforge.com
kanbanColumn: null
projectNature: showcase
deploymentNotes: Héberge les 8 projets OC ci-dessus
```

---

## 💼 PRO - Clients actifs (3)

### 10. Univers des Rêves
```yaml
id: univers-des-reves
name: Univers des Rêves
type: website
status: deployed
category: pro
subcategory: maintenance
technologies: [Wix]
client: Onirologue (premier client)
deployUrl: [URL Wix]
kanbanColumn: pause
projectNature: cms-external
deploymentStatus: production
deploymentNotes: Site Wix, maintenance uniquement
```

### 11. Corps et Sens Thérapie
```yaml
id: corps-et-sens-wix
name: Corps et Sens Thérapie
type: website
status: deployed
category: pro
subcategory: maintenance
technologies: [Wix]
client: Jezabel (épouse)
deployUrl: [URL Wix]
kanbanColumn: pause
projectNature: cms-external
deploymentStatus: production
deploymentNotes: Site Wix actuel, refonte en cours (cs-creation)
```

### 12. Libera Luminesa
```yaml
id: libera-luminesa
name: Libera Luminesa
type: backend
status: deployed
category: pro
subcategory: contrat
technologies: [PHP, Composer]
client: Olfactologue (2e cliente)
deployUrl: https://api.irimwebforge.com
githubRepo: ~/Projets/pro/Libera-Luminesa
kanbanColumn: entete
projectNature: api
deploymentStatus: production
deploymentNotes: API contact handler stable
```

---

## 💼 PRO - Projets actifs (4)

### 13. IrimWebForge Site
```yaml
id: irimwebforge-site
name: IrimWebForge Site
type: website
status: deployed
category: pro
subcategory: outil
technologies: [Next.js, TypeScript, Tailwind, Atomic Design]
deployUrl: https://irimwebforge.com
githubRepo: ~/Projets/pro/irimwebforge-site
kanbanColumn: entete
projectNature: portfolio-vitrine
deploymentStatus: production
deploymentNotes: Release 28/05/2025, Design System Lab intégré
startDate: 2024-11
```

### 14. MoodCycle
```yaml
id: moodcycle
name: MoodCycle
type: fullstack-mobile
status: active
category: pro
subcategory: outil
technologies: [React Native, Node.js, Express, Clean Architecture]
client: Projet propriétaire
githubRepo: ~/Projets/pro/moodcycle
kanbanColumn: entete
projectNature: app-mobile-saas
deploymentStatus: development
environmentUrls:
  admin: https://moodcycle-admin (release 05/07/2025)
  api: Port 4000 (PM2 - 🔴 97 restarts/19h)
  frontend: https://moodcycle.irimwebforge.com
deploymentNotes: API critique, dépendances manquantes
startDate: 2024-06
```

### 15. Corps & Sens Création
```yaml
id: cs-creation
name: Corps & Sens Création
type: website
status: paused
category: pro
subcategory: contrat
technologies: [À définir]
client: Jezabel (épouse)
githubRepo: ~/Projets/pro/cs-creation
kanbanColumn: pause
projectNature: refonte-wix
deploymentStatus: development
deploymentNotes: Refonte site artiste, bien commencé mais en pause
startDate: 2024-08
```

### 16. DemoForge
```yaml
id: demoforge
name: DemoForge
type: platform
status: concept
category: pro
subcategory: speculatif
technologies: [À définir]
githubRepo: ~/Projets/pro/demoforge
kanbanColumn: inbox
projectNature: demo-platform
deploymentStatus: local
deploymentNotes: Plateforme demo sites commerçants, opérationnelle mais non déployée
```

---

## 🔧 PERSO - Outils (3)

### 17. IRIMMetaBrain
```yaml
id: irimmetabrain
name: IRIMMetaBrain (IMB)
type: tool
status: deployed
category: perso
subcategory: outil
technologies: [React, Zustand]
githubRepo: ~/Projets/perso/IRIMMetaBrain
kanbanColumn: entete
projectNature: productivity
deploymentStatus: local
deploymentNotes: Gestionnaire de projet / Second cerveau, App web desktop + PWA mobile
```

### 18. Pepettes-Zub (Atlas Financial)
```yaml
id: pepettes-zub
name: Pepettes-Zub
type: tool
status: deployed
category: perso
subcategory: outil
technologies: [Node.js, Express, TypeScript]
githubRepo: ~/Projets/perso/atlas-financial/pepettesZub
deployUrl: https://pepettes-zub.irimwebforge.com
kanbanColumn: entete
projectNature: finance-tracker
deploymentStatus: production
environmentUrls:
  production: https://pepettes-zub.irimwebforge.com
deploymentNotes: App métier, ⚠️ 23 restarts/3 mois (MemoryStore issue), Port 3100, Release 18/08/2025
```

### 19. ResetPulse
```yaml
id: resetpulse
name: ResetPulse
type: tool
status: deployed
category: perso
subcategory: outil
technologies: [HTML, CSS, JavaScript]
githubRepo: ~/Projets/apps/ResetPulse
deployUrl: https://resetpulse.irimwebforge.com
kanbanColumn: entete
projectNature: timer-utility
deploymentStatus: production
deploymentNotes: Timer visuel personnalisable, stable
```

---

## 🌟 PERSO - Projets personnels (1)

### 20. Echo des Rêves
```yaml
id: echo-des-reves
name: Echo des Rêves
type: pwa
status: concept
category: perso
subcategory: apprentissage
technologies: [PWA, JavaScript]
githubRepo: ~/Projets/formation/PERSO_Echo-des-Reves
kanbanColumn: inbox
projectNature: goal-tracker
deploymentStatus: local
deploymentNotes: Premier projet perso, PWA suivi objectifs personnels
```

---

## 🔧 SERVICES (Bonus - non comptés dans les 20)

### Affine (Notion-like)
```yaml
id: affine
name: Affine
type: service
status: paused
category: perso
subcategory: outil
technologies: [Docker, PostgreSQL, Redis]
deployUrl: https://affine.irimwebforge.com
kanbanColumn: pause
projectNature: productivity-service
deploymentStatus: production
deploymentNotes: Utilisé 1 mois puis arrêté, conteneurs stables 6 mois, Port 3010 🔴 exposé publiquement
```

### n8n (Automatisation)
```yaml
id: n8n
name: n8n
type: service
status: concept
category: perso
subcategory: outil
technologies: [Docker, Node.js]
deployUrl: https://n8n.irimwebforge.com
kanbanColumn: inbox
projectNature: automation-service
deploymentStatus: production
deploymentNotes: Peu utilisé actuellement, objectif futur maîtrise, Port 8888 localhost only ✅, 3 semaines uptime
```

---

## 📊 Statistiques

### Par catégorie
- **Formation**: 9 projets (8 OC + 1 portfolio showcase)
- **PRO clients**: 3 projets (2 Wix maintenance + 1 API)
- **PRO actifs**: 4 projets (site vitrine + 2 apps + 1 refonte + 1 démo)
- **PERSO outils**: 3 projets (IMB + Pepettes + ResetPulse)
- **PERSO projets**: 1 projet (Echo des Rêves)
- **Services bonus**: 2 (Affine + n8n)

### Par statut
- **deployed**: 14 projets
- **active**: 1 (MoodCycle)
- **paused**: 2 (Corps & Sens Création, Affine)
- **concept**: 3 (DemoForge, Echo des Rêves, n8n en attente usage)

### Par déploiement
- **Production VPS**: 7 (IWF, MoodCycle, Pepettes, ResetPulse, Libera, Sophie Bluel API, Affine, n8n)
- **Production externe**: 2 (Wix: Univers Rêves, Corps & Sens)
- **Portfolio OC**: 8 projets
- **Local only**: 3 (IMB, DemoForge, Echo des Rêves)

### Par techno dominante
- **React/Node.js**: 6 (MoodCycle, Pepettes, IMB, Kasa, 724Events, n8n)
- **Next.js**: 1 (IrimWebForge)
- **HTML/CSS/JS**: 7 (Formation OC + ResetPulse)
- **PHP**: 1 (Libera Luminesa)
- **Wix**: 2 (Clients maintenance)
- **PWA**: 1 (Echo des Rêves)
- **Docker**: 2 (Affine, n8n)

### État de santé
- ✅ **Stables**: 15 projets
- ⚠️ **Instables**: 2 (MoodCycle API 97 restarts/19h, Pepettes 23 restarts/3 mois)
- 🔴 **Critiques**: 1 (MoodCycle API)
- ⏸️ **En pause**: 3 (Corps & Sens Création, Affine, n8n sous-utilisé)

---

## 🎯 Priorisation suggérée

### Phase 1 : PRO clients + critiques
1. **MoodCycle** (corriger API critique)
2. **Pepettes-Zub** (stabiliser MemoryStore)
3. **Libera Luminesa** (maintenance)
4. **IrimWebForge** (optimisation images)

### Phase 2 : PRO développement
1. **Corps & Sens Création** (reprendre refonte)
2. **DemoForge** (décider déploiement ou archivage)
3. **Univers des Rêves** (maintenance Wix)

### Phase 3 : Documentation & Outils perso
1. **IRIMMetaBrain** (documenter architecture)
2. **ResetPulse** (maintenance si besoin)
3. **Echo des Rêves** (valider concept ou archiver)
4. **Formation OC** (archivage propre)

### Phase 4 : Services
1. **Affine** (décider maintien ou arrêt)
2. **n8n** (formation + premiers workflows)

---

## 💡 Insights

### Patterns identifiés
- **Stack préféré**: React + Node.js + TypeScript
- **Hébergement**: VPS personnel bien utilisé (7 projets actifs)
- **Formation**: Solide (9 projets complétés)
- **Clients**: Diversifiés (thérapie, olfactologie, onirologue)

### Points d'attention
- 2 projets avec instabilité technique (MoodCycle, Pepettes)
- 3 projets en pause à clarifier (statut futur)
- Services sous-utilisés (Affine arrêté, n8n peu exploité)

### Opportunités
- DemoForge = potentiel commercial non exploité
- IMB = outil perso puissant à valoriser
- n8n = automatisations à développer (gain temps)