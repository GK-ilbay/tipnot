import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaUserMd, 
  FaGraduationCap, 
  FaHeartbeat, 
  FaMicroscope, 
  FaBrain,
  FaNotesMedical,
  FaFlask,
  FaBaby
} from 'react-icons/fa';

import Card from '../components/Card';

const Home = () => {
  const categories = [
    {
      id: 1,
      icon: <FaHeartbeat />,
      title: 'Cardiology',
      description: 'Explore heart diseases, treatments, and preventive care',
      linkTo: '/content?category=cardiology',
      color: '#e74c3c'
    },
    {
      id: 2,
      icon: <FaBrain />,
      title: 'Neurology',
      description: 'Discover latest advancements in neurological treatments',
      linkTo: '/content?category=neurology',
      color: '#9b59b6'
    },
    {
      id: 3,
      icon: <FaNotesMedical />,
      title: 'General Medicine',
      description: 'Comprehensive resources for general practitioners',
      linkTo: '/content?category=general',
      color: '#3498db'
    },
    {
      id: 4,
      icon: <FaMicroscope />,
      title: 'Pathology',
      description: 'Study disease processes and laboratory diagnostics',
      linkTo: '/content?category=pathology',
      color: '#2ecc71'
    },
    {
      id: 5,
      icon: <FaBaby />,
      title: 'Pediatrics',
      description: 'Resources for healthcare professionals treating children',
      linkTo: '/content?category=pediatrics',
      color: '#f1c40f'
    },
    {
      id: 6,
      icon: <FaFlask />,
      title: 'Research',
      description: 'Access to cutting-edge medical research and studies',
      linkTo: '/content?category=research',
      color: '#1abc9c'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Welcome to TipNot!</HeroTitle>
          <HeroSubtitle>Your Medical Education Platform</HeroSubtitle>
          <HeroDescription>
            Enhance your medical knowledge with our comprehensive courses, resources, and community.
            TipNot is designed to help healthcare professionals stay updated with the latest
            medical advancements and best practices.
          </HeroDescription>
          <ExploreButton to="/content">Explore Content</ExploreButton>
        </HeroContent>
        <HeroImage src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="Medical professionals" />
      </HeroSection>

      <SectionTitle>Education Categories</SectionTitle>
      <SectionDescription>
        Explore our comprehensive collection of medical education resources across various specialties
      </SectionDescription>
      
      <CategoryGrid>
        {categories.map(category => (
          <Card 
            key={category.id}
            icon={category.icon}
            title={category.title}
            description={category.description}
            linkTo={category.linkTo}
            color={category.color}
          />
        ))}
      </CategoryGrid>

      <FeaturesSection>
        <FeaturesSectionTitle>Why TipNot?</FeaturesSectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaBook />
            </FeatureIcon>
            <FeatureTitle>Comprehensive Resources</FeatureTitle>
            <FeatureDescription>
              Access a wide range of medical articles, case studies, and research papers
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaUserMd />
            </FeatureIcon>
            <FeatureTitle>Expert Contributors</FeatureTitle>
            <FeatureDescription>
              Learn from leading professionals in various medical specialties
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FaGraduationCap />
            </FeatureIcon>
            <FeatureTitle>Certification Courses</FeatureTitle>
            <FeatureDescription>
              Complete courses and earn certifications to advance your career
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <AboutSection>
        <AboutContent>
          <AboutTextContent>
            <AboutTitle>About TipNot</AboutTitle>
            <AboutDescription>
              TipNot was created with a vision to provide accessible, high-quality medical education to healthcare professionals worldwide. Our platform bridges the gap between theoretical knowledge and practical application, helping you stay at the forefront of medical advancements.
            </AboutDescription>
            <AboutDescription>
              Our mission is to empower healthcare professionals with the knowledge and skills needed to provide exceptional patient care. We believe in continuous learning and the power of community in advancing medical practice.
            </AboutDescription>
            <LearnMoreButton to="/about">Learn More About Us</LearnMoreButton>
          </AboutTextContent>
          
          <AdminCard>
            <AdminImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Dr. Alex Johnson" />
            <AdminInfo>
              <AdminName>Dr. Alex Johnson</AdminName>
              <AdminTitle>Founder & Chief Medical Officer</AdminTitle>
              <AdminBio>
                Dr. Johnson is a board-certified cardiologist with over 15 years of experience in medical education. His passion for sharing knowledge led to the creation of TipNot in 2020.
              </AdminBio>
            </AdminInfo>
          </AdminCard>
        </AboutContent>
      </AboutSection>

      <CTASection>
        <CTATitle>Ready to advance your medical knowledge?</CTATitle>
        <ButtonGroup>
          <PrimaryButton to="/content">Browse Content</PrimaryButton>
          <SecondaryButton to="/register">Create Account</SecondaryButton>
        </ButtonGroup>
      </CTASection>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  padding: 6rem 0;
  gap: 4rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    padding: 4rem 0;
    gap: 3rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.8rem;
  color: #3498db;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ExploreButton = styled(Link)`
  display: inline-block;
  background-color: #3498db;
  color: white;
  font-size: 1.2rem;
  padding: 1rem 2.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const HeroImage = styled.img`
  flex: 1;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 992px) {
    width: 100%;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin: 3rem 0 1rem;
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 5rem;
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: #f9fafb;
  margin: 0 -2rem;
  padding: 5rem 2rem;
`;

const FeaturesSectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #3498db;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
`;

const AboutSection = styled.section`
  padding: 5rem 0;
`;

const AboutContent = styled.div`
  display: flex;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const AboutTextContent = styled.div`
  flex: 1.5;
`;

const AboutTitle = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const AboutDescription = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const LearnMoreButton = styled(Link)`
  display: inline-block;
  background-color: transparent;
  color: #3498db;
  padding: 0.8rem 1.5rem;
  border: 2px solid #3498db;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

const AdminCard = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
`;

const AdminImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const AdminInfo = styled.div`
  padding: 2rem;
`;

const AdminName = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const AdminTitle = styled.h4`
  font-size: 1rem;
  color: #3498db;
  margin-bottom: 1rem;
`;

const AdminBio = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 5rem 0;
  background-color: #f1f8fe;
  border-radius: 10px;
  margin: 2rem 0 5rem;
`;

const CTATitle = styled.h2`
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  background-color: #3498db;
  color: white;
  padding: 1rem 2.5rem;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const SecondaryButton = styled(Link)`
  background-color: white;
  color: #3498db;
  padding: 1rem 2.5rem;
  text-decoration: none;
  border-radius: 4px;
  border: 2px solid #3498db;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3498db;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export default Home; 