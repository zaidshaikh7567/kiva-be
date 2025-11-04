import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { fetchCategories, selectCategories } from '../store/slices/categoriesSlice';

const CategoryDropdown = ({ onCloseMobileMenu, isMobile = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const categories = useSelector(selectCategories);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get main categories (parent categories only)
  const mainCategories = categories.filter(cat => !cat.parent);

  // Map category names to routes
  const categoryToRoute = (categoryName) => {
    const routeMap = {
      'ring': '/rings',
      'rings': '/rings',
      'earring': '/earrings',
      'earrings': '/earrings',
      'bracelet': '/bracelets',
      'bracelets': '/bracelets',
      'necklace': '/necklaces',
      'necklaces': '/necklaces',
    };
    
    const name = categoryName?.toLowerCase();
    return routeMap[name] || '/shop';
  };

  // Check if a category route is currently active
  const isCategoryActive = (category) => {
    const route = categoryToRoute(category.name);
    return location.pathname === route || location.pathname.startsWith(route + '/');
  };

  // Check if any category page is active
  const isAnyCategoryActive = () => {
    return mainCategories.some(category => isCategoryActive(category));
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    const route = categoryToRoute(category.name);
    navigate(route);
    setIsOpen(false);
    // Close mobile menu if provided
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`
          flex items-center justify-between w-full pl-4 pr-0 py-3 rounded-lg font-montserrat-medium-500 text-base
          transition-all duration-200
          ${isMobile 
            ? isOpen 
              ? 'bg-primary text-white ' 
              : isAnyCategoryActive()
                ? 'text-primary'
                : 'text-gray-700  hover:text-primary'
            : isOpen 
              ? ' text-primary ' 
              : isAnyCategoryActive()
                ? 'text-primary'
                : ' text-black-light hover:text-black '
          }
        `}
      >
        <span>Categories</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`${
            isMobile 
              ? 'relative w-full mt-2 bg-gray-50 rounded-lg border border-gray-200' 
              : 'absolute z-50 top-full left-0 mt-0 w-56 bg-white border border-gray-200 rounded-lg shadow-xl'
          } overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-h-80 overflow-auto">
            {mainCategories.length === 0 ? (
              <div className="px-4 py-3 text-sm font-montserrat-regular-400 text-black-light">
                No categories available
              </div>
            ) : (
              <div className="py-2">
                {mainCategories.map((category) => {
                  const isActive = isCategoryActive(category);
                  return (
                    <button
                      key={category._id || category.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm font-montserrat-medium-500 transition-colors duration-150 ${
                        isActive
                          ? 'bg-primary-light text-primary'
                          : 'text-black hover:bg-primary-light hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
                {/* Always show Shop link */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/shop');
                    setIsOpen(false);
                    if (onCloseMobileMenu) {
                      onCloseMobileMenu();
                    }
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-montserrat-medium-500 text-black hover:bg-primary-light hover:text-white transition-colors duration-150 border-t border-gray-100 mt-2"
                >
                  All Products
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;

