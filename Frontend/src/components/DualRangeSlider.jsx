import React, { useState, useRef, useEffect, useCallback } from 'react';
import PriceDisplay from './PriceDisplay';

const DualRangeSlider = ({ 
  min = 0, 
  max = 5000, 
  value = [0, 5000], 
  onChange, 
  step = 1,
  className = "",
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercentage = (val) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = (e, handle) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleTouchStart = (e, handle) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = Math.round((percentage / 100) * (max - min) + min);
    const steppedValue = Math.round(newValue / step) * step;

    setLocalValue(prevRange => {
      const newRange = [...prevRange];
      if (isDragging === 'min') {
        newRange[0] = Math.min(steppedValue, prevRange[1]);
      } else {
        newRange[1] = Math.max(steppedValue, prevRange[0]);
      }
      
      // Call onChange with the new range
      onChange && onChange(newRange);
      return newRange;
    });
  }, [isDragging, disabled, max, min, step, onChange]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const percentage = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const newValue = Math.round((percentage / 100) * (max - min) + min);
    const steppedValue = Math.round(newValue / step) * step;

    setLocalValue(prevRange => {
      const newRange = [...prevRange];
      if (isDragging === 'min') {
        newRange[0] = Math.min(steppedValue, prevRange[1]);
      } else {
        newRange[1] = Math.max(steppedValue, prevRange[0]);
      }
      
      // Call onChange with the new range
      onChange && onChange(newRange);
      return newRange;
    });
  }, [isDragging, disabled, max, min, step, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const minPercentage = getPercentage(localValue[0]);
  const maxPercentage = getPercentage(localValue[1]);

  return (
    <div className={`relative ${className}`}>
      {/* Track */}
      <div 
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percentage = ((e.clientX - rect.left) / rect.width) * 100;
          const newValue = Math.round((percentage / 100) * (max - min) + min);
          const steppedValue = Math.round(newValue / step) * step;
          
          setLocalValue(prevRange => {
            // Determine which handle to move based on which is closer
            const distanceToMin = Math.abs(steppedValue - prevRange[0]);
            const distanceToMax = Math.abs(steppedValue - prevRange[1]);
            
            const newRange = [...prevRange];
            if (distanceToMin < distanceToMax) {
              newRange[0] = Math.min(steppedValue, prevRange[1]);
            } else {
              newRange[1] = Math.max(steppedValue, prevRange[0]);
            }
            
            // Call onChange with the new range
            onChange && onChange(newRange);
            return newRange;
          });
        }}
        onTouchStart={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const touch = e.touches[0];
          const percentage = ((touch.clientX - rect.left) / rect.width) * 100;
          const newValue = Math.round((percentage / 100) * (max - min) + min);
          const steppedValue = Math.round(newValue / step) * step;
          
          setLocalValue(prevRange => {
            // Determine which handle to move based on which is closer
            const distanceToMin = Math.abs(steppedValue - prevRange[0]);
            const distanceToMax = Math.abs(steppedValue - prevRange[1]);
            
            const newRange = [...prevRange];
            if (distanceToMin < distanceToMax) {
              newRange[0] = Math.min(steppedValue, prevRange[1]);
            } else {
              newRange[1] = Math.max(steppedValue, prevRange[0]);
            }
            
            // Call onChange with the new range
            onChange && onChange(newRange);
            return newRange;
          });
        }}
      >
        {/* Active range */}
        <div 
          className="absolute h-2 bg-primary rounded-full transition-all duration-75 ease-out"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`
          }}
        />
        
        {/* Min handle */}
        <div
          className={`absolute w-5 h-5 bg-white border-2 border-primary rounded-full cursor-pointer transform -translate-y-1.5 -translate-x-1/2 transition-transform duration-75 ease-out ${
            isDragging === 'min' ? 'scale-110 shadow-lg' : 'hover:scale-105 hover:shadow-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ 
            left: `${minPercentage}%`,
            transition: isDragging === 'min' ? 'none' : 'transform 0.075s ease-out'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'min')}
          onTouchStart={(e) => handleTouchStart(e, 'min')}
        >
          {/* Min tooltip */}
          {isDragging === 'min' && (
            <div 
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 bg-gray-400 text-white text-xs font-montserrat-medium-500 rounded-lg shadow-xl whitespace-nowrap z-50"
              style={{ pointerEvents: 'none' }}
            >
              <PriceDisplay 
                price={localValue[0]} 
                variant="small"
                className="text-white text-xs"
              />
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="w-2 h-2 bg-gray-400 transform rotate-45"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Max handle */}
        <div
          className={`absolute w-5 h-5 bg-white border-2 border-primary rounded-full cursor-pointer transform -translate-y-1.5 -translate-x-1/2 transition-transform duration-75 ease-out ${
            isDragging === 'max' ? 'scale-110 shadow-lg' : 'hover:scale-105 hover:shadow-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ 
            left: `${maxPercentage}%`,
            transition: isDragging === 'max' ? 'none' : 'transform 0.075s ease-out'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
          onTouchStart={(e) => handleTouchStart(e, 'max')}
        >
          {/* Max tooltip */}
          {isDragging === 'max' && (
            <div 
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 bg-gray-400 text-white text-xs font-montserrat-medium-500 rounded-lg shadow-xl whitespace-nowrap z-50"
              style={{ pointerEvents: 'none' }}
            >
              <PriceDisplay 
                price={localValue[1]} 
                variant="small"
                className="text-white text-xs"
              />
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="w-2 h-2 bg-gray-400 transform rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Value labels */}
      <div className="flex justify-between mt-2 text-xs text-black-light font-montserrat-regular-400">
        <PriceDisplay 
          price={localValue[0]} 
          variant="small"
          className="text-xs text-black-light font-montserrat-regular-400"
        />
        <PriceDisplay 
          price={localValue[1]} 
          variant="small"
          className="text-xs text-black-light font-montserrat-regular-400"
        />
      </div>
    </div>
  );
};

export default DualRangeSlider;
