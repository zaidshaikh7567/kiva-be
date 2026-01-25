import React from 'react';
import { Gem } from 'lucide-react';
import PriceDisplay from './PriceDisplay';

const CenterStoneSelector = ({
  stones = [],
  loading = false,
  selectedStone,
  onSelect,
  label ="",
  required = false,
  showPrice = false,
  className = '',
  hideIfEmpty = true,
  isRing
  
}) => {
  if (!onSelect) return null;

  const activeStones = Array.isArray(stones)
    ? stones.filter((stone) => stone && stone.active !== false)
    : [];

  if (hideIfEmpty && activeStones.length === 0) {
    return null;
  }

  const isSelected = (stone) => {
    if (!selectedStone) return false;

    if (typeof selectedStone === 'string') {
      return selectedStone.toLowerCase() === stone.name?.toLowerCase();
    }

    const selectedId = selectedStone.id || selectedStone._id || selectedStone.stoneId;
    const stoneId = stone._id || stone.id || stone.stoneId;

    if (selectedId && stoneId) {
      return selectedId === stoneId;
    }

    return selectedStone.name?.toLowerCase() === stone.name?.toLowerCase();
  };

  const handleSelect = (stone) => {
    onSelect({
      name: stone.name,
      id: stone._id || stone.id,
      price: stone.price,
      stone
    });
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3 flex items-center gap-2">
        <Gem className="w-5 h-5 text-primary" />
      {isRing?'Center Stone':"Total Carat Weight"}
        {required && <span className="text-red-500">*</span>}
      </h3>

      <div className="mb-4">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-black-light mt-2">
              Loading stones...
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeStones.map((stone) => (
              <button
                key={stone._id || stone.id || stone.name}
                type="button"
                onClick={() => handleSelect(stone)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-montserrat-medium-500 ${
                  isSelected(stone)
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-black hover:border-primary hover:bg-primary-light'
                }`}
              >
                <span>{stone.name}{isRing ?"":"W"}</span>
                {showPrice && stone.price > 0 && (
                  <span className="ml-2 text-xs">
                    <PriceDisplay price={stone.price} variant="small" />
                  </span>
                )}
              </button>
            ))}
            {!activeStones.length && (
              <p className="text-sm text-black-light font-montserrat-regular-400">
                No stones available
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterStoneSelector;

