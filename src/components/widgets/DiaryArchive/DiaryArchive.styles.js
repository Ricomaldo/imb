// src/components/widgets/DiaryArchive/DiaryArchive.styles.js

import styled from 'styled-components';

export const ArchiveContainer = styled.div`
  display: flex;
  height: 100%;
  background: linear-gradient(135deg, #f5f3f0 0%, #ede8e1 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const MonthsList = styled.div`
  width: 200px;
  background: rgba(255, 255, 255, 0.7);
  border-right: 1px solid rgba(139, 115, 85, 0.2);
  padding: 16px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(139, 115, 85, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 115, 85, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(139, 115, 85, 0.4);
    }
  }
`;

export const MonthItem = styled.div`
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #5a4a3a;
  background: ${props => props.$isActive ? 'rgba(139, 115, 85, 0.15)' : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'rgba(139, 115, 85, 0.3)' : 'transparent'};
  transition: all 0.2s ease;
  text-transform: capitalize;

  &:hover {
    background: rgba(139, 115, 85, 0.1);
    border-color: rgba(139, 115, 85, 0.2);
  }
`;

export const ArchiveContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(139, 115, 85, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(139, 115, 85, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(139, 115, 85, 0.3);
    }
  }
`;

export const ArchiveHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(139, 115, 85, 0.15);
  font-size: 18px;
  font-weight: 600;
  color: #4a3a2a;
  text-transform: capitalize;
`;

export const ExportButton = styled.button`
  padding: 6px 12px;
  background: linear-gradient(135deg, #8b7355 0%, #6d5a45 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #9a8264 0%, #7c6954 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

export const NoArchivesMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px;
  text-align: center;
  color: #8b7355;
  font-size: 14px;
  line-height: 1.6;
`;

export const DayEntry = styled.div`
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 16px;
  border: 1px solid rgba(139, 115, 85, 0.1);
`;

export const DayHeader = styled.h3`
  margin: 0 0 12px 0;
  color: #5a4a3a;
  font-size: 16px;
  font-weight: 600;
  text-transform: capitalize;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
`;

export const DayContent = styled.div`
  min-height: 100px;

  // Style pour le MarkdownEditor en lecture seule
  .markdown-editor-container {
    background: transparent !important;
    border: none !important;
  }

  .markdown-preview {
    padding: 8px !important;
    background: transparent !important;
  }
`;