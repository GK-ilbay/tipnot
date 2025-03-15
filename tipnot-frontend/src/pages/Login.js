import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (validateForm()) {
      try {
        await login({
          email: formData.email,
          password: formData.password
        });
        
        // Redirect to content page after successful login
        const from = location.state?.from?.pathname || '/content';
        navigate(from, { replace: true });
        
      } catch (err) {
        setSubmitError(err.message || 'Login failed. Please check your credentials.');
      }
    }
  };
  
  return (
    <LoginContainer>
      <FormWrapper>
        <Title>Login to TipNot</Title>
        <Subtitle>Access your medical education portal</Subtitle>
        
        {(submitError || authError) && (
          <ErrorBanner>{submitError || authError}</ErrorBanner>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </FormGroup>
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          
          <FormGroup>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </FormGroup>
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          
          <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </SubmitButton>
        </Form>
        
        <RegisterPrompt>
          Don't have an account? <RegisterLink to="/register">Register</RegisterLink>
        </RegisterPrompt>
      </FormWrapper>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f7fa;
`;

const FormWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
`;

const IconWrapper = styled.div`
  background-color: #3498db;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: #bdc3c7;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: -1rem;
  margin-bottom: 1rem;
`;

const ForgotPassword = styled(Link)`
  align-self: flex-end;
  text-decoration: none;
  color: #3498db;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const RegisterPrompt = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: #7f8c8d;
`;

const RegisterLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorBanner = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
`;

export default Login; 