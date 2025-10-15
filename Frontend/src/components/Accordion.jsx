import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const Accordion = ({ title, children, isOpen = false, onToggle, icon }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className=" rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 bg-white hover:bg-primary/10 transition-all duration-200 flex items-center justify-between text-left group"
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <span className="font-montserrat-semibold-600 text-primary-dark text-left group-hover:text-primary transition-colors duration-200">
            {title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {isExpanded ? (
            <Minus className="w-5 h-5 text-primary-dark " />
          ) : (
            <Plus className="w-5 h-5 text-primary-dark group-hover:text-primary transition-colors duration-200" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 py-4 bg-white border-t border-gray-100">
          <div className="text-sm font-montserrat-regular-400 text-black-light leading-relaxed">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
