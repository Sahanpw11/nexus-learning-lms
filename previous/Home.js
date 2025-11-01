import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaExpandArrowsAlt, 
  FaUserTie, 
  FaRocket,
  FaBrain,
  FaImage,
  FaLightbulb,
  FaChartLine,
  FaAward,
  FaCog
} from 'react-icons/fa';
import './Home.css';

// Styled Components - Exact ReactorMinds Style
const HeroSection = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  background: transparent;
  position: relative;
  overflow: hidden;
  z-index: 1;
  padding: 0 2rem;
  padding-top: 0;
  max-width: 100%;
`;

const Section = styled.section`
  padding: 6rem 2rem;
  background: transparent;
  position: relative;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const HeroContainer = styled(Container)`
  color: white;
  z-index: 2;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding-top: 0;
`;

const HeroContent = styled.div`
  max-width: 800px;
  text-align: center;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 6rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  color: white;
  font-family: var(--font-headings) !important;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 4rem;
    white-space: normal;
  }
  
  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const OrangeText = styled.span`
  color: var(--primary-orange);
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  font-family: var(--font-body);
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 300;
  text-align: center;
  margin-bottom: 3rem;
  color: white;
  font-family: var(--font-headings) !important;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 4rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-family: var(--font-body);
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CTAButton = styled(motion.button)`
  background: #ff6b35;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e55a2b;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: white;
  padding: 1rem 2rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 107, 53, 0.1);
    border-color: #ff6b35;
    color: #ff6b35;
    transform: translateY(-3px);
  }
`;

const BackgroundAnimation = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
`;

const FloatingShape = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
`;

// Features Section
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 107, 53, 0.3);
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #ff6b35;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
  font-family: var(--font-headings) !important;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-family: var(--font-body);
`;

// Stats Section
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
`;

const StatNumber = styled(motion.div)`
  font-size: 4rem;
  font-weight: 700;
  color: #ff6b35;
  margin-bottom: 0.5rem;
  font-family: var(--font-headings) !important;
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-family: var(--font-body);
`;

// Technology Section
const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TechItem = styled(motion.div)`
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 107, 53, 0.2);
  }
`;

const TechIcon = styled.div`
  font-size: 2.5rem;
  color: #ff6b35;
  margin-bottom: 1rem;
`;

const TechName = styled.h4`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: var(--font-headings) !important;
`;

// CTA Section
const CTASection = styled(Section)`
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 2rem;
  margin: 4rem 2rem;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 300;
  color: white;
  margin-bottom: 1rem;
  font-family: var(--font-headings) !important;
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-family: var(--font-body);
`;

// Scroll Indicator - Simple Design
const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 10;
  cursor: pointer;
  margin: 0 auto;
  width: fit-content;
  
  &:hover .scroll-text {
    opacity: 1;
  }
  
  &:hover .scroll-lines {
    transform: translateY(5px);
  }
  
  @media (max-width: 768px) {
    bottom: 1.5rem;
    gap: 0.4rem;
  }
`;

const ScrollText = styled(motion.span)`
  color: #ff6b35;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: var(--font-body);
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const ScrollLines = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: all 0.3s ease;
  align-items: center;
`;

const ScrollLine = styled(motion.div)`
  width: 2px;
  height: 15px;
  background: #ff6b35;
  border-radius: 1px;
  transform-origin: center;
