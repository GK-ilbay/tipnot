import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaYoutube, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>
            <h3>TipNot</h3>
            <p>Your medical education platform</p>
          </FooterLogo>
          <SocialIcons>
            <SocialIcon href="mailto:contact@tipnot.com" aria-label="Email">
              <FaEnvelope />
            </SocialIcon>
            <SocialIcon href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </SocialIcon>
          </SocialIcons>
        </FooterSection>
        
        <FooterSection>
          <FooterSectionTitle>Quick Links</FooterSectionTitle>
          <FooterLinks>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/content">Content</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/login">Login</FooterLink>
            <FooterLink to="/register">Register</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterSectionTitle>Contact Us</FooterSectionTitle>
          <ContactInfo>
            <ContactItem>
              <strong>Email:</strong> contact@tipnot.com
            </ContactItem>
            <ContactItem>
              <strong>Phone:</strong> +1 (555) 123-4567
            </ContactItem>
            <ContactItem>
              <strong>Address:</strong> 123 Medical Plaza, Suite 500<br />
              San Francisco, CA 94103
            </ContactItem>
          </ContactInfo>
        </FooterSection>
        
        <FooterSection>
          <FooterSectionTitle>Help Improve TipNot</FooterSectionTitle>
          <p>Have suggestions or feedback?</p>
          <SuggestionButton href="https://forms.google.com/tipnot-feedback" target="_blank" rel="noopener noreferrer">
            Suggestion Form
          </SuggestionButton>
        </FooterSection>
      </FooterContent>
      
      <FooterDivider />
      
      <CopyrightText>
        © {currentYear} TipNot. All rights reserved. Made with <FaHeart style={{ color: '#e74c3c' }} /> for healthcare professionals.
      </CopyrightText>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: white;
  padding: 4rem 2rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.8rem;
    margin: 0;
    color: #3498db;
  }
  
  p {
    margin-top: 0.5rem;
    color: #ecf0f1;
    font-size: 0.9rem;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3498db;
    transform: translateY(-3px);
  }
`;

const FooterSectionTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #3498db;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 30px;
    height: 2px;
    background-color: #3498db;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FooterLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s;
  
  &:hover {
    color: #3498db;
    text-decoration: underline;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #ecf0f1;
  line-height: 1.6;
`;

const SuggestionButton = styled.a`
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const FooterDivider = styled.hr`
  margin: 2rem 0;
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const CopyrightText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #bdc3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export default Footer; 