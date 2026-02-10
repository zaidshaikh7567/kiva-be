import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, List, Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import CustomDropdown from "../components/CustomDropdown";
import ProductFilterToolbar from "../components/ProductFilterToolbar";
import { fetchProducts } from "../store/slices/productsSlice";
import { selectProducts, selectProductsLoading, selectProductsLoadingMore, selectProductsError, selectPagination } from "../store/slices/productsSlice";
import AnimatedSection from "../components/home/AnimatedSection";
import { SORT_OPTIONS } from "../constants";
import { Link } from "react-router-dom";
import CategoryHero from "../components/CategoryHero";
import NeedHelpSection from "../components/NeedHelpSection";
import { selectMedia } from "../store/slices/mediaSlice";
const WeddingBand = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const productsLoadingMore = useSelector(selectProductsLoadingMore);
  const productsError = useSelector(selectProductsError);
  const pagination = useSelector(selectPagination);
  const media = useSelector(selectMedia) || [];
  const [sortBy, setSortBy] = useState("price-low");
  const [viewMode, setViewMode] = useState("grid");

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 900, reset: true }));
  }, [dispatch]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = pagination.currentPage + 1;
    dispatch(fetchProducts({ page: nextPage, limit: 9, reset: false }));
  };

  // Filter wedding bands based on isBand === true
  const filteredWeddingBands = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Filter by isBand === true
    const bandProducts = products.filter(product => {
      return product.isBand === true;
    });

    // Map products to match ProductCard expected format
    return bandProducts.map(product => ({
      ...product,
      id: product._id,
      name: product.title || product.name || '',
      image: Array.isArray(product.images) ? product.images[0] : (Array.isArray(product.image) ? product.image[0] : product.image),
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      featured: product.featured || false,
      originalPrice: product.originalPrice || null
    }));
  }, [products]);

  const sortedWeddingBands = useMemo(() => {
    const bands = filteredWeddingBands;
    switch (sortBy) {
      case "price-low":
        return [...bands].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...bands].sort((a, b) => b.price - a.price);
      case "rating":
        return [...bands].sort((a, b) => b.rating - a.rating);
      case "featured":
      default:
        return [...bands].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredWeddingBands, sortBy]);

  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        eyebrow="JEWELRY COLLECTION"
        title="Wedding Band Collection"
        highlightedWord="."
        body="Discover our exquisite collection of wedding bands, symbolizing eternal love and commitment"
        backgroundImage={media.find(item => item.page === 'ring' && item.section === 'wedding-banner' && item.type === 'image')?.url}
        backgroundOverlay="rgba(0,0,0,0.22)"
      />
      {/* <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="py-8 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
              WEDDING COLLECTION
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
              Wedding Bands<span className="text-primary">.</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
              Discover our exquisite collection of wedding bands, symbolizing eternal love and commitment
            </p>
            <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
          </div>
        </section>
      </AnimatedSection> */}

      {/* Filter Section */}
      <ProductFilterToolbar
        totalCount={sortedWeddingBands?.length || 0}
        entityName="wedding band"
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
              <p className="text-black-light font-montserrat-regular-400">Loading wedding bands...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">Error loading wedding bands</h3>
              <p className="text-black-light font-montserrat-regular-400">
                {productsError}
              </p>
            </div>
          ) : sortedWeddingBands.length > 0 ? (
            <div 
              className={`grid gap-4 md:gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}
            >
              {sortedWeddingBands.map((band) => (
                <ProductCard
                  key={band._id || band.id}
                  product={band}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-black-light font-montserrat-regular-400 text-lg">
                No wedding bands found at the moment.
              </p>
              <p className="text-black-light font-montserrat-regular-400 mt-2">
                Check back soon for our latest collection!
              </p>
            </div>
          )}

          {/* Load More Button */}
          {sortedWeddingBands.length > 0 && pagination.hasMore && (
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

      {/* Call to Action */}
      <NeedHelpSection
        title="Looking for a Custom Wedding Band"
        description="Our jewelry experts can help you create a custom wedding band that perfectly matches your engagement ring or stands alone as a symbol of your commitment"
        primaryCtaLabel="Custom Design"
        primaryCtaHref="/custom"
      />
    
    </div>
  );
};

export default WeddingBand;

