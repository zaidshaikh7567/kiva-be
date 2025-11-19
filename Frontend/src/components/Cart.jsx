import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Eye } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { closeCart, updateQuantity, removeFromCart, clearCartItems, deleteCartItem, updateCartItem } from '../store/slices/cartSlice';
import PriceDisplay from './PriceDisplay';
import ConfirmationModal from './ConfirmationModal';
import toast from 'react-hot-toast';
import { TOKEN_KEYS } from '../constants/tokenKeys';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalPrice, isOpen, loading } = useSelector(state => state.cart);
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  const MAX_CART_ITEMS = 5;
  const remainingSlots = MAX_CART_ITEMS - items.length;

  if (!isOpen) return null;

  const handleQuantityChange = async (id, newQuantity) => {
    
    // Ensure quantity is at least 1
    if (newQuantity < 1) {
      return;
    }
    
    // Store previous quantity for rollback on error
    const item = items.find(item => item._id === id || item.id === id || item.cartId === id);
    const previousQuantity = item?.quantity || item?.product?.quantity;
    
    // Optimistic update: Update UI immediately for fast UX
    dispatch(updateQuantity({ id, quantity: newQuantity }));
    
    if (isAuthenticated) {
      // Sync with API in background (non-blocking)
      dispatch(updateCartItem({ 
        cartId: id, 
        cartData: { quantity: newQuantity } 
      })).unwrap()
        .catch((error) => {
          // Revert to previous quantity if API call fails
          if (previousQuantity) {
            dispatch(updateQuantity({ id, quantity: previousQuantity }));
          }
          toast.error(error || 'Failed to update quantity');
        });
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(deleteCartItem(id));

    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    setShowClearCartModal(true);
  };

  const handleConfirmClearCart = () => {
    dispatch(clearCartItems());
    setShowClearCartModal(false);
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  const handleViewProduct = (item) => {
  console.log('item :', item);
    // Close cart and navigate to cart product detail page
    dispatch(closeCart());
    const cartItemId = item._id || item.id || item.cartId;
    if (cartItemId) {
      navigate(`/cart/product/${cartItemId}`);
    } else {
      toast.error('Unable to view product details');
    }
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
            {/* Limit Indicator for Unauthenticated Users */}
            {!isAuthenticated && items.length > 0 && (
              <div className={`mx-6 mt-4 p-3 rounded-lg border-2 ${
                remainingSlots <= 1 
                  ? 'bg-yellow-50 border-yellow-300' 
                  : 'bg-blue-50 border-blue-300'
              }`}>
                <p className={`text-sm font-montserrat-medium-500 ${
                  remainingSlots <= 1 ? 'text-yellow-800' : 'text-blue-800'
                }`}>
                  {remainingSlots > 0 ? (
                    <>🔒 You can add {remainingSlots} more {remainingSlots === 1 ? 'item' : 'items'}. <Link to="/sign-in" className="underline hover:text-blue-600" onClick={() => dispatch(closeCart())}>Login</Link> for unlimited cart!</>
                  ) : (
                    <>⚠️ Cart limit reached! <Link to="/sign-in" className="underline hover:text-yellow-600" onClick={() => dispatch(closeCart())}>Login</Link> to add more items.</>
                  )}
                </p>
              </div>
            )}
            
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
                  onClick={() =>{
                   dispatch(closeCart());
                   navigate('/shop')
                  }}
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
                    <div key={item._id} className="flex items-center space-x-4 py-4 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                      {/* Product Image - Clickable */}
                      <div 
                        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                        onClick={() => handleViewProduct(item)}
                      >
                        <img
                          src={item?.product?.images?.[0] || item?.product?.image}
                          alt={item?.product?.title || item?.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details - Clickable */}
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleViewProduct(item)}
                      >
                        <h3 className="font-montserrat-semibold-600 text-black text-sm truncate hover:text-primary transition-colors duration-300">
                          {item?.product?.title}
                        </h3>
                        <PriceDisplay 
                          price={item.calculatedPrice}
                          variant="small"
                          className="text-primary font-montserrat-bold-700 text-sm"
                        />
                      
                        
                        {/* Show selected metal if available */}
                        {item.metal && (
                          <div className="text-xs text-black-light font-montserrat-regular-400 mt-1">
                            {item.metal.purityLevels?.[0]?.karat || item.purityLevel?.karat || ''}K 
                          </div>
                        )}
                        
                        {/* Show selected stone if available */}
                        {item.stoneType && (
                          <div className="text-xs text-black-light font-montserrat-regular-400 mt-1">
                            Stone: {item.stoneType.name}
                          </div>
                        )}
                        
                        {/* Show ring size if available */}
                        {item.ringSize && (
                          <div className="text-xs text-black-light font-montserrat-regular-400 mt-1">
                            Size: {item.ringSize}
                          </div>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(item._id, item.quantity - 1);
                            }}
                            className="w-6 h-6 bg-primary-light hover:bg-gray-300 rounded flex items-center justify-center transition-colors duration-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-montserrat-medium-500 text-black min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(item._id, item.quantity + 1);
                            }}
                            className="w-6 h-6 bg-primary-light hover:bg-gray-300 rounded flex items-center justify-center transition-colors duration-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center ">
                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewProduct(item)}
                          className="p-2 text-primary hover:text-primary-dark hover:bg-primary-light rounded-full transition-colors duration-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item._id);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-300"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                <span className="md:text-lg text-base font-montserrat-semibold-600 text-black">
                  Total ({totalQuantity} items)
                </span>
                <PriceDisplay 
                  price={totalPrice}
                  className="sm:text-xl text-base font-montserrat-bold-700 text-primary"
                />
              </div>

              {/* View Cart Button - Full Page */}
              <button
                onClick={() => {
                  dispatch(closeCart());
                  navigate('/view-cart');
                }}
                className="w-full bg-white text-primary border-2 border-primary font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2 mb-3"
              >
                <Eye className="w-5 h-5" />
                <span className="md:text-lg text-sm">View Cart</span>
              </button>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-white font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="md:text-lg text-sm">Proceed to Checkout</span>
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => dispatch(closeCart())}
                className="w-full mt-3 md:text-lg text-sm text-primary border border-primary font-montserrat-medium-500 py-2 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
        onConfirm={handleConfirmClearCart}
        loading={loading}
        title="Clear Cart"
        message="Are you sure you want to clear your cart? All items will be removed and this action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Cart;
