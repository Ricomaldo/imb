// src/components/room-modules/forge/DeploymentNotes.jsx

import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import MarkdownEditor from '../../common/MarkdownEditor/MarkdownEditor';
import useProjectMetaStore from '../../../stores/useProjectMetaStore';

const NotesContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.uiKitBlue.dark};
  color: white;
  border-radius: ${({ theme }) => theme.radii.sm};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProjectSelector = styled.select`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }

  option {
    background: ${({ theme }) => theme.colors.uiKitBlue.dark};
    color: white;
  }
`;

const EditorWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const InfoBanner = styled.div`
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};

  h4 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 8px;
  }

  p {
    margin: 4px 0;
    font-size: ${({ theme }) => theme.typography.sizes.sm};
  }
`;

/**
 * Widget pour gérer les notes de déploiement d'un projet
 * Permet d'éditer en markdown les informations de déploiement, CI/CD, etc.
 */
const DeploymentNotes = () => {
  const { projects, selectedProject, updateProjectMeta, selectProject } = useProjectMetaStore();
  const [localNotes, setLocalNotes] = useState('');
  const saveTimeoutRef = useRef(null);

  const project = projects[selectedProject];

  // Debounce manuel pour la sauvegarde
  const debouncedSave = useCallback((projectId, notes) => {
    // Annuler le timeout précédent s'il existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Créer un nouveau timeout
    saveTimeoutRef.current = setTimeout(() => {
      updateProjectMeta(projectId, { deploymentNotes: notes });
    }, 1000);
  }, [updateProjectMeta]);

  const handleNotesChange = (value) => {
    setLocalNotes(value);
    if (selectedProject) {
      debouncedSave(selectedProject, value);
    }
  };

  const handleProjectChange = (e) => {
    selectProject(e.target.value);
  };

  // Initialiser les notes locales quand le projet change
  React.useEffect(() => {
    if (project) {
      setLocalNotes(project.deploymentNotes || getDefaultNotes(project));
    }
  }, [selectedProject, project]);

  // Nettoyer le timeout au démontage
  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const getDefaultNotes = (proj) => {
    if (!proj) return '';

    return `# Notes de Déploiement - ${proj.name}

## 🚀 Configuration Déploiement

### Environnements
${proj.environmentUrls?.production ? `- **Production**: ${proj.environmentUrls.production}` : '- Production: _Non configuré_'}
${proj.environmentUrls?.staging ? `- **Staging**: ${proj.environmentUrls.staging}` : '- Staging: _Non configuré_'}
${proj.environmentUrls?.local ? `- **Local**: ${proj.environmentUrls.local}` : '- Local: _Non configuré_'}

### Stack Technique
${proj.frameworkVersion ? `\`\`\`
${proj.frameworkVersion}
\`\`\`` : '_Versions des frameworks non spécifiées_'}

### Repository
${proj.githubRepo ? `[GitHub: ${proj.githubRepo}](https://github.com/${proj.githubRepo})` : '_Repository non configuré_'}

---

## 📝 Notes CI/CD

### Pipeline de déploiement
_Décrire le processus de build et déploiement_

### Variables d'environnement
\`\`\`env
# Exemple:
# NODE_ENV=production
# API_URL=https://api.example.com
\`\`\`

### Commandes importantes
\`\`\`bash
# Build
npm run build

# Deploy
npm run deploy

# Tests
npm test
\`\`\`

---

## ⚠️ Points d'attention

-
-

---

## 📊 Monitoring

- Logs: _Où consulter les logs_
- Métriques: _Dashboard de monitoring_
- Alertes: _Configuration des alertes_

---

_Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}_`;
  };

  const projectList = Object.values(projects).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  if (!project) {
    return (
      <NotesContainer>
        <EmptyState>
          <h4>🚀 Notes de Déploiement</h4>
          <p>Aucun projet sélectionné</p>
          <p>Sélectionnez un projet pour gérer ses notes de déploiement</p>
        </EmptyState>
      </NotesContainer>
    );
  }

  return (
    <NotesContainer>
      <Header>
        <Title>
          🚀 Déploiement
        </Title>
        <ProjectSelector value={selectedProject} onChange={handleProjectChange}>
          {projectList.map(proj => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </ProjectSelector>
      </Header>

      {project.deployUrl || project.githubRepo ? (
        <InfoBanner>
          {project.deployUrl && (
            <div>
              <strong>Prod:</strong> <a href={project.deployUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                {project.deployUrl}
              </a>
            </div>
          )}
          {project.githubRepo && (
            <div>
              <strong>Repo:</strong> <a href={`https://github.com/${project.githubRepo}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                {project.githubRepo}
              </a>
            </div>
          )}
        </InfoBanner>
      ) : null}

      <EditorWrapper>
        <MarkdownEditor
          value={localNotes}
          onChange={handleNotesChange}
          placeholder="Notes de déploiement, CI/CD, variables d'environnement..."
          debounceDelay={0} // On gère le debounce nous-mêmes
        />
      </EditorWrapper>
    </NotesContainer>
  );
};

export default DeploymentNotes;