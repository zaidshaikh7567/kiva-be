import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, selectCurrentProduct, selectProductsLoading, selectProductsError } from '../store/slices/productsSlice';
import { addCartItem, selectCartLoading } from '../store/slices/cartSlice';
import { 
  toggleFavorite as toggleFavoriteAction, 
  addToFavoritesAPI, 
  removeFromFavoritesAPI, 
  selectIsFavorite 
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import PriceDisplay from '../components/PriceDisplay';
import MetalSelector from '../components/MetalSelector';
import CenterStoneSelector from '../components/CenterStoneSelector';
import RingSizeSelector from '../components/RingSizeSelector';
import ProductImageViewer from '../components/ProductImageViewer';
import QuantitySelector from '../components/QuantitySelector';
import { TOKEN_KEYS } from '../constants/tokenKeys';
import ProductDetailsSection from '../components/ProductDetailsSection';
import ContactBox from '../components/ContactBox';
import { selectCurrentCurrency, selectCurrencySymbol, selectExchangeRate, convertPrice, formatPrice } from '../store/slices/currencySlice';
import { selectStones, selectStonesLoading } from '../store/slices/stonesSlice';
import { selectCategories } from '../store/slices/categoriesSlice';
import { selectMetals } from '../store/slices/metalsSlice';
import { parseLexicalDescription } from '../helpers/lexicalToHTML';
import toast from 'react-hot-toast';
import { transformMetalsToSelectorOptions } from '../constants';
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [selectedCenterStone, setSelectedCenterStone] = useState(null);
  const [selectedCarat, setSelectedCarat] = useState(null);
  const previousPathRef = useRef(null);
  
  // Redux selectors
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const cartLoading = useSelector(selectCartLoading);
  const error = useSelector(selectProductsError);
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const exchangeRate = useSelector(selectExchangeRate);
  const stones = useSelector(selectStones);
  const stonesLoading = useSelector(selectStonesLoading);
  const categories = useSelector(selectCategories);
  const metals = useSelector(selectMetals);
  const isFavorite = useSelector(state => product ? selectIsFavorite(state, product._id || product.id) : false);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch product when component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      // dispatch(fetchStones({ page: 1, limit: 10 }));
      // dispatch(fetchMetals());
    }
  }, [id, dispatch]);

  // Set initial carat when product loads
  useEffect(() => {
    if (product?.stoneType?.name) {
      // Initialize selectedCarat with both name and ID
      if (product.stoneType) {
        setSelectedCarat({
          name: product.stoneType.name,
          id: product.stoneType._id || product.stoneType.id,
          price: product.stoneType.price
        });
        setSelectedCenterStone(product.stoneType);
      }
    }
  }, [product]);

  // Auto-select first available metal when product and metals load
  useEffect(() => {
    // Only auto-select if no metal is currently selected
    if (selectedMetal || !product || !metals || metals.length === 0) {
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
  }, [product, metals, selectedMetal]);

  // Store previous path from location state or referrer on mount
  useEffect(() => {
    // First, try to get from location state (if passed from ProductCard)
    if (location.state?.from) {
      previousPathRef.current = location.state.from;
    } else {
      // Fallback to document.referrer if available
      const referrer = document.referrer;
      if (referrer && referrer.includes(window.location.origin)) {
        try {
          const referrerUrl = new URL(referrer);
          const referrerPath = referrerUrl.pathname + referrerUrl.search;
          // Only store if it's not the same product page
          if (referrerPath !== location.pathname && !referrerPath.includes(`/product/${id}`)) {
            previousPathRef.current = referrerPath;
          }
        } catch {
          // Invalid URL, ignore
        }
      }
    }
  }, [location.state, location.pathname, id]);

  // Image navigation handlers

  // Keyboard navigation
  useEffect(() => {
    if (!product) return;

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
  }, [product]);

  // Check if product is a ring
  const categoryName = product?.category?.name?.toLowerCase();
  let parentCategoryName = null;
  if (product?.category?.parent && categories) {
    const parentCategory = categories.find(cat => 
      cat._id === product.category.parent || cat.id === product.category.parent
    );
    parentCategoryName = parentCategory?.name?.toLowerCase();
  }
  
  const isRing = (categoryName === 'ring' || categoryName === 'rings') ||
    (parentCategoryName === 'ring' || parentCategoryName === 'rings');

  // Handle back button navigation
  const handleBack = (e) => {
    // Prevent any default behavior
    e?.preventDefault();
    e?.stopPropagation();

    // First priority: Use stored previous path (preserves query params)
    if (previousPathRef.current && previousPathRef.current !== location.pathname) {
      navigate(previousPathRef.current, { replace: false });
      return;
    }

    // Second priority: Check document.referrer
    const referrer = document.referrer;
    if (referrer && referrer.includes(window.location.origin)) {
      try {
        const referrerUrl = new URL(referrer);
        const referrerPath = referrerUrl.pathname + referrerUrl.search;
        const currentPath = location.pathname;
        
        // Only navigate if it's a different page and not the same product
        if (referrerPath !== currentPath && !referrerPath.includes(`/product/${id}`)) {
          navigate(referrerPath, { replace: false });
          return;
        }
      } catch {
        // Invalid URL, continue to fallback
      }
    }

    // Third priority: Navigate to category page based on product
    if (product?.category) {
      const categoryNameLower = categoryName;
      const parentNameLower = parentCategoryName;
      
      const categoryRoutes = {
        'ring': '/rings',
        'rings': '/rings',
        'earring': '/earrings',
        'earrings': '/earrings',
        'bracelet': '/bracelets',
        'bracelets': '/bracelets',
        'necklace': '/necklaces',
        'necklaces': '/necklaces',
      };
      
      // Try parent category first, then current category
      const route = parentNameLower 
        ? (categoryRoutes[parentNameLower] || categoryRoutes[categoryNameLower])
        : categoryRoutes[categoryNameLower];
      
      if (route) {
        navigate(route, { replace: false });
        return;
      }
    }

    // Final fallback: Navigate to shop page
    navigate('/shop', { replace: false });
  };

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
        navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (isRing && !selectedRingSize) {
        toast.error('Please select a ring size before adding to cart', {
          duration: 3000,
          position: 'top-right',
        });
        return;
      }
      
      const cartData = {
        productId: product._id,
        quantity: quantity,
      };

      if (isRing && selectedRingSize) {
        cartData.ringSize = selectedRingSize;
      }

      if (selectedMetal) {
        cartData.metalId = selectedMetal.metalId;
        cartData.purityLevel = {
          karat: Number(selectedMetal.carat.match(/\d+/)[0]),
          priceMultiplier: selectedMetal.priceMultiplier,
        };
      }

      // Use selected stone ID if available, otherwise fallback to product stoneType
      if (selectedCarat) {
        if (selectedCarat.id) {
          cartData.stoneTypeId = selectedCarat.id;
        } else if (selectedCenterStone?._id) {
          cartData.stoneTypeId = selectedCenterStone._id;
        } else if (product.stoneType?._id) {
          cartData.stoneTypeId = product.stoneType._id;
        }
      }

     const response = await dispatch(addCartItem(cartData)).unwrap();
      if (response.success) {
        let successMessage = `${product.title || product.name} added to cart!`;
        const options = [];
        if (selectedMetal) {
          options.push(`${selectedMetal.carat} ${selectedMetal.color}`);
        }
        if (isRing && selectedRingSize) {
          options.push(`Size ${selectedRingSize}`);
        }
        if (selectedCarat) {
          options.push(`Stone: ${selectedCarat.name}`);
        }
        if (quantity > 1) {
          options.push(`Qty: ${quantity}`);
        }
        if (options.length > 0) {
          successMessage = `${product.title || product.name} added to cart (${options.join(', ')})!`;
        } 
        toast.success(successMessage, {
          duration: 3000,
          position: 'top-right',
        });
      } else {
        console.log('response.message :', response.message);    
 
      }
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

  const getFinalPrice = () => {
    if (!product) return 0;
    const basePrice = product.price;
    const metalMultiplier = selectedMetal ? selectedMetal.priceMultiplier : 1;
    const centerStonePrice = selectedCenterStone ? selectedCenterStone.price : 0;
    return (basePrice * metalMultiplier) + centerStonePrice;
  };

  // Magnifier handlers
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black-light font-montserrat-regular-400">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-montserrat-semibold-600 text-lg mb-4">
            {error ? 'Failed to load product' : 'Product not found'}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 lg:py-12">
      <div className="max-w-[1580px] mx-auto px-4 lg:px-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 lg:mb-8 flex items-center space-x-2 text-black-light hover:text-primary transition-colors duration-300 font-montserrat-medium-500"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white  overflow-hidden w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
            {/* Product Images */}
            <div className="relative lg:px-4 lg:col-span-2">
              <ProductImageViewer
                images={product?.images || []}
                selectedIndex={selectedImage}
                onChangeIndex={setSelectedImage}
                showFavoriteButton
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </div>

            {/* Product Details */}
            <div className="sm:px-2 lg:px-6 px-0 py-2 lg:py-0 lg:col-span-3 flex flex-col ">
              <div>        
                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-sorts-mill-gloudy text-black mb-4 capitalize">
                  {product.title || product.name}
                </h1>

                {/* Description */}
                <div 
                  className="text-black-light font-montserrat-regular-400 text-base mb-6 leading-relaxed prose prose-sm max-w-none"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {capitalizeFirstLetter(product.subDescription)}
                </div>

                {/* Price */}
                <div className="sm:flex block items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
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
                  />
                </div>

                {/* Center Stone Selection */}
                {isRing && !product.isBand && (
                  <CenterStoneSelector
                    className="mb-6"
                    stones={stones}
                    loading={stonesLoading}
                    selectedStone={selectedCarat}
                    onSelect={handleCaratChange}
                    required
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
                  className="mb-0"
                  product={product}
                  selectedMetal={selectedMetal}
                  selectedCarat={selectedCarat}
                  selectedRingSize={selectedRingSize}
                  isRing={isRing}
                  showCenterStone={isRing && !product.isBand}
                  showRingSize={isRing}
                  descriptionHtml={parseLexicalDescription(product.description)}
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 mt-[20px]" >
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
                  {/* <span>{cartLoading ? 'Adding to Cart...' : `Add to Cart - ${formatPrice(convertPrice(getFinalPrice() * quantity, 'USD', currentCurrency, { [currentCurrency]: exchangeRate }), currentCurrency, currencySymbol)}`}</span> */}
                </button>

                {/* Contact Box */}
                <ContactBox />

                {/* Additional Info */}
                <div className="text-xs font-montserrat-regular-400 text-black-light text-center">
                  <p>✓ Free shipping for every order</p>
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

export default ProductDetail;

