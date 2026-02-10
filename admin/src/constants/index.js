// ============================================
// PRODUCT CONSTANTS
// ============================================

// Care instructions options
export const CARE_OPTIONS = [
  'Professional Cleaning',
  'Clean with Soft Cloth',
  'Avoid Chemicals',
  'Store Separately',
  'Remove Before Swimming',
  'Ultrasonic Cleaning Safe',
];

// Shape options
export const SHAPE_OPTIONS = [
  { value: 'Round', label: 'Round' },
  { value: 'Princess', label: 'Princess' },
  { value: 'Oval', label: 'Oval' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Pear', label: 'Pear' },
  { value: 'Marquise', label: 'Marquise' },
  { value: 'Cushion', label: 'Cushion' },
  { value: 'Emerald', label: 'Emerald' },
  { value: 'Asscher', label: 'Asscher' },
  { value: 'Radiant', label: 'Radiant' },
  { value: 'Chain', label: 'Chain' },
  { value: 'Other', label: 'Other' }
];

// Color options
export const COLOR_OPTIONS = [
  { value: 'D-F', label: 'D-F' },
  { value: 'E', label: 'E' },
  { value: 'D', label: 'D' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'H', label: 'H' },
  { value: 'I', label: 'I' },
  { value: 'J', label: 'J' },
  { value: 'K', label: 'K' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'White', label: 'White' },
  { value: 'Yellow Gold', label: 'Yellow Gold' },
  { value: 'Rose Gold', label: 'Rose Gold' },
  { value: 'Platinum', label: 'Platinum' },
  { value: 'Silver', label: 'Silver' },
  // { value: 'Other', label: 'Other' }
];

// Clarity options
export const CLARITY_OPTIONS = [
  { value: 'FL', label: 'FL' },
  { value: 'IF', label: 'IF' },
  { value: 'VVS1', label: 'VVS1' },
  { value: 'VVS2', label: 'VVS2' },
  { value: 'VS1', label: 'VS1' },
  { value: 'VS2', label: 'VS2' },
  { value: 'VVS', label: 'VVS' },
  { value: 'VS', label: 'VS' },
  // { value: 'SI1', label: 'SI1 (Slightly Included 1)' },
  // { value: 'SI2', label: 'SI2 (Slightly Included 2)' },
  // { value: 'I1', label: 'I1 (Included 1)' },
  // { value: 'I2', label: 'I2 (Included 2)' },
  // { value: 'I3', label: 'I3 (Included 3)' },
  // { value: 'AAA', label: 'AAA (Pearl Quality)' },
  // { value: 'AA', label: 'AA (Pearl Quality)' },
  // { value: 'A', label: 'A (Pearl Quality)' }
];

// Certificate options
export const CERTIFICATE_OPTIONS = [
  { value: 'GIA', label: 'GIA' },
  { value: 'IGI', label: 'IGI' },
  { value: 'AGS', label: 'AGS' },
  { value: 'EGL', label: 'EGL' },
  { value: 'HRD', label: 'HRD' },
  // { value: 'Certificate of Authenticity', label: 'Certificate of Authenticity' },
  // { value: 'Other', label: 'Other' }
];

// Empty Lexical Editor State
export const EMPTY_LEXICAL_STATE = JSON.stringify({
  root: {
    children: [
      {
        children: [],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

// ============================================
// METAL CONSTANTS
// ============================================

// Color options with hex codes
export const METAL_COLOR_OPTIONS = [
  { value: '#FFFFFF', label: 'White', colorName: 'White' },
  { value: '#FFD700', label: 'Yellow', colorName: 'Yellow' },
  { value: '#E8B4B8', label: 'Rose', colorName: 'Rose' },
  // { value: '#C0C0C0', label: 'Silver', colorName: 'Silver' },
  // { value: '#E5E4E2', label: 'Platinum', colorName: 'Platinum' },
];

// Karat options for purity levels
export const KARAT_OPTIONS = [
  { value: 10, label: '10K' },
  { value: 14, label: '14K' },
  { value: 18, label: '18K' },
  // { value: 22, label: '22K' },
  // { value: 24, label: '24K' },
  // { value: 925, label: '925 Sterling' },
  // { value: 950, label: '950 Platinum' },
];

// ============================================
// ORDER CONSTANTS
// ============================================

// Order status options
export const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Order status colors mapping
export const ORDER_STATUS_COLORS = {
  delivered: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

// Payment status options
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

// Payment method options
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
];

// Shipping method options
export const SHIPPING_METHOD_OPTIONS = [
  { value: 'standard', label: 'Standard Shipping' },
  { value: 'express', label: 'Express Shipping' },
  { value: 'overnight', label: 'Overnight Shipping' },
  { value: 'pickup', label: 'Store Pickup' },
];
// ============================================
// PAGINATION CONSTANTS
// ============================================

export const PAGINATION_DEFAULTS = {
  itemsPerPage: 10,
  defaultPage: 1,
  maxVisiblePages: 5,
};

// ============================================
// TABLE CONSTANTS
// ============================================

export const TABLE_DEFAULTS = {
  itemsPerPage: 10,
  defaultPage: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// ============================================
// FILE UPLOAD CONSTANTS
// ============================================

export const FILE_UPLOAD_LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
  maxFiles: 10,
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// ============================================
// VALIDATION CONSTANTS
// ============================================

export const VALIDATION_RULES = {
  product: {
    title: {
      minLength: 3,
      maxLength: 200,
    },
    description: {
      minLength: 10,
      maxLength: 5000,
    },
    price: {
      min: 0,
      max: 1000000,
    },
    quantity: {
      min: 0,
      max: 10000,
    },
  },
  metal: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
  },
  category: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
  },
};

// ============================================
// DATE FORMAT CONSTANTS
// ============================================

export const DATE_FORMATS = {
  display: 'MMM DD, YYYY',
  full: 'MMMM DD, YYYY',
  time: 'MMM DD, YYYY HH:mm',
  iso: 'YYYY-MM-DD',
};

// ============================================
// STATUS CONSTANTS
// ============================================

export const STATUS_OPTIONS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

// ============================================
// EXPORT CONSTANTS
// ============================================

export const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
];

// ============================================
// MODAL CONSTANTS
// ============================================

export const MODAL_SIZES = {
  small: 'max-w-md',
  medium: 'max-w-lg',
  large: 'max-w-2xl',
  xlarge: 'max-w-4xl',
  full: 'max-w-7xl',
};

// ============================================
// TOAST MESSAGES
// ============================================

export const TOAST_MESSAGES = {
  success: {
    create: 'Item created successfully',
    update: 'Item updated successfully',
    delete: 'Item deleted successfully',
    save: 'Changes saved successfully',
  },
  error: {
    create: 'Failed to create item',
    update: 'Failed to update item',
    delete: 'Failed to delete item',
    fetch: 'Failed to fetch data',
    save: 'Failed to save changes',
    network: 'Network error. Please check your connection.',
  },
  warning: {
    unsaved: 'You have unsaved changes',
    delete: 'This action cannot be undone',
  },
};

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
  adminAuthenticated: 'adminAuthenticated',
  theme: 'theme',
  language: 'language',
};

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

export const PAGE_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'ring', label: 'Ring' },
  { value: 'bracelet', label: 'Bracelet' },
  { value: 'earring', label: 'Earrings' },
  { value: 'necklace', label: 'Necklace' },
  { value: 'contact', label: 'Contact' },
  { value: 'about', label: 'About' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'custom', label: 'Custom' },
  { value: 'other', label: 'Other' },
];

export const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
];

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];