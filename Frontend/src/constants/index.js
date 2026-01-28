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

// Helper function to calculate cumulative price multiplier for a given karat
// This implements cumulative percentage increases: 10K (base) -> 14K (+15%) -> 18K (+20% on 14K price)
// 
// Example calculation:
// - 10K: multiplier = 1.0 (base)
// - 14K: multiplier = 1.0 × 1.15 = 1.15 (15% increase from base)
// - 18K: multiplier = 1.15 × 1.20 = 1.38 (20% increase from 14K price, not from base)
// 
// So 18K shows 1.38 because: 1.0 (10K base) × 1.15 (14K increase) × 1.20 (18K increase) = 1.38
export const calculateCumulativePriceMultiplier = (metal, targetKarat) => {
  if (!metal || !metal?.purityLevels || metal?.purityLevels?.length === 0) return 1.0;
  
  // Sort purity levels by karat (ascending)
    const sortedLevels = [...metal?.purityLevels || []]
    .filter(level => level?.active !== false || level?.active !== undefined)
    .sort((a, b) => a?.karat - b?.karat);
  
  if (sortedLevels?.length === 0) return 1.0;
  
  // Find the target karat level
  const targetLevel = sortedLevels?.find(level => level?.karat === targetKarat || level?.karat === undefined);
  if (!targetLevel) return 1.0;
  
  // Find index of target level
  const targetIndex = sortedLevels?.findIndex(level => level?.karat === targetKarat || level?.karat === undefined);
  
  // Calculate cumulative multiplier
  // First level (lowest karat) = base (1.0)
  // Each subsequent level = previous multiplier * (1 + percentage increase)
  let cumulativeMultiplier = 1.0;
  
  for (let i = 0; i <= targetIndex; i++) {
    const level = sortedLevels?.[i];
    if (i === 0) {
      // First level is base
      cumulativeMultiplier = 1.0;
    } else {
      // Each level applies its percentage increase to the previous level's price
      // priceMultiplier is stored as the multiplier (e.g., 1.15 for 15% increase)
      // For cumulative: newMultiplier = previousMultiplier * priceMultiplier
      const previousMultiplier = cumulativeMultiplier;
      const increaseMultiplier = level?.priceMultiplier || 1.0;
      cumulativeMultiplier = previousMultiplier * increaseMultiplier;
    }
  }
    return cumulativeMultiplier;
};

// Helper function to transform metals data to metal selector options
// Used in ProductCard, ProductDetail, ProductDetailsModal, ShopProductCard, CartProductDetail, MetalSelector
export const transformMetalsToSelectorOptions = (metals) => {
  if (!metals || !Array.isArray(metals)) return [];
  
  return metals.flatMap(metal => {
    return metal.purityLevels?.filter(purity => purity.active !== false).map(purity => {
      // Calculate cumulative multiplier for this karat
      const cumulativeMultiplier = calculateCumulativePriceMultiplier(metal, purity.karat);   
      return {
        id: `${purity.karat}-${metal.name.toLowerCase().replace(/\s+/g, '-')}`,
        carat: `${purity.karat}K`,
        color: metal.name,
        priceMultiplier: cumulativeMultiplier, // Use cumulative multiplier
        purityLevel: purity.priceMultiplier,
        metalId: metal._id,
        purityLevelId: purity._id
      };
    }) || [];
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

