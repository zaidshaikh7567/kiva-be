import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AppRoutes from '../routes/AppRoutes';
import ScrollToTop from '../helpers/ScrollToTop';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard',
      '/products': 'Products',
      '/categories': 'Categories',
      '/orders': 'Orders',
      '/customers': 'Customers',
      '/analytics': 'Analytics',
      '/reviews': 'Reviews',
      '/favorites': 'Favorites',
      '/settings': 'Settings',
      '/metals': 'Metals',
      '/center-stones': 'Center Stones'
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Navbar */}
        <Navbar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          pageTitle={getPageTitle()}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-80px)] bg-secondary">
          <div className=" mx-auto">
            <AppRoutes />
            <ScrollToTop/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
