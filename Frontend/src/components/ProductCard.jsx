import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import ProductDetailsModal from './ProductDetailsModal';
import PriceDisplay from './PriceDisplay';

const ProductCard = ({ product, viewMode = "grid" }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
          viewMode === "list" ? "flex" : ""
        }`}
      >
        {/* Product Image */}
        <div className={`relative overflow-hidden ${
          viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "h-64 sm:h-72 md:h-80"
        }`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.featured && (
            <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-montserrat-medium-500">
              Featured
            </div>
          )}
          <button 
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full transition-colors duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-black-light hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          {product.originalPrice && (
            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm font-montserrat-medium-500">
              Sale
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
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
        <div className={`p-4 md:p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
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
            {product.description}
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
              className="flex-1 border border-gray-200 bg-gray-100 text-black font-montserrat-medium-500 py-2 md:py-3  rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
            >
              <Eye className="w-4 h-4 md:w-5 md:h-5" />
              <span>View</span>
            </button>
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white font-montserrat-medium-500 py-2 md:py-3  rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={product}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};

export default ProductCard;
