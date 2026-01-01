// src/components/tower/TowerViewer/TowerViewer.styles.js

import styled from 'styled-components';
import { woodBg } from '../../../styles/mixins';

export const ViewerContainer = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%; /* Force la contrainte de hauteur */
  ${woodBg}
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => `${theme.borders.base} solid ${theme.colors.border}`};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  text-align: left;
  box-sizing: border-box;
  overflow: hidden; /* Empêche le débordement */
`;

export const NoteHeader = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  border-bottom: ${({ expanded, theme }) => expanded ? `${theme.borders.base} solid ${theme.colors.border}` : 'none'};
  user-select: none;
  background: ${({ theme }) => `${theme.colors.primary}1A`}; /* 10% opacity */
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}33`}; /* 20% opacity */
  }
`;

export const NoteContent = styled.div`
  padding: 12px;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const NoteTextarea = styled.textarea`
  width: 100%;
  height: 120px;
  border: 1px solid rgba(139, 69, 19, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  resize: none;
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.families.primary};
  line-height: 1.4;
  padding: 8px;
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.border};
    background: rgba(255, 255, 255, 0.95);
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.6;
    font-style: italic;
  }
`;