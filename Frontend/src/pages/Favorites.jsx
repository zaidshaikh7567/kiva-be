import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Trash2, X } from 'lucide-react';
import { selectFavorites, selectFavoritesCount, removeFromFavorites, clearFavorites } from '../store/slices/favoritesSlice';
import { addToCart } from '../store/slices/cartSlice';
import PriceDisplay from '../components/PriceDisplay';
import ProductDetailsModal from '../components/ProductDetailsModal';
import CustomDropdown from '../components/CustomDropdown';
import { RING_SIZES } from '../services/centerStonesApi';
import { selectCategories } from '../store/slices/categoriesSlice';
import { extractPlainText } from '../helpers/lexicalToHTML';
import toast from 'react-hot-toast';
import { useState } from 'react';
import AnimatedSection from '../components/home/AnimatedSection';

const Favorites = () => {
  const favorites = useSelector(selectFavorites);
  console.log('favorites :', favorites);
  const favoritesCount = useSelector(selectFavoritesCount);
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRingSizeModal, setShowRingSizeModal] = useState(false);
  const [selectedRingSize, setSelectedRingSize] = useState('');
  const [productForRingSize, setProductForRingSize] = useState(null);

  // Check if product is a ring
  const isRing = (product) => {
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
      ...productForRingSize,
      ringSize: selectedRingSize
    };
    
    dispatch(addToCart(productWithRingSize));
    toast.success(`${productForRingSize.title || productForRingSize.name} added to cart with size ${selectedRingSize}!`, {
      duration: 2000,
      position: 'top-right',
    });
    
    // Close modal and reset
    setShowRingSizeModal(false);
    setSelectedRingSize('');
    setProductForRingSize(null);
  };

  const handleAddToCart = (product) => {
    // Check if product is a ring
    if (isRing(product)) {
      // Show ring size selection modal
      setProductForRingSize(product);
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

  const handleRemoveFromFavorites = (product) => {
  console.log('product :', product);
    dispatch(removeFromFavorites(product._id || product.id));
    toast.success(`${product.title || product.name} removed from favorites!`, {
      duration: 2000,
      position: 'top-right',
    });
  };

  const handleClearAllFavorites = () => {
    dispatch(clearFavorites());
    toast.success('All favorites cleared!', {
      duration: 2000,
      position: 'top-right',
    });
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="py-8 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
              FAVORITES
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
              Your Favorite <span className="text-primary">Jewelry</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
              Discover and manage your favorite jewelry pieces, saved for easy access and future purchases.
            </p>
            <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
          </div>
        </section>
      </AnimatedSection>

      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <AnimatedSection animationType="fadeInLeft" delay={200}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-montserrat-semibold-600 text-black mb-2">
              My Favorites
            </h2>
            <p className="text-black-light font-montserrat-regular-400">
              {favoritesCount} item{favoritesCount !== 1 ? 's' : ''} saved
            </p>
          </div>
          
          {favoritesCount > 0 && (
            <button
              onClick={handleClearAllFavorites}
              className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-montserrat-medium-500 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
          </div>
        </AnimatedSection>

        {/* Favorites Content */}
        <AnimatedSection animationType="scaleIn" delay={300}>
        {favoritesCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-primary-light">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black-light">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Remove from Favorites Button */}
                  <button
                    onClick={() => handleRemoveFromFavorites(product)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-primary hover:bg-primary hover:text-white transition-all duration-200 z-10"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleQuickView(product)}
                        className="px-3 sm:px-4 py-2 bg-white text-black rounded-lg hover:bg-primary-light transition-colors flex items-center gap-1 sm:gap-2 font-montserrat-medium-500 shadow-lg text-xs sm:text-sm whitespace-nowrap"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Quick View</span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3 sm:px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-1 sm:gap-2 font-montserrat-medium-500 shadow-lg text-xs sm:text-sm whitespace-nowrap"
                      >
                        <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    {/* <Link to={`/product/${product._id || product.id}`} className="block"> */}
                      <h3 className="text-base sm:text-lg font-montserrat-semibold-600 text-black mb-2 line-clamp-1 hover:text-primary-dark transition-colors">{product.title || product.name}</h3>
                    {/* </Link> */}
                    <p className="text-black-light text-xs sm:text-sm mb-3 line-clamp-2 font-montserrat-regular-400">{extractPlainText(product.description)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <PriceDisplay 
                      price={product.price}
                      className="text-lg sm:text-xl font-montserrat-bold-700 text-primary-dark"
                    />
                    <span className="text-xs sm:text-sm text-black-light font-montserrat-regular-400">{product.quantity} in stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-primary-light mb-6">
              <Heart className="w-24 h-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-montserrat-semibold-600 text-black mb-4">No Favorites Yet</h3>
            <p className="text-black-light font-montserrat-regular-400 mb-8 max-w-md mx-auto">
              Start exploring our jewelry collection and save your favorite pieces by clicking the heart icon.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors font-montserrat-medium-500"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        )}
        </AnimatedSection>
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={showQuickView}
          onClose={handleCloseQuickView}
        />
      )}

      {/* Ring Size Selection Modal */}
      {showRingSizeModal && productForRingSize && (
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
                  setProductForRingSize(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                {productForRingSize?.images?.[0] && (
                  <img
                    src={productForRingSize.images[0]}
                    alt={productForRingSize.title || productForRingSize.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-montserrat-semibold-600 text-black mb-1">
                    {productForRingSize.title || productForRingSize.name}
                  </h4>
                  <PriceDisplay 
                    price={productForRingSize.price}
                    originalPrice={productForRingSize.originalPrice}
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
                  setProductForRingSize(null);
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
    </div>
  );
};

export default Favorites;
