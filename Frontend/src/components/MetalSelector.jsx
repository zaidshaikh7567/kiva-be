import React from 'react';

const MetalSelector = ({ selectedMetal, onMetalChange, className = "" }) => {
  const metalOptions = [
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
    // {
    //   id: '10k-yellow',
    //   carat: '10K',
    //   color: 'Yellow Gold',
    //   priceMultiplier: 1.0,
    //   gradient: 'from-yellow-100 to-yellow-200',
    //   borderColor: 'border-yellow-200',
    //   textColor: 'text-yellow-700',
    //   backgroundColor: 'linear-gradient(to right, #fefce8, #fef08a)'
    // },
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
      <div className="grid grid-cols-3 gap-4">
        {metalOptions.map((metal) => (
          <button
            key={metal.id}
            onClick={() => onMetalChange(metal)}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl group
              ${selectedMetal?.id === metal.id 
                ? 'border-primary ring-2 ring-primary ring-opacity-30 shadow-xl bg-primary-light' 
                : 'border-secondary hover:border-primary bg-white hover:bg-secondary shadow-sm hover:shadow-lg'
              }
            `}
          >
            {/* Metal Color Preview with Carat Overlay */}
            <div 
              className={`w-full h-12 rounded-xl mb-4 bg-gradient-to-r ${metal.gradient} border border-gray-200 relative flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
              style={{ background: metal.backgroundColor }}
            >
              <div className="font-montserrat-bold-700 text-lg text-black drop-shadow-sm">
                {metal.carat}
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
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>

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
