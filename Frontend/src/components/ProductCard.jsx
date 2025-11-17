import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye, X, Loader2 } from 'lucide-react';
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
import ProductDetailsModal from './ProductDetailsModal';
import PriceDisplay from './PriceDisplay';
import { TOKEN_KEYS } from '../constants/tokenKeys';
import CustomDropdown from './CustomDropdown';
import MetalSelector from './MetalSelector';
import { RING_SIZES } from '../services/centerStonesApi';
import { selectCategories } from '../store/slices/categoriesSlice';
import toast from 'react-hot-toast';
import { extractPlainText } from '../helpers/lexicalToHTML';
import { transformMetalsToSelectorOptions } from '../constants';

const ProductCard = ({ product, viewMode = "grid" }) => {
  const [showDetails, setShowDetails] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const isList = viewMode === "list";
  console.log('loading :', loading);
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
      const isAuth = !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
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
        productId: product._id || product.id,
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
      setLoading(true);
     const response=  await dispatch(addCartItem(cartData));
     console.log('response$%^%^ :', response);
      setLoading(false);
     if (response.payload.success) {
      let successMessage = `${product.name || product.title} added to cart!`;
      const options = [];
      if (selectedMetal) {
        options.push(`${selectedMetal.carat} ${selectedMetal.color}`);
      }
      if (isRing() && selectedRingSize) {
        options.push(`Size ${selectedRingSize}`);
      }
      if (options.length > 0) {
        successMessage = `${product.name || product.title} added to cart (${options.join(', ')})!`;
      }
      
      console.log('isAuth :', isAuth);
      // if (isAuth) {
        toast.success(successMessage, {
          duration: 2000,
          position: 'top-right',
        });
      // }
      setShowAddToCartModal(false);
      setSelectedRingSize('');
      setSelectedMetal(null);
    } else {
      setShowAddToCartModal(false);
      setSelectedRingSize('');
      setSelectedMetal(null);
    }
      
      // Build success message
    
      
      // Close modal and reset
 
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // toast.error('Failed to add item to cart. Please try again.', {
      //   duration: 2000,
      //   position: 'top-right',
      // });
    }
  };

  const handleAddToCart = () => {
    const isAuth = !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
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
    // Fetch metals when opening modal if not already loaded
    // if (metals.length === 0) {
    //   dispatch(fetchMetals());
    // }
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
    const metalOptions = transformMetalsToSelectorOptions(metals);

    // Find first available metal option from product's metals
    const firstAvailableMetal = metalOptions.find(metalOption => {
      return availableMetalIds.includes(metalOption.metalId);
    });

    // Set the first available metal as selected
    if (firstAvailableMetal) {
      setSelectedMetal(firstAvailableMetal);
    }
  }, [showAddToCartModal, product, metals, selectedMetal, dispatch]);

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
        toast.success(`${product.name || product.title} removed from favorites!`, {
          duration: 2000,
          position: 'top-right',
        });
      } else {
        await dispatch(addToFavoritesAPI(productId));
        toast.success(`${product.name || product.title} added to favorites!`, {
          duration: 2000,
          position: 'top-right',
        });
      }
    } else {
      // Use localStorage for non-authenticated users
      dispatch(toggleFavorite(product));
      if (isFavorite) {
        toast.success(`${product.name || product.title} removed from favorites!`, {
          duration: 2000,
          position: 'top-right',
        });
      } else {
        toast.success(`${product.name || product.title} added to favorites!`, {
          duration: 2000,
          position: 'top-right',
        });
      }
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setShowDetails(true);
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

  return (
    <>
  <div
        onClick={handleCardClick}
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full ${
          isList ? "sm:flex-row" : ""
        }`}
      >
        {/* Product Image */}
        <div className={`relative overflow-hidden ${
          viewMode === "list" ? "w-full h-64 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 sm:flex-shrink-0" : "h-64 sm:h-72 md:h-80"
        }`}>
          <img
            src={product?.images?.[0]}
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.featured && (
            <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-montserrat-medium-500">
              Featured
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(e);
            }}
            className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full transition-colors duration-300 z-20 pointer-events-auto ${
              isFavorite 
                ? 'bg-primary text-white hover:primary' 
                : 'bg-white/80 text-black-light hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 md:w-5 md:h-5  `}/>
          </button>
          {product.originalPrice && (
            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm font-montserrat-medium-500">
              Sale
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(e);
              }}
              className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors duration-300"
              title="View Details"
            >
              <Eye className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="p-3 bg-primary rounded-full hover:bg-primary-dark transition-colors duration-300"
              title="Add to Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className={`${isList ? "p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-between" : "p-4 md:p-6 flex flex-col flex-1"}`}>
          {isList ? (
            <>
              {/* Top Section */}
              <div className="flex-1">
                {/* <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-montserrat-regular-400 text-black-light">
                    {product.rating} ({product.reviews})
                  </span>
                </div> */}

                <h3 className="text-sm sm:text-base md:text-lg font-montserrat-semibold-600 text-black mb-2 capitalize">
                  {product.name}
                </h3>

                <p className="text-xs md:text-sm text-black-light font-montserrat-regular-400 mb-3 line-clamp-2">
                  {extractPlainText(product.subDescription)}
                </p>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <PriceDisplay 
                    price={product.price}
                    originalPrice={product.originalPrice}
                    showOriginalPrice={true}
                  />
                </div>
                <div className="flex space-x-2 flex-shrink-0 w-full sm:w-auto">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(e);
                    }}
                    className="flex-1 sm:flex-none border border-gray-200 bg-gray-100 text-black font-montserrat-medium-500 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-1.5 text-xs md:text-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                    className="flex-1 sm:flex-none bg-primary text-white font-montserrat-medium-500 py-2 px-3 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-1.5 text-xs md:text-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1">
              {/* <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-montserrat-regular-400 text-black-light">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div> */}

                <h3 className="text-lg md:text-xl font-montserrat-semibold-600 text-black mb-2  line-clamp-2 capitalize">
                  {product.name}
                </h3>

                <p className="text-black-light font-montserrat-regular-400 text-xs md:text-sm mb-4 line-clamp-1">
                  {extractPlainText(product.subDescription)}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <PriceDisplay 
                    price={product.price}
                    originalPrice={product.originalPrice}
                    showOriginalPrice={true}
                  />
                </div>
              </div>

              <div className="flex space-x-2 mt-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(e);
                  }}
                  className="flex-1 border border-gray-200 bg-gray-100 text-black font-montserrat-medium-500 py-2 md:py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  <span>View</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  className="flex-1 bg-primary text-white font-montserrat-medium-500 py-2 md:py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={product}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

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
                    alt={product.name || product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-montserrat-semibold-600 text-black mb-1">
                    {product.name || product.title}
                  </h4>
                  <PriceDisplay 
                    price={product.price}
                    originalPrice={product.originalPrice}
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
                selectedMetal={selectedMetal}
                onMetalChange={handleMetalChange}
                product={product}
                cartItem={null}
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
                {loading ? <span className="flex items-center space-x-2w-full justify-center "><Loader2 className="w-4 h-4 animate-spin  mr-2 " /> Adding to Cart...</span> : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
