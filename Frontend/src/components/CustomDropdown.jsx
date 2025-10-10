import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  searchable = true,
}) => {
  console.log(value,'value');
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // --- Filter options only if searchable and query is entered ---
  const filteredOptions =
    searchable && searchQuery
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

  // --- Focus search input when dropdown opens ---
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [isOpen, searchable]);

  // --- Close dropdown when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Keyboard navigation ---
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // --- Handle option click ---
  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
    if (searchable) setSearchQuery('');
  };

  // --- Get display text for selected option ---
  const getDisplayText = () => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      {/* --- Dropdown Button --- */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full px-4 py-3 text-left bg-white border border-primary-light rounded-lg shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}
          ${isOpen ? 'ring-2 ring-primary border-primary' : ''}
        `}
      >
        <span
          className={`block truncate font-montserrat-regular-400 ${
            !value ? 'text-black-light' : 'text-black'
          }`}
        >
          {getDisplayText()}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown
            className={`h-5 w-5 text-black-light transition-transform duration-300 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {/* --- Dropdown Menu --- */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-primary-light rounded-lg shadow-lg overflow-hidden">
          {/* --- Search Input (optional) --- */}
          {searchable && options.length > 0 && (
            <div className="p-2 border-b border-primary-light bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black-light" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 text-sm font-montserrat-regular-400 text-black border border-primary-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* --- Options List --- */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm font-montserrat-regular-400 text-black-light">
                {searchable && searchQuery
                  ? 'No results found'
                  : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    w-full px-4 py-3 text-left text-sm font-montserrat-regular-400 focus:outline-none transition-colors duration-150
                    ${
                      value === option.value
                        ? 'bg-primary-light text-black font-montserrat-medium-500'
                        : 'text-black'
                    }
                    ${
                      highlightedIndex === index
                        ? 'bg-primary-light'
                        : 'hover:bg-gray-50'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
