import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, List } from "lucide-react";
import ProductCard from "../components/ProductCard";
import CustomDropdown from "../components/CustomDropdown";
import { fetchProducts } from "../store/slices/productsSlice";
import { selectProducts, selectProductsLoading, selectProductsLoadingMore, selectProductsError, selectPagination } from "../store/slices/productsSlice";
import { selectCategories } from "../store/slices/categoriesSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import AnimatedSection from "../components/home/AnimatedSection";
import { SORT_OPTIONS } from "../constants";
import { Link } from "react-router-dom";
const Bracelets = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const productsLoadingMore = useSelector(selectProductsLoadingMore);
  const productsError = useSelector(selectProductsError);
  const pagination = useSelector(selectPagination);
  const categories = useSelector(selectCategories);
  
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 90, reset: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = pagination.currentPage + 1;
    dispatch(fetchProducts({ page: nextPage, limit: 9, reset: false }));
  };

  // Find bracelet category (main category without parent)
  const braceletCategory = useMemo(() => {
    return categories?.find(cat => 
      !cat.parent && (cat.name?.toLowerCase() === "bracelet" || cat.name?.toLowerCase() === "bracelets")
    );
  }, [categories]);

  // Filter bracelets based on bracelet category
  const filteredBracelets = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Filter by bracelet category
    let braceletProducts = products.filter(product => {
      if (!braceletCategory) return false;
      
      const productCategoryId = product.category?._id;
      const productCategoryName = product.category?.name?.toLowerCase();
      
      return productCategoryId === braceletCategory._id || 
             productCategoryName === "bracelet" || 
             productCategoryName === "bracelets";
    });

    // Map products to match ProductCard expected format
    return braceletProducts.map(product => ({
      ...product,
      id: product._id,
      name: product.title || product.name || '',
      image: Array.isArray(product.image) ? product.image[0] : product.image,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      featured: product.featured || false,
      originalPrice: product.originalPrice || null
    }));
  }, [products, braceletCategory]);

  const sortBracelets = (bracelets) => {
    switch (sortBy) {
      case "price-low":
        return [...bracelets].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...bracelets].sort((a, b) => b.price - a.price);
      case "rating":
        return [...bracelets].sort((a, b) => b.rating - a.rating);
      case "featured":
      default:
        return [...bracelets].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  };

  const sortedBracelets = sortBracelets(filteredBracelets);

  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="py-8 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
              JEWELRY COLLECTION
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
              Bracelet Collection<span className="text-primary">.</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
              Discover our exquisite collection of bracelets, from delicate chains to statement cuffs
            </p>
            <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
          </div>
        </section>
      </AnimatedSection>

      {/* Simple Filter Section */}
      {/* <AnimatedSection animationType="fadeInLeft" delay={200}> */}
        <section className="py-4 md:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Filters and Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-montserrat-medium-500 text-black-light">
                {sortedBracelets.length} bracelets available
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <CustomDropdown
                options={SORT_OPTIONS.CATEGORY}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort by"
                className="min-w-[200px]"
                searchable={false}
              />

              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary  rounded-tl-lg rounded-bl-lg text-white" : "text-black-light hover:bg-gray-50 rounded-tl-lg rounded-bl-lg"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary rounded-tr-lg rounded-br-lg text-white" : "text-black-light hover:bg-gray-50 rounded-tr-lg rounded-br-lg"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* </AnimatedSection> */}

      {/* Products Grid */}
      {/* <AnimatedSection animationType="scaleIn" delay={300}> */}
        <section className="py-2 md:py-8 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {productsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-black-light font-montserrat-regular-400">Loading bracelets...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">Error loading bracelets</h3>
              <p className="text-black-light font-montserrat-regular-400">
                {productsError}
              </p>
            </div>
          ) : sortedBracelets.length > 0 ? (
            <div className={`grid gap-4 md:gap-8 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {sortedBracelets.map((bracelet) => (
                <ProductCard
                  key={bracelet._id || bracelet.id}
                  product={bracelet}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-black-light font-montserrat-regular-400">
                No bracelets found.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {sortedBracelets.length > 0 && pagination.hasMore && (
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
      {/* <AnimatedSection animationType="fadeInUp" delay={400}> */}
        <section className="py-16 md:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy mb-6 md:mb-8">
            Need Help Choosing<span className="text-primary">?</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl font-montserrat-regular-400 text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Our jewelry experts can help you find the perfect bracelet or create a custom design just for you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
          <Link to="/custom" className="px-6 md:px-10 py-3 md:py-4 bg-primary text-white font-montserrat-medium-500 hover:bg-primary-dark transition-colors duration-300 rounded-lg text-base md:text-lg">
              Custom Design
            </Link>
            {/* <button className="px-6 md:px-10 py-3 md:py-4 border-2 border-primary text-primary font-montserrat-medium-500 hover:bg-primary hover:text-white transition-colors duration-300 rounded-lg text-base md:text-lg">
              Book Consultation
            </button> */}
          </div>
        </div>
      </section>
      {/* </AnimatedSection> */}
    </div>
  );
};

export default Bracelets;
