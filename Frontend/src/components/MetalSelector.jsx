import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetals, selectMetals, selectMetalsLoading } from '../store/slices/metalsSlice';
import { useLocation } from 'react-router-dom';

const MetalSelector = ({ selectedMetal, onMetalChange, className = "" }) => {
  const dispatch = useDispatch();
  const metals = useSelector(selectMetals);
  const loading = useSelector(selectMetalsLoading);
const pathname = useLocation();
console.log('pathname :', pathname);
const isProductDetail = pathname?.pathname?.includes('/product/');
const gridCols = isProductDetail ? 'grid-cols-4 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-9' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6';
  useEffect(() => {
    dispatch(fetchMetals());
  }, [dispatch]);

  // Transform API metals data to match component format
  // Expand metals to show all purity levels as separate options
  const metalOptions = metals.flatMap(metal => {
    // Generate gradient colors based on metal color
    const getColorStyles = (color, karat) => {
      const lowerColor = color.toLowerCase();
      const karatStr = String(karat); // Convert to string
      
      if (lowerColor?.includes('white')) {
        return {
          gradient: karatStr.includes('14') ? 'from-gray-200 to-gray-300' : 'from-gray-100 to-gray-200',
          borderColor: karatStr.includes('14') ? 'border-gray-200' : 'border-gray-100',
          textColor: karatStr.includes('14') ? 'text-gray-700' : 'text-gray-600',
          backgroundColor: karatStr.includes('14') 
            ? 'linear-gradient(to right, #e5e7eb, #d1d5db)' 
            : 'linear-gradient(to right, #f3f4f6, #e5e7eb)'
        };
      } else if (lowerColor.includes('gold')) {
        return {
          gradient: karatStr.includes('14') ? 'from-yellow-50 to-yellow-100' : 'from-yellow-25 to-yellow-50',
          borderColor: karatStr.includes('14') ? 'border-yellow-100' : 'border-yellow-50',
          textColor: karatStr.includes('14') ? 'text-yellow-600' : 'text-yellow-500',
          backgroundColor: karatStr.includes('14')
            ? 'linear-gradient(to right, #fffbeb, #fefce8)'
            : 'linear-gradient(to right, #fffbeb, #fffbeb)'
        };
      } else if (lowerColor.includes('rose')) {
        return {
          gradient: karatStr.includes('14') ? 'from-pink-50 to-pink-100' : 'from-pink-25 to-pink-50',
          borderColor: karatStr.includes('14') ? 'border-pink-100' : 'border-pink-50',
          textColor: karatStr.includes('14') ? 'text-pink-600' : 'text-pink-500',
          backgroundColor: 'linear-gradient(to right, #fdf2f8, #fdf2f8)'
        };
      }
      
      // Default gray for other colors
      return {
        gradient: 'from-gray-200 to-gray-300',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-700',
        backgroundColor: 'linear-gradient(to right, #e5e7eb, #d1d5db)'
      };
    };

    // Map each purity level to a separate metal option
    return metal.purityLevels?.map(purity => {
      const styles = getColorStyles(metal.name, purity.karat);
      
      return {
        id: `${purity.karat}-${metal.name.toLowerCase().replace(/\s+/g, '-')}`,
        carat: `${purity.karat}K`, // Add 'K' suffix for display
        color: metal.name,
        priceMultiplier: purity.priceMultiplier || 1.0,
        metalId: metal._id,
        purityLevelId: purity._id,
        ...styles
      };
    }) || [];
  });

  // Fallback mock data if API hasn't loaded yet
  const fallbackMetalOptions = [
    // {
    //   id: '10k-white',
    //   carat: '10K',
    //   color: 'White Gold',
    //   priceMultiplier: 1.0,
    //   gradient: 'from-gray-300 to-gray-400',
    //   borderColor: 'border-gray-300',
    //   textColor: 'text-gray-800',
    //   backgroundColor: 'linear-gradient(to right, #d1d5db, #9ca3af)'
    // },
    {
      id: '14k-white',
      carat: '14K',
      color: 'White Gold',
      priceMultiplier: 1.2,
      gradient: 'from-gray-200 to-gray-300',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
      backgroundColor: 'linear-gradient(to right, #e5e7eb, #d1d5db)'
    },
    {
      id: '18k-white',
      carat: '18K',
      color: 'White Gold',
      priceMultiplier: 1.5,
      gradient: 'from-gray-100 to-gray-200',
      borderColor: 'border-gray-100',
      textColor: 'text-gray-600',
      backgroundColor: 'linear-gradient(to right, #f3f4f6, #e5e7eb)'
    },
    {
      id: '14k-yellow',
      carat: '14K',
      color: 'Yellow Gold',
      priceMultiplier: 1.2,
      gradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-100',
      textColor: 'text-yellow-600',
      backgroundColor: 'linear-gradient(to right, #fffbeb, #fefce8)'
    },
    {
      id: '18k-yellow',
      carat: '18K',
      color: 'Yellow Gold',
      priceMultiplier: 1.5,
      gradient: 'from-yellow-25 to-yellow-50',
      borderColor: 'border-yellow-50',
      textColor: 'text-yellow-500',
      backgroundColor: 'linear-gradient(to right, #fffbeb, #fffbeb)'
    },
    // {
    //   id: '10k-rose',
    //   carat: '10K',
    //   color: 'Rose Gold',
    //   priceMultiplier: 1.0,
    //   gradient: 'from-pink-100 to-pink-200',
    //   borderColor: 'border-pink-200',
    //   textColor: 'text-pink-700',
    //   backgroundColor: 'linear-gradient(to right, #fdf2f8, #fce7f3)'
    // },
    {
      id: '14k-rose',
      carat: '14K',
      color: 'Rose Gold',
      priceMultiplier: 1.2,
      gradient: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-100',
      textColor: 'text-pink-600',
      backgroundColor: 'linear-gradient(to right, #fdf2f8, #fdf2f8)'
    },
    {
      id: '18k-rose',
      carat: '18K',
      color: 'Rose Gold',
      priceMultiplier: 1.5,
      gradient: 'from-pink-25 to-pink-50',
      borderColor: 'border-pink-50',
      textColor: 'text-pink-500',
      backgroundColor: 'linear-gradient(to right, #fdf2f8, #fdf2f8)'
    }
  ];

  // Use API data if available, otherwise use fallback
  const displayMetalOptions = metalOptions.length > 0 ? metalOptions : fallbackMetalOptions;

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
          Metal Options
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
          {displayMetalOptions.map((metal) => (
          <button
            key={metal.id}
            onClick={() => onMetalChange(metal)}
            className={`
              relative p-1 rounded-lg transition-all duration-300 
              ${selectedMetal?.id === metal.id 
                ? 'border-primary ring-1 ring-primary ring-opacity-30  bg-primary-light' 
                : 'border-secondary hover:border-primary bg-white hover:bg-secondary '
              }
            `}
          >
            {/* Metal Color Preview with Carat Overlay */}
            <div 
              className={`w-full p-2  rounded-lg  bg-gradient-to-r ${metal.gradient} border border-gray-200 relative items-center justify-center `}
              style={{ background: metal.backgroundColor }}
            >
              <div className="font-montserrat-bold-700 text-sm text-black ">
                {metal.carat}
              </div>
              <div className="font-montserrat-semibold-600 text-black text-sm leading-tight">
                {metal.color}
              </div>
            </div>
            
            {/* Metal Info */}
        

            {/* Selected Indicator */}
            {selectedMetal?.id === metal.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center ">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </button>
          ))}
        </div>
      )}

      {/* Selected Metal Display */}
      {selectedMetal && (
        <div className="bg-primary-light rounded-xl p-4 border border-primary border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-montserrat-semibold-600 text-black text-base">
                {selectedMetal.carat} {selectedMetal.color}
              </div>
              <div className="text-sm font-montserrat-regular-400 text-black-light">
                Premium quality metal
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-montserrat-medium-500 text-primary-dark">
                +{((selectedMetal.priceMultiplier - 1) * 100).toFixed(0)}% price
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetalSelector;
