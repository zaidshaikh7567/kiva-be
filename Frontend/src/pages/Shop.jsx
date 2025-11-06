import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import ShopProductCard from '../components/ShopProductCard';
import CustomDropdown from '../components/CustomDropdown';
import DualRangeSlider from '../components/DualRangeSlider';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts, selectProductsLoading, selectProductsError } from '../store/slices/productsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { selectCategories } from '../store/slices/categoriesSlice';
import AnimatedSection from '../components/home/AnimatedSection';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);
  const categories = useSelector(selectCategories);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products and categories on mount
  useEffect(() => {
    // Ensure loading state is set before fetching
    dispatch(fetchProducts({ page: 1, limit: 100, reset: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Get parent categories only
  const parentCategories = categories?.filter(category => !category.parent) || [];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Safely extract description text for search
      const descriptionText = typeof product.description === 'string' 
        ? product.description.toLowerCase() 
        : '';

      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           descriptionText.includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             product.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
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
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setSortBy('newest');
  };

  // product load show loader

  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AnimatedSection animationType="fadeInUp" delay={100}>
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
      </AnimatedSection>
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm px-6 py-[10px] sticky top-8">
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
                    className="w-full pl-10 pr-4 py-2 border border-primary-light rounded-lg focus:ring-1 outline-none focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black placeholder-black-light"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-montserrat-medium-500 text-black-light mb-4">
                  Category
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group hover:bg-primary-light/5 rounded-lg pb-[4px] transition-colors duration-200">
                    <div className="relative">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === 'all'}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedCategory === 'all' 
                          ? 'border-primary bg-white' 
                          : 'border-gray-300 group-hover:border-primary'
                      }`}>
                        {selectedCategory === 'all' && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </div>
                    <span className={`ml-4 text-sm font-montserrat-regular-400 transition-colors duration-200 ${
                      selectedCategory === 'all' 
                        ? 'text-primary font-montserrat-medium-500' 
                        : 'text-black-light group-hover:text-black'
                    }`}>
                      All Products
                    </span>
                  </label>
                  {parentCategories.map((category) => (
                    <label key={category._id} className="flex items-center cursor-pointer group hover:bg-primary-light/5 rounded-lg pb-[4px] transition-colors duration-200">
                      <div className="relative">
                        <input
                          type="radio"
                          name="category"
                          value={category.name}
                          checked={selectedCategory === category.name}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedCategory === category.name 
                            ? 'border-primary bg-white' 
                            : 'border-gray-300 group-hover:border-primary'
                        }`}>
                          {selectedCategory === category.name && (
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      </div>
                      <span className={`ml-4 text-sm font-montserrat-regular-400 transition-colors duration-200 ${
                        selectedCategory === category.name 
                          ? 'text-primary font-montserrat-medium-500' 
                          : 'text-black-light group-hover:text-black'
                      }`}>
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-montserrat-medium-500 text-black-light mb-4">
                  Price Range
                </label>
                <DualRangeSlider
                  min={0}
                  max={5000}
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  step={50}
                />
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
                        className="w-full pl-10 pr-4 py-3 border border-primary-light rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary font-montserrat-regular-400 text-black placeholder-black-light"
                      />
                    </div>
                  </div>

                  {/* Mobile Category Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-montserrat-medium-500 text-black-light mb-4">
                      Category
                    </label>
                    <div className="space-y-4">
                      <label className="flex items-center cursor-pointer group hover:bg-primary-light/5 rounded-lg pb-[4px] transition-colors duration-200">
                        <div className="relative">
                          <input
                            type="radio"
                            name="category"
                            value="all"
                            checked={selectedCategory === 'all'}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            selectedCategory === 'all' 
                              ? 'border-primary bg-white' 
                              : 'border-gray-300 group-hover:border-primary'
                          }`}>
                            {selectedCategory === 'all' && (
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                        <span className={`ml-4 text-sm font-montserrat-regular-400 transition-colors duration-200 ${
                          selectedCategory === 'all' 
                            ? 'text-primary font-montserrat-medium-500' 
                            : 'text-black-light group-hover:text-black'
                        }`}>
                          All Products
                        </span>
                      </label>
                      {parentCategories.map((category) => (
                        <label key={category._id} className="flex items-center cursor-pointer group hover:bg-primary-light/5 rounded-lg pb-[4px] transition-colors duration-200">
                          <div className="relative">
                            <input
                              type="radio"
                              name="category"
                              value={category.name}
                              checked={selectedCategory === category.name}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              selectedCategory === category.name 
                                ? 'border-primary bg-white' 
                                : 'border-gray-300 group-hover:border-primary'
                            }`}>
                              {selectedCategory === category.name && (
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                          </div>
                          <span className={`ml-4 text-sm font-montserrat-regular-400 transition-colors duration-200 ${
                            selectedCategory === category.name 
                              ? 'text-primary font-montserrat-medium-500' 
                              : 'text-black-light group-hover:text-black'
                          }`}>
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-montserrat-medium-500 text-black-light mb-4">
                      Price Range
                    </label>
                    <DualRangeSlider
                      min={0}
                      max={5000}
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      step={50}
                    />
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
            {productsLoading || (products.length === 0 && !productsError) ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin mb-6"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">Loading Products</h3>
                <p className="text-black-light font-montserrat-regular-400">Please wait while we fetch our collection...</p>
              </div>
            ) : productsError ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">Error loading products</h3>
                <p className="text-black-light font-montserrat-regular-400 mb-4">
                  {productsError}
                </p>
                <button
                  onClick={() => dispatch(fetchProducts())}
                  className="px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors font-montserrat-medium-500"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                  : 'space-y-4 sm:space-y-6'
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
