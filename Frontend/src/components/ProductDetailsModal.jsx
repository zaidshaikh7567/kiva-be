import React, { useEffect, useState } from 'react';
import { X, Star, ShoppingBag, Shield, Truck, RotateCcw, Award, Info, HelpCircle, FileText, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem, selectCartLoading } from '../store/slices/cartSlice';
import { 
  toggleFavorite as toggleFavoriteAction, 
  addToFavoritesAPI, 
  removeFromFavoritesAPI, 
  selectIsFavorite 
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import PriceDisplay from './PriceDisplay';
import MetalSelector from './MetalSelector';
import CenterStoneSelector from './CenterStoneSelector';
import RingSizeSelector from './RingSizeSelector';
import ProductImageViewer from './ProductImageViewer';
import QuantitySelector from './QuantitySelector';
import { TOKEN_KEYS } from '../constants/tokenKeys';
import ProductDetailsSection from './ProductDetailsSection';
import { selectCurrentCurrency, selectCurrencySymbol, selectExchangeRate, convertPrice, formatPrice } from '../store/slices/currencySlice';
import { selectStones, selectStonesLoading } from '../store/slices/stonesSlice';
import { selectCategories } from '../store/slices/categoriesSlice';
import { selectMetals } from '../store/slices/metalsSlice';
import { parseLexicalDescription } from '../helpers/lexicalToHTML';
import toast from 'react-hot-toast';
import ContactBox from './ContactBox';
import { transformMetalsToSelectorOptions } from '../constants';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const cartLoading = useSelector(selectCartLoading);
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [selectedCarat, setSelectedCarat] = useState(product?.stoneType ? {
    name: product.stoneType.name,
    id: product.stoneType._id || product.stoneType.id,
    price: product.stoneType.price
  } : null);
  const [selectedCenterStone, setSelectedCenterStone] = useState(product?.stoneType ? product.stoneType : null);
  const dispatch = useDispatch();
  
  // Currency selectors
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const exchangeRate = useSelector(selectExchangeRate);
  
  // Stones selectors
  const stones = useSelector(selectStones);
  const stonesLoading = useSelector(selectStonesLoading);
  
  // Metals selectors
  const metals = useSelector(selectMetals);
  
  // Categories selector
  const categories = useSelector(selectCategories);
  
  // Favorite status from Redux
  const isFavorite = useSelector(state => selectIsFavorite(state, product?._id || product?.id));
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isBracelet = product?.category?.name?.toLowerCase().includes('bracelet') || 
   product?.category?.name?.toLowerCase().includes('bracelets') ||
   product?.category?.parent?.name?.toLowerCase().includes('bracelet') ||
   product?.category?.parent?.name?.toLowerCase().includes('bracelets')|| 
   false;
  // Fetch stones and metals when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Fetch stones from API
      // dispatch(fetchStones({ page: 1, limit: 10 }));
      // Fetch metals from API if not already loaded
      if (metals.length === 0) {
        // dispatch(fetchMetals());
      }
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, dispatch, metals.length]);

  // Auto-select first available metal when modal opens and metals are loaded
  useEffect(() => {
    // Only auto-select if modal is open and no metal is currently selected
    if (!isOpen || selectedMetal || !product || !metals || metals.length === 0) {
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
  }, [isOpen, product, metals, selectedMetal, dispatch]);


  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !product) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => {
          const total = product?.images?.length || 0;
          return total > 0 ? (prev - 1 + total) % total : prev;
        });
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => {
          const total = product?.images?.length || 0;
          return total > 0 ? (prev + 1) % total : prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Check if product is a ring (to show ring size and center stone options)
  // Check if category is ring or if parent category is ring
  const categoryName = product?.category?.name?.toLowerCase();

  
  // Find parent category from categories array if it exists
  let parentCategoryName = null;
  if (product?.category?.parent && categories) {
    const parentCategory = categories.find(cat => 
      cat._id === product.category.parent || cat.id === product.category.parent
    );
    parentCategoryName = parentCategory?.name?.toLowerCase();
  }
  
  const isRing = (categoryName === 'ring' || categoryName === 'rings') ||
  (parentCategoryName === 'ring' || parentCategoryName === 'rings');
  const handleAddToCart = async () => {
    try {
      // Check authentication first
      const isAuthenticated = !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
      if (!isAuthenticated) {
        const currentPath = window.location.pathname + window.location.search;
        toast.error('Please login to add items to cart', {
          duration: 3000,
          position: 'top-right',
          icon: '🔒',
        });
        // Use window.location to redirect and close modal
        window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`;
        return;
      }

      // Validate ring size for rings
      if (isRing && !selectedRingSize) {
        toast.error('Please select a ring size before adding to cart', {
          duration: 3000,
          position: 'top-right',
        });
        return;
      }
      
      // Prepare cart data according to API structure
      const cartData = {
        productId: product._id,
        quantity: quantity,
      };

      // Add ring size if product is a ring
      if (isRing && selectedRingSize) {
        cartData.ringSize = selectedRingSize;
      }

      // Add metal information if selected
      if (selectedMetal) {
        cartData.metalId = selectedMetal.metalId;
        cartData.purityLevel = {
          karat: Number(selectedMetal.carat.match(/\d+/)[0]),
          priceMultiplier: selectedMetal.priceMultiplier,
        };
      }

      // Add stone type if selected - use selected stone ID if available
      if (selectedCarat) {
        if (typeof selectedCarat === 'object' && selectedCarat.id) {
          cartData.stoneTypeId = selectedCarat.id;
        } else if (selectedCenterStone?._id) {
          cartData.stoneTypeId = selectedCenterStone._id;
        } else if (product.stoneType?._id) {
          cartData.stoneTypeId = product.stoneType._id;
        }
      }

      // Dispatch the async thunk
     const response = await dispatch(addCartItem(cartData));
     if (response.payload.success) {
      let successMessage = `${product.title || product.name} added to cart!`;
      const options = [];
      
      if (selectedMetal) {
        options.push(`${selectedMetal.carat} ${selectedMetal.color}`);
      }
      if (isRing && selectedRingSize) {
        options.push(`Size ${selectedRingSize}`);
      }
      if (selectedCarat) {
        const stoneName = typeof selectedCarat === 'string' ? selectedCarat : selectedCarat.name;
        options.push(`Stone: ${stoneName}`);
      }
      if (quantity > 1) {
        options.push(`Qty: ${quantity}`);
      }
      
      if (options.length > 0) {
        successMessage = `${product.title || product.name} added to cart (${options.join(', ')})!`;
      }
      
      // Show success message
      toast.success(successMessage, {
        duration: 3000,
        position: 'top-right',
      });
     } 
      
      // Build success message with selected options
   
      
      // Close modal after successful add to cart
      onClose();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // toast.error('Failed to add item to cart. Please try again.', {
      //   duration: 3000,
      //   position: 'top-right',
      // });
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product) return;
    
    const productId = product._id || product.id;
    if (!productId) {
      toast.error('Invalid product');
      return;
    }

    // Check if product is available
    if (!product) {
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
      dispatch(toggleFavoriteAction(product));
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

  const handleMetalChange = (metal) => {
    setSelectedMetal(metal);
  };

  const handleRingSizeChange = (size) => {
    setSelectedRingSize(size);
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

      const matchedStone = stones.find(
        (stone) => (stone._id || stone.id) === carat.id
      );
      setSelectedCenterStone(matchedStone || carat);
      return;
    }

    const stone = stones.find((stoneItem) =>
      stoneItem.name?.toLowerCase().includes(carat.toLowerCase())
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
  };

  // Calculate final price with metal multiplier and center stone
  const getFinalPrice = () => {
    const basePrice = product.price;
    const metalMultiplier = selectedMetal ? selectedMetal.priceMultiplier : 1;
    const centerStonePrice = selectedCenterStone ? selectedCenterStone.price : 0;
    return (basePrice * metalMultiplier) + centerStonePrice;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-6xl w-full  overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute lg:top-4 top-8 lg:right-4 right-6 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-300"
          >
            <X className="w-5 h-5 text-black" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Product Images */}
            <div className="relative bg-gray-50 p-4 lg:p-8">
              <ProductImageViewer
                images={product?.images || []}
                selectedIndex={selectedImage}
                onChangeIndex={setSelectedImage}
                showFavoriteButton
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                imageContainerClassName="cursor-zoom-in"
              />
            </div>

            {/* Product Details */}
            <div className="p-4 lg:p-8 flex flex-col justify-between">
              <div>
                {/* Rating */}
                {/* <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-montserrat-medium-500 text-black">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div> */}

                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-sorts-mill-gloudy text-black mb-4 capitalize">
                  {product.title}
                </h1>

                {/* Description */}
                <div 
                  className="text-black-light font-montserrat-regular-400 text-base mb-6 leading-relaxed prose prose-sm max-w-none"
                  // dangerouslySetInnerHTML={{ __html: parseLexicalDescription(product.subDescription) }}
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                {
                  capitalizeFirstLetter(product.subDescription)
                }
                </div>
                {/* Price */}
                <div className="sm:flex block items-center justify-between mb-6">
                <div className="flex items-center space-x-3 ">
                  <PriceDisplay 
                    price={getFinalPrice()}
                    originalPrice={product.price}
                    showOriginalPrice={true}
                    showSavings={true}
                    className="text-3xl lg:text-4xl font-montserrat-bold-700 text-primary"
                  />
                  {selectedMetal && (
                    <div className="text-sm font-montserrat-regular-400 text-black-light capitalize">
                      ({selectedMetal.carat} {selectedMetal.color})
                    </div>
                  )}
                  </div>
                  <div>
                  <div className="text-lg font-montserrat-semibold-600 text-black">
                  Made to order
                </div>
                </div>
                </div>

                {/* Metal Selection */}
                <div className="mb-6">
                  <MetalSelector
                    selectedMetal={selectedMetal}
                    onMetalChange={handleMetalChange}
                    product={product}
                    cartItem={null}
                  />
                </div>

                {/* Center Stone Selection */}
                {!product.isBand && !isBracelet && (
                  <CenterStoneSelector
                    className="mb-6"
                    stones={stones}
                    loading={stonesLoading}
                    selectedStone={selectedCarat}
                    onSelect={handleCaratChange}
                    required
                    isRing={isRing}
                    product={product}
                  />
                 )}

                {/* Ring Size Selection */}
                {isRing && (
                  <RingSizeSelector
                    className="mb-6"
                    value={selectedRingSize}
                    onChange={handleRingSizeChange}
                    required
                    showHint={!selectedRingSize}
                    placeholder="Select Ring Size (Required)"
                  />
                )}

                <ProductDetailsSection
                  className="mb-2"
                  product={product}
                  selectedMetal={selectedMetal}
                  selectedCarat={selectedCarat}
                  selectedRingSize={selectedRingSize}
                  isRing={isRing}
                  showCenterStone={isRing}
                  showRingSize={isRing}
                  descriptionHtml={parseLexicalDescription(product.description)}
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                />

                {/* Add to Cart Button */}
                <button
                  disabled={cartLoading}
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
                >
                  {cartLoading ? <span className="flex items-center space-x-2w-full justify-center "><Loader2 className="w-5 h-5 animate-spin  mr-2 " /> Adding to Cart...</span> : <><ShoppingBag className="w-5 h-5" /> <span>Add to Cart - {formatPrice(convertPrice(getFinalPrice() * quantity, 'USD', currentCurrency, { [currentCurrency]: exchangeRate }), currentCurrency, currencySymbol)}</span></>}
                  {/* <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart - {formatPrice(convertPrice(getFinalPrice() * quantity, 'USD', currentCurrency, { [currentCurrency]: exchangeRate }), currentCurrency, currencySymbol)}</span> */}
                </button>
                <ContactBox />
                {/* Additional Info */}
                <div className="text-xs font-montserrat-regular-400 text-black-light text-center">
                  {/* <p>✓ Free shipping for every order</p> */}
                  {/* <p>✓ 30-day return policy</p> */}
                  <p>✓ Secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
