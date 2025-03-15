import React from 'react';
import styled from 'styled-components';
import { FaUserMd, FaUniversity, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

const About = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <HeroTitle>About TipNot</HeroTitle>
        <HeroSubtitle>Empowering Healthcare Professionals Through Education</HeroSubtitle>
      </HeroSection>

      <Section>
        <SectionTitle>Our Story</SectionTitle>
        <StoryContent>
          <StoryText>
            <p>
              TipNot was founded in 2020 by a team of medical professionals who recognized the need for more accessible, comprehensive medical education resources. What began as a small collection of educational materials has grown into a robust platform serving healthcare professionals worldwide.
            </p>
            <p>
              Our journey started when Dr. Alex Johnson, a cardiologist with a passion for teaching, began creating online resources for his residents and fellows. As these resources gained popularity among his colleagues, he envisioned a platform that could reach healthcare professionals globally.
            </p>
            <p>
              Today, TipNot collaborates with hundreds of medical experts across specialties to deliver high-quality educational content that bridges the gap between theoretical knowledge and clinical practice.
            </p>
          </StoryText>
          <ImageContainer>
            <StoryImage src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="Medical team discussion" />
          </ImageContainer>
        </StoryContent>
      </Section>

      <Section>
        <SectionTitle>Our Mission</SectionTitle>
        <Mission>
          To advance global healthcare by providing accessible, high-quality medical education that empowers healthcare professionals to deliver exceptional patient care.
        </Mission>
      </Section>

      <Section>
        <SectionTitle>What We Offer</SectionTitle>
        <OfferingsGrid>
          <OfferingCard>
            <OfferingIcon>
              <FaUserMd />
            </OfferingIcon>
            <OfferingTitle>Specialty Resources</OfferingTitle>
            <OfferingDescription>
              Comprehensive educational materials across medical specialties, from cardiology to pediatrics.
            </OfferingDescription>
          </OfferingCard>

          <OfferingCard>
            <OfferingIcon>
              <FaUniversity />
            </OfferingIcon>
            <OfferingTitle>Certification Courses</OfferingTitle>
            <OfferingDescription>
              Accredited courses that help advance your career and maintain professional credentials.
            </OfferingDescription>
          </OfferingCard>

          <OfferingCard>
            <OfferingIcon>
              <FaUsers />
            </OfferingIcon>
            <OfferingTitle>Professional Community</OfferingTitle>
            <OfferingDescription>
              Connect with peers, share insights, and collaborate with healthcare professionals worldwide.
            </OfferingDescription>
          </OfferingCard>

          <OfferingCard>
            <OfferingIcon>
              <FaChalkboardTeacher />
            </OfferingIcon>
            <OfferingTitle>Expert-Led Webinars</OfferingTitle>
            <OfferingDescription>
              Live and recorded sessions with leading experts discussing cutting-edge medical topics.
            </OfferingDescription>
          </OfferingCard>
        </OfferingsGrid>
      </Section>

      <Section>
        <SectionTitle>Our Team</SectionTitle>
        <TeamGrid>
          <TeamMember>
            <TeamMemberImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Dr. Alex Johnson" />
            <TeamMemberInfo>
              <TeamMemberName>Dr. Alex Johnson</TeamMemberName>
              <TeamMemberTitle>Founder & Chief Medical Officer</TeamMemberTitle>
              <TeamMemberBio>
                Board-certified cardiologist with over 15 years of experience in medical education.
              </TeamMemberBio>
            </TeamMemberInfo>
          </TeamMember>

          <TeamMember>
            <TeamMemberImage src="https://images.unsplash.com/photo-1614608997588-88d8ec7195b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Dr. Sarah Chen" />
            <TeamMemberInfo>
              <TeamMemberName>Dr. Sarah Chen</TeamMemberName>
              <TeamMemberTitle>Director of Educational Content</TeamMemberTitle>
              <TeamMemberBio>
                Pediatric specialist and medical educator focused on creating evidence-based curriculum.
              </TeamMemberBio>
            </TeamMemberInfo>
          </TeamMember>

          <TeamMember>
            <TeamMemberImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Dr. Marcus Williams" />
            <TeamMemberInfo>
              <TeamMemberName>Dr. Marcus Williams</TeamMemberName>
              <TeamMemberTitle>Lead Neurologist & Content Advisor</TeamMemberTitle>
              <TeamMemberBio>
                Award-winning neurologist and researcher specializing in stroke prevention and treatment.
              </TeamMemberBio>
            </TeamMemberInfo>
          </TeamMember>

          <TeamMember>
            <TeamMemberImage src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Emma Rodriguez" />
            <TeamMemberInfo>
              <TeamMemberName>Emma Rodriguez</TeamMemberName>
              <TeamMemberTitle>Chief Technology Officer</TeamMemberTitle>
              <TeamMemberBio>
                Technology leader with a background in healthcare informatics and platform development.
              </TeamMemberBio>
            </TeamMemberInfo>
          </TeamMember>
        </TeamGrid>
      </Section>

      <Section>
        <SectionTitle>Join Our Mission</SectionTitle>
        <JoinMission>
          <JoinText>
            <p>
              We're always looking for passionate healthcare professionals to contribute to our growing platform. Whether you're interested in creating educational content, reviewing materials, or participating in webinars, there's a place for you at TipNot.
            </p>
            <p>
              Together, we can improve healthcare education and ultimately, patient outcomes worldwide.
            </p>
          </JoinText>
          <JoinButton href="mailto:join@tipnot.com">Contact Us to Get Involved</JoinButton>
        </JoinMission>
      </Section>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 6rem 0 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.8rem;
  color: #3498db;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Section = styled.section`
  margin: 5rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: #3498db;
  }
`;

const StoryContent = styled.div`
  display: flex;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const StoryText = styled.div`
  flex: 1.5;
  
  p {
    font-size: 1.1rem;
    color: #7f8c8d;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
`;

const StoryImage = styled.img`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
`;

const Mission = styled.p`
  font-size: 1.8rem;
  color: #3498db;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  font-style: italic;
`;

const OfferingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const OfferingCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const OfferingIcon = styled.div`
  font-size: 3rem;
  color: #3498db;
  margin-bottom: 1.5rem;
`;

const OfferingTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const OfferingDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const TeamMember = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const TeamMemberImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const TeamMemberInfo = styled.div`
  padding: 1.5rem;
`;

const TeamMemberName = styled.h3`
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const TeamMemberTitle = styled.h4`
  font-size: 1rem;
  color: #3498db;
  margin-bottom: 1rem;
  font-weight: 400;
`;

const TeamMemberBio = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
`;

const JoinMission = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const JoinText = styled.div`
  margin-bottom: 2rem;
  
  p {
    font-size: 1.1rem;
    color: #7f8c8d;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }
`;

const JoinButton = styled.a`
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export default About; 