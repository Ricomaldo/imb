// src/components/modals/ProjectOverviewModal/ProjectForm.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { alpha } from '../../../styles/color';

const FormContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 2px 8px ${({ theme }) => alpha(theme.colors.black, 0.1)};
`;

const FormTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 500;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.5)};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => alpha(theme.colors.primary, 0.1)};
  }

  &:disabled {
    background: ${({ theme }) => alpha(theme.colors.backgroundLight, 0.5)};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => alpha(theme.colors.border, 0.5)};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => alpha(theme.colors.primary, 0.1)};
  }
`;

const TechTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const TechTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => alpha(theme.colors.primary, 0.1)};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const TechInput = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};

  input {
    flex: 1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.primary {
    background: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${({ theme }) => alpha(theme.colors.primary, 0.3)};
    }
  }

  &.secondary {
    background: ${({ theme }) => alpha(theme.colors.textSecondary, 0.1)};
    color: ${({ theme }) => theme.colors.text};

    &:hover {
      background: ${({ theme }) => alpha(theme.colors.textSecondary, 0.2)};
    }
  }

  &.danger {
    background: ${({ theme }) => theme.colors.danger};
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${({ theme }) => alpha(theme.colors.danger, 0.3)};
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ProjectForm = ({ project, categories, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'tool',
    status: 'concept',
    category: '',
    subcategory: '',
    contractType: null,
    deploymentStatus: 'local',
    projectNature: 'speculatif',
    kanbanColumn: 'inbox',
    technologies: [],
    client: '',
    startDate: '',
    endDate: '',
    // Nouveaux champs
    deployUrl: '',
    githubRepo: '',
    frameworkVersion: '',
    deploymentNotes: '',
    environmentUrls: {
      staging: '',
      production: '',
      local: ''
    }
  });

  const [newTech, setNewTech] = useState('');
  const [errors, setErrors] = useState({});
  const isEditMode = !!project;

  // Technologies prédéfinies
  const commonTechnologies = [
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
    'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS',
    'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust'
  ];

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id || '',
        name: project.name || '',
        type: project.type || 'tool',
        status: project.status || 'concept',
        category: project.category || '',
        subcategory: project.subcategory || '',
        contractType: project.contractType || null,
        deploymentStatus: project.deploymentStatus || 'local',
        projectNature: project.projectNature || 'speculatif',
        kanbanColumn: project.kanbanColumn || 'inbox',
        technologies: project.technologies || [],
        client: project.client || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        // Nouveaux champs
        deployUrl: project.deployUrl || '',
        githubRepo: project.githubRepo || '',
        frameworkVersion: project.frameworkVersion || '',
        deploymentNotes: project.deploymentNotes || '',
        environmentUrls: project.environmentUrls || {
          staging: '',
          production: '',
          local: ''
        }
      });
    }
  }, [project]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      handleChange('technologies', [...formData.technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech) => {
    handleChange('technologies', formData.technologies.filter(t => t !== tech));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!isEditMode && !formData.id.trim()) {
      newErrors.id = 'L\'identifiant du projet est requis';
    } else if (!isEditMode && !/^[a-z0-9-_]+$/.test(formData.id)) {
      newErrors.id = 'L\'identifiant doit contenir uniquement des lettres minuscules, chiffres, tirets et underscores';
    }

    if (formData.contractType && !formData.client) {
      newErrors.client = 'Le nom du client est requis pour un projet sous contrat';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <FormContainer>
      <FormTitle>
        {isEditMode ? `Éditer : ${project.name}` : 'Nouveau Projet'}
      </FormTitle>

      <FormGrid>
        <FormGroup>
          <Label>Identifiant*</Label>
          <Input
            type="text"
            value={formData.id}
            onChange={(e) => handleChange('id', e.target.value)}
            placeholder="mon-projet"
            disabled={isEditMode}
          />
          {errors.id && <ErrorMessage>{errors.id}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Nom du projet*</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Mon Projet"
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Type</Label>
          <Select value={formData.type} onChange={(e) => handleChange('type', e.target.value)}>
            <option value="tool">Outil</option>
            <option value="app">Application</option>
            <option value="website">Site Web</option>
            <option value="api">API</option>
            <option value="library">Librairie</option>
            <option value="other">Autre</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Statut</Label>
          <Select value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="concept">Concept</option>
            <option value="dev_actif">Développement Actif</option>
            <option value="maintenance">Maintenance</option>
            <option value="pause">En Pause</option>
            <option value="archive">Archivé</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Catégorie*</Label>
          <Select value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </Select>
          {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Sous-catégorie</Label>
          <Select value={formData.subcategory} onChange={(e) => handleChange('subcategory', e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {categories[formData.category]?.subcategories?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Type de contrat</Label>
          <Select value={formData.contractType || ''} onChange={(e) => handleChange('contractType', e.target.value || null)}>
            <option value="">Aucun</option>
            <option value="conception">Conception</option>
            <option value="maintenance">Maintenance</option>
            <option value="consultation">Consultation</option>
            <option value="forfait">Forfait</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Statut de déploiement</Label>
          <Select value={formData.deploymentStatus} onChange={(e) => handleChange('deploymentStatus', e.target.value)}>
            <option value="local">Local</option>
            <option value="dev">Développement</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Nature du projet</Label>
          <Select value={formData.projectNature} onChange={(e) => handleChange('projectNature', e.target.value)}>
            <option value="speculatif">Spéculatif</option>
            <option value="demo">Démo</option>
            <option value="outil_perso">Outil Personnel</option>
            <option value="exercice">Exercice</option>
            <option value="commercial">Commercial</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Position Kanban</Label>
          <Select
            value={formData.kanbanColumn}
            onChange={(e) => handleChange('kanbanColumn', e.target.value)}
            disabled={formData.category === 'formation'}
          >
            <option value="inbox">📥 Réserve</option>
            <option value="entete">🎯 En Tête (max 5)</option>
            <option value="actif">⚡ Actif</option>
            <option value="pause">⏸️ Pause</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Client</Label>
          <Input
            type="text"
            value={formData.client}
            onChange={(e) => handleChange('client', e.target.value)}
            placeholder="Nom du client"
          />
          {errors.client && <ErrorMessage>{errors.client}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Date de début</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Date de fin</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
          {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
        </FormGroup>

        <FormGroup className="full-width">
          <Label>Technologies</Label>
          <TechInput>
            <Input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Ajouter une technologie..."
              list="tech-suggestions"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
            />
            <datalist id="tech-suggestions">
              {commonTechnologies.map(tech => (
                <option key={tech} value={tech} />
              ))}
            </datalist>
            <Button type="button" className="primary" onClick={handleAddTech}>
              Ajouter
            </Button>
          </TechInput>
          <TechTagsContainer>
            {formData.technologies.map(tech => (
              <TechTag key={tech}>
                {tech}
                <button onClick={() => handleRemoveTech(tech)}>×</button>
              </TechTag>
            ))}
          </TechTagsContainer>
        </FormGroup>

        {/* Nouveaux champs */}
        <FormGroup>
          <Label>URL de déploiement</Label>
          <Input
            type="url"
            value={formData.deployUrl}
            onChange={(e) => handleChange('deployUrl', e.target.value)}
            placeholder="https://example.com"
          />
        </FormGroup>

        <FormGroup>
          <Label>Dépôt GitHub</Label>
          <Input
            type="text"
            value={formData.githubRepo}
            onChange={(e) => handleChange('githubRepo', e.target.value)}
            placeholder="username/repository"
          />
        </FormGroup>

        <FormGroup className="full-width">
          <Label>Versions des frameworks</Label>
          <Input
            type="text"
            value={formData.frameworkVersion}
            onChange={(e) => handleChange('frameworkVersion', e.target.value)}
            placeholder="React 18.2, Node 20.11, PostgreSQL 15"
          />
        </FormGroup>

        <FormGroup className="full-width">
          <Label>URLs des environnements</Label>
          <div style={{ display: 'grid', gap: '8px' }}>
            <Input
              type="url"
              value={formData.environmentUrls.local}
              onChange={(e) => handleChange('environmentUrls', { ...formData.environmentUrls, local: e.target.value })}
              placeholder="Local: http://localhost:3000"
            />
            <Input
              type="url"
              value={formData.environmentUrls.staging}
              onChange={(e) => handleChange('environmentUrls', { ...formData.environmentUrls, staging: e.target.value })}
              placeholder="Staging: https://staging.example.com"
            />
            <Input
              type="url"
              value={formData.environmentUrls.production}
              onChange={(e) => handleChange('environmentUrls', { ...formData.environmentUrls, production: e.target.value })}
              placeholder="Production: https://example.com"
            />
          </div>
        </FormGroup>

        <FormGroup className="full-width">
          <Label>Notes de déploiement</Label>
          <Input
            type="text"
            value={formData.deploymentNotes}
            onChange={(e) => handleChange('deploymentNotes', e.target.value)}
            placeholder="Informations sur le déploiement, serveurs, CI/CD..."
          />
        </FormGroup>
      </FormGrid>

      <ButtonGroup>
        {isEditMode && (
          <Button
            type="button"
            className="danger"
            onClick={() => {
              if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${formData.name}" ?`)) {
                onDelete(formData.id);
              }
            }}
          >
            Supprimer
          </Button>
        )}
        <Button type="button" className="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" className="primary" onClick={handleSubmit}>
          {isEditMode ? 'Enregistrer' : 'Créer'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default ProjectForm;