import React from 'react';
import { notAvailable } from './ToastProvider';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="ml-20 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-12">
      <div className="w-full px-8 py-6">
        {/* Single Row Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Left: Logo and Copyright */}
          <div className="flex items-center space-x-6">            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-lg font-medium" style={{ fontFamily: 'MontserratAlt1, sans-serif' }}>
                  <span className="text-primary-orange">Nexus</span>
                  <span className="text-gray-900">Learn</span>
                </h2>
              </div>
            </div>
            <div className="hidden md:block text-xs text-gray-500">
              © 2024 NexusLearn. All rights reserved.
            </div>
          </div>

          {/* Center: Quick Links */}
          <div className="flex items-center space-x-6 text-xs">
            <Link to="/dashboard" className="text-gray-600 hover:text-primary-orange transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/classes" className="text-gray-600 hover:text-primary-orange transition-colors font-medium">
              Classes
            </Link>
            <Link to="/assignments" className="text-gray-600 hover:text-primary-orange transition-colors font-medium">
              Assignments
            </Link>
            <Link to="/calendar" className="text-gray-600 hover:text-primary-orange transition-colors font-medium">
              Calendar
            </Link>
          </div>

          {/* Right: Contact & Links */}
          <div className="flex items-center space-x-6 text-xs">
            <a 
              href="mailto:support@nexuslearn.edu" 
              className="text-gray-600 hover:text-primary-orange transition-colors font-medium"
            >
              Support
            </a>
            <button onClick={() => notAvailable('The privacy policy')} className="text-gray-600 hover:text-primary-orange transition-colors font-medium">
              Privacy
            </button>
            <button onClick={() => notAvailable('The terms page')} className="text-gray-600 hover:text-primary-orange transition-colors font-medium">
              Terms
            </button>
          </div>
        </div>
        
        {/* Mobile Copyright */}
        <div className="md:hidden text-center mt-4 pt-4 border-t border-gray-200/50">
          <div className="text-xs text-gray-500">
            © 2024 NexusLearn. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
