import React, { useState } from "react";
import { ShoppingBag, Menu, X, Heart } from "lucide-react"; // lucide-react icons
import { useSelector } from "react-redux";
import { selectFavoritesCount } from "../store/slices/favoritesSlice";
import { Link, useLocation } from "react-router-dom";
import CurrencyDropdown from "./CurrencyDropdown";
import UserProfile from "./UserProfile";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/images/kiva-diamond-logo.png";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const favoritesCount = useSelector(selectFavoritesCount);
  const { user, logout } = useAuth();
  const location = useLocation();
  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <div className="  rounded-md">
          <Link to="/" className="flex-shrink-0 ">
            <div className="inline-block bg-primary-dark rounded-lg p-1 shadow-2xl">
              <img
                src={Logo}
                alt="KIVA Diamond Logo"
                className="h-[45px] w-auto"
                style={{
                  filter: "brightness(1.1) contrast(1.1)",
                }}
              />
            </div>
          </Link>
        </div>
        {/* <
        
        </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-6 text-[#1e2b38] font-medium">
          {/* Category Dropdown */}
          <Link
            to="/shop"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/shop') ? 'text-primary' : 'text-black-light'
              }`}
          >
            Shop
          </Link>
          <Link
            to="/rings"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/rings') ? 'text-primary' : 'text-black-light'
              }`}
          >
            Rings
          </Link>
          <Link
            to="/wedding-band"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/wedding-band') ? 'text-primary' : 'text-black-light'
              }`}
          >
            Wedding Band
          </Link>
          <Link
            to="/earrings"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/earrings') ? 'text-primary' : 'text-black-light'
              }`}
          >
            Earrings
          </Link>
          <Link
            to="/bracelets"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/bracelets') ? 'text-primary' : 'text-black-light'
              }`}
          >
            Bracelets
          </Link>
          <Link
            to="/necklaces"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/necklaces') ? 'text-primary' : 'text-black-light'
              }`}
          >
            Necklaces
          </Link>

          <Link
            to="/favorites"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] flex items-center gap-1 transition-colors duration-200 ${isActive('/favorites') ? 'text-primary' : 'text-black-light'
              }`}
          >
            <Heart className="w-4 h-4" />
            Favorites
            {favoritesCount > 0 && (
              <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link
            to="/custom"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/custom') ? 'text-primary' : 'text-black-light'
              }`}
          >
            Custom
          </Link>
          <Link
            to="/about"
            className={`${user !== null ? "" : "hidden"}  nav:inline-block hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/about') ? 'text-primary' : 'text-black-light'
              }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`hover:text-black font-montserrat-medium-500 text-[16px] transition-colors duration-200 ${isActive('/contact') ? 'text-primary' : 'text-black-light'
              }`}
          >
            Contact
          </Link>

        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Currency Dropdown - Single instance for all screen sizes */}
          <CurrencyDropdown />

          {/* Auth Links - Desktop */}
          <div className="hidden xl:flex items-center space-x-4">
            {user ? (
              <UserProfile user={user} onLogout={logout} />
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="text-black-light hover:text-black font-montserrat-medium-500 text-sm transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-montserrat-medium-500 text-sm transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Cart Button */}
          {/* <button 
            onClick={() => dispatch(openCart())}
            className="relative hover:opacity-80 transition-opacity duration-300 p-2"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e2b38]" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </button> */}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="xl:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Menu className="w-6 h-6 text-[#1e2b38]" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 xl:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute top-0 left-0 w-80 max-w-sm h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              {/* Logo */}
              <div className="text-2xl font-serif text-primary font-bold">Aurora</div>

              {/* Close Button */}
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">

              {/* Currency Selection */}
              {/* <div className="mb-8">
              <label className="block text-sm font-montserrat-medium-500 text-gray-600 mb-3">
                Currency
              </label>
              <CurrencyDropdown />
            </div> */}

              {/* Navigation Links */}
              <nav className="space-y-1 mb-1">
                {/* Category Dropdown for Mobile */}


                <Link
                  to="/shop"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/shop')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Shop
                </Link>
                <Link
                  to="/rings"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/rings')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Rings
                </Link>
                <Link
                  to="/wedding-band"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/wedding-band')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Wedding Band
                </Link>
                <Link
                  to="/earrings"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/earrings')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Earrings
                </Link>
                <Link
                  to="/bracelets"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/bracelets')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Bracelets
                </Link>
                <Link
                  to="/necklaces"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/necklaces')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Necklaces
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/favorites')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Favorites
                  </div>
                  {favoritesCount > 0 && (
                    <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/custom"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/custom')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Custom
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/about')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base transition-all duration-200 ${isActive('/contact')
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  Contact Us
                </Link>

              </nav>

              {/* User Section */}
              {user ? (
                <div className=" border-gray-200 pt-0">
                  {/* User Profile Header */}
                  {/* <div className="flex items-center space-x-3 m-2-6 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-lg font-montserrat-semibold-600">
                      {user.name?.charAt(0) || user.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-montserrat-semibold-600 text-gray-900 truncate">
                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'User'}
                    </p>
                    <p className="text-sm font-montserrat-regular-400 text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>  
                </div> */}

                  {/* User Actions */}
                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-2 rounded-lg font-montserrat-medium-500 text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    {/* <Link
                    to="/change-password"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-2 rounded-lg font-montserrat-medium-500 text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200"
                  >
                    Change Password
                  </Link> */}
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 rounded-lg font-montserrat-medium-500 text-base text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-3">
                    <Link
                      to="/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center border border-gray-300 px-4 py-3 rounded-lg font-montserrat-medium-500 text-base text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/sign-up"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-lg font-montserrat-medium-500 text-base bg-primary text-white hover:bg-primary-dark transition-all duration-200 shadow-md"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
