import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import quotesData from '../../../../data/sagesQuotes.json';

const QuoteContainer = styled.div`
  margin: 15px 0;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.15) 100%);
  border: 1px solid ${props => props.color}44;
  border-left: 4px solid ${props => props.color};
  border-radius: 6px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.1) 100%);
    border-color: ${props => props.color}66;
  }

  @media (max-width: 640px) {
    padding: 12px;
    margin: 12px 0;
    border-left-width: 3px;
  }
`;

const QuoteText = styled.p`
  font-size: 1em;
  font-style: italic;
  margin: 0 0 12px 0;
  line-height: 1.6;
  opacity: 0.95;
  color: #f5f5f5;
  font-weight: 300;

  &::before {
    content: '«';
    margin-right: 4px;
    opacity: 0.6;
  }

  &::after {
    content: '»';
    margin-left: 4px;
    opacity: 0.6;
  }

  @media (max-width: 640px) {
    font-size: 0.95em;
    line-height: 1.5;
  }
`;

const RefreshButton = styled.button`
  background: ${props => props.color}20;
  border: 1px solid ${props => props.color}60;
  color: #fff;
  padding: 8px 14px;
  border-radius: 4px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  width: 100%;

  &:hover {
    background: ${props => props.color}40;
    border-color: ${props => props.color};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    padding: 7px 12px;
    font-size: 0.8em;
  }
`;

export const SageQuote = ({ sageId, color }) => {
  const [quote, setQuote] = useState('');

  const getRandomQuote = () => {
    const quotes = quotesData[sageId] || [];
    if (quotes.length === 0) return '';
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  useEffect(() => {
    setQuote(getRandomQuote());
  }, [sageId]);

  const refreshQuote = () => {
    setQuote(getRandomQuote());
  };

  return (
    <QuoteContainer color={color}>
      <QuoteText>{quote}</QuoteText>
      <RefreshButton color={color} onClick={refreshQuote}>
        🔄 Autre citation
      </RefreshButton>
    </QuoteContainer>
  );
};
