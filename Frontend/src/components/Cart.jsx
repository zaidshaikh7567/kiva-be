import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeCart, updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import PriceDisplay from './PriceDisplay';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalPrice, isOpen } = useSelector(state => state.cart);

  if (!isOpen) return null;

  const handleQuantityChange = (id, newQuantity) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => dispatch(closeCart())}
      ></div>
      
      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-sorts-mill-gloudy text-black">
              Shopping Cart<span className="text-primary">.</span>
            </h2>
            <button
              onClick={() => dispatch(closeCart())}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                  Your cart is empty
                </h3>
                <p className="text-black-light font-montserrat-regular-400 text-sm mb-6">
                  Add some beautiful jewelry to get started
                </p>
                <button
                  onClick={() => dispatch(closeCart())}
                  className="px-6 py-3 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-6">
                {/* Clear Cart Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-500 hover:text-red-700 font-montserrat-medium-500 transition-colors duration-300"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-montserrat-semibold-600 text-black text-sm truncate">
                          {item.name}
                        </h3>
                        <PriceDisplay 
                          price={item.price}
                          className="text-primary font-montserrat-bold-700 text-sm"
                        />
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-primary-light hover:bg-gray-300 rounded flex items-center justify-center transition-colors duration-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm  font-montserrat-medium-500 text-black min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-primary-light hover:bg-gray-300 rounded flex items-center justify-center transition-colors duration-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-montserrat-semibold-600 text-black">
                  Total ({totalQuantity} items)
                </span>
                <PriceDisplay 
                  price={totalPrice}
                  className="text-xl font-montserrat-bold-700 text-primary"
                />
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-white font-montserrat-medium-500 py-4 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Proceed to Checkout</span>
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => dispatch(closeCart())}
                className="w-full mt-3 text-primary border border-primary font-montserrat-medium-500 py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
