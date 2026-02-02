import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Sparkles,
  Camera,
  Video,
  Image as ImageIcon,
  ArrowRight,
  Star,
  Zap,
  ChevronDown,
  Filter,
  Grid,
  List,
  ZoomIn
} from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BsInstagram } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveSocialHandles, selectActiveSocialHandles } from '../store/slices/socialHandlesSlice';
import { fetchActiveCollections, selectActiveCollections, selectCollectionsLoading } from '../store/slices/collectionsSlice';
import { fetchCategories, selectCategories } from '../store/slices/categoriesSlice';
import { fetchProducts, selectProducts, selectProductsLoading } from '../store/slices/productsSlice';
import { FaFacebook, FaInstagram,FaWhatsapp  } from "react-icons/fa";
// Platform icon mapping
const getPlatformIcon = (platform) => {
  const platformLower = platform?.toLowerCase() || '';
  switch (platformLower.toLowerCase()) {
    case 'instagram':
      return <FaInstagram className="w-5 h-5" />;
    case 'facebook':
      return < FaFacebook className="w-5 h-5" />;
    default:
    // case 'twitter':
    //   return <Twitter className="w-5 h-5" />;
    // case 'linkedin':
    //   return <Linkedin className="w-5 h-5" />;
    // case 'pinterest':
    //   return <Pinterest className="w-5 h-5" />;
    // default:
      return <Share2 className="w-5 h-5" />;
  }
};
const Discover = () => {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);
  const [muted, setMuted] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const dispatch = useDispatch();
  const socialHandles = useSelector(selectActiveSocialHandles);
  const collections = useSelector(selectActiveCollections);
  const collectionsLoading = useSelector(selectCollectionsLoading);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);

  useEffect(() => {
    // Fetch active social handles
    dispatch(fetchActiveSocialHandles({ page: 1, limit: 1000 }));
    // Fetch active collections
    dispatch(fetchActiveCollections({ page: 1, limit: 1000 }));
    // Fetch categories
    dispatch(fetchCategories());
    // Fetch products (needed for subcategory filtering)
    dispatch(fetchProducts({ page: 1, limit: 1000,  reset: true }));
  }, [dispatch]);

  // Use API collections data only
  const displayCollections = useMemo(() => collections || [], [collections]);
  
  // Get main categories only (parent categories)
  const mainCategories = useMemo(() => {
    return categories?.filter(cat => !cat.parent) || [];
  }, [categories]);

  // Find Rings category and its subcategories
  const ringsCategory = useMemo(() => {
    return mainCategories.find(cat => 
      cat.name?.toLowerCase() === 'ring' || cat.name?.toLowerCase() === 'rings'
    );
  }, [mainCategories]);

  const ringsSubcategories = useMemo(() => {
    if (!ringsCategory || !categories) return [];
    
    const subcategories = categories.filter(cat => {
      if (!cat.parent) return false;
      const parentId = typeof cat.parent === 'object' 
        ? cat.parent._id || cat.parent.id
        : cat.parent;
      const ringsId = ringsCategory._id || ringsCategory.id;
      return parentId === ringsId;
    });

    // Add virtual "Wedding Band" category
    const weddingBandOption = {
      _id: 'wedding-band',
      id: 'wedding-band',
      name: 'Wedding Band',
      isVirtual: true
    };

    return [weddingBandOption, ...subcategories];
  }, [categories, ringsCategory]);

  // Reset subcategory when category changes
  useEffect(() => {
    const isRingsSelected = selectedCategory.toLowerCase() === 'ring' || 
                           selectedCategory.toLowerCase() === 'rings';
    if (!isRingsSelected) {
      setSelectedSubcategory(null);
    }
    // Don't auto-select - let "All Rings" be the default
  }, [selectedCategory]);

  // Build category filter list
  const categoryFilters = useMemo(() => {
    const filters = [
      { id: 'all', name: 'All Collections', count: displayCollections.length }
    ];

    // Add main categories from API or fallback to hardcoded
    if (mainCategories.length > 0) {
      mainCategories.forEach(cat => {
        const categoryNameLower = cat.name?.toLowerCase() || '';
        const count = displayCollections.filter(c => 
          c.category?.toLowerCase() === categoryNameLower
        ).length;
        filters.push({
          id: categoryNameLower,
          name: cat.name,
          count
        });
      });
    } else {
      // Fallback to hardcoded categories if API categories not available
      filters.push(
        { id: 'necklaces', name: 'Necklaces', count: displayCollections.filter(c => c.category === 'necklaces').length },
        { id: 'rings', name: 'Rings', count: displayCollections.filter(c => c.category === 'rings').length },
        { id: 'earrings', name: 'Earrings', count: displayCollections.filter(c => c.category === 'earrings').length },
        { id: 'bracelets', name: 'Bracelets', count: displayCollections.filter(c => c.category === 'bracelets').length }
      );
    }

    return filters;
  }, [displayCollections, mainCategories]);

  // Filter collections (when no subcategory is selected)
  const filteredCollections = useMemo(() => {
    if (selectedCategory === 'all') {
      return displayCollections;
    }
    
    let filtered = displayCollections.filter(c => {
      const collectionCategory = c.category?.toLowerCase() || '';
      return collectionCategory === selectedCategory.toLowerCase();
    });
    
    return filtered;
  }, [displayCollections, selectedCategory]);
  // Filter products by subcategory (when subcategory is selected)
  const filteredProducts = useMemo(() => {
    if (!selectedSubcategory || selectedCategory === 'all') {
      return [];
    }

    const isRingsSelected = selectedCategory.toLowerCase() === 'ring' || 
                           selectedCategory.toLowerCase() === 'rings';
    
    if (!isRingsSelected || !ringsCategory) {
      return [];
    }

    return products.filter(product => {
      if (!product.images || product.images.length === 0) return false;

      const productCategoryId = product.category?._id || product.category?.id;
      const productParent = product.category?.parent;
      const productParentId = typeof productParent === 'object' 
        ? productParent?._id || productParent?.id
        : productParent;
      const productParentName = typeof productParent === 'object' 
        ? productParent?.name?.toLowerCase() 
        : null;
      const categoryName = product.category?.name || 'Uncategorized';
      const ringsId = ringsCategory._id || ringsCategory.id;

      // Check if product belongs to Rings category or its subcategories
      const belongsToRings = productCategoryId === ringsId || 
                            productParentId === ringsId ||
                            productParentName === 'ring' || 
                            productParentName === 'rings' ||
                            categoryName.toLowerCase() === 'ring' ||
                            categoryName.toLowerCase() === 'rings';

      if (!belongsToRings) return false;

      // Filter by selected subcategory
      if (selectedSubcategory === 'wedding-band') {
        return product.isBand === true;
      } else {
        return productCategoryId === selectedSubcategory;
      }
    });
  }, [products, selectedCategory, selectedSubcategory, ringsCategory]);

  // Determine if we should show products or collections
  const showProducts = selectedSubcategory !== null && 
                      (selectedCategory.toLowerCase() === 'ring' || selectedCategory.toLowerCase() === 'rings');
  // Auto-advance video slider (disabled for now - video autoplays)
  // useEffect(() => {
  //   if (isVideoPlaying) {
  //     const interval = setInterval(() => {
  //       setCurrentVideoIndex(prev => (prev + 1) % filteredCollections.length);
  //     }, 4000);
  //     return () => clearInterval(interval);
  //   }
  // }, [isVideoPlaying, filteredCollections.length]);

  // Keyboard navigation for fullscreen image slider (infinite)
  useEffect(() => {
    if (!fullscreenImage) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = fullscreenImage.index === 0 
          ? fullscreenImage.images.length - 1 
          : fullscreenImage.index - 1;
        setFullscreenImage({
          ...fullscreenImage,
          index: newIndex
        });
      } else if (e.key === 'ArrowRight') {
        const newIndex = fullscreenImage.index === fullscreenImage.images.length - 1
          ? 0
          : fullscreenImage.index + 1;
        setFullscreenImage({
          ...fullscreenImage,
          index: newIndex
        });
      } else if (e.key === 'Escape') {
        setFullscreenImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fullscreenImage]);

  const toggleVideo = (id) => {
    setActiveVideo(activeVideo === id ? null : id);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const nextVideo = () => {
    setCurrentVideoIndex(prev => (prev + 1) % filteredCollections.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex(prev => (prev - 1 + filteredCollections.length) % filteredCollections.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.8s ease-out;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Elegant Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-24 h-24 sm:w-40 sm:h-40 bg-primary-light/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 bg-primary-dark/5 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10  mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Elegant Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary px-4 py-2 sm:px-6 sm:py-3 rounded-full mb-6 sm:mb-8 animate-fadeIn border border-primary/20 shadow-lg">
              <Camera className="w-4 h-4" />
              <span className="font-montserrat-medium-500 text-xs sm:text-sm">Visual Collections</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy font-thin mb-4 sm:mb-6 text-gray-900 animate-fadeIn">
              Discover Our
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                Collections
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 font-montserrat-regular-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeIn">
              Explore our curated jewelry collections through an immersive visual experience
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fadeIn">
              {/* <button className="group w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-primary text-white font-montserrat-medium-500 rounded-xl hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Watch Collections</span>
              </button> */}
              
              <button 
                onClick={() => navigate('/gallery')}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 border-2  border-gray-300 text-gray-700 font-montserrat-medium-500 rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Browse Gallery</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Slider Section - Only show when not filtering by subcategory */}
      {/* {!showProducts && displayCollections.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className=" mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-sorts-mill-gloudy font-thin text-gray-900 mb-2 sm:mb-4">
                Collection Videos
              </h2>
              <p className="text-gray-600 font-montserrat-regular-400">
                Watch our collections come to life
              </p>
            </div>
{
  filteredCollections[currentVideoIndex]?.video && 

            <div className="relative max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-black shadow-2xl">
                <div className="aspect-video">
                  <video
                    className="w-full h-full object-cover"
                    src={filteredCollections[currentVideoIndex]?.video || ''}
                    muted
                    loop
                    autoPlay
                  />
                 
                </div>


                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h3 className="text-white text-lg sm:text-xl font-sorts-mill-gloudy font-medium mb-1">
                      {filteredCollections[currentVideoIndex]?.title || 'Collection'}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm font-montserrat-regular-400">
                      {filteredCollections[currentVideoIndex]?.category || ''}
                    </p>
                  </div>
                </div>


                <button
                  onClick={prevVideo}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextVideo}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>


              <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                {filteredCollections.map((collection, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentVideoIndex ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>}
          </div>
        </section>
      )} */}

      {/* Beautiful Image Gallery */}
      <section className="py-16 bg-gray-50">
        <div className=" mx-auto px-4 w-full">
          {/* Filters - Always Visible */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-sorts-mill-gloudy font-thin text-gray-900 mb-2">
                {showProducts ? 'Product Gallery' : 'Collection Gallery'}
              </h2>
              <p className="text-gray-600 font-montserrat-regular-400">
                {showProducts ? 'Explore products in this subcategory' : 'Explore our collections in detail'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 ">
              {/* Category Filter */}
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {categoryFilters.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory(null);
                      }}
                      className={`px-3 py-2 rounded-full text-xs sm:text-sm font-montserrat-medium-500 transition-all duration-300 capitalize ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Subcategory Filters for Rings */}
                {ringsSubcategories.length > 0 && 
                 (selectedCategory.toLowerCase() === 'ring' || selectedCategory.toLowerCase() === 'rings') && (
                  <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
                    <button
                      onClick={() => setSelectedSubcategory(null)}
                      className={`px-3 py-1.5 rounded-full font-montserrat-medium-500 text-xs whitespace-nowrap transition-all duration-300 capitalize ${
                        !selectedSubcategory
                          ? 'bg-primary/20 text-primary border border-primary'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      All Rings
                    </button>
                    {ringsSubcategories.map((subcategory) => (
                      <button
                        key={subcategory._id || subcategory.id}
                        onClick={() => setSelectedSubcategory(subcategory._id || subcategory.id)}
                        className={`px-3 py-1.5 rounded-full font-montserrat-medium-500 text-xs whitespace-nowrap transition-all duration-300 capitalize ${
                          selectedSubcategory === (subcategory._id || subcategory.id)
                            ? 'bg-primary/20 text-primary border border-primary'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary rounded-tl-lg rounded-bl-lg text-white" : "text-black-light hover:bg-gray-50 rounded-tl-lg rounded-bl-lg"}`}

                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === "list" ? "bg-primary rounded-tr-lg rounded-br-lg text-white" : "text-black-light hover:bg-gray-50 rounded-tr-lg rounded-br-lg"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {(collectionsLoading || productsLoading) && displayCollections.length === 0 && filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-12 ">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-montserrat-regular-400 text-black-light">Loading...</p>
              </div>
            </div>
          ) : (!showProducts && displayCollections.length === 0) || (showProducts && filteredProducts.length === 0) ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">
                {showProducts ? 'No Products Found' : 'No Collections Found'}
              </h3>
              <p className="font-montserrat-regular-400 text-black-light mb-4">
                {showProducts ? 'No products available in this subcategory.' : 'No active collections available at the moment.'}
              </p>
              {showProducts && selectedSubcategory && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className="px-6 py-2 bg-primary text-white font-montserrat-medium-500 rounded-full hover:bg-primary-dark transition-all duration-300 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reset Filter (Show All Rings)
                  </button>
                  <p className="text-sm text-gray-500 font-montserrat-regular-400">
                    or click "All Rings" above to see all ring collections
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
              {showProducts ? (
                // Show products when subcategory is selected
                filteredProducts.map((product) => {
                  const productImages = product.images || [];
                  if (productImages.length === 0) return null;
                  
                  return (
                    <div key={product._id || product.id} className="group bg-white shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img
                          src={productImages[0] || 'https://via.placeholder.com/400x500'}
                          alt={product.title || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-2 sm:p-2">
                        <div className="grid grid-cols-3 gap-1">
                          {productImages.slice(0, 3).map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-square overflow-hidden cursor-pointer group/thumb"
                              onClick={() => setFullscreenImage({ 
                                collection: product.title || 'Product', 
                                images: productImages, 
                                image, 
                                index 
                              })}
                            >
                              <img
                                src={image}
                                alt={`${product.title || 'Product'} ${index + 1}`}
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="transform transition-transform duration-300 group-hover/thumb:scale-110">
                                  <ZoomIn className="w-4 h-4 md:w-4 md:h-4 text-white" />
                                </div>
                              </div>
                              {index === 2 && productImages.length > 3 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                  <span className="text-white text-xs font-montserrat-medium-500">
                                    +{productImages.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Show collections when no subcategory is selected
                filteredCollections.map((collection) => (
                <div key={collection._id || collection.id} className="group bg-white  shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={collection.images?.[0] || 'https://via.placeholder.com/400x500'}
                      alt={collection.title || 'Collection'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => {if(collection.video){toggleVideo(collection._id || collection.id)}else{setFullscreenImage({ collection: collection.title || 'Collection', images: collection.images || [], image: collection.images?.[0] || 'https://via.placeholder.com/400x500', index: 0 })}}}
                        className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
                      >
                        {collection.video ? <Play className="w-5 h-5 text-primary-dark ml-1" /> : <ZoomIn className="w-5 h-5 text-primary-dark ml-1" />}  
                      </button>
                    </div>

                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {collection.isNew && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-montserrat-medium-500">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button
                        onClick={() => toggleLike(collection.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          likedItems.has(collection.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedItems.has(collection.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-300">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div> */}
                  </div>

                  <div className="p-2 sm:p-2">
                    {/* <h3 className="text-lg sm:text-xl font-sorts-mill-gloudy font-medium text-gray-900 mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-montserrat-regular-400 mb-4">
                      {collection.subtitle}
                    </p> */}
                    
                    <div className="grid grid-cols-3 gap-1">
                      {(collection.images || []).slice(0, 3).map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden cursor-pointer group/thumb"
                          onClick={() => setFullscreenImage({ collection: collection.title || 'Collection', images: collection.images || [], image, index })}
                        >
                          <img
                            src={image}
                            alt={`${collection.title || 'Collection'} ${index + 1}`}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Primary Color Overlay with Zoom Icon on Hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="transform transition-transform duration-300 group-hover/thumb:scale-110">
                              <ZoomIn className="w-4 h-4 md:w-4 md:h-4 text-white" />
                            </div>
                          </div>

                          {index === 2 && (collection.images || []).length > 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                              <span className="text-white text-xs font-montserrat-medium-500">
                                +{(collection.images || []).length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {showProducts ? (
                // Show products in list view when subcategory is selected
                filteredProducts.map((product) => {
                  const productImages = product.images || [];
                  if (productImages.length === 0) return null;
                  
                  return (
                    <div key={product._id || product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                      <div className="flex flex-col lg:flex-row">
                        <div className="w-full lg:w-80 aspect-square lg:aspect-auto relative">
                          <img
                            src={productImages[0] || 'https://via.placeholder.com/400x500'}
                            alt={product.title || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4 sm:p-6 lg:p-8">
                          <h3 className="text-xl sm:text-2xl font-sorts-mill-gloudy font-medium text-gray-900 mb-2 capitalize">
                            {product.title || 'Product'}
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            {productImages.slice(0, 4).map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group/thumb"
                                onClick={() => setFullscreenImage({ 
                                  collection: product.title || 'Product', 
                                  images: productImages, 
                                  image, 
                                  index 
                                })}
                              >
                                <img
                                  src={image}
                                  alt={`${product.title || 'Product'} ${index + 1}`}
                                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="transform transition-transform duration-300 group-hover/thumb:scale-110">
                                    <ZoomIn className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                  </div>
                                </div>
                                {index === 3 && productImages.length > 4 && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                    <span className="text-white text-xs sm:text-sm font-montserrat-medium-500">
                                      +{productImages.length - 4}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Show collections in list view when no subcategory is selected
                filteredCollections.map((collection) => (
                <div key={collection._id || collection.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-80 aspect-square lg:aspect-auto relative">
                      <img
                        src={collection.images?.[0] || 'https://via.placeholder.com/400x500'}
                        alt={collection.title || 'Collection'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => {if(collection.video){toggleVideo(collection._id || collection.id)}else{setFullscreenImage({ collection: collection.title || 'Collection', images: collection.images || [], image: collection.images?.[0] || 'https://via.placeholder.com/400x500', index: 0 })}}}
                          className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
                        >
                          {collection.video ? <Play className="w-5 h-5 text-primary-dark ml-1" /> : <ZoomIn className="w-5 h-5 text-primary-dark ml-1" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                      <h3 className="text-xl sm:text-2xl font-sorts-mill-gloudy font-medium text-gray-900 mb-2 capitalize">
                        {collection.title || 'Collection'}
                      </h3>
                      <p className="text-gray-600 font-montserrat-regular-400 mb-4 capitalize">
                        {collection.category || ''}
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {(collection.images || []).slice(0, 4).map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group/thumb"
                            onClick={() => setFullscreenImage({ collection: collection.title || 'Collection', images: collection.images || [], image, index })}
                          >
                            <img
                              src={image}
                              alt={`${collection.title || 'Collection'} ${index + 1}`}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                            />
                            
                            {/* Primary Color Overlay with Zoom Icon on Hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0  group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="transform transition-transform duration-300 group-hover/thumb:scale-110">
                                <ZoomIn className="w-6 h-6 md:w-8 md:h-8 text-white" />
                              </div>
                            </div>

                            {index === 3 && (collection.images || []).length > 4 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                <span className="text-white text-xs sm:text-sm font-montserrat-medium-500">
                                  +{(collection.images || []).length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          )}
            </>
          )}
        </div>
      </section>

{/* Social Media Gallery Slider Section */}
<section className="py-12 md:py-16 bg-[#F5F1E8] overflow-hidden">
  <div className="w-full">
    {/* Top Banner */}
    <div className="text-center mb-16">
      <h2 className="text-2xl md:text-3xl font-sorts-mill-gloudy font-thin text-gray-900 mb-2">
        Stay Engaged With Us
      </h2>
      <p className="text-gray-600 font-montserrat-regular-400">
        Stay updated with our latest collections and news
      </p>
    </div>

    {/* Gallery Slider - Auto Slider with react-slick - Center Mode */}
    <div className="relative px-4 md:px-8">
      <Slider
        {...{
          dots: false,
          infinite: true,
          speed: 1000,
          slidesToShow: 4,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          pauseOnHover: true,
          arrows: false,
          centerMode: true,
          centerPadding: '8%',
          responsive: [
            {
              breakpoint: 1280,
              settings: {
                slidesToShow: 4,
                centerMode: true,
                centerPadding: '8%',
              }
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                centerMode: true,
                centerPadding: '5%',
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                centerMode: true,
                centerPadding: '5%',
              }
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
                centerMode: true,
                centerPadding: '15%',
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                centerMode: true,
                centerPadding: '10%',
              }
            }
          ]
        }}
        className="social-gallery-slider"
      >
        {socialHandles.map((item) => (
          <div key={item._id} className="px-1 md:px-2">
            <div className="relative group h-full w-full overflow-hidden aspect-square shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
              {/* Background Image */}
              <a href={item.url} target="_blank" rel="noopener noreferrer">
              <img
                src={item.image}
                alt={item.alt}
                className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110 ${item.bgColor}`}
              />
              
              {/* Opacity Overlay on Hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                {/* Instagram Icon - Shows on Hover */}
                <div className="transform transition-transform duration-500 group-hover:scale-110 hover:rotate-90">
                  <div className="rounded-2xl p-3 md:p-4 text-white">
                    {getPlatformIcon(item.platform)}
                   {/* <BsInstagram className="w-6 h-6 text-white" /> */}
                  </div>
                </div>
              </div>
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>

    {/* Custom Slider Styles */}
    <style>{`
      .social-gallery-slider .slick-slide {
        padding: 0 4px;
      }
      .social-gallery-slider .slick-track {
        display: flex;
        align-items: stretch;
      }
      .social-gallery-slider .slick-slide > div {
        height: 100%;
      }
      .social-gallery-slider .slick-slide.slick-center {
        transform: scale(1);
      }
      .social-gallery-slider .slick-slide:not(.slick-center) {
        opacity: 0.8;
      }
      .social-gallery-slider .slick-slide.slick-center {
        opacity: 1;
      }
    `}</style>
  </div>
</section>

      {/* Beautiful Marquee */}
      {/* <section className="py-8 sm:py-12 bg-primary-light overflow-hidden mb-12">
        <div className="flex animate-marquee">
          {[...filteredCollections, ...filteredCollections].map((collection, index) => (
            <div key={index} className="flex-shrink-0 mx-2 sm:mx-4 w-48 sm:w-64 h-32 sm:h-40 relative group overflow-hidden rounded-lg sm:rounded-xl shadow-lg">
              <img
                src={collection.images[0]}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white">
                  <p className="text-xs sm:text-sm font-montserrat-medium-500 truncate">
                    {collection.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Video Modal */}
      {activeVideo && displayCollections.find(c => (c._id || c.id) === activeVideo)?.video ?(
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-black  overflow-hidden">
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="aspect-video">
            <video
              className="w-full h-full object-cover"
              controls
              muted={muted}
              autoPlay
            >
              <source src={displayCollections.find(c => (c._id || c.id) === activeVideo)?.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <h3 className="text-white text-lg font-sorts-mill-gloudy font-medium capitalize">
              {displayCollections.find(c => (c._id || c.id) === activeVideo)?.title || 'Collection'} - Collection Video
            </h3>
            <button
              onClick={toggleMute}
              className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white text-sm"
            >
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        </div>
      </div>
      ):(fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black overflow-hidden flex flex-col">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <img
                src={fullscreenImage.images[fullscreenImage.index]}
                alt={`${fullscreenImage.collection} - Image ${fullscreenImage.index + 1}`}
                className="max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300"
              />

              {/* Left Arrow - Infinite navigation */}
              <button
                onClick={() => {
                  const newIndex = fullscreenImage.index === 0 
                    ? fullscreenImage.images.length - 1 
                    : fullscreenImage.index - 1;
                  setFullscreenImage({
                    ...fullscreenImage,
                    index: newIndex
                  });
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Arrow - Infinite navigation */}
              <button
                onClick={() => {
                  const newIndex = fullscreenImage.index === fullscreenImage.images.length - 1
                    ? 0
                    : fullscreenImage.index + 1;
                  setFullscreenImage({
                    ...fullscreenImage,
                    index: newIndex
                  });
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10 backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg font-sorts-mill-gloudy font-medium">
                    {fullscreenImage.collection}
                  </h3>
                  <p className="text-white/80 text-sm font-montserrat-regular-400">
                    Image {fullscreenImage.index + 1} of {fullscreenImage.images.length}
                  </p>
                </div>
                {/* Navigation Dots */}
                <div className="flex gap-2">
                  {fullscreenImage.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFullscreenImage({
                          ...fullscreenImage,
                          index: idx
                        });
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === fullscreenImage.index
                          ? 'bg-white w-6'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
        
      )}

      {/* Fullscreen Image Modal with Slider */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black overflow-hidden flex flex-col">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <img
                src={fullscreenImage.images[fullscreenImage.index]}
                alt={`${fullscreenImage.collection} - Image ${fullscreenImage.index + 1}`}
                className="max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300"
              />

              {/* Left Arrow - Infinite navigation */}
              <button
                onClick={() => {
                  const newIndex = fullscreenImage.index === 0 
                    ? fullscreenImage.images.length - 1 
                    : fullscreenImage.index - 1;
                  setFullscreenImage({
                    ...fullscreenImage,
                    index: newIndex
                  });
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Arrow - Infinite navigation */}
              <button
                onClick={() => {
                  const newIndex = fullscreenImage.index === fullscreenImage.images.length - 1
                    ? 0
                    : fullscreenImage.index + 1;
                  setFullscreenImage({
                    ...fullscreenImage,
                    index: newIndex
                  });
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10 backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white text-lg font-sorts-mill-gloudy font-medium">
                    {fullscreenImage.collection}
                  </h3>
                  <p className="text-white/80 text-sm font-montserrat-regular-400">
                    Image {fullscreenImage.index + 1} of {fullscreenImage.images.length}
                  </p>
                </div>
                {/* Navigation Dots */}
                <div className="flex gap-2">
                  {fullscreenImage.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFullscreenImage({
                          ...fullscreenImage,
                          index: idx
                        });
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === fullscreenImage.index
                          ? 'bg-white w-6'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Discover;