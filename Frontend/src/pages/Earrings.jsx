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
import NeedHelpSection from "../components/NeedHelpSection";
import { selectMedia } from "../store/slices/mediaSlice";
const Earrings = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const productsLoadingMore = useSelector(selectProductsLoadingMore);
  const productsError = useSelector(selectProductsError);
  const pagination = useSelector(selectPagination);
  const categories = useSelector(selectCategories);
  const media = useSelector(selectMedia) || [];
  const [sortBy, setSortBy] = useState("price-low");
  const [viewMode, setViewMode] = useState("grid");

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 1000, reset: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = pagination.currentPage + 1;
    dispatch(fetchProducts({ page: nextPage, limit: 100, reset: false }));
  };

  // Find earring category (main category without parent)
  const earringCategory = useMemo(() => {
    return categories?.find(cat => 
      !cat.parent && (cat.name?.toLowerCase() === "earring" || cat.name?.toLowerCase() === "earrings")
    );
  }, [categories]);

  // Filter earrings based on earring category
  const filteredEarrings = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Filter by earring category
    let earringProducts = products.filter(product => {
      if (!earringCategory) return false;
      
      const productCategoryId = product.category?._id;
      const productCategoryName = product.category?.name?.toLowerCase();
      
      return productCategoryId === earringCategory._id || 
             productCategoryName === "earring" || 
             productCategoryName === "earrings";
    });

    // Map products to match ProductCard expected format
    return earringProducts.map(product => ({
      ...product,
      id: product._id,
      name: product.title || product.name || '',
      image: Array.isArray(product.image) ? product.image[0] : product.image,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      featured: product.featured || false,
      originalPrice: product.originalPrice || null
    }));
  }, [products, earringCategory]);

  const sortEarrings = (earrings) => {
    switch (sortBy) {
      case "price-low":
        return [...earrings].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...earrings].sort((a, b) => b.price - a.price);
      case "rating":
        return [...earrings].sort((a, b) => b.rating - a.rating);
      case "featured":
      default:
        return [...earrings].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  };

  const sortedEarrings = sortEarrings(filteredEarrings);

  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <CategoryHero
        eyebrow="JEWELRY COLLECTION"
        title="Earring Collection"
        highlightedWord="."
        body="Discover our stunning collection of earrings, from delicate studs to statement pieces"
        backgroundImage={media.find(item => item.page === 'earring' && item.section === 'earrings-banner' && item.type === 'image')?.url}
        backgroundOverlay="rgba(0,0,0,0.22)"
      />

      {/* Simple Filter Section */}
      {/* <AnimatedSection animationType="fadeInLeft" delay={200}> */}
      <ProductFilterToolbar
        totalCount={sortedEarrings.length}
        entityName="earring"
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
                <p className="text-black-light font-montserrat-regular-400">Loading earrings...</p>
              </div>
            ) : productsError ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">Error loading earrings</h3>
                <p className="text-black-light font-montserrat-regular-400">
                  {productsError}
                </p>
              </div>
            ) : sortedEarrings.length > 0 ? (
              <div className={`grid gap-4 md:gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {sortedEarrings.map((earring) => (
                  <ProductCard
                    key={earring._id || earring.id}
                    product={earring}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-black-light font-montserrat-regular-400">
                  No earrings found.
                </p>
              </div>
            )}

            {/* Load More Button */}
            {sortedEarrings.length > 0 && pagination.hasMore && (
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
        description="Our jewelry experts can help you find the perfect earrings or create a custom design just for you."
        primaryCtaLabel="Custom Design"
        primaryCtaHref="/custom"
      />
    </div>
  );
};

export default Earrings;
