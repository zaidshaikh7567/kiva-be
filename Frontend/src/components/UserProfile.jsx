import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Package, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    onLogout();
    setIsOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    navigate('/change-password');
  };
const getInitials = (name) => {
  
  if (!name) return '';

  const parts = name.trim().split(' ');
  const first = parts[0]?.charAt(0) || '';
  const last = parts[1]?.charAt(0) || '';

  return (first + last).toUpperCase();
};

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center outline-none space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
      >
        <div className="w-10 h-10 min-w-10 min-h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-montserrat-semibold-600">
          {user.profileImage ? <img src={user.profileImage} alt="User" className="w-full h-full object-cover rounded-full" /> : getInitials(user.name)}
        {/* {user.name?.charAt(0)} */}
        </div>
        {/* <span className="hidden md:block font-montserrat-medium-500 text-black text-sm">
          {user?.name || 'User'}
        </span> */}
        {/* <ChevronDown className={`w-4 h-4 text-black-light transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /> */}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 " style={{ zIndex: '9999999999 !important' }}>
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-montserrat-semibold-600 text-black">
              {user?.name} 
            </p>
            <p className="text-xs font-montserrat-regular-400 text-black-light">
              {user?.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-2 text-sm font-montserrat-medium-500 text-black hover:bg-gray-50 transition-colors duration-300"
            >
              <User className="w-4 h-4 mr-3 text-black-light" />
              Dashboard
            </button>

            {/* <button
              onClick={handleChangePassword}
              className="flex items-center w-full px-4 py-2 text-sm font-montserrat-medium-500 text-black hover:bg-gray-50 transition-colors duration-300"
            >
              <Settings className="w-4 h-4 mr-3 text-black-light" />
              Change Password
            </button> */}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-montserrat-medium-500 text-red-600 hover:bg-red-50 transition-colors duration-300"
            >
              <LogOut className="w-4 h-4 mr-3 text-red-600" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
