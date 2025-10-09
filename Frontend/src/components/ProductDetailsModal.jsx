import React, { useEffect, useState } from 'react';
import { X, Heart, Star, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import PriceDisplay from './PriceDisplay';
import MetalSelector from './MetalSelector';
import { selectCurrentCurrency, selectCurrencySymbol, selectExchangeRate, convertPrice, formatPrice } from '../store/slices/currencySlice';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(null);
  console.log('selectedMetal :', selectedMetal);
  const dispatch = useDispatch();
  
  // Currency selectors
  const currentCurrency = useSelector(selectCurrentCurrency);
  const currencySymbol = useSelector(selectCurrencySymbol);
  const exchangeRate = useSelector(selectExchangeRate);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    const productWithMetal = {
      ...product,
      selectedMetal: selectedMetal
    };
    
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(productWithMetal));
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

  // Calculate final price with metal multiplier
  const getFinalPrice = () => {
    const basePrice = product.price;
    const metalMultiplier = selectedMetal ? selectedMetal.priceMultiplier : 1;
    return basePrice * metalMultiplier;
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
                <div className="flex items-center space-x-3 mb-6">
                  <PriceDisplay 
                    price={getFinalPrice()}
                    originalPrice={product.originalPrice}
                    showOriginalPrice={true}
                    showSavings={true}
                    className="text-3xl lg:text-4xl font-montserrat-bold-700 text-primary"
                  />
                  {selectedMetal && (
                    <div className="text-sm font-montserrat-regular-400 text-black-light">
                      ({selectedMetal.karat} {selectedMetal.color})
                    </div>
                  )}
                </div>

                {/* Metal Selection */}
                <div className="mb-6">
                  <MetalSelector
                    selectedMetal={selectedMetal}
                    onMetalChange={handleMetalChange}
                  />
                </div>

                {/* Product Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">
                    Product Details
                  </h3>
                  <div className="space-y-2 text-sm font-montserrat-regular-400 text-black-light">
                    <div className="flex justify-between">
                      <span>Material:</span>
                      <span>{selectedMetal ? `${selectedMetal.karat} ${selectedMetal.color}` : 'Premium Gold/Silver'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stone:</span>
                      <span>Natural Diamond/Gemstone</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Care:</span>
                      <span>Professional Cleaning</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Warranty:</span>
                      <span>2 Years</span>
                    </div>
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
