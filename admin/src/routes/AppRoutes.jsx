import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Categories from '../pages/Categories';
import Orders from '../pages/Orders';
import Customers from '../pages/Customers';
import Analytics from '../pages/Analytics';
import Reviews from '../pages/Reviews';
import Favorites from '../pages/Favorites';
import Settings from '../pages/Settings';
import SocialHandles from '../pages/SocialHandles';
import Metals from '../pages/Metals';
import CenterStones from '../pages/CenterStones';
import Profile from '../pages/Profile';
import ChangePassword from '../pages/ChangePassword';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default route - redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Main application routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/metals" element={<Metals />} />
      <Route path="/center-stones" element={<CenterStones />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/social-handles" element={<SocialHandles />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      
      {/* 404 Route - Must be last */}
      <Route path="*" element={<NotFound />} />
     
    </Routes>
  );
};

export default AppRoutes;
