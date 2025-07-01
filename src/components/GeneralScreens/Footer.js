import React from "react";
import { Link } from 'react-router-dom';
// Import logo directly
import himLogo from '../../assets/images/himlogo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4">
            <img src={himLogo} alt="HIM Learning" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900">HIM Learning</span>
          </div>
          <p className="text-gray-600 text-sm">
            Empowering learners and writers to share knowledge and connect with the community.
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 HIM Learning. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
