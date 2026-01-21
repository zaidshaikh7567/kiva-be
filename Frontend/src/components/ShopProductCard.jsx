import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem } from '../store/slices/cartSlice';
import { selectMetals } from '../store/slices/metalsSlice';
import { 
  toggleFavorite, 
  addToFavoritesAPI, 
  removeFromFavoritesAPI, 
  selectIsFavorite 
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import PriceDisplay from './PriceDisplay';
import ProductDetailsModal from './ProductDetailsModal';
import AddToCartModal from './AddToCartModal';
import { TOKEN_KEYS } from '../constants/tokenKeys';
import { selectCategories } from '../store/slices/categoriesSlice';
import { selectStones } from '../store/slices/stonesSlice';
import toast from 'react-hot-toast';
import { transformMetalsToSelectorOptions } from '../constants';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';

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
  const stones = useSelector(selectStones);
  const [selectedCarat, setSelectedCarat] = useState(product?.stoneType ? {
    name: product.stoneType.name,
    id: product.stoneType._id || product.stoneType.id,
    price: product.stoneType.price
  } : null);
  const [selectedCenterStone, setSelectedCenterStone] = useState(product?.stoneType ? product.stoneType : null);
const getFinalPrice = () => {
  if (!product) return 0;
  const basePrice = product?.price || 0;
  const metalMultiplier = selectedMetal ? selectedMetal.priceMultiplier : 1;
  const centerStonePrice = selectedCarat ? selectedCarat.price : 0;
  return (basePrice * metalMultiplier) + centerStonePrice;
};

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

  useEffect(() => {
    if(showAddToCartModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showAddToCartModal]);

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

      // Add stone type if selected
      if (selectedCarat?.id) {
        cartData.stoneTypeId = selectedCarat.id;
      } else if (product?.stoneType?._id) {
        cartData.stoneTypeId = product.stoneType._id;
      }

      // Use API for authenticated users
     const response = await dispatch(addCartItem(cartData));
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
      
      toast.success(successMessage, {
        duration: 2000,
        position: 'top-right',
      }); 
      
      // Close modal and reset
      handleCloseAddToCartModal();
     } else {
       // Close modal and reset
       handleCloseAddToCartModal();
     }
    
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleCloseAddToCartModal = () => {
    setShowAddToCartModal(false);
    setSelectedRingSize('');
    
    // Reset to product's default metal if exists, otherwise null
    if (product?.metal) {
      setSelectedMetal(product.metal);
    } else {
      setSelectedMetal(null);
    }
    
    // Reset to product's default stone if exists, otherwise null
    if (product?.stoneType) {
      setSelectedCarat({
        name: product.stoneType.name,
        id: product.stoneType._id || product.stoneType.id,
        price: product.stoneType.price
      });
      setSelectedCenterStone(product.stoneType);
    } else {
      setSelectedCarat(null);
      setSelectedCenterStone(null);
    }
  };

  const handleCaratChange = (carat) => {
    if (!carat) {
      setSelectedCarat(null);
      setSelectedCenterStone(null);
      return;
    }

    if (typeof carat === 'object') {
      setSelectedCarat({
        name: carat.name,
        id: carat.id,
        price: carat.price
      });

      const stone = stones.find((s) => (s._id || s.id) === carat.id);
      setSelectedCenterStone(stone || carat);
    } else {
      const stone = stones.find((s) =>
        s.name?.toLowerCase().includes(carat.toLowerCase())
      );
      if (stone) {
        setSelectedCarat({
          name: stone.name,
          id: stone._id || stone.id,
          price: stone.price
        });
        setSelectedCenterStone(stone);
      } else {
        setSelectedCarat({
          name: carat,
          id: null,
          price: 0
        });
        setSelectedCenterStone(null);
      }
    }
  };

  const handleAddToCart = (e) => {

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
    e.preventDefault();
    e.stopPropagation();
    
    // Fetch metals when opening modal if not already loaded
    if (metals.length === 0) {
      // dispatch(fetchMetals());
    }
    // Show modal with metal selection and ring size (if ring)
    setShowAddToCartModal(true);
    // when hadd to card if prodect has stone type, set the selected carat to the stone type
    if (product?.stoneType) {
      setSelectedCarat({
        name: product.stoneType.name,
        id: product.stoneType._id || product.stoneType.id,
        price: product.stoneType.price
      });
      setSelectedCenterStone(product.stoneType);
    }
    // when hadd to card if prodect has metal, set the selected metal to the metal
    if (product?.metal) {
      setSelectedMetal(product.metal);
    }
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
    if (!product ) {
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
              <h3 className="text-lg sm:text-xl font-montserrat-semibold-600 text-black mb-2 capitalize">{product.title}</h3>
              <p className="text-black-light font-montserrat-regular-400 mb-4 line-clamp-2 text-sm sm:text-base ">{capitalizeFirstLetter(product.subDescription)}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <PriceDisplay 
                    price={getFinalPrice()}
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
         {/* Add to Cart Modal */}
         <AddToCartModal
          isOpen={showAddToCartModal}
          product={product}
          selectedMetal={selectedMetal}
          selectedRingSize={selectedRingSize}
          selectedCarat={selectedCarat}
          selectedCenterStone={selectedCenterStone}
          onClose={handleCloseAddToCartModal}
          onConfirm={handleConfirmAddToCart}
          onMetalChange={handleMetalChange}
          onRingSizeChange={handleRingSizeChange}
          onCaratChange={handleCaratChange}
          getFinalPrice={getFinalPrice}
          isRing={isRing()}
        />
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
            <h3 className="text-base sm:text-lg font-montserrat-semibold-600 text-black mb-2 line-clamp-1 hover:text-primary-dark transition-colors capitalize">{product.title}</h3>
            <p className="text-black-light text-xs sm:text-sm mb-3 line-clamp-2 font-montserrat-regular-400">{capitalizeFirstLetter(product.subDescription)}</p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <PriceDisplay 
              variant="small"
              price={getFinalPrice()}
              className="text-lg sm:text-xl font-montserrat-bold-700 text-primary-dark"
              
            />
            {/* <span className="text-xs sm:text-sm text-black-light font-montserrat-regular-400">{product.quantity} in stock</span> */}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView &&
        createPortal(
          <ProductDetailsModal
            product={product}
            isOpen={showQuickView}
            onClose={handleCloseQuickView}
          />,
          document.body
        )}

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showAddToCartModal}
        product={product}
        selectedMetal={selectedMetal}
        selectedRingSize={selectedRingSize}
        selectedCarat={selectedCarat}
        selectedCenterStone={selectedCenterStone}
        onClose={handleCloseAddToCartModal}
        onConfirm={handleConfirmAddToCart}
        onMetalChange={handleMetalChange}
        onRingSizeChange={handleRingSizeChange}
        onCaratChange={handleCaratChange}
        getFinalPrice={getFinalPrice}
        isRing={isRing()}
      />
    </>
  );
};

export default ShopProductCard;
