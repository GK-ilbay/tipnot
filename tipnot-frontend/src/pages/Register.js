import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaUserMd } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
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
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (validateForm()) {
      try {
        // Prepare the data by removing confirmPassword
        const userData = {
          username: formData.fullName,
          email: formData.email,
          password: formData.password,
          specialization: formData.specialization
        };
        
        await register(userData);
        // Redirect to login page after successful registration
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in with your credentials.' 
          } 
        });
      } catch (err) {
        setSubmitError(err.message || 'Registration failed. Please try again.');
      }
    }
  };
  
  return (
    <RegisterContainer>
      <FormWrapper>
        <Title>Create an Account</Title>
        <Subtitle>Join the TipNot medical education community</Subtitle>
        
        {(submitError || authError) && (
          <ErrorBanner>{submitError || authError}</ErrorBanner>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
            />
          </FormGroup>
          {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
          
          <FormGroup>
            <IconWrapper>
              <FaEnvelope />
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
          
          <FormGroup>
            <IconWrapper>
              <FaLock />
            </IconWrapper>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </FormGroup>
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          
          <FormGroup>
            <IconWrapper>
              <FaUserMd />
            </IconWrapper>
            <Select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select your specialization</option>
              <option value="general">General Medicine</option>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="surgery">Surgery</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </SubmitButton>
        </Form>
        
        <LoginPrompt>
          Already have an account? <LoginLink to="/login">Login</LoginLink>
        </LoginPrompt>
      </FormWrapper>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
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
  max-width: 500px;
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

const Select = styled.select`
  flex: 1;
  padding: 1rem;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  color: #2c3e50;
  
  option {
    padding: 1rem;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: -1rem;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: #7f8c8d;
`;

const LoginLink = styled(Link)`
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

export default Register; 