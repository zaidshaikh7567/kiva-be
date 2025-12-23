import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { SORT_OPTIONS } from '../constants';
import FormInput from '../components/FormInput';
import CategoryHero from "../components/CategoryHero";
import shopHeroBg from "../assets/images/summar.webp";
const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
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
  
  // Ref to track if category change is from user action (prevents flicker)
  const isUserActionRef = useRef(false);
  const timeoutRef = useRef(null);

  // Fetch products and categories on mount
  useEffect(() => {
    // Ensure loading state is set before fetching
    dispatch(fetchProducts({ page: 1, limit: 100, reset: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const parentCategories = useMemo(
    () => categories?.filter(category => !category.parent) || [],
    [categories]
  );

  const categoryHierarchy = useMemo(() => {
    const parentsByName = {};
    const childrenByParentId = {};

    parentCategories.forEach((parent) => {
      if (parent?.name && parent?._id) {
        parentsByName[parent.name.toLowerCase()] = parent._id;
      }
    });

    categories?.forEach((category) => {
      if (!category?.parent || !category?._id) return;

      const parentId = typeof category.parent === 'object'
        ? category.parent?._id
        : category.parent;

      if (!parentId) return;

      if (!childrenByParentId[parentId]) {
        childrenByParentId[parentId] = new Set();
      }

      childrenByParentId[parentId].add(category._id);
    });

    return { parentsByName, childrenByParentId };
  }, [categories, parentCategories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Safely extract description text for search
      const descriptionText = typeof product.description === 'string' 
      ? product.description.toLowerCase() 
      : '';

      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           descriptionText.includes(searchTerm.toLowerCase());

      let matchesCategory = selectedCategory === 'all';
      

      if (!matchesCategory) {
        const selectedCategoryLower = selectedCategory.toLowerCase();
        const productCategoryName = product.category?.name?.toLowerCase();
        const productParent = product.category?.parent;
        const productParentName = typeof productParent === 'object'
          ? productParent?.name?.toLowerCase()
          : null;

        const productCategoryId = product.category?._id;
        const productParentId = typeof productParent === 'object'
          ? productParent?._id
          : productParent;

        const selectedParentId = categoryHierarchy.parentsByName[selectedCategoryLower];

        if (productCategoryName === selectedCategoryLower || productParentName === selectedCategoryLower) {
          matchesCategory = true;
        } else if (selectedParentId) {
          const childSet = categoryHierarchy.childrenByParentId[selectedParentId];

          if (productCategoryId === selectedParentId) {
            matchesCategory = true;
          } else if (productParentId && productParentId === selectedParentId) {
            matchesCategory = true;
          } else if (childSet && productCategoryId && childSet.has(productCategoryId)) {
            matchesCategory = true;
          }
        }
      }

      // Calculate total price (base price + stone price if stone is selected)
      const basePrice = typeof product.price === "number" ? product.price : 0;
      const stonePrice = typeof product.stoneType?.price === "number" ? product.stoneType.price : 0;
      const totalPrice = basePrice + stonePrice;
      
      const matchesPrice = totalPrice >= priceRange[0] && totalPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const aBase = typeof a.price === "number" ? a.price : 0;
          const aStone = typeof a.stoneType?.price === "number" ? a.stoneType.price : 0;
          const aTotal = aBase + aStone;
          const bBase = typeof b.price === "number" ? b.price : 0;
          const bStone = typeof b.stoneType?.price === "number" ? b.stoneType.price : 0;
          const bTotal = bBase + bStone;
          return aTotal - bTotal;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const aBase = typeof a.price === "number" ? a.price : 0;
          const aStone = typeof a.stoneType?.price === "number" ? a.stoneType.price : 0;
          const aTotal = aBase + aStone;
          const bBase = typeof b.price === "number" ? b.price : 0;
          const bStone = typeof b.stoneType?.price === "number" ? b.stoneType.price : 0;
          const bTotal = bBase + bStone;
          return bTotal - aTotal;
        });
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
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, categoryHierarchy]);


  console.log('filteredProducts :', filteredProducts);
  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };

  const handleCategoryChange = (value) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Mark as user action to prevent useEffect from causing flicker
    isUserActionRef.current = true;
    
    // Update state first
    setSelectedCategory(value);

    // Update URL
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', value.toLowerCase());
    }
    setSearchParams(nextParams, { replace: true });
    
    // Reset the ref after React processes the updates
    // This prevents the useEffect from triggering and causing flicker
    timeoutRef.current = setTimeout(() => {
      isUserActionRef.current = false;
      timeoutRef.current = null;
    }, 50);
  };

  const clearFilters = () => {
    setSearchTerm('');
    handleCategoryChange('all');
    setPriceRange([priceLimits.min, priceLimits.max]);
    setSortBy('newest');
  };
  // Sync category from URL (only when URL changes externally, not from user action)
  useEffect(() => {
    // Skip if this is a user-initiated change to prevent flicker
    if (isUserActionRef.current) {
      return;
    }

    const categoryParam = searchParams.get('category');
    const normalizedParam = categoryParam ? categoryParam.toLowerCase() : 'all';

    // Determine what the category should be based on URL
    let targetCategory = 'all';
    if (normalizedParam !== 'all' && parentCategories.length > 0) {
      const matchedParent = parentCategories.find(
        (category) => category?.name?.toLowerCase() === normalizedParam
      );
      if (matchedParent) {
        targetCategory = matchedParent.name;
      }
    }

    // Use functional update to compare with current state without needing it in deps
    setSelectedCategory((currentCategory) => {
      // Only update if different to prevent unnecessary re-renders
      return currentCategory !== targetCategory ? targetCategory : currentCategory;
    });
  }, [searchParams, parentCategories]);


  // product load show loader
  const priceLimits = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 5000 };
    }
  
    // One total price per product
    const totalPrices = products
      .map(p => {
        const base = typeof p.price === "number" ? p.price : 0;
        const stone = typeof p.stoneType?.price === "number" ? p.stoneType.price : 0;
        return base + stone; // <-- combined total price
      })
      .filter(v => typeof v === "number" && !isNaN(v));
  
    if (totalPrices.length === 0) {
      return { min: 0, max: 5000 };
    }
    console.log('totalPrices :', totalPrices);
  
    return {
      min: Math.min(...totalPrices),
      max: Math.max(...totalPrices)
    };
  }, [products]);
  
  
  
useEffect(() => {
  if (products.length > 0) {
    setPriceRange([priceLimits.min, priceLimits.max]);
  }
}, [products, priceLimits.min, priceLimits.max]);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <CategoryHero
        eyebrow="JEWELRY COLLECTION"
        title="Shop"
        highlightedWord="."
        body="Discover our exquisite collection of handcrafted jewelry pieces, each one telling a unique story of elegance and beauty."
        backgroundImage={shopHeroBg}
        backgroundOverlay="rgba(0,0,0,0.22)"
      />
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
                <FormInput
                  label="Search Products"
                  name="searchTerm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  // error={errors.searchTerm}
                  icon={Search}
                  placeholder="Search jewelry..."
                />
                
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
                        onChange={(e) => handleCategoryChange(e.target.value)}
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
                          onChange={(e) => handleCategoryChange(e.target.value)}
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
  min={priceLimits.min}
  max={priceLimits.max}
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
                            onChange={(e) => handleCategoryChange(e.target.value)}
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
                              onChange={(e) => handleCategoryChange(e.target.value)}
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
                      min={priceLimits.min}
                      max={priceLimits.max}
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
                  options={SORT_OPTIONS.SHOP}
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
                    key={product?._id}
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
