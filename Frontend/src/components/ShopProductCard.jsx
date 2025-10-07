import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import PriceDisplay from './PriceDisplay';

const ShopProductCard = ({ product, viewMode = 'grid', showQuickActions = true }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view functionality
    console.log('Quick view:', product);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-primary-light rounded-lg overflow-hidden flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
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
            <h3 className="text-xl font-montserrat-semibold-600 text-black mb-2">{product.title}</h3>
            <p className="text-black-light font-montserrat-regular-400 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <PriceDisplay 
                  price={product.price}
                  className="text-2xl font-montserrat-bold-700 text-primary-dark"
                />
                <span className="text-sm text-black-light font-montserrat-regular-400 ml-2">({product.quantity} in stock)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite ? 'text-primary bg-primary-light' : 'text-black-light hover:text-primary'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2 font-montserrat-medium-500"
                >
                  <ShoppingBag className="w-4 h-4" />
              Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-primary-light">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
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
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
            <div className="flex gap-3">
              <button
                onClick={handleQuickView}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-primary-light transition-colors flex items-center gap-2 font-montserrat-medium-500 shadow-lg"
              >
                <Eye className="w-4 h-4" />
                <span className='sm:hidden flex '>Quick View</span>
              
              </button>
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2 font-montserrat-medium-500 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className='sm:hidden flex '>Add to Cart</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product._id || product.id}`} className="block">
          <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2 line-clamp-1 hover:text-primary-dark transition-colors">{product.title}</h3>
        </Link>
        <p className="text-black-light text-sm mb-3 line-clamp-2 font-montserrat-regular-400">{product.description}</p>
        <div className="flex items-center justify-between">
          <PriceDisplay 
            price={product.price}
            className="text-xl font-montserrat-bold-700 text-primary-dark"
          />
          <span className="text-sm text-black-light font-montserrat-regular-400">{product.quantity} in stock</span>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
