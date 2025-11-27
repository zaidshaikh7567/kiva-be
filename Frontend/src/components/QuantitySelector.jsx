import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({
  value = 1,
  min = 1,
  max,
  label = 'Quantity',
  onChange,
  onIncrement,
  onDecrement,
  disabled = false,
  className = '',
  labelClassName = 'block text-sm font-montserrat-medium-500 text-black mb-2',
  buttonClassName = 'w-10 h-10 bg-primary-light hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300',
  valueClassName = 'w-16 text-center font-montserrat-medium-500 text-black',
}) => {
  const numericValue = Number.isFinite(value) ? value : min;
  const canDecrease = numericValue > min;
  const canIncrease =
    typeof max === 'number' ? numericValue < max : true;

  const handleDecrement = () => {
    if (disabled) return;
    if (onDecrement) {
      onDecrement();
      return;
    }
    if (!onChange || !canDecrease) return;
    onChange(Math.max(numericValue - 1, min));
  };

  const handleIncrement = () => {
    if (disabled) return;
    if (onIncrement) {
      onIncrement();
      return;
    }
    if (!onChange || !canIncrease) return;
    onChange(
      typeof max === 'number'
        ? Math.min(numericValue + 1, max)
        : numericValue + 1
    );
  };

  return (
    <div className={className}>
      {label && <label className={labelClassName}>{label}</label>}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (!canDecrease && !onDecrement)}
          className={`${buttonClassName} ${
            disabled || (!canDecrease && !onDecrement)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className={valueClassName}>{numericValue}</span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (!canIncrease && !onIncrement)}
          className={`${buttonClassName} ${
            disabled || (!canIncrease && !onIncrement)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;


