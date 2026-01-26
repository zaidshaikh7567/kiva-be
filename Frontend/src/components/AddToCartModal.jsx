import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectStones, selectStonesLoading } from '../store/slices/stonesSlice';
import PriceDisplay from './PriceDisplay';
import MetalSelector from './MetalSelector';
import CenterStoneSelector from './CenterStoneSelector';
import RingSizeSelector from './RingSizeSelector';

const AddToCartModal = ({
  isOpen,
  product,
  selectedMetal,
  selectedRingSize,
  selectedCarat,
  onClose,
  onConfirm,
  onMetalChange,
  onRingSizeChange,
  onCaratChange,
  getFinalPrice,
  isRing
}) => {
  const stones = useSelector(selectStones);
  const stonesLoading = useSelector(selectStonesLoading);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-montserrat-semibold-600 text-black">
            Add to Cart
          </h3>
          <button
            onClick={handleClose}
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
                alt={product.title || product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div>
              <h4 className="font-montserrat-semibold-600 text-black mb-1 capitalize">
                {product.title || product.name}
              </h4>
              <PriceDisplay 
                price={getFinalPrice ? getFinalPrice() : product.price}
                variant="small"
                className="text-primary font-montserrat-bold-700 text-md"
              />
              {/* Selected Center Stone Info */}
              {selectedMetal && (
                <div className="text-sm text-black-light font-montserrat-regular-400 mt-1 capitalize">
                  {selectedMetal?.carat} {selectedMetal?.color}
                </div>
              )}
              {selectedCarat && (
                <div className="text-sm text-black-light font-montserrat-regular-400 mt-1">
                  {selectedCarat?.name || selectedCarat}
                </div>
              )}
              {selectedRingSize && (
                <div className="text-sm text-black-light font-montserrat-regular-400 mt-1">
                  {selectedRingSize}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metal Selection */}
        <div className="mb-6">
          {/* <label className="block text-sm font-montserrat-medium-500 text-black mb-3">
            Select Metal <span className="text-red-500">*</span>
          </label> */}
          <MetalSelector
            product={product}
            cartItem={null}
            selectedMetal={selectedMetal}
            onMetalChange={onMetalChange}
          />
        </div>

        {/* Center Stone Selection (if ring) */}
        {/* {isRing && ( */}
          <CenterStoneSelector
            className="mb-6"
            stones={stones}
            loading={stonesLoading}
            selectedStone={selectedCarat}
            onSelect={onCaratChange}
            required
            isRing={isRing}
            product={product}
          />
        {/* )} */}

        {/* Ring Size Selection (if ring) */}
        {isRing && (
          <RingSizeSelector
            className="mb-6"
            value={selectedRingSize}
            onChange={onRingSizeChange}
            required
          />
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 border border-gray-300 text-gray-700 font-montserrat-medium-500 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-primary text-white font-montserrat-medium-500 py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddToCartModal;

