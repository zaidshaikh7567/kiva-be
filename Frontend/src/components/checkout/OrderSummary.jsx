import React from 'react';
import { Package } from 'lucide-react';
import PriceDisplay from '../PriceDisplay';

const OrderSummary = ({ items, totalPrice, shippingCost, finalTotal }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 sticky top-8">
      <h3 className="text-xl font-sorts-mill-gloudy text-black mb-6">
        Order Summary<span className="text-primary">.</span>
      </h3>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item) => {
            // Extract product data (handle both nested and flat structures)
            const product = item.product || item;
            const productName = product.title || product.name || 'Product';
            const productImage = product.images?.[0] || item.image || item.productImage;
            
            // Extract metal and stone info
            const metal = item.metal || {};
            const metalName = metal.name || '';
            const purityLevel = item.purityLevel || {};
            const karat = purityLevel.karat || '';
            
            const stoneType = item.stoneType || {};
            const stoneName = stoneType.name || '';
            
            const ringSize = item.ringSize || '';
            const quantity = item.quantity || 1;
            
            // Use calculatedPrice if available, otherwise calculate
            const itemPrice = item.calculatedPrice || 
              (product.price ? 
                ((product.price * (purityLevel.priceMultiplier || 1)) + (stoneType.price || 0)) * quantity 
                : 0);
            
            return (
              <div key={item._id || item.id} className="flex items-center space-x-3 pb-4 border-b border-primary-light">
                {productImage ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-montserrat-semibold-600 text-sm text-black truncate capitalize">
                    {productName}
                  </h4>
                  <div className="text-xs text-black-light font-montserrat-regular-400 space-y-0.5 mt-1">
                    <p>Qty: {quantity}</p>
                    {metalName && karat && (
                      <p className='capitalize'>{metalName} ({karat}K)</p>
                    )}
                    {stoneName && (
                      <p>Stone: {stoneName}</p>
                    )}
                    {ringSize && (
                      <p>Size: {ringSize}</p>
                    )}
                  </div>
                  <PriceDisplay 
                    price={itemPrice}
                    className="text-sm font-montserrat-bold-700 text-primary mt-1" 
                    variant="small"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-black-light font-montserrat-regular-400 text-center py-4">
            No items in cart
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-montserrat-regular-400 text-black-light">
            Subtotal
          </span>
          <PriceDisplay 
            price={totalPrice}
            variant="small"
            className=" font-montserrat-semibold-600 text-primary text-lg"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-montserrat-regular-400 text-black-light">
            Shipping {totalPrice > 500 && <span className="text-green-600">(Free)</span>}
          </span>
          <PriceDisplay 
            price={shippingCost}
            variant="small"
            className=" font-montserrat-semibold-600 text-primary text-lg"
          />
        </div>
        <div className="border-t border-primary-light pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-montserrat-bold-700 text-primary">
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
        <div className="bg-primary-light rounded-lg p-4 ">
          <span className="text-xs font-montserrat-medium-500 text-black-light text-center flex ">
            Add <PriceDisplay price={500 - totalPrice} variant="small" className="inline font-montserrat-bold-700 text-black mx-2" /> more to get FREE shipping!
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
