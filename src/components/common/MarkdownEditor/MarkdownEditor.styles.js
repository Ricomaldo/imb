// src/components/common/MarkdownEditor/MarkdownEditor.styles.js

import styled from 'styled-components';

// Helper pour calculer la taille avec zoom

export const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%; /* Respecte le parent */
  background: transparent;
  border: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  box-sizing: border-box; /* Empêche dépassement */

`;

export const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${props => `${props.theme.colors.primary}1A`};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: bold;
`;

export const EditorTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  user-select: none;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing['2xs']};
`;

export const Tab = styled.button`
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${props => props.$active
    ? props.theme.colors.primary
    : props.theme.colors.white
  };
  color: ${props => props.$active
    ? props.theme.colors.white
    : props.theme.colors.text.primary
  };
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.$active
      ? props.theme.colors.primary
      : `${props.theme.colors.primary}33`
    };
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const EditorContent = styled.div`
  padding: 0;
  animation: ${props => props.$animate ? 'fadeIn 0.2s ease-out' : 'none'};
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: ${props => props.$height === '100%' ? '100%' : (props.$height || '120px')};
  min-height: ${props => props.$height === '100%' ? '200px' : 'auto'};
  max-height: 100%; /* Respecte toujours le parent */
  flex: ${props => props.$height === '100%' ? '1' : 'none'};
  border: ${({ theme }) => `${theme.borders.thin} solid ${theme.colors.primary}`};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  resize: ${props => props.$height === '100%' ? 'none' : 'vertical'};
  font-size: ${({ theme, $compact, $zoomLevel = 0 }) => {
    // Base augmentée : sm (16px) en compact, base (18px) en normal
    const baseSize = $compact ? theme.typography.sizes.sm : theme.typography.sizes.base;
    const scale = 1 + ($zoomLevel * 0.20); // 20% par niveau (au lieu de 15%)
    return `calc(${baseSize} * ${scale})`;
  }};
  font-family: ${({ theme }) => theme.typography.families.primary};
  line-height: 1.4;
  padding: 8px;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white} !important;
  text-shadow: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.white} !important;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.secondary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.6;
    font-style: italic;
  }
`;

// Toolbar supprimée complètement