import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts, selectProductsLoading } from '../store/slices/productsSlice';
import { fetchCategories, selectCategories } from '../store/slices/categoriesSlice';
import { ZoomIn, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const categories = useSelector(selectCategories);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 1000, reset: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

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

    // Add virtual "Wedding Band" category for products with isBand: true
    const weddingBandOption = {
      _id: 'wedding-band',
      id: 'wedding-band',
      name: 'Wedding Band',
      isVirtual: true // Flag to identify this is a virtual category
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
    // Don't auto-select - let "All Rings" be the default (selectedSubcategory === null)
  }, [selectedCategory, ringsSubcategories]);

  // Collect all images from products
  const allImages = useMemo(() => {
    let imageList = [];
    
    products.forEach(product => {
      if (!product.images || product.images.length === 0) return;
      
      const categoryName = product.category?.name || 'Uncategorized';
      const productCategoryId = product.category?._id || product.category?.id;
      const productParent = product.category?.parent;
      const productParentId = typeof productParent === 'object' 
        ? productParent?._id || productParent?.id
        : productParent;
      const productParentName = typeof productParent === 'object' 
        ? productParent?.name?.toLowerCase() 
        : null;
      
      // Check if category matches
      let categoryMatches = selectedCategory.toLowerCase() === 'all';
      
      if (!categoryMatches) {
        const selectedCategoryLower = selectedCategory.toLowerCase();
        const isRingsSelected = selectedCategoryLower === 'ring' || selectedCategoryLower === 'rings';
        
        if (isRingsSelected && ringsCategory) {
          const ringsId = ringsCategory._id || ringsCategory.id;
          
          // Check if product belongs to Rings category or its subcategories
          const belongsToRings = productCategoryId === ringsId || 
                                productParentId === ringsId ||
                                productParentName === 'ring' || 
                                productParentName === 'rings' ||
                                categoryName.toLowerCase() === 'ring' ||
                                categoryName.toLowerCase() === 'rings';
          
          if (belongsToRings) {
            // If subcategory is selected, filter by subcategory
            if (selectedSubcategory) {
              // Check if "Wedding Band" is selected (virtual category)
              if (selectedSubcategory === 'wedding-band') {
                // Show only products with isBand: true
                categoryMatches = product.isBand === true;
              } else {
                // Filter by regular subcategory
                categoryMatches = productCategoryId === selectedSubcategory;
              }
            } else {
              // Show all Rings subcategories if no specific subcategory selected
              // Exclude wedding bands when showing all (they'll show when "Wedding Band" is selected)
              categoryMatches = true;
            }
          }
        } else {
          // For other categories, match by name
          categoryMatches = categoryName.toLowerCase() === selectedCategoryLower ||
                           productParentName === selectedCategoryLower;
        }
      }
      
      if (categoryMatches) {
        product.images.forEach((image, index) => {
          const imageUrl = typeof image === 'string' ? image : image?.url || image;
          if (imageUrl) {
            imageList.push({
              id: `${product._id || product.id}-${index}`,
              url: imageUrl,
              productId: product._id || product.id,
              productTitle: product.title,
              category: categoryName
            });
          }
        });
      }
    });
    
    return imageList;
  }, [products, selectedCategory, selectedSubcategory, ringsCategory]);
  
  // Handle fullscreen image view
  const openFullscreen = (image, index) => {
    setFullscreenImage({
      images: allImages.map(img => img.url),
      items: allImages, // keep mapping to productId/title
      index,
      collection: 'Gallery'
    });
  };

  // Keyboard navigation for fullscreen
  useEffect(() => {
    if (!fullscreenImage) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = fullscreenImage.index === 0 
          ? fullscreenImage.images.length - 1 
          : fullscreenImage.index - 1;
        setFullscreenImage({ ...fullscreenImage, index: newIndex });
      } else if (e.key === 'ArrowRight') {
        const newIndex = fullscreenImage.index === fullscreenImage.images.length - 1
          ? 0
          : fullscreenImage.index + 1;
        setFullscreenImage({ ...fullscreenImage, index: newIndex });
      } else if (e.key === 'Escape') {
        setFullscreenImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fullscreenImage]);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header Section */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-sorts-mill-gloudy font-thin text-gray-900 mb-4">
              Gallery
            </h1>
            <p className="text-gray-600 font-montserrat-regular-400 max-w-2xl mx-auto">
              Explore our curated collection of jewelry in a simple, elegant gallery
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory(null);
              }}
              className={`px-4 py-2 rounded-full font-montserrat-medium-500 text-sm whitespace-nowrap transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {mainCategories.map((category) => (
              <button
                key={category._id || category.id}
                onClick={() => {
                  setSelectedCategory(category.name);
                  // Reset subcategory when switching categories
                  setSelectedSubcategory(null);
                }}
                className={`px-4 py-2 rounded-full font-montserrat-medium-500 text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory.toLowerCase() === category.name.toLowerCase()
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Subcategory Filters for Rings */}
          {ringsSubcategories.length > 0 && 
           (selectedCategory.toLowerCase() === 'ring' || selectedCategory.toLowerCase() === 'rings') && (
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-3 border-t border-gray-100 scrollbar-hide">
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
      </section>

      {/* Images Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {productsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : allImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 font-montserrat-regular-400">
                No images found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
              {allImages.map((imageItem, index) => (
                <div
                  key={imageItem.id}
                  className="relative aspect-square overflow-hidden bg-white rounded-sm cursor-pointer group"
                  onClick={() => openFullscreen(imageItem, index)}
                >
                  <img
                    src={imageItem.url}
                    alt={imageItem.productTitle || 'Gallery Image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="transform transition-transform duration-300 group-hover:scale-110">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black overflow-hidden flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image Container - Fixed Height */}
            <div className="flex-1 flex items-center justify-center p-8 relative min-h-0">
              <img
                src={fullscreenImage.images[fullscreenImage.index]}
                alt={`Gallery Image ${fullscreenImage.index + 1}`}
                className="max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300 cursor-pointer"
                onClick={() => {
                  const current = fullscreenImage.items?.[fullscreenImage.index];
                  if (!current) return;
                  const product = products.find(p => (p._id || p.id) === current.productId);
                  if (product) {
                    setSelectedProduct(product);
                    navigate(`/product/${product._id || product.id}`);
                    setFullscreenImage(null);
                  }
                }}
                onError={(e) => {
                }}
              />

              {/* Left Arrow - Fixed Position */}
              <button
                onClick={() => {
                  const newIndex = fullscreenImage.index === 0 
                    ? fullscreenImage.images.length - 1 
                    : fullscreenImage.index - 1;
                  setFullscreenImage({ ...fullscreenImage, index: newIndex });
                }}
                className="absolute left-4 top-0 bottom-0 my-auto h-12 w-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10 backdrop-blur-sm"
                style={{ marginTop: 'auto', marginBottom: 'auto' }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Arrow - Fixed Position */}
              <button
                onClick={() => {
                  const newIndex = fullscreenImage.index === fullscreenImage.images.length - 1
                    ? 0
                    : fullscreenImage.index + 1;
                  setFullscreenImage({ ...fullscreenImage, index: newIndex });
                }}
                className="absolute right-4 top-0 bottom-0 my-auto h-12 w-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10 backdrop-blur-sm"
                style={{ marginTop: 'auto', marginBottom: 'auto' }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Info Bar - Fixed at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex-shrink-0">
                  <h3 className="text-white text-lg font-sorts-mill-gloudy font-medium">
                    {fullscreenImage.collection}
                  </h3>
                  <p className="text-white/80 text-sm font-montserrat-regular-400">
                    Image {fullscreenImage.index + 1} of {fullscreenImage.images.length}
                  </p>
                </div>
                {/* Navigation Dots - Improved Layout */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide max-w-full">
                  {fullscreenImage.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFullscreenImage({ ...fullscreenImage, index: idx });
                      }}
                      className={`flex-shrink-0 rounded-full transition-all duration-300 ${
                        idx === fullscreenImage.index
                          ? 'bg-white h-2 w-8'
                          : 'bg-white/40 hover:bg-white/60 h-2 w-2'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </div>
  );
};

export default Gallery;

