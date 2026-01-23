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
import CategoryHero from "../components/CategoryHero";
import necklaceHeroBg from "../assets/images/summar.webp";
import NeedHelpSection from "../components/NeedHelpSection";
const Necklaces = () => {
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
    dispatch(fetchProducts({ page: 1, limit: 90, reset: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = pagination.currentPage + 1;
    dispatch(fetchProducts({ page: nextPage, limit: 9, reset: false }));
  };

  // Find necklace category (main category without parent)
  const necklaceCategory = useMemo(() => {
    return categories?.find(cat => 
      !cat.parent && (cat.name?.toLowerCase() === "necklace" || cat.name?.toLowerCase() === "necklaces")
    );
  }, [categories]);

  // Filter necklaces based on necklace category
  const filteredNecklaces = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Filter by necklace category
    let necklaceProducts = products.filter(product => {
      if (!necklaceCategory) return false;
      
      const productCategoryId = product.category?._id;
      const productCategoryName = product.category?.name?.toLowerCase();
      
      return productCategoryId === necklaceCategory._id || 
             productCategoryName === "necklace" || 
             productCategoryName === "necklaces";
    });

    // Map products to match ProductCard expected format
    return necklaceProducts.map(product => ({
      ...product,
      id: product._id,
      name: product.title || product.name || '',
      image: Array.isArray(product.image) ? product.image[0] : product.image,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      featured: product.featured || false,
      originalPrice: product.originalPrice || null
    }));
  }, [products, necklaceCategory]);

  const sortNecklaces = (necklaces) => {
    switch (sortBy) {
      case "price-low":
        return [...necklaces].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...necklaces].sort((a, b) => b.price - a.price);
      case "rating":
        return [...necklaces].sort((a, b) => b.rating - a.rating);
      case "featured":
      default:
        return [...necklaces].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  };

  const sortedNecklaces = sortNecklaces(filteredNecklaces);

  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        eyebrow="JEWELRY COLLECTION"
        title="Necklace Collection"
        highlightedWord="."
        body="Discover our stunning collection of necklaces, from delicate chains to statement pieces"
        backgroundImage={necklaceHeroBg}
        backgroundOverlay="rgba(0,0,0,0.22)"
      />     

      {/* Simple Filter Section */}
      <ProductFilterToolbar
        totalCount={sortedNecklaces.length}
        entityName="necklace"
        sortOptions={SORT_OPTIONS.CATEGORY}
        sortValue={sortBy}
        onChangeSort={setSortBy}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        dropdownProps={{ searchable: false }}
      />

      {/* Products Grid */}
      <section className="py-2 md:py-8 bg-secondary">
        <div className="max-w-[1580px] mx-auto px-4 md:px-6">
          {productsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-black-light font-montserrat-regular-400">Loading necklaces...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">Error loading necklaces</h3>
              <p className="text-black-light font-montserrat-regular-400">
                {productsError}
              </p>
            </div>
          ) : sortedNecklaces.length > 0 ? (
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {sortedNecklaces.map((necklace) => (
                <ProductCard
                  key={necklace._id || necklace.id}
                  product={necklace}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-black-light font-montserrat-regular-400">
                No necklaces found.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {sortedNecklaces.length > 0 && pagination.hasMore && (
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

      <NeedHelpSection
        description="Our jewelry experts can help you find the perfect necklace or create a custom design just for you."
        primaryCtaLabel="Custom Design"
        primaryCtaHref="/custom"
      />
    </div>
  );
};

export default Necklaces;
