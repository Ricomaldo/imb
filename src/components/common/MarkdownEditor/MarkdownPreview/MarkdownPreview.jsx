// src/components/common/MarkdownEditor/MarkdownPreview/MarkdownPreview.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PreviewContainer, EmptyPreview } from './MarkdownPreview.styles';

/**
 * Strip YAML frontmatter from markdown content
 * Frontmatter is delimited by --- at start of file
 */
const stripFrontmatter = (text) => {
  if (!text) return text;
  // Match frontmatter: starts with ---, ends with ---, at beginning of file
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n?/;
  return text.replace(frontmatterRegex, '');
};

/**
 * Markdown preview component with styling support
 * @renders PreviewContainer
 * @renders EmptyPreview
 * @renders ReactMarkdown
 * @renders h1
 * @renders h2
 * @renders h3
 * @renders p
 * @renders li
 * @renders code
 * @renders pre
 * @renders input
 */
const MarkdownPreview = ({ content, height, compact, zoomLevel = 0, accentColor }) => {
  // Strip frontmatter for clean preview
  const cleanContent = stripFrontmatter(content);

  if (!cleanContent || !cleanContent.trim()) {
    return (
      <EmptyPreview height={height}>
        Aperçu du rendu markdown...
      </EmptyPreview>
    );
  }

  return (
    <PreviewContainer $height={height} compact={compact} zoomLevel={zoomLevel} accentColor={accentColor}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customisation des composants rendus
          h1: ({ children }) => <h1 style={{ margin: '8px 0 4px 0' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ margin: '8px 0 4px 0' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ margin: '8px 0 4px 0' }}>{children}</h3>,
          p: ({ children }) => <p style={{ margin: '4px 0' }}>{children}</p>,
          li: ({ children }) => <li style={{ margin: '2px 0' }}>{children}</li>,
          code: ({ children }) => (
            <code style={{
              background: '#F5F5DC',
              border: '1px solid #A0522D',
              borderRadius: '3px',
              padding: '1px 3px',
              fontFamily: 'Courier New, monospace'
              // fontSize supprimé - utilise le CSS
            }}>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre style={{
              background: '#F5F5DC',
              border: '1px solid #A0522D',
              borderRadius: '4px',
              padding: '8px',
              margin: '8px 0',
              overflowX: 'auto'
            }}>
              {children}
            </pre>
          ),
          // Support des tasklists GitHub
          input: ({ checked, type }) => (
            type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={checked}
                readOnly
                style={{ marginRight: '6px' }}
              />
            ) : null
          )
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </PreviewContainer>
  );
};

export default MarkdownPreview;