import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import ShopProductCard from '../components/ShopProductCard';
import CustomDropdown from '../components/CustomDropdown';
import { mockProducts, mockCategories } from '../data/mockProducts';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category.name === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
 
      <section className="py-8 md:py-16 lg:py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
          SHOP
          </p>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
          Our Jewelry Collection <span className="text-primary">.</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
          Discover our exquisite collection of handcrafted jewelry pieces, each one telling a unique story of elegance and beauty.
          </p>
          <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
        </div>
      </section>
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-montserrat-semibold-600 text-black">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-dark font-montserrat-medium-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-montserrat-medium-500 text-black-light mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-light w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search jewelry..."
                    className="w-full pl-10 pr-4 py-3 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black placeholder-black-light"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-montserrat-medium-500 text-black-light mb-2">
                  Category
                </label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-3 text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-sm font-montserrat-regular-400 text-black-light">All Products</span>
                  </label>
                  {mockCategories.map((category) => (
                    <label key={category._id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.name}
                        checked={selectedCategory === category.name}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-3 text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-sm font-montserrat-regular-400 text-black-light">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-montserrat-medium-500 text-black-light mb-2">
                  Price Range: <span className="text-primary-dark font-montserrat-semibold-600">${priceRange[0]}</span> - <span className="text-primary-dark font-montserrat-semibold-600">${priceRange[1]}</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                    className="w-full accent-primary"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-primary-light rounded-lg shadow-sm hover:shadow-md transition-shadow font-montserrat-medium-500 text-black"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
                <div className="absolute top-0 left-0 w-80 h-full bg-white shadow-lg p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-montserrat-semibold-600 text-black">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-primary-light rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-black-light" />
                    </button>
                  </div>

                  {/* Mobile Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-montserrat-medium-500 text-black-light mb-2">
                      Search Products
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-light w-4 h-4" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search jewelry..."
                        className="w-full pl-10 pr-4 py-3 border border-primary-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black placeholder-black-light"
                      />
                    </div>
                  </div>

                  {/* Mobile Category Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-montserrat-medium-500 text-black-light mb-2">
                      Category
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value="all"
                          checked={selectedCategory === 'all'}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-3 text-primary focus:ring-primary accent-primary"
                        />
                        <span className="text-sm font-montserrat-regular-400 text-black-light">All Products</span>
                      </label>
                      {mockCategories.map((category) => (
                        <label key={category._id} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={category.name}
                            checked={selectedCategory === category.name}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mr-3 text-primary focus:ring-primary accent-primary"
                          />
                          <span className="text-sm font-montserrat-regular-400 text-black-light">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-montserrat-medium-500 text-black-light mb-2">
                      Price Range: <span className="text-primary-dark font-montserrat-semibold-600">${priceRange[0]}</span> - <span className="text-primary-dark font-montserrat-semibold-600">${priceRange[1]}</span>
                    </label>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                        className="w-full accent-primary"
                      />
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="w-full py-3 px-4 bg-primary-light text-black rounded-lg hover:bg-primary transition-colors font-montserrat-medium-500"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-black-light font-montserrat-regular-400">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <CustomDropdown
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort by"
                  className="min-w-[200px]"
                    searchable={false}
                />

                {/* View Mode Toggle */}
                <div className="flex border border-primary-light rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-black-light hover:bg-primary-light'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-black-light hover:bg-primary-light'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-6'
              }>
                {filteredProducts.map((product) => (
                  <ShopProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                    showQuickActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-primary-light mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">No products found</h3>
                <p className="text-black-light font-montserrat-regular-400 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors font-montserrat-medium-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
