import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";
import { RiPencilFill } from "react-icons/ri";
import { FaUserEdit, FaBars, FaTimes } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { BsBookmarks } from "react-icons/bs";
import { MdAdminPanelSettings } from "react-icons/md";
import SkeletonElement from "../Skeletons/SkeletonElement";
import { AuthContext } from "../../Context/AuthContext";
import { getUserPhotoUrl, handleImageError } from '../../utils/imageUtils';
import NotificationBell from './NotificationBell';
import himLogo from '../../assets/images/himlogo.png';

const Header = () => {
  const bool = localStorage.getItem("authToken") ? true : false;
  const [auth, setAuth] = useState(bool);
  const { activeUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(bool);
    setTimeout(() => {
      setLoading(false);
    }, 1600);
  }, [bool]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
    setProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={himLogo} alt="HIM Learning Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">HIM Learning</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <SearchForm />

            {auth ? (
              <div className="flex items-center space-x-4">
                {/* Create Content Button */}
                <Link
                  to="/add-content"
                  className="btn-primary flex items-center space-x-2"
                >
                  <RiPencilFill className="w-4 h-4" />
                  <span>Create Content</span>
                </Link>

                {/* Notifications */}
                <NotificationBell />

                {/* Learning Library */}
                <Link
                  to="/learning-library"
                  className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <BsBookmarks className="w-5 h-5" />
                  {activeUser.readListLength > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {activeUser.readListLength}
                    </span>
                  )}
                </Link>

                {/* Admin Panel */}
                {activeUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="nav-link flex items-center space-x-2"
                  >
                    <MdAdminPanelSettings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    {loading ? (
                      <SkeletonElement type="minsize-avatar" />
                    ) : (
                      <img
                        src={getUserPhotoUrl(activeUser.photo)}
                        alt={activeUser.username}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => handleImageError(e, 'user')}
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">{activeUser.username}</span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <FaUserEdit className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <SearchForm />

              {auth ? (
                <div className="space-y-3">
                  <Link
                    to="/add-content"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <RiPencilFill className="w-4 h-4" />
                    <span>Create Content</span>
                  </Link>

                  <Link
                    to="/learning-library"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BsBookmarks className="w-4 h-4" />
                    <span>Learning Library ({activeUser.readListLength})</span>
                  </Link>

                  {activeUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MdAdminPanelSettings className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUserEdit className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    <BiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
