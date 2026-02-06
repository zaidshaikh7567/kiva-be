import React, { useState, useEffect, useMemo, useTransition, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../store/slices/productsSlice";
import { selectProducts, selectProductsLoading, selectProductsLoadingMore, selectProductsError, selectPagination } from "../store/slices/productsSlice";
import { selectCategories } from "../store/slices/categoriesSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import { SORT_OPTIONS } from "../constants";
import ProductFilterToolbar from "../components/ProductFilterToolbar";
import CategoryHero from "../components/CategoryHero";
import ringHeroBg from "../assets/images/ring-hero.png";
import NeedHelpSection from "../components/NeedHelpSection";
const Rings = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const productsLoadingMore = useSelector(selectProductsLoadingMore);
  const productsError = useSelector(selectProductsError);
  const pagination = useSelector(selectPagination);
  const categories = useSelector(selectCategories);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("price-low");
  const [viewMode, setViewMode] = useState("grid");
  const [isPending, startTransition] = useTransition();
  const isManualChange = useRef(false);

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 900, reset: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = pagination.currentPage + 1;
    dispatch(fetchProducts({ page: nextPage, limit: 9, reset: false }));
  };

  // Find ring category (main category without parent)
  const ringCategory = useMemo(() => {
    return categories?.find(cat => 
      !cat.parent && (cat.name?.toLowerCase() === "ring" || cat.name?.toLowerCase() === "rings")
    );
  }, [categories]);

  // Find subcategories where parent is ring category
  const subCategories = useMemo(() => {
    const allSubCategories = [];
    
    if (ringCategory && categories) {
      const subCats = categories.filter(cat => 
        cat.parent && (
          cat.parent._id === ringCategory._id || 
          cat.parent?.name?.toLowerCase() === "ring" ||
          cat.parent?.name?.toLowerCase() === "rings"
        )
      );
      
      subCats.forEach(cat => {
        allSubCategories.push({
          id: cat._id,
          name: cat.name,
          icon: "💍"
        });
      });
    }
    
    return allSubCategories;
  }, [categories, ringCategory]);

  // Initialize selected category from URL or default to first subcategory
  useEffect(() => {
    if (subCategories.length > 0 && !selectedCategory) {
      const categoryParam = searchParams.get('category');
      
      if (categoryParam) {
        // Try to find the category by name (case-insensitive)
        const foundCategory = subCategories.find(
          cat => cat.name.toLowerCase() === categoryParam.toLowerCase() || cat.id === categoryParam
        );
        
        if (foundCategory) {
          setSelectedCategory(foundCategory.id);
        } else {
          // If category param doesn't match, default to first
          setSelectedCategory(subCategories[0].id);
          // Update URL with the first category
          setSearchParams({ category: subCategories[0].name.toLowerCase() });
        }
      } else {
        // No category in URL, set default to first subcategory
        setSelectedCategory(subCategories[0].id);
        // Update URL with the first category
        setSearchParams({ category: subCategories[0].name.toLowerCase() });
      }
    }
  }, [subCategories, searchParams, setSearchParams, selectedCategory]);
  
  // Sync selected category when URL changes (e.g., browser back/forward)
  useEffect(() => {
    // Skip if this is a manual change
    if (isManualChange.current) {
      isManualChange.current = false;
      return;
    }
    
    if (subCategories.length > 0 && selectedCategory) {
      const categoryParam = searchParams.get('category');
      
      if (categoryParam) {
        const foundCategory = subCategories.find(
          cat => cat.name.toLowerCase() === categoryParam.toLowerCase() || cat.id === categoryParam
        );
        
        if (foundCategory && selectedCategory !== foundCategory.id) {
          startTransition(() => {
            setSelectedCategory(foundCategory.id);
          });
        }
      }
    }
  }, [searchParams, subCategories, selectedCategory]);
  
  // Handle category change and update URL
  const handleCategoryChange = (categoryId) => {
    const category = subCategories.find(cat => cat.id === categoryId);
    if (category && selectedCategory !== categoryId) {
      isManualChange.current = true;
      startTransition(() => {
        setSelectedCategory(categoryId);
        setSearchParams({ category: category.name.toLowerCase() });
      });
    }
  };

  // Filter rings based on ring category and subcategory
  const filteredRings = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // First filter by ring category and its subcategories
    let ringProducts = products.filter(product => {
      if (!ringCategory) return false;
      
      // Check if product belongs to ring category or any of its subcategories
      const productCategoryId = product.category?._id;
      const productCategoryName = product.category?.name?.toLowerCase();
      
      // Main ring category
      if (productCategoryId === ringCategory._id || 
          productCategoryName === "ring" || 
          productCategoryName === "rings") {
        return true;
      }
      
      // Check if product belongs to any ring subcategory
      const ringSubcategoryIds = subCategories.map(sub => sub.id);
      
      return ringSubcategoryIds.includes(productCategoryId);
    });
    
    // Exclude wedding bands from ring listings
    ringProducts = ringProducts.filter(product => product.isBand !== true);
    
    // Filter by selected subcategory
    if (selectedCategory) {
      ringProducts = ringProducts.filter(product => {
        return product.category?._id === selectedCategory;
      });
    }
    
    // Map products to match ProductCard expected format
    return ringProducts.map(product => ({
      ...product,
      id: product._id,
      name: product.title || product.name || '',
      image: Array.isArray(product.image) ? product.image[0] : product.image,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      featured: product.featured || false,
      originalPrice: product.originalPrice || null
    }));
  }, [products, ringCategory, selectedCategory, subCategories]);

  const sortedRings = useMemo(() => {
    const rings = filteredRings;
    switch (sortBy) {
      case "price-low":
        return [...rings].sort((a, b) => a.price - b.price);
        case "price-high":
          return [...rings].sort((a, b) => b.price - a.price);
          case "rating":
            return [...rings].sort((a, b) => b.rating - a.rating);
            case "featured":
              default:
                return [...rings].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
              }
            }, [filteredRings, sortBy]);
    
  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        eyebrow="JEWELRY COLLECTION"
        title="Ring Collection"
        highlightedWord="."
        body="Discover our exquisite collection of rings, from engagement rings to fashion statements"
        backgroundImage={ringHeroBg}
        backgroundOverlay="rgba(0,0,0,0.22)"
      />
      {/* <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="py-8 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
              JEWELRY COLLECTION
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
              Ring Collection<span className="text-primary">.</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
              Discover our exquisite collection of rings, from engagement rings to fashion statements
            </p>
            <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
          </div>
        </section>
      </AnimatedSection> */}

      {/* Category Tabs */}
      {/* <AnimatedSection animationType="fadeInLeft" delay={200}> */}
        <section className="py-4 md:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-sorts-mill-gloudy text-black mb-2 md:mb-4">
              Choose Your Style<span className="text-primary">.</span>
            </h2>
            <p className="text-sm md:text-lg font-montserrat-regular-400 text-black-light px-2 md:px-4">
              Browse our collection by diamond cut and style
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="relative mb-8 border-b border-primary-dark pb-[2px]">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex justify-center items-center space-x-8">
              {subCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`relative py-3 font-montserrat-medium-500 text-base transition-all duration-300 outline-none capitalize ${
                    selectedCategory === category.id
                      ? "text-primary rounded-lg bg-primary-light/10"
                      : "text-black-light hover:text-black"
                  }`}
                >
                  {category.name}
                  {selectedCategory === category.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tablet Navigation (2 rows) */}
            <div className="hidden md:flex lg:hidden flex-col space-y-4">
              <div className="flex justify-center items-center space-x-6">
                {subCategories.slice(0, 6).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`relative py-2 font-montserrat-medium-500 text-sm transition-all duration-300 outline-none capitalize ${
                      selectedCategory === category.id
                        ? "text-primary rounded-lg bg-primary-light/10"
                        : "text-black-light hover:text-black"
                    }`}
                  >
                    {category.name}
                    {selectedCategory === category.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-center items-center space-x-6">
                {subCategories.slice(6).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`relative px-3 py-2 font-montserrat-medium-500 text-sm transition-all duration-300 outline-none capitalize ${
                      selectedCategory === category.id
                        ? "text-primary rounded-lg bg-primary-light/10"
                        : "text-black-light hover:text-black"
                    }`}
                  >
                    {category.name}
                    {selectedCategory === category.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Navigation (Clean Layout) */}
            <div className="md:hidden">
              {/* First Row - 4 tabs */}
              <div className="flex justify-center items-center space-x-3 mb-3">
                {subCategories.slice(0, 6).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`relative py-2 font-montserrat-medium-500 text-xs transition-all duration-300 outline-none capitalize ${
                      selectedCategory === category.id
                        ? "text-primary rounded-lg bg-primary-light/10 "
                        : "text-black-light hover:text-black"
                    }`}
                  >
                    {category.name}
                    {selectedCategory === category.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Second Row - 3 tabs */}
              <div className="flex justify-center items-center space-x-3">
                {subCategories.slice(6).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`relative px-3 py-2 font-montserrat-medium-500 text-xs transition-all duration-300 outline-none capitalize ${
                      selectedCategory === category.id
                        ? "text-primary rounded-lg bg-primary-light/10"
                        : "text-black-light hover:text-black"
                    }`}
                  >
                    {category.name}
                    {selectedCategory === category.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Filter Section */}
    <ProductFilterToolbar
      totalCount={sortedRings.length}
      entityName="ring"
      sortOptions={SORT_OPTIONS.CATEGORY}
      sortValue={sortBy}
      onChangeSort={setSortBy}
      viewMode={viewMode}
      onChangeViewMode={setViewMode}
    />
      {/* </AnimatedSection> */}

      {/* Products Grid */}
      {/* <AnimatedSection animationType="scaleIn" delay={300}> */}
        <section className="py-2 md:py-8 bg-secondary">
        <div className="max-w-[1580px] mx-auto px-4 md:px-6">
          {productsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-black-light font-montserrat-regular-400">Loading rings...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">Error loading rings</h3>
              <p className="text-black-light font-montserrat-regular-400">
                {productsError}
              </p>
            </div>
          ) : sortedRings.length > 0 ? (
            <div 
              className={`grid gap-4 md:gap-6 transition-all duration-300 ${
                isPending ? 'opacity-60 pointer-events-none' : 'opacity-100 pointer-events-auto'
              } ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}
            >
              {sortedRings.map((ring) => (
                <ProductCard
                  key={ring._id || ring.id}
                  product={ring}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-black-light font-montserrat-regular-400">
                No rings found in this category.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {sortedRings.length > 0 && pagination.hasMore && (
            <div className="text-center mt-8 md:mt-12">
              <button
                onClick={handleLoadMore}
                disabled={productsLoadingMore}
                className="px-8 md:px-12 py-3 md:py-4 bg-primary text-white font-montserrat-medium-500 rounded-lg hover:bg-primary-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                {productsLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Load More</span>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
      {/* </AnimatedSection> */}

      {/* Call to Action */}
      <NeedHelpSection
        title="Can't Find What You're Looking For"
        description="Our jewelry experts can help you create a custom ring or find the perfect piece from our private collection"
        primaryCtaLabel="Custom Design"
        primaryCtaHref="/custom"
      />    
    </div>
  );
};

export default Rings;