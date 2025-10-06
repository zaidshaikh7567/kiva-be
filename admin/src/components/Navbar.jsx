import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, pageTitle }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can implement dark mode logic here
  };

  const profileMenuItems = [
    { label: 'Profile', icon: User },
    { label: 'Settings', icon: Settings },
  ];

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
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-black-light" />
            ) : (
              <Moon className="w-5 h-5 text-black-light" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-black-light" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-montserrat-medium-500">
                3
              </span>
            </button>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-montserrat-medium-500 text-black">Admin</p>
                <p className="text-xs font-montserrat-light-300 text-black-light">admin@mailinator.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-black-light" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {profileMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-black-light" />
                      <span className="font-montserrat-medium-500 text-black">{item.label}</span>
                    </button>
                  );
                })}
                <div className="border-t border-gray-200 my-2"></div>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600">
                  <span className="font-montserrat-medium-500">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black-light" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-montserrat-regular-400"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
