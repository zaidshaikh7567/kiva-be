import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite, selectIsFavorite } from '../store/slices/favoritesSlice';
import ProductDetailsModal from './ProductDetailsModal';
import PriceDisplay from './PriceDisplay';
import CustomDropdown from './CustomDropdown';
import { RING_SIZES } from '../services/centerStonesApi';
import { selectCategories } from '../store/slices/categoriesSlice';
import toast from 'react-hot-toast';
import { extractPlainText } from '../helpers/lexicalToHTML';

const ProductCard = ({ product, viewMode = "grid" }) => {
  console.log('product-----!!!! :', product);
  const [showDetails, setShowDetails] = useState(false);
  const [showRingSizeModal, setShowRingSizeModal] = useState(false);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const dispatch = useDispatch();
  const isFavorite = useSelector(state => selectIsFavorite(state, product.id));
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
    toast.success(`${product.name} added to cart with size ${selectedRingSize}!`, {
      duration: 2000,
      position: 'top-right',
    });
    
    // Close modal and reset
    setShowRingSizeModal(false);
    setSelectedRingSize('');
  };

  const handleAddToCart = () => {
    // Check if product is a ring
    if (isRing()) {
      // Show ring size selection modal
      setShowRingSizeModal(true);
    } else {
      // Add directly to cart
      dispatch(addToCart(product));
      toast.success(`${product.name} added to cart!`, {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product));
    
    if (isFavorite) {
      toast.success(`${product.name} removed from favorites!`, {
        duration: 2000,
        position: 'top-right',
      });
    } else {
      toast.success(`${product.name} added to favorites!`, {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
          viewMode === "list" ? "flex flex-col sm:flex-row" : ""
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
            onClick={handleToggleFavorite}
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
              onClick={handleViewDetails}
              className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors duration-300"
              title="View Details"
            >
              <Eye className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-3 bg-primary rounded-full hover:bg-primary-dark transition-colors duration-300"
              title="Add to Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className={`${viewMode === "list" ? "p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-between" : "p-4 md:p-6"}`}>
          {viewMode === "list" ? (
            <>
              {/* Top Section */}
              <div className="flex-1">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-montserrat-regular-400 text-black-light">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <h3 className="text-sm sm:text-base md:text-lg font-montserrat-semibold-600 text-black mb-2">
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
                    onClick={handleViewDetails}
                    className="flex-1 sm:flex-none border border-gray-200 bg-gray-100 text-black font-montserrat-medium-500 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-1.5 text-xs md:text-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 sm:flex-none bg-primary text-white font-montserrat-medium-500 py-2 px-3 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-1.5 text-xs md:text-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-montserrat-regular-400 text-black-light">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-montserrat-semibold-600 text-black mb-2">
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

              <div className="flex space-x-2">
                <button 
                  onClick={handleViewDetails}
                  className="flex-1 border border-gray-200 bg-gray-100 text-black font-montserrat-medium-500 py-2 md:py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  <span>View</span>
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white font-montserrat-medium-500 py-2 md:py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={product}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

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
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-montserrat-semibold-600 text-black mb-1">
                    {product.name}
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

export default ProductCard;
