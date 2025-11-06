import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem } from '../store/slices/cartSlice';
import { fetchMetals, selectMetals } from '../store/slices/metalsSlice';
import { 
  toggleFavorite, 
  addToFavoritesAPI, 
  removeFromFavoritesAPI, 
  selectIsFavorite 
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import PriceDisplay from './PriceDisplay';
import ProductDetailsModal from './ProductDetailsModal';
import CustomDropdown from './CustomDropdown';
import MetalSelector from './MetalSelector';
import { RING_SIZES } from '../services/centerStonesApi';
import { selectCategories } from '../store/slices/categoriesSlice';
import toast from 'react-hot-toast';
import { extractPlainText } from '../helpers/lexicalToHTML';

const ShopProductCard = ({ product, viewMode = 'grid', showQuickActions = true }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [selectedMetal, setSelectedMetal] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isFavorite = useSelector(state => selectIsFavorite(state, product._id || product.id));
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const categories = useSelector(selectCategories);
  const metals = useSelector(selectMetals);

  // Check if product is a ring
  const isRing = () => {
    const categoryName = product?.category?.name?.toLowerCase();
    
    // Find parent category from categories array if it exists
    let parentCategoryName = null;
    if (product?.category?.parent && categories) {
      const parentCategory = categories.find(cat => 
        cat._id === product.category.parent || cat.id === product.category.parent
      );
      parentCategoryName = parentCategory?.name?.toLowerCase();
    }
    
    return (categoryName === 'ring' || categoryName === 'rings') ||
           (parentCategoryName === 'ring' || parentCategoryName === 'rings');
  };

  const handleRingSizeChange = (size) => {
    setSelectedRingSize(size);
  };

  const handleMetalChange = (metal) => {
    setSelectedMetal(metal);
  };

  const handleConfirmAddToCart = async () => {
    try {
      // Check authentication first
      const isAuth = !!localStorage.getItem('accessToken');
      if (!isAuth) {
        const currentPath = window.location.pathname + window.location.search;
        toast.error('Please login to add items to cart', {
          duration: 3000,
          position: 'top-right',
          icon: '🔒',
        });
        navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Validate ring size for rings
      if (isRing() && !selectedRingSize) {
        toast.error('Please select a ring size', {
          duration: 2000,
          position: 'top-right',
        });
        return;
      }

      // Validate metal selection
      if (!selectedMetal) {
        toast.error('Please select a metal', {
          duration: 2000,
          position: 'top-right',
        });
        return;
      }
      
      // Prepare cart data according to API structure
      const cartData = {
        productId: product._id,
        quantity: 1,
      };

      // Add ring size if product is a ring
      if (isRing() && selectedRingSize) {
        cartData.ringSize = selectedRingSize;
      }

      // Add metal information
      if (selectedMetal) {
        cartData.metalId = selectedMetal.metalId;
        cartData.purityLevel = {
          karat: Number(selectedMetal.carat.match(/\d+/)?.[0] || 18),
          priceMultiplier: selectedMetal.priceMultiplier || 1,
        };
      }

      // Add stone type if product has stone
      if (product?.stoneType?._id) {
        cartData.stoneTypeId = product.stoneType._id;
      }

      // Use API for authenticated users
     const response = await dispatch(addCartItem(cartData));
     console.log('response$%^%^ :', response);
     if (response.payload.success) {
      let successMessage = `${product.title || product.name} added to cart!`;
      const options = [];
      if (selectedMetal) {
        options.push(`${selectedMetal.carat} ${selectedMetal.color}`);
      }
      if (isRing() && selectedRingSize) {
        options.push(`Size ${selectedRingSize}`);
      }
      if (options.length > 0) {
        successMessage = `${product.title || product.name} added to cart (${options.join(', ')})!`;
      }
      
      // if (isAuth) {
        toast.success(successMessage, {
          duration: 2000,
          position: 'top-right',
        }); 
      // }
      
      // Close modal and reset
      setShowAddToCartModal(false);
      setSelectedRingSize('');
      setSelectedMetal(null);
     } else {
       // Close modal and reset
       setShowAddToCartModal(false);
       setSelectedRingSize('');
       setSelectedMetal(null);
     }
      
      // Build success message
    
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // toast.error('Failed to add item to cart. Please try again.', {
      //   duration: 2000,
      //   position: 'top-right',
      // });
    }
  };

  const handleAddToCart = (e) => {

    const isAuth = !!localStorage.getItem('accessToken');
    if (!isAuth) {
      const currentPath = window.location.pathname + window.location.search;
      toast.error('Please login to add items to cart', {
        duration: 3000,
        position: 'top-right',
        icon: '🔒',
      });
      navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    
    // Fetch metals when opening modal if not already loaded
    if (metals.length === 0) {
      dispatch(fetchMetals());
    }
    // Show modal with metal selection and ring size (if ring)
    setShowAddToCartModal(true);
  };

  // Auto-select first available metal when modal opens and metals are loaded
  useEffect(() => {
    // Only auto-select if modal is open and no metal is currently selected
    if (!showAddToCartModal || selectedMetal || !product || !metals || metals.length === 0) {
      return;
    }

    // Check if product has metals configured
    const hasProductMetals = product.metals && Array.isArray(product.metals) && product.metals.length > 0;
    if (!hasProductMetals) {
      // Product has no metals configured, don't auto-select
      return;
    }

    // Get available metal IDs from product
    const availableMetalIds = product.metals.map(metal => metal?._id || metal?.id || metal);

    // Transform metals to options (same logic as MetalSelector)
    const metalOptions = metals.flatMap(metal => {
      return metal.purityLevels?.filter(purity => purity.active !== false).map(purity => ({
        id: `${purity.karat}-${metal.name.toLowerCase().replace(/\s+/g, '-')}`,
        carat: `${purity.karat}K`,
        color: metal.name,
        priceMultiplier: purity.priceMultiplier || 1.0,
        metalId: metal._id,
        purityLevelId: purity._id
      })) || [];
    });

    // Find first available metal option from product's metals
    const firstAvailableMetal = metalOptions.find(metalOption => {
      return availableMetalIds.includes(metalOption.metalId);
    });

    // Set the first available metal as selected
    if (firstAvailableMetal) {
      setSelectedMetal(firstAvailableMetal);
    }
  }, [showAddToCartModal, product, metals, selectedMetal, dispatch]);

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleCardClick = () => {
    const productId = product._id || product.id;
    if (productId) {
      // Pass current location with query params as state to preserve it when going back
      const currentPath = location.pathname + location.search;
      navigate(`/product/${productId}`, { 
        state: { from: currentPath },
        replace: false 
      });
    }
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = product._id || product.id;
    if (!productId) {
      toast.error('Invalid product');
      return;
    }

    // Check if product is available
    if (!product || !product.quantity || product.quantity <= 0) {
      toast.error('Product is not available');
      return;
    }

    if (isAuthenticated) {
      // Use API for authenticated users
      if (isFavorite) {
        await dispatch(removeFromFavoritesAPI(productId));
        toast.success(`${product.title || product.name} removed from favorites!`, {
          duration: 2000,
          position: 'top-right',
        });
      } else {
        await dispatch(addToFavoritesAPI(productId));
        toast.success(`${product.title || product.name} added to favorites!`, {
          duration: 2000,
          position: 'top-right',
        });
      }
    } else {
      // Use localStorage for non-authenticated users
      dispatch(toggleFavorite(product));
      if (isFavorite) {
        toast.success(`${product.title || product.name} removed from favorites!`, {
          duration: 2000,
          position: 'top-right',
        });
      } else {
        toast.success(`${product.title || product.name} added to favorites!`, {
          duration: 2000,
          position: 'top-right',
        });
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <>
        <div 
          onClick={handleCardClick}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="w-full sm:w-32 h-48 sm:h-32 bg-primary-light rounded-lg overflow-hidden flex-shrink-0">
              {product.images && product?.images?.length > 0 ? (
                <img
                  src={product.images[0] || product?.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-black-light">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-montserrat-semibold-600 text-black mb-2">{product.title}</h3>
              <p className="text-black-light font-montserrat-regular-400 mb-4 line-clamp-2 text-sm sm:text-base">{extractPlainText(product.subDescription)}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <PriceDisplay 
                    price={product.price}
                    className="text-xl sm:text-2xl font-montserrat-bold-700 text-primary-dark"
                  />
                  {/* <span className="text-sm text-black-light font-montserrat-regular-400">({product.quantity} in stock)</span> */}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(e);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorite ? 'text-primary bg-primary-light' : 'text-black-light hover:text-primary'
                    }`}
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickView(e);
                    }}
                    className="px-3 sm:px-4 py-2 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-1 sm:gap-2 font-montserrat-medium-500 text-sm"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    {/* <span className="hidden sm:inline">Quick View</span> */}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(e);
                    }}
                    className="px-3 sm:px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-1 sm:gap-2 font-montserrat-medium-500 text-sm"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                    {/* <span className="hidden sm:inline">Add to Cart</span> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick View Modal */}
        {showQuickView && (
          <ProductDetailsModal
            product={product}
            isOpen={showQuickView}
            onClose={handleCloseQuickView}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer"
      >
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-primary-light">
            {product.images && product.images.length > 0 ? (
              <img
                src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black-light">
                No Image
              </div>
            )}
          </div>
          
          {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite(e);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isFavorite 
              ? 'bg-primary text-white' 
              : 'bg-white/90 text-black-light hover:bg-primary hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
        </button>
        
        {/* Quick Actions Overlay - Only show on hover */}
        {showQuickActions && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickView(e);
                }}
                className="px-3 sm:px-4 py-2 bg-white text-black rounded-lg hover:bg-primary-light transition-colors flex items-center gap-1 sm:gap-2 font-montserrat-medium-500 shadow-lg text-xs sm:text-sm whitespace-nowrap"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                {/* <span className="hidden sm:inline">Quick View</span> */}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(e);
                }}
                className="px-3 sm:px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-1 sm:gap-2 font-montserrat-medium-500 shadow-lg text-xs sm:text-sm whitespace-nowrap"
              >
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                {/* <span className="hidden sm:inline">Add to Cart</span> */}
              </button>
            </div>
          </div>
        )}
        </div>
        
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-montserrat-semibold-600 text-black mb-2 line-clamp-1 hover:text-primary-dark transition-colors">{product.title}</h3>
            <p className="text-black-light text-xs sm:text-sm mb-3 line-clamp-2 font-montserrat-regular-400">{extractPlainText(product.subDescription)}</p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <PriceDisplay 
              variant="small"
              price={product.price}
              className="text-lg sm:text-xl font-montserrat-bold-700 text-primary-dark"
              
            />
            {/* <span className="text-xs sm:text-sm text-black-light font-montserrat-regular-400">{product.quantity} in stock</span> */}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <ProductDetailsModal
          product={product}
          isOpen={showQuickView}
          onClose={handleCloseQuickView}
        />
      )}

      {/* Add to Cart Modal with Metal Selection and Ring Size */}
      {showAddToCartModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-montserrat-semibold-600 text-black">
                Add to Cart
              </h3>
              <button
                onClick={() => {
                  setShowAddToCartModal(false);
                  setSelectedRingSize('');
                  setSelectedMetal(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                {product?.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title || product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-montserrat-semibold-600 text-black mb-1">
                    {product.title || product.name}
                  </h4>
                  <PriceDisplay 
                    price={product.price}
                    variant="small"
                  />
                </div>
              </div>
            </div>

            {/* Metal Selection */}
            <div className="mb-6">
              <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
                Select Metal *
              </label>
              <MetalSelector
                product={product}
                cartItem={null}
                selectedMetal={selectedMetal}
                onMetalChange={handleMetalChange}
              />
            </div>

            {/* Ring Size Selection (if ring) */}
            {isRing() && (
              <div className="mb-6">
                <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
                  Ring Size *
                </label>
                <CustomDropdown
                  options={RING_SIZES}
                  value={selectedRingSize}
                  onChange={handleRingSizeChange}
                  placeholder="Select your ring size"
                />
                <p className="mt-2 text-xs text-gray-600 font-montserrat-regular-400">
                  Need help finding your size? Check our <a href="/size-guide" className="text-primary hover:underline">Size Guide</a>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddToCartModal(false);
                  setSelectedRingSize('');
                  setSelectedMetal(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 font-montserrat-medium-500 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 bg-primary text-white font-montserrat-medium-500 py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopProductCard;
