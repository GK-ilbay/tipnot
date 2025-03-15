import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <NotFoundContainer>
      <ErrorIcon>
        <FaExclamationTriangle />
      </ErrorIcon>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Page Not Found</ErrorMessage>
      <ErrorDescription>
        The page you are looking for doesn't exist or has been moved.
      </ErrorDescription>
      <Actions>
        <HomeButton to="/">
          <FaHome /> Go to Home
        </HomeButton>
      </Actions>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
`;

const ErrorIcon = styled.div`
  font-size: 6rem;
  color: #e74c3c;
  margin-bottom: 1rem;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
  line-height: 1;
`;

const ErrorMessage = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 1rem 0;
`;

const ErrorDescription = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const HomeButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3498db;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

export default NotFound; 