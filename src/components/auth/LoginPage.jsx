// src/components/auth/LoginPage.jsx - Page de connexion minimaliste

import React, { useState } from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%);
  color: #e0e0e0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const LoginCard = styled.div`
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  text-align: center;
  font-size: 48px;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #ffffff;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: #a0a0a0;
  margin: 0 0 32px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #e0e0e0;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4a9eff;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: #666;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #4a9eff 0%, #2d5bff 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(74, 158, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 59, 59, 0.1);
  border: 1px solid rgba(255, 59, 59, 0.3);
  border-radius: 8px;
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
`;

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mot de passe depuis les variables d'environnement
  const SIMPLE_PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD || 'metabrain2024';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simpler une petite latence pour l'effet
    setTimeout(() => {
      if (password === SIMPLE_PASSWORD) {
        // Sauvegarder l'état de connexion
        sessionStorage.setItem('irim-logged-in', 'true');
        onLogin();
      } else {
        setError('Mot de passe incorrect');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>🏰</Logo>
        <Title>IRIM MetaBrain</Title>
        <Subtitle>Studio Hall • Accès sécurisé</Subtitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Entrez votre mot de passe"
              disabled={isLoading}
              autoFocus
            />
          </FormGroup>

          <LoginButton type="submit" disabled={isLoading || !password}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </LoginButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;