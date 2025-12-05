// src/components/common/MarkdownEditor/MarkdownPreview/MarkdownPreview.styles.js

import styled from 'styled-components';

// Helper pour calculer la taille avec zoom

export const PreviewContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['compact', 'zoomLevel', 'accentColor', 'height', '$height'].includes(prop)
})`
  width: 100%;
  /* Hauteur dynamique: 100% => prend tout l'espace disponible, sinon valeur fixe */
  height: ${props => (props.$height && props.$height !== '100%') ? props.$height : 'auto'};
  flex: ${props => (props.$height === '100%') ? 1 : 'none'};
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;

  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  /* Font-size de base avec zoom - tous les enfants vont hériter */
  font-size: ${({ theme, compact, zoomLevel = 0 }) => {
    // Base augmentée : sm (16px) en compact, base (18px) en normal
    const baseSize = compact ? theme.typography.sizes.sm : theme.typography.sizes.base;
    const scale = 1 + (zoomLevel * 0.20); // 20% par niveau (au lieu de 15%)
    return `calc(${baseSize} * ${scale})`;
  }};
  font-family: ${({ theme }) => theme.typography.families.primary};
  font-weight: normal; /* S'assurer que le texte standard n'est pas en gras */
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.black};
  text-shadow: none;

  /* Styles Markdown */
  h1, h2, h3, h4, h5, h6 {
    margin: 8px 0 4px 0;
    font-weight: bold;
    color: ${props => props.accentColor || props.theme.colors.black};
    text-shadow: none;
  }

  h1 { font-size: 1.5em; }  /* 150% du base */
  h2 { font-size: 1.33em; } /* 133% du base */
  h3 { font-size: 1.17em; } /* 117% du base */
  h4, h5, h6 { font-size: 1em; } /* 100% du base */

  p {
    margin: 4px 0;
  }

  strong {
    font-weight: bold;
    color: ${props => props.accentColor || props.theme.colors.black};
    text-shadow: none;
    font-size: inherit; /* Hérite du parent (p, li, etc.) */
  }

  em {
    font-style: italic;
    color: ${({ theme }) => theme.colors.gray};
    text-shadow: none;
  }

  ul, ol {
    margin: 4px 0;
    padding-left: 20px;
  }

  li {
    margin: 2px 0;
  }

  code {
    background: ${({ theme }) => theme.colors.beige};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 3px;
    padding: 1px 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.85em; /* 85% du base */
  }

  pre {
    background: ${({ theme }) => theme.colors.beige};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    padding: ${({ theme }) => theme.spacing.sm};
    margin: 8px 0;
    overflow-x: auto;

    code {
      background: none;
      border: none;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
    padding-left: 8px;
    margin: 8px 0;
    font-style: italic;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: 12px 0;
  }
`;

export const EmptyPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.height || '120px'};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  opacity: 0.6;
`;