import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaGithub, 
  FaTwitter, 
  FaDiscord, 
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaMagic,
  FaExpandArrowsAlt,
  FaUserTie,
  FaPalette
} from 'react-icons/fa';

const FooterSection = styled.footer`
  background: #0a0a0a;
  color: white;
  padding: 2rem 0 1rem;
  border-top: 1px solid rgba(255, 107, 53, 0.1);
  margin-top: 3rem;
  position: relative;
  z-index: 10;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterColumn = styled(motion.div)``;

const FooterTitle = styled.h3`
  margin-bottom: 1rem;
  font-family: var(--font-headings);
  font-weight: 500;
  color: white;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FooterText = styled.p`
  color: #a0aec0;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-family: var(--font-body);
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 0.8rem;
`;

const FooterLink = styled.a`
  color: #a0aec0;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: var(--font-body);
  position: relative;
  
  &:hover {
    color: #ff6b35;
    transform: translateX(5px);
  }
`;

const RouterLink = styled(Link)`
  color: #a0aec0;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: var(--font-body);
  position: relative;
  display: block;
  
  &:hover {
    color: #ff6b35;
    transform: translateX(5px);
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const SocialIcon = styled(motion.a)`
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  text-decoration: none;
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
  
  &:hover {
    border-color: #ff6b35;
    color: #ff6b35;
    transform: translateY(-2px);
  }
`;

const LogoSection = styled.div`
  margin-bottom: 1rem;
`;

const Logo = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  font-family: var(--font-headings);
  color: white;
  margin-bottom: 1rem;
  letter-spacing: 0.02em;
  
  .orange-text {
    color: #ff6b35;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  color: #a0aec0;
  font-family: var(--font-body);
  font-size: 0.9rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  color: #a0aec0;
  
  svg {
    color: #ff6b35;
    width: 16px;
    height: 16px;
  }
`;

const Footer = () => {  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Generate', href: '/generate' },
    { name: 'Upscale', href: '/upscale' },
    { name: 'BG Remove', href: '/bg-remove' },
    { name: 'Style Transfer', href: '/style-transfer' }
  ];

  const socialLinks = [
    { 
      label: 'GitHub',
      href: 'https://github.com/your-username/ai-canvas', 
      icon: <FaGithub />
    },
    { 
      label: 'Twitter',
      href: 'https://twitter.com/your-handle', 
      icon: <FaTwitter />
    },
    { 
      label: 'Discord',
      href: 'https://discord.gg/your-server', 
      icon: <FaDiscord />
    },
    { 
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/your-company', 
      icon: <FaLinkedin />
    }
  ];  const features = [
    { name: 'AI Image Generation', icon: <FaMagic /> },
    { name: 'Image Upscaling', icon: <FaExpandArrowsAlt /> },
    { name: 'Background Removal', icon: <FaUserTie /> },
    { name: 'Style Transfer', icon: <FaPalette /> }
  ];

  return (
    <FooterSection>
      <Container>
        <FooterGrid>
          <FooterColumn
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <LogoSection>
              <Logo>
                AI <span className="orange-text">Canvas</span>
              </Logo>
            </LogoSection>
            
            <FooterText>
              Transform your imagination into stunning visuals with our advanced AI-powered platform. 
              Generate, enhance, and restore images with professional quality results in seconds.
            </FooterText>
            
            <FooterTitle>Features</FooterTitle>
            <FooterList>
              {features.map((feature, index) => (
                <FooterListItem key={index}>
                  <ContactItem>
                    {feature.icon}
                    <span>{feature.name}</span>
                  </ContactItem>
                </FooterListItem>
              ))}
            </FooterList>
            
            <SocialIcons>
              {socialLinks.map((social, index) => (
                <SocialIcon
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.label}
                >
                  {social.icon}
                </SocialIcon>
              ))}
            </SocialIcons>
          </FooterColumn>
          
          <FooterColumn
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <FooterTitle>Navigation</FooterTitle>
            <FooterList>
              {navigation.map((item, index) => (
                <FooterListItem key={index}>
                  <RouterLink to={item.href}>
                    {item.name}
                  </RouterLink>
                </FooterListItem>
              ))}
            </FooterList>
          </FooterColumn>
            <FooterColumn
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FooterTitle>Contact</FooterTitle>
            <FooterText>
              Ready to create amazing images?
            </FooterText>
            
            <ContactItem>
              <FaEnvelope />
              <FooterLink href="mailto:reactorminds@gmail.com">
                reactorminds@gmail.com
              </FooterLink>
            </ContactItem>
            
            <ContactItem>
              <FaPhone />
              <FooterLink href="tel:+94786952081">
                +94 78 695 2081
              </FooterLink>
            </ContactItem>
            
            <ContactItem>
              <FaPhone />
              <FooterLink href="tel:+94718542662">
                +94 71 854 2662
              </FooterLink>
            </ContactItem>
            
            <ContactItem>
              <FaMapMarkerAlt />
              <span>Sri Lanka</span>
            </ContactItem>
          </FooterColumn>
        </FooterGrid>
        
        <FooterBottom>          <Copyright>
            © 2023-2025 AI Canvas. All rights reserved.
          </Copyright>
        </FooterBottom>
      </Container>
    </FooterSection>
  );
};

export default Footer;
