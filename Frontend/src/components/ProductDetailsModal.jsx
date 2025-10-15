import React, { useEffect, useState, useCallback } from 'react';
import { X, Heart, Star, ShoppingBag, Minus, Plus, Gem, Shield, Truck, RotateCcw, Award, Info, ListChevronsDownUp, HelpCircle, FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import PriceDisplay from './PriceDisplay';
import MetalSelector from './MetalSelector';
import CustomDropdown from './CustomDropdown';
import Accordion from './Accordion';
import { selectCurrentCurrency, selectCurrencySymbol, selectExchangeRate, convertPrice, formatPrice } from '../store/slices/currencySlice';
import centerStonesApi, { RING_SIZES, CENTER_STONE_CARATS } from '../services/centerStonesApi';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
console.log('product :', product);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(null);
  console.log('selectedMetal :', selectedMetal);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [selectedCenterStone, setSelectedCenterStone] = useState(null);
  const [selectedCarat, setSelectedCarat] = useState('');
  const [centerStones, setCenterStones] = useState([]);
  console.log('centerStones :', centerStones);
  const dispatch = useDispatch();
  
  // Currency selectors
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const exchangeRate = useSelector(selectExchangeRate);


  // Fetch center stones based on product category
  const fetchCenterStones = useCallback(async () => {
    if (!product?.category) return;
    
    try {
      // If product has a center stone category, filter by that
      // Otherwise, fetch all center stones
      let response;
      if (product.centerStoneCategory) {
        response = await centerStonesApi.getCenterStonesByCategory(product.centerStoneCategory);
        console.log('response :', response);
      } else {
        response = await centerStonesApi.getCenterStones();
      }
      
      setCenterStones(response.centerStones || []);
    } catch (error) {
      console.error('Error fetching center stones:', error);
      setCenterStones([]);
    }
  }, [product?.category, product?.centerStoneCategory]);

   useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Fetch center stones when modal opens
      fetchCenterStones();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, fetchCenterStones]);
  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    const productWithOptions = {
      ...product,
      selectedMetal: selectedMetal,
      selectedRingSize: selectedRingSize,
      selectedCenterStone: selectedCenterStone,
      selectedCarat: selectedCarat,
      finalPrice: getFinalPrice()
    };
    
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(productWithOptions));
    }
    onClose();
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleMetalChange = (metal) => {
    setSelectedMetal(metal);
  };

  const handleRingSizeChange = (size) => {
    setSelectedRingSize(size);
  };

  const handleCaratChange = (carat) => {
    setSelectedCarat(carat);
    // Find center stone by carat - use the first available stone for this carat
    const stone = centerStones.find(stone => 
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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-montserrat-medium-500">
                    Featured
                  </div>
                )}
                <button
                  onClick={toggleFavorite}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-black hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Additional Images (if available) */}
              <div className="grid grid-cols-4 gap-2">
                {[product.image, product.image, product.image, product.image].map((img, index) => (
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
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-black-light font-montserrat-regular-400 text-base mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Price */}
                <div className="sm:flex block items-center justify-between mb-6">
                <div className="flex items-center space-x-3 ">
                  <PriceDisplay 
                    price={getFinalPrice()}
                    originalPrice={product.originalPrice}
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
                {centerStones.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3 flex items-center gap-2">
                      <Gem className="w-5 h-5 text-primary" />
                      Center Stone
                    </h3>
                    
                    {/* Carat Selection */}
                    <div className="mb-4">
                      {/* <label className="block text-sm font-montserrat-medium-500 text-black mb-2">
                        Carat Weight
                      </label> */}
                      <div className="flex flex-wrap gap-2">
                        {CENTER_STONE_CARATS.map((carat) => (
                          <button
                            key={carat.value}
                            onClick={() => handleCaratChange(carat.value)}
                            className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-montserrat-medium-500 ${
                              selectedCarat === carat.value
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-200 bg-white text-black hover:border-primary hover:bg-primary-light'
                            }`}
                          >
                            {carat.label}
                          </button>
                        ))}
                      </div>
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
                    <div className="flex justify-between">
                      <span>Stone:</span>
                      <span>Natural Diamond/Gemstone</span>
                    </div>
                    {selectedCarat && (
                      <div className="flex justify-between">
                        <span>Center Stone:</span>
                        <span>{selectedCarat} CT</span>
                      </div>
                    )}
                    {selectedRingSize && (
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
                  <div className="space-y-3">
                    <Accordion 
                      title="More Details" 
                      icon={<ListChevronsDownUp className="w-4 h-4 text-primary" />}
                    >
                      <div className="space-y-3">
                        <p><strong>Daily Care:</strong> Gently clean with a soft, dry cloth. Avoid contact with harsh chemicals, perfumes, and lotions.</p>
                        <p><strong>Storage:</strong> Store in a soft pouch or jewelry box to prevent scratches and tarnishing. Keep pieces separate to avoid tangling.</p>
                        <p><strong>Professional Cleaning:</strong> We recommend professional cleaning every 6 months to maintain brilliance and check for any needed repairs.</p>
                      </div>
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
