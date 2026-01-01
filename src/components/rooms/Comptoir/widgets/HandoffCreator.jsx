import React, { useState } from 'react';
import styled from 'styled-components';
import { createHandoff } from '../../../../services/mcpClient';
import sagesData from '../../../../data/sagesConfig.json';

const HandoffContainer = styled.div`
  margin: 15px 0;
  padding: 15px;
  border-left: 3px solid ${props => props.color};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const HandoffTitle = styled.p`
  margin: 0 0 10px 0;
  font-size: 0.9em;
  font-weight: 600;
  opacity: 0.9;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.8em;
  font-weight: 600;
  opacity: 0.8;
`;

const Select = styled.select`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.color}33;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.85em;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.color}66;
  }

  option {
    background: #1a1a1a;
    color: #fff;
  }
`;

const Textarea = styled.textarea`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.color}33;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.85em;
  min-height: 60px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.color}66;
  }

  &::placeholder {
    opacity: 0.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  background: ${props => props.variant === 'cancel' ? 'rgba(255,255,255,0.1)' : props.color};
  border: 1px solid ${props => props.variant === 'cancel' ? 'rgba(255,255,255,0.2)' : props.color};
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'cancel' ? 'rgba(255,255,255,0.15)' : props.color}dd;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.p`
  margin: 8px 0 0 0;
  font-size: 0.8em;
  opacity: 0.8;
  color: ${props => {
    if (props.type === 'success') return '#4CAF50';
    if (props.type === 'error') return '#FF6B6B';
    return '#fff';
  }};
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
