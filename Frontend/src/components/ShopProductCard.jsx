import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite, selectIsFavorite } from '../store/slices/favoritesSlice';
import PriceDisplay from './PriceDisplay';
import ProductDetailsModal from './ProductDetailsModal';
import CustomDropdown from './CustomDropdown';
import { RING_SIZES } from '../services/centerStonesApi';
import { selectCategories } from '../store/slices/categoriesSlice';
import toast from 'react-hot-toast';
import { extractPlainText } from '../helpers/lexicalToHTML';

const ShopProductCard = ({ product, viewMode = 'grid', showQuickActions = true }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [showRingSizeModal, setShowRingSizeModal] = useState(false);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isFavorite = useSelector(state => selectIsFavorite(state, product._id));
  const categories = useSelector(selectCategories);

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

  const handleConfirmRingSize = () => {
    if (!selectedRingSize) {
      toast.error('Please select a ring size', {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }
    
    // Add to cart with ring size
    const productWithRingSize = {
      ...product,
      ringSize: selectedRingSize
    };
    
    dispatch(addToCart(productWithRingSize));
    // toast.success(`${product.title || product.name} added to cart with size ${selectedRingSize}!`, {
    //   duration: 2000,
    //   position: 'top-right',
    // });
    
    // Close modal and reset
    setShowRingSizeModal(false);
    setSelectedRingSize('');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if product is a ring
    if (isRing()) {
      // Show ring size selection modal
      setShowRingSizeModal(true);
    } else {
      // Add directly to cart
      dispatch(addToCart(product));
      toast.success(`${product.title || product.name} added to cart!`, {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

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

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product));
    
    if (isFavorite) {
      toast.success(`${product.title} removed from favorites!`, {
        duration: 2000,
        position: 'top-right',
      });
    } else {
      toast.success(`${product.title} added to favorites!`, {
        duration: 2000,
        position: 'top-right',
      });
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

      {/* Ring Size Selection Modal */}
      {showRingSizeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-montserrat-semibold-600 text-black">
                Select Ring Size
              </h3>
              <button
                onClick={() => {
                  setShowRingSizeModal(false);
                  setSelectedRingSize('');
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
                    originalPrice={product.originalPrice}
                    variant="small"
                  />
                </div>
              </div>
            </div>

            {/* Ring Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
                Ring Size *
              </label>
              <CustomDropdown
                options={RING_SIZES}
                value={selectedRingSize}
                onChange={handleRingSizeChange}
                placeholder="Select your ring size"
                searchable={false}
              />
              <p className="mt-2 text-xs text-gray-600 font-montserrat-regular-400">
                Need help finding your size? Check our <a href="/size-guide" className="text-primary hover:underline">Size Guide</a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRingSizeModal(false);
                  setSelectedRingSize('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 font-montserrat-medium-500 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRingSize}
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
