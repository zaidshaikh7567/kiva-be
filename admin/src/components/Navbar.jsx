import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_KEYS } from '../constants/tokenKeys';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings,
  Moon,
  Sun,
  ChevronDown,
  Lock
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, pageTitle }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector(selectUser);
  const profileMenuRef = useRef(null);

  const profileMenuItems = [
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Change Password', icon: Lock, path: '/change-password' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];
  
  const handleMenuItemClick = (path) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.AUTHENTICATED);
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to appropriate page based on search query
      // You can customize this logic based on your needs
      // For now, we'll just log it. You can add actual search functionality later
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 h-20">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors z-50 relative"
          >
            <Menu className="w-6 h-6 text-black" />
          </button>

          {/* Page Title */}
          <div className="hidden sm:block">
            <h1 className="text-xl font-sorts-mill-gloudy font-bold text-black">
              {pageTitle}
            </h1>
            <p className="text-sm font-montserrat-light-300 text-black-light">
              Manage your jewelry business
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        {/* <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders, customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
            />
          </form>
        </div> */}

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          {/* <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-black-light" />
            ) : (
              <Moon className="w-5 h-5 text-black-light" />
            )}
          </button> */}

          {/* Notifications */}
          {/* <div className="relative">
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-black-light" />
             
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-montserrat-medium-500">
                3
              </span>
            </button>
          </div> */}

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-montserrat-medium-500 text-black">{user.name}</p>
                <p className="text-xs font-montserrat-light-300 text-black-light">{user.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-black-light" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {profileMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleMenuItemClick(item.path)}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-black-light" />
                      <span className="font-montserrat-medium-500 text-black">{item.label}</span>
                    </button>
                  );
                })}
                <div className="border-t border-gray-200 my-2"></div>
                <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600">
                  <span className="font-montserrat-medium-500">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {/* <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:1 focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
          />
        </form>
      </div> */}
    </header>
  );
};

export default Navbar;
