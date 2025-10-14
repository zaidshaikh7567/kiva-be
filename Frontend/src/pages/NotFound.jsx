import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

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
          <h2 className="text-3xl md:text-4xl font-sorts-mill-gloudy text-black mb-4 font-light">
            Page Not Found
          </h2>
          <p className="text-lg font-montserrat-regular-400 text-black-light leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to exploring our beautiful jewelry collection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-montserrat-medium-500 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link
            to="/shop"
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary-dark text-primary-dark font-montserrat-medium-500 rounded-lg hover:bg-primary-dark hover:text-white transition-colors duration-300"
          >
            <Search className="w-5 h-5" />
            Browse Shop
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-montserrat-semibold-600 text-black mb-6">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/rings"
              className="p-4 bg-secondary rounded-lg hover:bg-primary-light transition-colors duration-300 group"
            >
              <div className="text-sm font-montserrat-medium-500 text-black group-hover:text-primary-dark">
                Rings
              </div>
            </Link>
            <Link
              to="/earrings"
              className="p-4 bg-secondary rounded-lg hover:bg-primary-light transition-colors duration-300 group"
            >
              <div className="text-sm font-montserrat-medium-500 text-black group-hover:text-primary-dark">
                Earrings
              </div>
            </Link>
            <Link
              to="/bracelets"
              className="p-4 bg-secondary rounded-lg hover:bg-primary-light transition-colors duration-300 group"
            >
              <div className="text-sm font-montserrat-medium-500 text-black group-hover:text-primary-dark">
                Bracelets
              </div>
            </Link>
            <Link
              to="/necklaces"
              className="p-4 bg-secondary rounded-lg hover:bg-primary-light transition-colors duration-300 group"
            >
              <div className="text-sm font-montserrat-medium-500 text-black group-hover:text-primary-dark">
                Necklaces
              </div>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="my-8 text-center">
          <p className="text-sm font-montserrat-regular-400 text-black-light">
            Still can't find what you're looking for?{' '}
            <Link
              to="/contact"
              className="text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors duration-300"
            >
              Contact us
            </Link>
            {' '}for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
