import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Eye
} from 'lucide-react';
import { 
  updateQuantity, 
  removeFromCart, 
  clearCart
} from '../store/slices/cartSlice';
import PriceDisplay from '../components/PriceDisplay';
import ProductDetailsModal from '../components/ProductDetailsModal';

const ViewCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalPrice } = useSelector(state => state.cart);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const MAX_CART_ITEMS = 5;
  const remainingSlots = MAX_CART_ITEMS - items.length;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    // if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    // }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleViewProduct = (item) => {
    setSelectedProduct(item);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-secondary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-black hover:text-primary transition-colors duration-300 mb-4 font-montserrat-medium-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl md:text-4xl font-sorts-mill-gloudy text-black">
            Shopping Cart<span className="text-primary">.</span>
          </h1>
          <p className="text-black-light font-montserrat-regular-400 mt-2">
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-montserrat-semibold-600 text-black mb-3">
              Your cart is empty
            </h2>
            <p className="text-black-light font-montserrat-regular-400 text-lg mb-8 max-w-md">
              Add some beautiful jewelry to get started
            </p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300 text-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              {/* Clear Cart Button */}
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-montserrat-semibold-600 text-black">
                  Cart Items
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-montserrat-medium-500 transition-colors duration-300 flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Cart</span>
                </button>
              </div>

              {/* Limit Indicator for Unauthenticated Users */}
              {!isAuthenticated && items.length > 0 && (
                <div className={`mb-6 p-4 rounded-lg border-2 ${
                  remainingSlots <= 1 
                    ? 'bg-yellow-50 border-yellow-300' 
                    : 'bg-blue-50 border-blue-300'
                }`}>
                  <p className={`text-sm font-montserrat-medium-500 ${
                    remainingSlots <= 1 ? 'text-yellow-800' : 'text-blue-800'
                  }`}>
                    {remainingSlots > 0 ? (
                      <>🔒 You can add {remainingSlots} more {remainingSlots === 1 ? 'item' : 'items'}. <Link to="/sign-in" className="underline hover:text-blue-600">Login</Link> for unlimited cart!</>
                    ) : (
                      <>⚠️ Cart limit reached! <Link to="/sign-in" className="underline hover:text-yellow-600">Login</Link> to add more items.</>
                    )}
                  </p>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image - Clickable */}
                      <div 
                        className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                        onClick={() => handleViewProduct(item)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleViewProduct(item)}
                          >
                            <h3 className="text-lg font-montserrat-semibold-600 text-black hover:text-primary transition-colors duration-300 mb-2">
                              {item.name}
                            </h3>
                            
                            {/* Show selected metal if available */}
                            {item.selectedMetal && (
                              <div className="text-sm text-black-light font-montserrat-regular-400 mb-2">
                                {item.selectedMetal.karat} {item.selectedMetal.color}
                              </div>
                            )}

                            <PriceDisplay 
                              price={item.price}
                              className="text-primary font-montserrat-bold-700 text-xl"
                            />
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(item.id);
                            }}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-300 ml-4 flex-shrink-0"
                            title="Remove Item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity Controls and View Button */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-100 hover:bg-gray-300 rounded flex items-center justify-center transition-colors duration-300"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-montserrat-medium-500 text-black min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-100 hover:bg-gray-300 rounded flex items-center justify-center transition-colors duration-300"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-black-light font-montserrat-regular-400 ml-2">
                              Qty
                            </span>
                          </div>

                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewProduct(item)}
                            className="flex items-center space-x-2 text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors duration-300"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-montserrat-semibold-600 text-black mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black-light font-montserrat-regular-400">
                      Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
                    </span>
                    <PriceDisplay 
                      price={totalPrice}
                      className="text-black font-montserrat-semibold-600"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-black-light font-montserrat-regular-400">
                      Shipping
                    </span>
                    <span className="text-black-light font-montserrat-regular-400">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-montserrat-semibold-600 text-black">
                        Total
                      </span>
                      <PriceDisplay 
                        price={totalPrice}
                        className="text-xl font-montserrat-bold-700 text-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg mb-4"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/shop"
                  className="block w-full text-center text-primary border-2 border-primary font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  Continue Shopping
                </Link>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-black-light font-montserrat-regular-400 text-center">
                    🔒 Secure checkout • Free shipping on orders over $500
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={handleCloseProductModal}
        />
      )}
    </div>
  );
};

export default ViewCart;

