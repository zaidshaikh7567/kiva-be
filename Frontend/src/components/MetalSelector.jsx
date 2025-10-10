import React from 'react';

const MetalSelector = ({ selectedMetal, onMetalChange, className = "" }) => {
  const metalOptions = [
    // {
    //   id: '10k-white',
    //   karat: '10K',
    //   color: 'White Gold',
    //   priceMultiplier: 1.0,
    //   gradient: 'from-gray-300 to-gray-400',
    //   borderColor: 'border-gray-300',
    //   textColor: 'text-gray-800',
    //   backgroundColor: 'linear-gradient(to right, #d1d5db, #9ca3af)'
    // },
    {
      id: '14k-white',
      karat: '14K',
      color: 'White Gold',
      priceMultiplier: 1.2,
      gradient: 'from-gray-200 to-gray-300',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
      backgroundColor: 'linear-gradient(to right, #e5e7eb, #d1d5db)'
    },
    {
      id: '18k-white',
      karat: '18K',
      color: 'White Gold',
      priceMultiplier: 1.5,
      gradient: 'from-gray-100 to-gray-200',
      borderColor: 'border-gray-100',
      textColor: 'text-gray-600',
      backgroundColor: 'linear-gradient(to right, #f3f4f6, #e5e7eb)'
    },
    // {
    //   id: '10k-yellow',
    //   karat: '10K',
    //   color: 'Yellow Gold',
    //   priceMultiplier: 1.0,
    //   gradient: 'from-yellow-100 to-yellow-200',
    //   borderColor: 'border-yellow-200',
    //   textColor: 'text-yellow-700',
    //   backgroundColor: 'linear-gradient(to right, #fefce8, #fef08a)'
    // },
    {
      id: '14k-yellow',
      karat: '14K',
      color: 'Yellow Gold',
      priceMultiplier: 1.2,
      gradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-100',
      textColor: 'text-yellow-600',
      backgroundColor: 'linear-gradient(to right, #fffbeb, #fefce8)'
    },
    {
      id: '18k-yellow',
      karat: '18K',
      color: 'Yellow Gold',
      priceMultiplier: 1.5,
      gradient: 'from-yellow-25 to-yellow-50',
      borderColor: 'border-yellow-50',
      textColor: 'text-yellow-500',
      backgroundColor: 'linear-gradient(to right, #fffbeb, #fffbeb)'
    },
    // {
    //   id: '10k-rose',
    //   karat: '10K',
    //   color: 'Rose Gold',
    //   priceMultiplier: 1.0,
    //   gradient: 'from-pink-100 to-pink-200',
    //   borderColor: 'border-pink-200',
    //   textColor: 'text-pink-700',
    //   backgroundColor: 'linear-gradient(to right, #fdf2f8, #fce7f3)'
    // },
    {
      id: '14k-rose',
      karat: '14K',
      color: 'Rose Gold',
      priceMultiplier: 1.2,
      gradient: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-100',
      textColor: 'text-pink-600',
      backgroundColor: 'linear-gradient(to right, #fdf2f8, #fdf2f8)'
    },
    {
      id: '18k-rose',
      karat: '18K',
      color: 'Rose Gold',
      priceMultiplier: 1.5,
      gradient: 'from-pink-25 to-pink-50',
      borderColor: 'border-pink-50',
      textColor: 'text-pink-500',
      backgroundColor: 'linear-gradient(to right, #fdf2f8, #fdf2f8)'
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <h3 className="text-base font-montserrat-semibold-600 text-black mb-2">
          Metal Options
        </h3>
        <p className="text-xs font-montserrat-regular-400 text-black-light mb-3">
          Choose your preferred metal type and karat
        </p>
      </div>

      {/* Metal Options Grid */}
      <div className="grid grid-cols-3 gap-3">
        {metalOptions.map((metal) => (
          <button
            key={metal.id}
            onClick={() => onMetalChange(metal)}
            className={`
              relative p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg
              ${selectedMetal?.id === metal.id 
                ? 'border-primary ring-2 ring-primary ring-opacity-50 shadow-lg bg-primary-light' 
                : `border-gray-200 hover:border-primary-light ${metal.borderColor} bg-white hover:bg-gray-50`
              }
            `}
          >
            {/* Metal Color Preview with Karat Overlay */}
            <div 
              className={`w-full h-10 rounded-lg mb-3 bg-gradient-to-r ${metal.gradient} border border-gray-200 relative flex items-center justify-center shadow-md`}
              style={{ background: metal.backgroundColor }}
            >
              <div className={`font-montserrat-bold-700 text-base  drop-shadow-sm`}>
                {metal.karat}
              </div>
            </div>
            
            {/* Metal Info */}
            <div className="text-center">
              <div className="font-montserrat-semibold-600 text-black text-sm leading-tight">
                {metal.color}
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedMetal?.id === metal.id && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Metal Display */}
      {selectedMetal && (
        <div className="bg-primary-light rounded-md p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-montserrat-semibold-600 text-black text-sm">
                {selectedMetal.karat} {selectedMetal.color}
              </div>
              <div className="text-xs font-montserrat-regular-400 text-black-light">
                Premium quality metal
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-montserrat-medium-500 text-primary">
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
