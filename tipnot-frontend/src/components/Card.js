import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = ({ icon, title, description, linkTo, color = '#3498db' }) => {
  return (
    <CardContainer to={linkTo} color={color}>
      <IconContainer color={color}>
        {icon}
      </IconContainer>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardContainer>
  );
};

const CardContainer = styled(Link)`
  background-color: white;
  border-radius: 10px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: ${props => props.color};
    transition: width 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    
    &::before {
      width: 100%;
      opacity: 0.1;
    }
  }
`;

const IconContainer = styled.div`
  font-size: 2.5rem;
  color: ${props => props.color};
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.2) rotate(5deg);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
  
  ${CardContainer}:hover & {
    color: #3498db;
  }
`;

const CardDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export default Card; 