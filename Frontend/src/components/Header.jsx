import React, { useState } from "react";
import { ShoppingBag, Menu, X, Heart } from "lucide-react"; // lucide-react icons
import { useSelector } from "react-redux";
import { selectFavoritesCount } from "../store/slices/favoritesSlice";
import { Link } from "react-router-dom";
import CurrencyDropdown from "./CurrencyDropdown";
import UserProfile from "./UserProfile";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/images/kiva-diamond-logo.png";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const favoritesCount = useSelector(selectFavoritesCount);
  const { user, logout } = useAuth();
  console.log('user :', user);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 xl:px-32 py-4">
        {/* Logo */}
        <div className="  rounded-md">
          <Link to="/" className="flex-shrink-0 ">
            {/* <div className="inline-block bg-gray-600 rounded-lg p-1 shadow-2xl">
              <img
                src={Logo}
                alt="KIVA Diamond Logo"
                className="h-[45px] w-auto"
                style={{
                  filter: "brightness(1.1) contrast(1.1)",
                }}
              />
            </div> */}
              <div div className="text-xl font-serif text-primary">Aurora</div>
          </Link>
        </div>
        {/* <
        
        </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden xl:flex space-x-8 text-[#1e2b38] font-medium">
          <Link
            to="/shop"
            className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
          >
            Shop
          </Link>
          <Link
            to="/rings"
            className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
          >
            Rings
          </Link>
          <Link
            to="/earrings"
            className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
          >
            Earrings
          </Link>
          <Link
            to="/bracelets"
            className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
          >
            Bracelets
          </Link>
          <Link
            to="/necklaces"
            className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
          >
            Necklaces
          </Link>
          <Link
            to="/favorites"
            className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px] flex items-center gap-1"
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
            to="/about"
            className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-black text-black-light font-montserrat-medium-500 text-[16px]"
          >
            Contact Us
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
        <div className="fixed inset-0 bg-black/50 z-50 xl:hidden">
          <div className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg p-6 overflow-y-auto">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5 text-[#1e2b38]" />
            </button>

            {/* Logo */}
            <div className="text-xl font-serif text-primary mb-8">Aurora</div>

            {/* Currency Selection */}
            {/* <div className="mb-8">
              <label className="block text-sm font-montserrat-medium-500 text-gray-600 mb-3">
                Currency
              </label>
              <CurrencyDropdown />
            </div> */}

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-2">
              <Link
                to="/shop"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
              >
                Shop
              </Link>
              <Link
                to="/rings"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
              >
                Rings
              </Link>
              <Link
                to="/earrings"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
              >
                Earrings
              </Link>
              <Link
                to="/bracelets"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
              >
                Bracelets
              </Link>
              <Link
                to="/necklaces"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
              >
                Necklaces
              </Link>
              <Link
                to="/favorites"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100 flex items-center gap-2"
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
                to="/about"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-gray-100"
              >
                Contact Us
              </Link>

              {/* Auth Links - Mobile */}
              {user ? (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 min-w-8 min-h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-montserrat-semibold-600">
                        {user.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-montserrat-semibold-600 text-black">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs font-montserrat-regular-400 text-black-light">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block hover:text-red-600 text-red-600 font-montserrat-medium-500 text-base py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <Link
                    to="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-primary text-black-light font-montserrat-medium-500 text-base py-2 border-b border-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-montserrat-medium-500 text-sm transition-colors duration-300 mt-4 text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
