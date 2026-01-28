import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectMetals, selectMetalsLoading } from '../store/slices/metalsSlice';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { transformMetalsToSelectorOptions, getMetalColorStyles } from '../constants';

const MetalSelector = ({ selectedMetal, onMetalChange, className = "", product, cartItem }) => {
  const metals = useSelector(selectMetals);
  const loading = useSelector(selectMetalsLoading);
const pathname = useLocation();
const isProductDetail = pathname?.pathname?.includes('/product/');
  // useEffect(() => {
  //   dispatch(fetchMetals());
  // }, [dispatch]);

  // Transform API metals data to match component format
  // Expand metals to show all purity levels as separate options
  const baseMetalOptions = transformMetalsToSelectorOptions(metals);
  
  // Add color styles to each metal option
  const metalOptions = baseMetalOptions.map(option => {
    const karat = parseInt(option.carat.replace('K', ''));
    const styles = getMetalColorStyles(option.color, karat);
    
    return {
      ...option,
      carat: option.carat, // Already has 'K' suffix from transformMetalsToSelectorOptions
      ...styles
    };
  });

  // Fallback mock data if API hasn't loaded yet
 

  // Use API data if available, otherwise use fallback
  const allMetalOptions = metalOptions.length > 0 && metalOptions !== null ? metalOptions : [];

  // Filter metals based on product availability
  // Get available metal IDs from product
  const availableMetalIds = useMemo(() => {
    if (!product?.metals || !Array.isArray(product.metals) || product.metals.length === 0) {
      // If no metals specified in product, return empty array (no metals available)
      return [];
    }
    // Extract metal IDs from populated metals array
    return product.metals.map(metal => {
      // Handle both populated object and ID string
      return metal?._id || metal?.id || metal;
    });
  }, [product]);
  
  
  // Check if product has any metals configured
  const hasProductMetals = product?.metals && Array.isArray(product.metals) && product.metals.length > 0;

  // Get selected metal ID from cart item (if available) to ensure it's always enabled
  const selectedMetalIdFromCart = useMemo(() => {
    if (cartItem?.metal?._id) {
      return cartItem.metal._id;
    }
    if (selectedMetal?.metalId) {
      return selectedMetal.metalId;
    }
    return null;
  }, [cartItem, selectedMetal]);

  // Mark metals as enabled/disabled based on product availability
  const displayMetalOptions = useMemo(() => {
    return allMetalOptions.map(metalOption => {
      // If product has no metals configured, all metals are disabled
      // Only enable metals that are in the product's metals list or are selected in cart
      const isAvailable = hasProductMetals && (
        availableMetalIds.includes(metalOption.metalId) ||
        metalOption.metalId === selectedMetalIdFromCart
      );
      
      return {
        ...metalOption,
        isAvailable
      };
    });
  }, [allMetalOptions, availableMetalIds, selectedMetalIdFromCart, hasProductMetals]);
  

  // If product has no metals configured, show message instead of metal options
  if (!hasProductMetals && product) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
            Metal Options
          </h3>
          <p className="text-sm font-montserrat-regular-400 text-black-light">
            This product does not have metal options available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
          Metal Options <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm font-montserrat-regular-400 text-black-light">
          Choose your preferred metal type and carat
        </p>
      </div>

      {/* Metal Options Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-black-light mt-2">Loading metals...</p>
        </div>
      ) : (
        <div className={`grid ${isProductDetail ? 'grid-cols-4 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-9' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'} gap-2`}>
          {displayMetalOptions.map((metal) => {
            const isDisabled = !metal.isAvailable;
            const isSelected = selectedMetal?.id === metal.id;
            
            return (
              <button
              key={metal.id}
              onClick={() => {
                if (!isDisabled) {
                  onMetalChange(metal);
                }
              }}
              disabled={isDisabled}
              className={`
                relative p-1 rounded-lg transition-all duration-300 
                ${isSelected
                  ? 'border-primary ring-1 ring-primary ring-opacity-30 bg-primary-light' 
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 opacity-90 cursor-not-allowed'
                  : 'border-secondary hover:border-primary bg-white hover:bg-secondary'
                }
              `}
              title={isDisabled ? 'This metal is not available for this product' : ''}
            >
              {/* Metal Color Preview with Carat Overlay */}
              <div 
                className={`w-full p-2 rounded-lg bg-gradient-to-r ${metal.gradient} border border-gray-200 relative items-center justify-center ${isDisabled ? 'opacity-50' : ''}`}
                style={{ background: metal.backgroundColor }}
              >
                <div className="font-montserrat-bold-700 text-sm text-black ">
                  {metal.carat}
                </div>
                <div className="font-montserrat-semibold-600 text-black text-sm leading-tight capitalize">
                  {metal.color}
                </div>
              </div>
              
              {/* Disabled Indicator - Cross Icon */}
              {isDisabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 rounded-lg">
                  <X className="w-6 h-6 text-gray-400" strokeWidth={3} />
                </div>
              )}
              
              {/* Selected Indicator */}
              {isSelected && !isDisabled && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
            )
          })}

        
        </div>
      )}

      {/* Selected Metal Display */}
      {selectedMetal && (
        <div className="bg-primary-light rounded-xl p-4 border border-primary border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-montserrat-semibold-600 text-black text-base capitalize">
                {selectedMetal.carat} {selectedMetal.color}
              </div>
              {/* <div className="text-sm font-montserrat-regular-400 text-black-light">
                Premium quality metal
              </div> */}
            </div>
            <div className="text-right">
              <div className="text-sm font-montserrat-medium-500 text-primary-dark">
                +{((selectedMetal.purityLevel - 1) * 100).toFixed(0)}% price
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetalSelector;
