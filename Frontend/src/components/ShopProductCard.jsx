import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite, selectIsFavorite } from '../store/slices/favoritesSlice';
import PriceDisplay from './PriceDisplay';
import ProductDetailsModal from './ProductDetailsModal';
import toast from 'react-hot-toast';
import { extractPlainText } from '../helpers/lexicalToHTML';

const ShopProductCard = ({ product, viewMode = 'grid', showQuickActions = true }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const dispatch = useDispatch();
  const isFavorite = useSelector(state => selectIsFavorite(state, product._id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`${product.title} added to cart!`, {
      duration: 2000,
      position: 'top-right',
    });
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
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
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
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
              <p className="text-black-light font-montserrat-regular-400 mb-4 line-clamp-2 text-sm sm:text-base">{extractPlainText(product.description)}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <PriceDisplay 
                    price={product.price}
                    className="text-xl sm:text-2xl font-montserrat-bold-700 text-primary-dark"
                  />
                  <span className="text-sm text-black-light font-montserrat-regular-400">({product.quantity} in stock)</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorite ? 'text-primary bg-primary-light' : 'text-black-light hover:text-primary'
                    }`}
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleQuickView}
                    className="px-3 sm:px-4 py-2 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-1 sm:gap-2 font-montserrat-medium-500 text-sm"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    {/* <span className="hidden sm:inline">Quick View</span> */}
                  </button>
                  <button
                    onClick={handleAddToCart}
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
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
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
          onClick={handleToggleFavorite}
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
                onClick={handleQuickView}
                className="px-3 sm:px-4 py-2 bg-white text-black rounded-lg hover:bg-primary-light transition-colors flex items-center gap-1 sm:gap-2 font-montserrat-medium-500 shadow-lg text-xs sm:text-sm whitespace-nowrap"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                {/* <span className="hidden sm:inline">Quick View</span> */}
              </button>
              <button
                onClick={handleAddToCart}
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
            <Link to={`/product/${product._id || product.id}`} className="block">
              <h3 className="text-base sm:text-lg font-montserrat-semibold-600 text-black mb-2 line-clamp-1 hover:text-primary-dark transition-colors">{product.title}</h3>
            </Link>
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
};

export default ShopProductCard;