`;

const Home = () => {
  const shapes = [
    { size: 100, top: '20%', left: '10%' },
    { size: 60, top: '60%', left: '80%' },
    { size: 80, top: '80%', left: '20%' },
    { size: 40, top: '30%', left: '85%' },
    { size: 120, top: '70%', left: '70%' },
  ];

  const features = [
    {
      icon: <FaBrain />,
      title: "AI-Powered Generation",
      description: "Advanced machine learning algorithms create stunning visuals from your text descriptions."
    },
    {
      icon: <FaImage />,
      title: "High-Quality Output",
      description: "Generate professional-grade images with exceptional detail and artistic quality."
    },
    {
      icon: <FaLightbulb />,
      title: "Creative Enhancement",
      description: "Transform your creative ideas into visual masterpieces with intelligent suggestions."
    },
    {
      icon: <FaExpandArrowsAlt />,
      title: "Flexible Formats",
      description: "Create images in various sizes, styles, and formats to meet your specific needs."
    },
    {
      icon: <FaRocket />,
      title: "Lightning Fast",
      description: "Generate images in seconds, not hours. Perfect for rapid prototyping and iteration."
    },
    {
      icon: <FaUserTie />,
      title: "Professional Results",
      description: "Achieve professional-quality results without extensive design experience or skills."
    }
  ];

  const stats = [
    { number: "1M+", label: "Images Generated" },
    { number: "50K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const technologies = [
    { icon: <FaBrain />, name: "Neural Networks" },
    { icon: <FaCog />, name: "Deep Learning" },
    { icon: <FaChartLine />, name: "Data Analysis" },
    { icon: <FaAward />, name: "Quality Control" }
  ];

  const handleCTAClick = () => {
    window.location.href = '/generate';
  };

  const handleLearnMoreClick = () => {
    const element = document.querySelector('#features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <BackgroundAnimation
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
        />
        
        <FloatingElements>
          {shapes.map((shape, index) => (
            <FloatingShape
              key={index}
              size={shape.size}
              top={shape.top}
              left={shape.left}
              initial={{ y: 0, opacity: 0 }}
              animate={{ 
                y: [-20, 20, -20],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }}
            />
          ))}
        </FloatingElements>
        
        <HeroContainer>
          <HeroContent>            <HeroTitle
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Where Imagination<br />
              Becomes<br />
              <OrangeText>Digital Reality</OrangeText>
            </HeroTitle>
            
            <HeroSubtitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Powered by cutting-edge AI technology, create, enhance, and restore images 
              with professional quality results in seconds.
            </HeroSubtitle>
            
            <ButtonContainer
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <CTAButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCTAClick}
              >
                Start Creating
              </CTAButton>
              
              <SecondaryButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMoreClick}
              >
                Learn More
              </SecondaryButton>            </ButtonContainer>
          </HeroContent>
        </HeroContainer>        {/* Scroll Indicator - Inside Hero Section */}
        <ScrollIndicator
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          onClick={() => {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
              featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >          <ScrollLines 
            className="scroll-lines"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ScrollLine 
              animate={{ 
                opacity: [0.4, 1, 0.4],
                scaleY: [0.8, 1.2, 0.8],
                y: [0, 3, 0],
                skewX: [-20, -25, -20]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                delay: 0,
                ease: "easeInOut"
              }}
            />
            <ScrollLine 
              animate={{ 
                opacity: [0.3, 0.9, 0.3],
                scaleY: [0.7, 1.1, 0.7],
                y: [0, 5, 0],
                skewX: [-20, -25, -20]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                delay: 0.3,
                ease: "easeInOut"
              }}
            />
            <ScrollLine 
              animate={{ 
                opacity: [0.2, 0.8, 0.2],
                scaleY: [0.6, 1, 0.6],
                y: [0, 7, 0],
                skewX: [-20, -25, -20]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                delay: 0.6,
                ease: "easeInOut"
              }}
            />
          </ScrollLines>
          <ScrollText 
            className="scroll-text"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll down
          </ScrollText>
        </ScrollIndicator>
      </HeroSection>

      {/* Features Section */}
      <Section id="features">
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features
          </SectionTitle>
          
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover the advanced capabilities that make our AI image generator the perfect tool for creators, designers, and visionaries.
          </SectionSubtitle>

          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Trusted by Creators Worldwide
          </SectionTitle>

          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <StatNumber
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                >
                  {stat.number}
                </StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </Container>
      </Section>

      {/* Technology Section */}
      <Section>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Advanced Technology
          </SectionTitle>
          
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Built on cutting-edge AI technologies to deliver exceptional results every time.
          </SectionSubtitle>

          <TechGrid>
            {technologies.map((tech, index) => (
              <TechItem
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <TechIcon>{tech.icon}</TechIcon>
                <TechName>{tech.name}</TechName>
              </TechItem>
            ))}
          </TechGrid>
        </Container>
      </Section>

      {/* Final CTA Section */}
      <CTASection>
        <Container>
          <CTATitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Create?
          </CTATitle>
          
          <CTADescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of creators who are already transforming their ideas into stunning visuals with our AI-powered platform.
          </CTADescription>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCTAClick}
            >
              Start Creating Now
            </CTAButton>
          </motion.div>
        </Container>
      </CTASection>
    </>
  );
};

export default Home;