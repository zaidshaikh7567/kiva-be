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
import ProductFilterToolbar from "../components/ProductFilterToolbar";
import braceletHeroBg from "../assets/images/braclelate-banner.jpg";
import CategoryHero from "../components/CategoryHero";
import NeedHelpSection from "../components/NeedHelpSection";
const Bracelets = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const productsLoadingMore = useSelector(selectProductsLoadingMore);
  const productsError = useSelector(selectProductsError);
  const pagination = useSelector(selectPagination);
  const categories = useSelector(selectCategories);
  
  const [sortBy, setSortBy] = useState("price-low");
  const [viewMode, setViewMode] = useState("grid");

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
      <CategoryHero
        eyebrow="JEWELRY COLLECTION"
        title="Bracelet Collection"
        highlightedWord="."
        body="Discover our exquisite collection of bracelets, from delicate chains to statement cuffs"
        backgroundImage={braceletHeroBg}
        backgroundOverlay="rgba(0,0,0,0.22)"
      />

      {/* Simple Filter Section */}
      {/* <AnimatedSection animationType="fadeInLeft" delay={200}> */}
      <ProductFilterToolbar
        totalCount={sortedBracelets.length}
        entityName="bracelet"
        sortOptions={SORT_OPTIONS.CATEGORY}
        sortValue={sortBy}
        onChangeSort={setSortBy}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        dropdownProps={{ searchable: false }}
      />
      {/* </AnimatedSection> */}

      {/* Products Grid */}
      {/* <AnimatedSection animationType="scaleIn" delay={300}> */}
        <section className="py-2 md:py-8 bg-secondary">
        <div className="max-w-[1580px] mx-auto px-4 md:px-6">
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
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
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

      <NeedHelpSection
        description="Our jewelry experts can help you find the perfect bracelet or create a custom design just for you."
        primaryCtaLabel="Custom Design"
        primaryCtaHref="/custom"
      />
    </div>
  );
};

export default Bracelets;
