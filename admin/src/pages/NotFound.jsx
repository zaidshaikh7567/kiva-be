import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Settings, Database } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="my-8">
          <h1 className="text-8xl md:text-9xl font-sorts-mill-gloudy text-primary-dark font-thin leading-none">
            404
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-sorts-mill-gloudy text-black mb-4 font-light">
            Page Not Found
          </h2>
          <p className="text-lg font-montserrat-regular-400 text-black-light leading-relaxed">
            The admin page you're looking for doesn't exist or has been moved. 
            Let's get you back to managing your jewelry store.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-montserrat-medium-500 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link
            to="/products"
             className="flex items-center gap-2 px-6 py-3 border-2 border-primary-dark text-primary-dark font-montserrat-medium-500 rounded-lg hover:bg-primary-dark hover:text-white transition-colors duration-300"
          >
            <Database className="w-5 h-5" />
            Manage Products
          </Link>
        </div>

        {/* Admin Quick Links */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Admin Quick Access
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/products"
              className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-600" />
                <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                  Products
                </div>
              </div>
            </Link>
            <Link
              to="/categories"
              className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-green-600" />
                <div className="text-sm font-medium text-gray-800 group-hover:text-green-600">
                  Categories
                </div>
              </div>
            </Link>
            <Link
              to="/orders"
              className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-purple-600" />
                <div className="text-sm font-medium text-gray-800 group-hover:text-purple-600">
                  Orders
                </div>
              </div>
            </Link>
            <Link
              to="/customers"
              className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-orange-600" />
                <div className="text-sm font-medium text-gray-800 group-hover:text-orange-600">
                  Customers
                </div>
              </div>
            </Link>
            <Link
              to="/analytics"
              className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-indigo-600" />
                <div className="text-sm font-medium text-gray-800 group-hover:text-indigo-600">
                  Analytics
                </div>
              </div>
            </Link>
            <Link
              to="/settings"
              className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <div className="text-sm font-medium text-gray-800 group-hover:text-gray-600">
                  Settings
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please check the URL or contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
