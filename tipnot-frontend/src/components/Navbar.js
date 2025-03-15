import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserMd, FaSignOutAlt, FaBook, FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus, FaShieldAlt, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <LogoContainer>
          <Link to="/">
            <LogoText>TipNot</LogoText>
            <LogoSubtext>Medical Education</LogoSubtext>
          </Link>
        </LogoContainer>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
            <FaHome />
            <span>Home</span>
          </NavLink>
          
          {isAuthenticated() ? (
            <>
              <NavLink to="/content" onClick={() => setIsMenuOpen(false)}>
                <FaBook />
                <span>Content</span>
              </NavLink>
              
              {/* Admin-specific links */}
              {isAdmin && (
                <AdminLinks>
                  <NavLink to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <FaShieldAlt />
                    <span>Admin</span>
                  </NavLink>
                  
                  <NavLink to="/admin/content/create" onClick={() => setIsMenuOpen(false)}>
                    <FaEdit />
                    <span>Create Content</span>
                  </NavLink>
                </AdminLinks>
              )}
              
              <UserSection>
                <UserInfo>
                  <FaUserMd />
                  <UserName>
                    {currentUser?.username || 'User'}
                    {isAdmin && <AdminBadge>Admin</AdminBadge>}
                  </UserName>
                </UserInfo>
                
                <LogoutButton onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </LogoutButton>
              </UserSection>
            </>
          ) : (
            <>
              <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                <FaInfoCircle />
                <span>About</span>
              </NavLink>
              
              <AuthLinks>
                <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                  <FaSignInAlt />
                  <span>Login</span>
                </NavLink>
                
                <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                  <FaUserPlus />
                  <span>Register</span>
                </NavLink>
              </AuthLinks>
            </>
          )}
        </NavLinks>
        
        <MobileMenuToggle onClick={toggleMenu} isOpen={isMenuOpen}>
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuToggle>
      </NavbarContent>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.nav`
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const LogoContainer = styled.div`
  a {
    text-decoration: none;
    display: flex;
    flex-direction: column;
  }
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: #3498db;
`;

const LogoSubtext = styled.span`
  font-size: 0.8rem;
  color: #7f8c8d;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff;
    padding: 1rem 2rem;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #34495e;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  
  &:hover {
    color: #3498db;
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0;
    width: 100%;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 0.75rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #34495e;
  font-weight: 500;
  
  svg {
    color: #3498db;
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e74c3c;
  background: none;
  border: none;
  padding: 0;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: #c0392b;
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`;

const MobileMenuToggle = styled.div`
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  span {
    display: block;
    width: 25px;
    height: 3px;
    background-color: #34495e;
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  
  ${props => props.isOpen && `
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    span:nth-child(2) {
      opacity: 0;
    }
    
    span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  `}
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const AdminLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdminBadge = styled.span`
  background-color: #e74c3c;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-weight: bold;
`;

export default Navbar; 