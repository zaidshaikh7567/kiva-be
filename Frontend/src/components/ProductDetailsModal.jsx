import React, { useEffect, useState } from 'react';
import { X, Heart, Star, ShoppingBag, Minus, Plus, Gem, Shield, Truck, RotateCcw, Award, Info, ListChevronsDownUp, HelpCircle, FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem } from '../store/slices/cartSlice';
import { toggleFavorite as toggleFavoriteAction, selectIsFavorite } from '../store/slices/favoritesSlice';
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

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [selectedCenterStone, setSelectedCenterStone] = useState(null);
  const [selectedCarat, setSelectedCarat] = useState(product.stoneType?.name);
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
      // Check if user is authenticated
      const isAuthenticated = !!localStorage.getItem('accessToken');
      
      // Prepare cart data according to API structure
      const cartData = {
        productId: product._id,
        quantity: quantity,
      };

      // Add metal information if selected
      if (selectedMetal) {
        cartData.metalId = selectedMetal.metalId;
        cartData.purityLevel = {
          karat: selectedMetal.carat,
          priceMultiplier: selectedMetal.priceMultiplier,
        };
      }

      // Add stone type if selected
      if (selectedCarat && product.stoneType) {
        cartData.stoneTypeId = product.stoneType._id;
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
      }

      // Dispatch the async thunk
      await dispatch(addCartItem(cartData));
      onClose();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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
  };

  const handleMetalChange = (metal) => {
    setSelectedMetal(metal);
  };

  const handleRingSizeChange = (size) => {
    setSelectedRingSize(size);
  };

  const handleCaratChange = (carat) => {
    setSelectedCarat(carat);
    // Find stone by carat name
    const stone = stones.find(stone => 
      stone.name.toLowerCase().includes(carat.toLowerCase())
    );
    if (stone) {
      setSelectedCenterStone(stone);
    }
  };

  // Calculate final price with metal multiplier and center stone
  const getFinalPrice = () => {
    const basePrice = product.price;
    const metalMultiplier = selectedMetal ? selectedMetal.priceMultiplier : 1;
    const centerStonePrice = selectedCenterStone ? selectedCenterStone.price : 0;
    return (basePrice + centerStonePrice) * metalMultiplier;
  };


  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-6xl w-full  overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-300"
          >
            <X className="w-5 h-5 text-black" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Product Images */}
            <div className="relative bg-gray-50 p-4 lg:p-8">
              <div className="aspect-square relative overflow-hidden rounded-2xl mb-4">
                <img
                  src={product?.images?.[selectedImage]}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
                {product?.featured && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-montserrat-medium-500">
                    Featured
                  </div>
                )}
                <button
                  onClick={toggleFavorite}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 z-10 ${
                    isFavorite 
                      ? 'bg-primary text-white' 
                      : 'bg-white/90 text-black-light hover:bg-primary hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
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
                                selectedCarat === stone.name
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
                      Ring Size
                    </label>
                    <CustomDropdown
                      options={RING_SIZES}
                      value={selectedRingSize}
                      onChange={handleRingSizeChange}
                      placeholder="Select Ring Size"
                      searchable={false}
                    />
                  </div>
                )}

                {/* Product Details Accordion */}
                <div className="mb-6 space-y-3">
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
                        <span>{selectedCarat} CT</span>
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
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart - {formatPrice(convertPrice(getFinalPrice() * quantity, 'USD', currentCurrency, { [currentCurrency]: exchangeRate }), currentCurrency, currencySymbol)}</span>
                </button>

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
