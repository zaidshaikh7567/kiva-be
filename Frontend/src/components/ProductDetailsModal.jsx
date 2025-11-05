import React, { useEffect, useState, useRef } from 'react';
import { X, Heart, Star, ShoppingBag, Minus, Plus, Gem, Shield, Truck, RotateCcw, Award, Info, ListChevronsDownUp, HelpCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem } from '../store/slices/cartSlice';
import { 
  toggleFavorite as toggleFavoriteAction, 
  addToFavoritesAPI, 
  removeFromFavoritesAPI, 
  selectIsFavorite 
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import PriceDisplay from './PriceDisplay';
import MetalSelector from './MetalSelector';
import CustomDropdown from './CustomDropdown';
import Accordion from './Accordion';
import { selectCurrentCurrency, selectCurrencySymbol, selectExchangeRate, convertPrice, formatPrice } from '../store/slices/currencySlice';
import { fetchStones, selectStones, selectStonesLoading } from '../store/slices/stonesSlice';
import { selectCategories } from '../store/slices/categoriesSlice';
import { RING_SIZES } from '../services/centerStonesApi';
import { parseLexicalDescription } from '../helpers/lexicalToHTML';
import toast from 'react-hot-toast';
import ContactBox from './ContactBox';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  console.log('quantity----:', quantity);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [selectedCenterStone, setSelectedCenterStone] = useState(null);
  const [selectedCarat, setSelectedCarat] = useState(
    product?.stoneType ? {
      name: product.stoneType.name,
      id: product.stoneType._id || product.stoneType.id
    } : null
  );
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const dispatch = useDispatch();
  
  // Currency selectors
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const exchangeRate = useSelector(selectExchangeRate);
  
  // Stones selectors
  const stones = useSelector(selectStones);
  const stonesLoading = useSelector(selectStonesLoading);
  
  // Categories selector
  const categories = useSelector(selectCategories);
  
  // Favorite status from Redux
  const isFavorite = useSelector(state => selectIsFavorite(state, product?._id || product?.id));
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch stones when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Fetch stones from API
      dispatch(fetchStones({ page: 1, limit: 10 }));
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, dispatch]);

  // Image navigation handlers
  const handleNextImage = (e) => {
    e?.stopPropagation();
    const total = product?.images?.length || 0;
    if (total > 0) {
      setSelectedImage((prev) => (prev + 1) % total);
    }
    // Reset magnifier position to current mouse position after image change
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
    // Reset magnifier position to current mouse position after image change
    if (imageContainerRef.current && mousePositionRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = mousePositionRef.current.x - rect.left;
      const y = mousePositionRef.current.y - rect.top;
      const constrainedX = Math.max(0, Math.min(x, rect.width));
      const constrainedY = Math.max(0, Math.min(y, rect.height));
      setMagnifierPosition({ x: constrainedX, y: constrainedY });
    }
  };

  // Hide magnifier when entering arrow button area
  const handleArrowMouseEnter = () => {
    setShowMagnifier(false);
  };

  // Re-enable magnifier when leaving arrow button and going to image
  const handleArrowMouseLeave = () => {
    // Small delay to allow mouse to move to image container
    setTimeout(() => {
      if (imageContainerRef.current && mousePositionRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const { x, y } = mousePositionRef.current;
        // Check if mouse is within image bounds
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
      // Validate ring size for rings
      if (isRing && !selectedRingSize) {
        toast.error('Please select a ring size before adding to cart', {
          duration: 3000,
          position: 'top-right',
        });
        return;
      }

      // Check if user is authenticated
      const isAuthenticated = !!localStorage.getItem('accessToken');
      
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

      // For unauthenticated users, include full product details
      if (!isAuthenticated) {
        cartData.name = product.title || product.name;
        cartData.title = product.title || product.name;
        cartData.price = getFinalPrice();
        cartData.image = product.images?.[0]?.url || product.images?.[0];
        cartData.images = product.images;
        cartData.description = product.description;
        cartData._id = product._id;
        cartData.selectedMetal = selectedMetal;
        if (isRing && selectedRingSize) {
          cartData.ringSize = selectedRingSize;
        }
      }

      // Dispatch the async thunk
      await dispatch(addCartItem(cartData));
      
      // Build success message with selected options
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
      
      // Close modal after successful add to cart
      onClose();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
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

  // Calculate final price with metal multiplier and center stone
  const getFinalPrice = () => {
    const basePrice = product.price;
    const metalMultiplier = selectedMetal ? selectedMetal.priceMultiplier : 1;
    const centerStonePrice = selectedCenterStone ? selectedCenterStone.price : 0;
    return (basePrice + centerStonePrice) * metalMultiplier;
  };

  // Magnifier handlers
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    
    // Track global mouse position
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constrain position within image bounds
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

  // Calculate zoom position for background image
  const getZoomPosition = () => {
    if (!imageContainerRef.current) return { x: 0, y: 0, zoom: 2.5 };
    const rect = imageContainerRef.current.getBoundingClientRect();
    const zoomLevel = 4.5; // Zoom factor
    const x = (magnifierPosition.x / rect.width) * 100;
    const y = (magnifierPosition.y / rect.height) * 100;
    return { x, y, zoom: zoomLevel };
  };

  const zoomPos = getZoomPosition();

  // Get total images for display
  const totalImages = product?.images?.length || 0;
  
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
              <div 
                ref={imageContainerRef}
                className="aspect-square relative overflow-hidden rounded-lg mb-4 cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Main Image */}
                <img
                  src={product?.images?.[selectedImage]}
                  alt={product?.name}
                  className="w-full h-full object-cover"
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
                  className={`absolute top-4 sm:right-4 left-4 w-fit  p-2 rounded-full transition-all duration-200 z-10 ${
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
                    {/* Previous Button */}
                    <button
                      onClick={handlePreviousImage}
                      onMouseEnter={handleArrowMouseEnter}
                      onMouseLeave={handleArrowMouseLeave}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-1 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-black" />
                    </button>

                    {/* Next Button */}
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
              <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                      selectedImage === index ? 'border-primary ring-1 outline-none ring-primary ring-offset-2' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4 lg:p-8 flex flex-col justify-between">
              <div>
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-montserrat-medium-500 text-black">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-sorts-mill-gloudy text-black mb-4">
                  {product.title}
                </h1>

                {/* Description */}
                <div 
                  className="text-black-light font-montserrat-regular-400 text-base mb-6 leading-relaxed prose prose-sm max-w-none"
                  // dangerouslySetInnerHTML={{ __html: parseLexicalDescription(product.subDescription) }}
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                {
                  product.subDescription
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
                  />
                </div>

                {/* Center Stone Selection */}
                {isRing && stones.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3 flex items-center gap-2">
                      <Gem className="w-5 h-5 text-primary" />
                      Center Stone
                    </h3>
                    
                    {/* Stone Selection */}
                    <div className="mb-4">
                      {stonesLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-lg h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="text-sm text-black-light mt-2">Loading stones...</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {stones.filter(stone => stone.active).map((stone) => (
                            <button
                              key={stone._id}
                              onClick={() => handleCaratChange(stone.name)}
                              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-montserrat-medium-500 ${
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


                    {/* Selected Center Stone Info */}
                    {/* {selectedCenterStone && (
                      <div className="bg-primary-light/10 border border-primary-light rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-montserrat-semibold-600 text-black">
                              {selectedCenterStone.name}
                            </h4>
                            <p className="text-sm font-montserrat-regular-400 text-black-light capitalize">
                              {selectedCenterStone.categoryId} cut
                            </p>
                          </div>
                          <div className="text-right">
                            <PriceDisplay 
                              price={selectedCenterStone.price}
                              className="text-lg font-montserrat-semibold-600 text-primary"
                            />
                          </div>
                        </div>
                      </div>
                    )} */}
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
                <div className="mb-2 space-y-3">
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">
                    Product Details
                  </h3>
                  

                  <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
                    <div className="flex justify-between">
                      <span>Material:</span>
                      <span>{selectedMetal ? `${selectedMetal.carat} ${selectedMetal.color}` : 'Premium Gold/Silver'}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>Stone:</span>
                      <span>Natural Diamond/Gemstone</span>
                    </div> */}
                    {isRing && selectedCarat && (
                      <div className="flex justify-between">
                        <span>Center Stone:</span>
                        <span>{typeof selectedCarat === 'string' ? selectedCarat : selectedCarat.name}</span>
                      </div>
                    )}
                    {isRing && selectedRingSize && (
                      <div className="flex justify-between">
                        <span>Ring Size:</span>
                        <span>{selectedRingSize}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Care:</span>
                      <span>Professional Cleaning</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>Warranty:</span>
                      <span>2 Years</span>
                    </div> */}
                  </div>
           

                  {/* FAQ Style Accordions */}
                  <div className="space-y-2">
                    <Accordion 
                      title="More Details" 
                      icon={<ListChevronsDownUp className="w-4 h-4 text-primary" />}
                    >
                      <div 
              // className="text-gray-600 prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: parseLexicalDescription(product.description) }}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            />
                    </Accordion>

                
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
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

export default ProductDetailsModal;
