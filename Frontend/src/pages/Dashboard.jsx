import React, { useState } from 'react';
import { Package, MapPin, CreditCard } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../store/slices/authSlice';
import ChangePasswordForm from '../components/account/ChangePasswordForm';
import ProfileForm from '../components/account/ProfileForm';
import OrdersList from '../components/account/OrdersList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const user = useSelector(selectAuthUser);

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-sorts-mill-gloudy text-black mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-black-light font-montserrat-regular-400">
            Manage your account and track your orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat-semibold-600 text-black">
                    My Account
                  </h3>
                  <p className="text-sm font-montserrat-regular-400 text-black-light">
                    Manage your profile
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
              <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 outline-none ${
                    activeTab === 'profile'
                      ? 'bg-primary-light text-primary'
                      : 'text-black-light hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-montserrat-medium-500">Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 outline-none ${
                    activeTab === 'orders'
                      ? 'bg-primary-light text-primary'
                      : 'text-black-light hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-montserrat-medium-500">My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-300 outline-none ${
                    activeTab === 'password'
                      ? 'bg-primary-light text-primary'
                      : 'text-black-light hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-montserrat-medium-500">Change Password</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && <OrdersList />}
            {activeTab === 'profile' && <ProfileForm />}
            {activeTab === 'password' && (
              <ChangePasswordForm onSuccess={() => setActiveTab('profile')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
