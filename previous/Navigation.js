import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaMagic, 
  FaExpandArrowsAlt, 
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaPalette,
  FaEraser
} from 'react-icons/fa';
import { useAuth } from './AuthContext';
import './Navigation.css';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };  
  
  // Navigation items aligned to match previous Header implementation  
  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/generate', label: 'Generate', icon: FaMagic },    
    { path: '/upscale', label: 'Upscale', icon: FaExpandArrowsAlt },
    { path: '/bg-remove', label: 'BG Remove', icon: FaEraser },
    { path: '/style-transfer', label: 'Style Transfer', icon: FaPalette },
  ];
  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{ fontFamily: 'var(--font-headings)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <motion.div 
            className="logo-content"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="logo-text">AI Canvas</span>
            <span className="logo-subtitle">
              <span className="by-text">by </span>Reactor<span className="minds-text">Minds</span>
            </span>
          </motion.div>
        </Link>
        
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (              <motion.li
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={isActive ? 'active' : ''}
                style={{ fontFamily: 'var(--font-headings)' }}
              >
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeIndicator"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <div className="nav-auth">
          {isAuthenticated() ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUser className="nav-icon" />
                <span className="user-name">{user?.username}</span>
              </button>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="user-dropdown"
                >
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="auth-link">
              <FaSignInAlt className="nav-icon" />
              <span>Login</span>
            </Link>
          )}
        </div>

        <div 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
