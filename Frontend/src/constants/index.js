// Sort Options
export const SORT_OPTIONS = {
  // For category pages (Rings, Earrings, Bracelets, Necklaces, WeddingBand)
  CATEGORY: [
    // { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    // { value: 'rating', label: 'Highest Rated' },
  ],
  // For Shop page
  SHOP: [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
  ],
};

// Service Options for Contact Form
export const SERVICE_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'custom', label: 'Custom Design' },
  { value: 'repair', label: 'Jewelry Repair' },
  { value: 'appraisal', label: 'Jewelry Appraisal' },
  { value: 'consultation', label: 'Personal Consultation' },
  { value: 'wholesale', label: 'Wholesale Inquiry' },
];

// Timeline Options for Custom Order Form
export const TIMELINE_OPTIONS = [
  { value: '1-2 weeks', label: '1-2 weeks' },
  { value: '2-4 weeks', label: '2-4 weeks' },
  { value: '1-2 months', label: '1-2 months' },
  { value: '2-3 months', label: '2-3 months' },
  { value: 'flexible', label: 'Flexible' },
];

// Helper function to transform metals data to dropdown options
// Used in Custom page - displays "karat + name" format
export const transformMetalsToDropdownOptions = (metals) => {
  if (!metals || !Array.isArray(metals)) return [];
  
  return metals
    .filter(metal => metal.active !== false)
    .flatMap(metal => {
      return metal.purityLevels
        ?.filter(purity => purity.active !== false)
        .map(purity => ({
          value: `${purity.karat}K ${metal.name}`,
          label: `${purity.karat}K ${metal.name}`
        })) || [];
    });
};

// Helper function to transform stones data to dropdown options
// Used in Custom page
export const transformStonesToDropdownOptions = (stones) => {
  if (!stones || !Array.isArray(stones)) return [];
  
  return stones
    .filter(stone => stone.active !== false)
    .map(stone => ({
      value: stone.name,
      label: stone.name
    }));
};

// Helper function to transform metals data to metal selector options
// Used in ProductCard, ProductDetail, ProductDetailsModal, ShopProductCard, CartProductDetail, MetalSelector
export const transformMetalsToSelectorOptions = (metals) => {
  if (!metals || !Array.isArray(metals)) return [];
  
  return metals.flatMap(metal => {
    return metal.purityLevels?.filter(purity => purity.active !== false).map(purity => ({
      id: `${purity.karat}-${metal.name.toLowerCase().replace(/\s+/g, '-')}`,
      carat: `${purity.karat}K`,
      color: metal.name,
      priceMultiplier: purity.priceMultiplier || 1.0,
      metalId: metal._id,
      purityLevelId: purity._id
    })) || [];
  });
};

// Helper function to get color styles for metal selector
// Used in MetalSelector component
export const getMetalColorStyles = (color, karat) => {
  const lowerColor = color?.toLowerCase() || '';
  const normalizedColor = lowerColor.replace(/\s+/g, '');
  const karatStr = String(karat);

  const isWhiteTone = lowerColor.includes('white') || lowerColor.includes('silver') || normalizedColor.includes('#ffffff');
  const isYellowTone = lowerColor.includes('gold') || lowerColor.includes('yellow') || normalizedColor.includes('#ffd700') || normalizedColor.includes('#ffea00');
  const isRoseTone = lowerColor.includes('rose') || lowerColor.includes('pink');

  if (isWhiteTone) {
    return {
      gradient: karatStr.includes('14') ? 'from-gray-200 to-gray-300' : 'from-gray-100 to-gray-200',
      borderColor: karatStr.includes('14') ? 'border-gray-200' : 'border-gray-100',
      textColor: karatStr.includes('14') ? 'text-gray-700' : 'text-gray-600',
      backgroundColor: karatStr.includes('14') 
        ? 'linear-gradient(to right, #f3f4f6, #f3f4f6)' 
        : 'linear-gradient(to right, #f3f4f6, #f3f4f6)'
    };
  } else if (isYellowTone) {
    return {
      gradient: karatStr.includes('14') ? 'from-amber-100 to-yellow-100' : 'from-amber-50 to-yellow-50',
      borderColor: karatStr.includes('14') ? 'border-amber-100' : 'border-amber-50',
      textColor: karatStr.includes('14') ? 'text-amber-700' : 'text-amber-600',
      backgroundColor: karatStr.includes('14')
        ? 'linear-gradient(to right, #fffbeb, #fffbeb)'
        : 'linear-gradient(to right, #fffbeb, #fffbeb)'
    };
  } else if (isRoseTone) {
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

