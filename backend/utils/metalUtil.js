/**
 * Helper function to calculate cumulative price multiplier for a given karat
 * This implements cumulative percentage increases: 10K (base) -> 14K (+15%) -> 18K (+20% on 14K price)
 * 
 * @param {Object} metal - Metal object with purityLevels array
 * @param {Number} targetKarat - The target karat value to calculate multiplier for
 * @returns {Number} Cumulative price multiplier
 * 
 * @example
 * // If metal has purityLevels: [{karat: 10, priceMultiplier: 1.0}, {karat: 14, priceMultiplier: 1.15}, {karat: 18, priceMultiplier: 1.20}]
 * // calculateCumulativePriceMultiplier(metal, 10) returns 1.0
 * // calculateCumulativePriceMultiplier(metal, 14) returns 1.15 (1.0 * 1.15)
 * // calculateCumulativePriceMultiplier(metal, 18) returns 1.38 (1.0 * 1.15 * 1.20)
 */
const calculateCumulativePriceMultiplier = (metal, targetKarat) => {
  if (!metal || !metal.purityLevels || metal.purityLevels.length === 0) return 1.0;
  
  // Sort purity levels by karat (ascending)
  const sortedLevels = [...metal.purityLevels]
    .filter(level => level.active !== false)
    .sort((a, b) => a.karat - b.karat);
  
  if (sortedLevels.length === 0) return 1.0;
  
  // Find the target karat level
  const targetLevel = sortedLevels.find(level => level.karat === targetKarat);
  if (!targetLevel) return 1.0;
  
  // Find index of target level
  const targetIndex = sortedLevels.findIndex(level => level.karat === targetKarat);
  
  // Calculate cumulative multiplier
  // First level (lowest karat) = base (1.0)
  // Each subsequent level = previous multiplier * (1 + percentage increase)
  let cumulativeMultiplier = 1.0;
  
  for (let i = 0; i <= targetIndex; i++) {
    const level = sortedLevels[i];
    if (i === 0) {
      // First level is base
      cumulativeMultiplier = 1.0;
    } else {
      // Each level applies its percentage increase to the previous level's price
      // priceMultiplier is stored as the multiplier (e.g., 1.15 for 15% increase)
      // For cumulative: newMultiplier = previousMultiplier * priceMultiplier
      const previousMultiplier = cumulativeMultiplier;
      const increaseMultiplier = level.priceMultiplier || 1.0;
      cumulativeMultiplier = previousMultiplier * increaseMultiplier;
    }
  }
  
  return cumulativeMultiplier;
};

module.exports = {
  calculateCumulativePriceMultiplier
};

