import React from 'react';
import PriceDisplay from '../PriceDisplay';

const OrderSummary = ({ items, totalPrice, shippingCost, finalTotal }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
      <h3 className="text-xl font-sorts-mill-gloudy text-black mb-6">
        Order Summary<span className="text-primary">.</span>
      </h3>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 pb-4 border-b border-primary-light">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-montserrat-semibold-600 text-sm text-black truncate">
                {item.name}
              </h4>
              <p className="text-xs text-black-light font-montserrat-regular-400">
                Qty: {item.quantity}
              </p>
              <PriceDisplay 
                price={item.price * item.quantity}
                className="text-sm font-montserrat-bold-700 text-primary"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-montserrat-regular-400 text-black-light">
            Subtotal
          </span>
          <PriceDisplay 
            price={totalPrice}
            className="text-sm font-montserrat-semibold-600 text-black"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-montserrat-regular-400 text-black-light">
            Shipping {totalPrice > 500 && <span className="text-green-600">(Free)</span>}
          </span>
          <PriceDisplay 
            price={shippingCost}
            className="text-sm font-montserrat-semibold-600 text-black"
          />
        </div>
        <div className="border-t border-primary-light pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-montserrat-bold-700 text-black">
              Total
            </span>
            <PriceDisplay 
              price={finalTotal}
              className="text-xl font-montserrat-bold-700 text-primary"
            />
          </div>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {totalPrice < 500 && (
        <div className="bg-primary-light rounded-lg p-4">
          <p className="text-xs font-montserrat-medium-500 text-black-light text-center">
            Add <PriceDisplay price={500 - totalPrice} className="inline font-montserrat-bold-700 text-primary" /> more to get FREE shipping!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
