import React, { useState } from 'react';
import styled from 'styled-components';
import { createHandoff } from '../../../../services/mcpClient';
import sagesData from '../../../../data/sagesConfig.json';

const HandoffContainer = styled.div`
  margin: 15px 0;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.1) 100%);
  border: 1px solid ${props => props.color}44;
  border-left: 4px solid ${props => props.color};
  border-radius: 6px;
  backdrop-filter: blur(4px);

  @media (max-width: 640px) {
    padding: 12px;
    margin: 12px 0;
    border-left-width: 3px;
  }
`;

const HandoffTitle = styled.p`
  margin: 0 0 12px 0;
  font-size: 0.95em;
  font-weight: 600;
  opacity: 0.95;
  color: #f5f5f5;

  @media (max-width: 640px) {
    font-size: 0.9em;
    margin-bottom: 10px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 640px) {
    margin-bottom: 10px;
  }
`;

const Label = styled.label`
  font-size: 0.8em;
  font-weight: 600;
  opacity: 0.85;
  color: #f5f5f5;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  @media (max-width: 640px) {
    font-size: 0.75em;
  }
`;

const Select = styled.select`
  background: ${props => props.color}08;
  border: 1px solid ${props => props.color}55;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.color}99;
    background: ${props => props.color}12;
    box-shadow: 0 0 8px ${props => props.color}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  option {
    background: #1a1a1a;
    color: #fff;
  }

  @media (max-width: 640px) {
    font-size: 0.8em;
    padding: 8px;
  }
`;

const Textarea = styled.textarea`
  background: ${props => props.color}08;
  border: 1px solid ${props => props.color}55;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.85em;
  min-height: 60px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${props => props.color}99;
    background: ${props => props.color}12;
    box-shadow: 0 0 8px ${props => props.color}20;
  }

  &::placeholder {
    opacity: 0.5;
    color: rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 640px) {
    font-size: 0.8em;
    padding: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 6px;
    margin-top: 10px;
  }
`;

const Button = styled.button`
  flex: 1;
  background: ${props => props.variant === 'cancel' ? 'rgba(255,255,255,0.08)' : `${props.color}30`};
  border: 1px solid ${props => props.variant === 'cancel' ? 'rgba(255,255,255,0.15)' : `${props.color}77`};
  color: #fff;
  padding: 10px 14px;
  border-radius: 5px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-family: inherit;

  &:hover:not(:disabled) {
    background: ${props => props.variant === 'cancel' ? 'rgba(255,255,255,0.15)' : `${props.color}55`};
    border-color: ${props => props.variant === 'cancel' ? 'rgba(255,255,255,0.3)' : props.color};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 8px 12px;
    font-size: 0.8em;
  }
`;

const StatusMessage = styled.p`
  margin: 10px 0 0 0;
  padding: 8px 10px;
  font-size: 0.8em;
  opacity: 0.9;
  color: ${props => {
    if (props.type === 'success') return '#4CAF50';
    if (props.type === 'error') return '#FF6B6B';
    return '#fff';
  }};
  background: ${props => {
    if (props.type === 'success') return 'rgba(76, 175, 80, 0.1)';
    if (props.type === 'error') return 'rgba(255, 107, 107, 0.1)';
    return 'transparent';
  }};
  border-left: 2px solid ${props => {
    if (props.type === 'success') return '#4CAF50';
    if (props.type === 'error') return '#FF6B6B';
    return 'transparent';
  }};
  border-radius: 3px;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 0.9;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    font-size: 0.75em;
    padding: 6px 8px;
  }
`;

export const HandoffCreator = ({ emetteurId, emetteurName, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recepteur, setRecepteur] = useState('');
  const [question, setQuestion] = useState('');
  const [contexte, setContexte] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const recepteurs = sagesData.sages.filter(s => s.id !== emetteurId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recepteur) {
      setStatus('error');
      setMessage('Récepteur requis');
      return;
    }

    if (!question.trim()) {
      setStatus('error');
      setMessage('Question requise');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const result = await createHandoff(emetteurId, recepteur, question, contexte);
      setStatus('success');
      setMessage(`✅ Handoff créé: ${result.filename}`);

      // Reset form après 2 secondes
      setTimeout(() => {
        setRecepteur('');
        setQuestion('');
        setContexte('');
        setIsOpen(false);
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(`❌ ${error.message}`);
    }
  };

  if (!isOpen) {
    return (
      <HandoffContainer color={color}>
        <Button
          color={color}
          onClick={() => setIsOpen(true)}
          style={{ width: '100%' }}
        >
          ✉️ Créer Handoff
        </Button>
      </HandoffContainer>
    );
  }

  return (
    <HandoffContainer color={color}>
      <HandoffTitle>✉️ Créer Handoff depuis {emetteurName}</HandoffTitle>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Vers quel Sage?</Label>
          <Select
            color={color}
            value={recepteur}
            onChange={e => setRecepteur(e.target.value)}
            disabled={status === 'loading'}
          >
            <option value="">Sélectionner récepteur...</option>
            {recepteurs.map(sage => (
              <option key={sage.id} value={sage.id}>
                {sage.emoji} {sage.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Sujet / Question</Label>
          <Textarea
            color={color}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Formule clairement ce que tu veux explorer..."
            disabled={status === 'loading'}
          />
        </FormGroup>

        <FormGroup>
          <Label>Contexte (optionnel)</Label>
          <Textarea
            color={color}
            value={contexte}
            onChange={e => setContexte(e.target.value)}
            placeholder="Contexte, observations, sensibilités..."
            disabled={status === 'loading'}
            style={{ minHeight: '50px' }}
          />
        </FormGroup>

        <ButtonGroup>
          <Button
            type="submit"
            color={color}
            disabled={status === 'loading' || !recepteur || !question.trim()}
          >
            {status === 'loading' ? '⏳ Création...' : '✉️ Envoyer'}
          </Button>
          <Button
            type="button"
            color={color}
            variant="cancel"
            onClick={() => {
              setIsOpen(false);
              setRecepteur('');
              setQuestion('');
              setContexte('');
              setStatus('idle');
              setMessage('');
            }}
            disabled={status === 'loading'}
          >
            Annuler
          </Button>
        </ButtonGroup>

        {message && (
          <StatusMessage type={status}>
            {message}
          </StatusMessage>
        )}
      </form>
    </HandoffContainer>
  );
};
