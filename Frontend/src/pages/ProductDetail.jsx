import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Minus, Plus, Gem, ChevronLeft, ChevronRight, ListChevronsDownUp, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, selectCurrentProduct, selectProductsLoading, selectProductsError } from '../store/slices/productsSlice';
import { addCartItem } from '../store/slices/cartSlice';
import { 
  toggleFavorite as toggleFavoriteAction, 
  addToFavoritesAPI, 
  removeFromFavoritesAPI, 
  selectIsFavorite 
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import PriceDisplay from '../components/PriceDisplay';
import MetalSelector from '../components/MetalSelector';
import CustomDropdown from '../components/CustomDropdown';
import Accordion from '../components/Accordion';
import ContactBox from '../components/ContactBox';
import { selectCurrentCurrency, selectCurrencySymbol, selectExchangeRate, convertPrice, formatPrice } from '../store/slices/currencySlice';
import { fetchStones, selectStones, selectStonesLoading } from '../store/slices/stonesSlice';
import { selectCategories } from '../store/slices/categoriesSlice';
import { fetchMetals, selectMetals } from '../store/slices/metalsSlice';
import { RING_SIZES } from '../services/centerStonesApi';
import { parseLexicalDescription } from '../helpers/lexicalToHTML';
import toast from 'react-hot-toast';
import { transformMetalsToSelectorOptions } from '../constants';

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
  console.log('selectedCenterStone :', selectedCenterStone);
  const [selectedCarat, setSelectedCarat] = useState(null);
  console.log('selectedCarat :', selectedCarat);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const previousPathRef = useRef(null);
  
  // Redux selectors
  const product = useSelector(selectCurrentProduct);
  console.log('product :', product);
  const loading = useSelector(selectProductsLoading);
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
          id: product.stoneType._id || product.stoneType.id
        });
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
  const handleNextImage = (e) => {
    e?.stopPropagation();
    const total = product?.images?.length || 0;
    if (total > 0) {
      setSelectedImage((prev) => (prev + 1) % total);
    }
    if (imageContainerRef.current && mousePositionRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = mousePositionRef.current.x - rect.left;
      const y = mousePositionRef.current.y - rect.top;
      const constrainedX = Math.max(0, Math.min(x, rect.width));
      const constrainedY = Math.max(0, Math.min(y, rect.height));
      setMagnifierPosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handlePreviousImage = (e) => {
    e?.stopPropagation();
    const total = product?.images?.length || 0;
    if (total > 0) {
      setSelectedImage((prev) => (prev - 1 + total) % total);
    }
    if (imageContainerRef.current && mousePositionRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = mousePositionRef.current.x - rect.left;
      const y = mousePositionRef.current.y - rect.top;
      const constrainedX = Math.max(0, Math.min(x, rect.width));
      const constrainedY = Math.max(0, Math.min(y, rect.height));
      setMagnifierPosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handleArrowMouseEnter = () => {
    setShowMagnifier(false);
  };

  const handleArrowMouseLeave = () => {
    setTimeout(() => {
      if (imageContainerRef.current && mousePositionRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const { x, y } = mousePositionRef.current;
        const isOverImage = 
          x >= rect.left && 
          x <= rect.right && 
          y >= rect.top && 
          y <= rect.bottom;
        if (isOverImage) {
          setShowMagnifier(true);
        }
      }
    }, 10);
  };

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
      const isAuthenticated = !!localStorage.getItem('accessToken');
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

      console.log('product :', product);
      console.log('selectedCarat :', selectedCarat);
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
     console.log('response :', response);
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

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
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
    if (!product.quantity || product.quantity <= 0) {
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
    // Find stone by carat name
    const stone = stones.find(stone => 
      stone.name.toLowerCase().includes(carat.toLowerCase())
    );
    if (stone) {
      // Save both name and ID in selectedCarat
      setSelectedCarat({
        name: stone.name,
        id: stone._id || stone.id
      });
      setSelectedCenterStone(stone);
    } else {
      // Fallback: if stone not found, just save the name
      setSelectedCarat({
        name: carat,
        id: null
      });
    }
  };

  const getFinalPrice = () => {
    if (!product) return 0;
    const basePrice = product.price;
    const metalMultiplier = selectedMetal ? selectedMetal.priceMultiplier : 1;
    const centerStonePrice = selectedCenterStone ? selectedCenterStone.price : 0;
    return (basePrice + centerStonePrice) * metalMultiplier;
  };

  // Magnifier handlers
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const constrainedX = Math.max(0, Math.min(x, rect.width));
    const constrainedY = Math.max(0, Math.min(y, rect.height));
    
    setMagnifierPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const getZoomPosition = () => {
    if (!imageContainerRef.current) return { x: 0, y: 0, zoom: 2.5 };
    const rect = imageContainerRef.current.getBoundingClientRect();
    const zoomLevel = 4.5;
    const x = (magnifierPosition.x / rect.width) * 100;
    const y = (magnifierPosition.y / rect.height) * 100;
    return { x, y, zoom: zoomLevel };
  };

  const zoomPos = getZoomPosition();
  const totalImages = product?.images?.length || 0;

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
              <div 
                ref={imageContainerRef}
                className="aspect-square relative overflow-hidden mb-3 cursor-zoom-in max-w-xl mx-auto shadow-lg"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Main Image */}
                <img
                  src={product?.images?.[selectedImage]}
                  alt={product?.name || product?.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                
                {/* Magnified Image Overlay */}
                {showMagnifier && imageContainerRef.current && (
                  <div 
                    className="absolute pointer-events-none z-20 border-2 border-white rounded-full shadow-2xl overflow-hidden"
                    style={{
                      left: `${magnifierPosition.x}px`,
                      top: `${magnifierPosition.y}px`,
                      width: '200px',
                      height: '200px',
                      backgroundImage: `url(${product?.images?.[selectedImage]})`,
                      backgroundSize: `${zoomPos.zoom * 100}%`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundRepeat: 'no-repeat',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
                
                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  onMouseEnter={handleArrowMouseEnter}
                  onMouseLeave={handleArrowMouseLeave}
                  className={`absolute top-4 sm:right-4 left-4 w-fit p-2 rounded-full transition-all duration-200 z-10 ${
                    isFavorite 
                      ? 'bg-primary text-white' 
                      : 'bg-white/90 text-black-light hover:bg-primary hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Navigation Arrows */}
                {totalImages > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      onMouseEnter={handleArrowMouseEnter}
                      onMouseLeave={handleArrowMouseLeave}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-1 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-black" />
                    </button>

                    <button
                      onClick={handleNextImage}
                      onMouseEnter={handleArrowMouseEnter}
                      onMouseLeave={handleArrowMouseLeave}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-1 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-black" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {totalImages > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-montserrat-medium-500">
                    {selectedImage + 1} / {totalImages}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2  mx-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors max-w-md duration-300 ${
                        selectedImage === index ? 'border-primary ring-1 outline-none ring-primary ring-offset-2' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name || product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="sm:px-2 lg:px-6 px-0 py-2 lg:py-0 lg:col-span-3 flex flex-col ">
              <div>
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-montserrat-medium-500 text-black">
                    {product.rating || 5} ({product.reviews || 0} reviews)
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-sorts-mill-gloudy text-black mb-4">
                  {product.title || product.name}
                </h1>

                {/* Description */}
                <div 
                  className="text-black-light font-montserrat-regular-400 text-base mb-6 leading-relaxed prose prose-sm max-w-none"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {product.subDescription}
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
                      <div className="text-sm font-montserrat-regular-400 text-black-light">
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
                {isRing && stones.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3 flex items-center gap-2">
                      <Gem className="w-5 h-5 text-primary" />
                      Center Stone
                    </h3>
                    
                    <div className="mb-4">
                      {stonesLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="text-sm text-black-light mt-2">Loading stones...</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {stones.filter(stone => stone.active).map((stone) => (
                            <button
                              key={stone._id}
                              onClick={() => handleCaratChange(stone.name)}
                              className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-montserrat-medium-500 ${
                                (selectedCarat?.name === stone.name || selectedCarat?.id === stone._id) || (typeof selectedCarat === 'string' && selectedCarat === stone.name)
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 bg-white text-black hover:border-primary hover:bg-primary-light'
                              }`}
                            >
                              {stone.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ring Size Selection */}
                {isRing && (
                  <div className="mb-6">
                    <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                      Ring Size <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                      options={RING_SIZES}
                      value={selectedRingSize}
                      onChange={handleRingSizeChange}
                      placeholder="Select Ring Size (Required)"
                      searchable={false}
                    />
                    {!selectedRingSize && (
                      <p className="mt-2 text-xs text-gray-600 font-montserrat-regular-400">
                        Need help finding your size? Check our <a href="/size-guide" className="text-primary hover:underline">Size Guide</a>
                      </p>
                    )}
                  </div>
                )}

                {/* Product Details Accordion */}
                <div className="mb-0 space-y-3">
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">
                    Product Details
                  </h3>
                  
                  <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
                    <div className="flex justify-between">
                      <span className="font-montserrat-medium-500 text-black">Material:</span>
                      <span>{selectedMetal ? `${selectedMetal.carat} ${selectedMetal.color}` : 'Premium Gold/Silver'}</span>
                    </div>
                    {isRing && selectedCarat && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Center Stone:</span>
                        <span>{typeof selectedCarat === 'string' ? selectedCarat : selectedCarat.name}</span>
                      </div>
                    )}
                    {isRing && selectedRingSize && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Ring Size:</span>
                        <span>{selectedRingSize}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                    <span className="font-montserrat-medium-500 text-black">Care:</span>
                      <span>{product.careInstruction}</span>
                    </div>
                    {product.shape && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Shape:</span>
                        <span>{product.shape}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex justify-between">
                        <span className="font-montserrat-medium-500 text-black">Color:</span>
                        <span>{product.color}</span>
                      </div>
                    )}
                    {product.clarity.length > 0 && (
                      <div className="flex justify-between">
                       <span className="font-montserrat-medium-500 text-black">Clarity:</span>
                        <span>{product.clarity.join(', ')}</span>
                      </div>
                    )}
                    {product.certificate.length > 0 && (
                      <div className="flex justify-between">
                      <span className="font-montserrat-medium-500 text-black">Certificate:</span>
                        <span>{product.certificate.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* FAQ Style Accordions */}
                  <div className="space-y-2 ">
                    <Accordion 
                      title="More Details" 
                      icon={<ListChevronsDownUp className="w-4 h-4 text-primary" />}
                    >
                      <div 
                        dangerouslySetInnerHTML={{ __html: parseLexicalDescription(product.description) }}
                        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                      />
                    </Accordion>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 mt-[20px]" >
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 bg-primary-light hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-montserrat-medium-500 text-black">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 bg-primary-light hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart - {formatPrice(convertPrice(getFinalPrice() * quantity, 'USD', currentCurrency, { [currentCurrency]: exchangeRate }), currentCurrency, currencySymbol)}</span>
                </button>

                {/* Contact Box */}
                <ContactBox />

                {/* Additional Info */}
                <div className="text-xs font-montserrat-regular-400 text-black-light text-center">
                  <p>✓ Free shipping on orders over $100</p>
                  <p>✓ 30-day return policy</p>
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

