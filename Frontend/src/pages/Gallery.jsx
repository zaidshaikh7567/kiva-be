import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts, selectProductsLoading } from '../store/slices/productsSlice';
import { fetchCategories, selectCategories } from '../store/slices/categoriesSlice';
import { ZoomIn, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const categories = useSelector(selectCategories);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 1000, reset: true }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Get main categories only (parent categories)
  const mainCategories = useMemo(() => {
    return categories?.filter(cat => !cat.parent) || [];
  }, [categories]);

  // Collect all images from products
  const allImages = useMemo(() => {
    let imageList = [];
    
    products.forEach(product => {
      if (!product.images || product.images.length === 0) return;
      
      const categoryName = product.category?.name || 'Uncategorized';
      const categoryMatches = selectedCategory === 'all' || 
                              categoryName.toLowerCase() === selectedCategory.toLowerCase();
      
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
  }, [products, selectedCategory]);

  // Handle fullscreen image view
  const openFullscreen = (image, index) => {
    setFullscreenImage({
      images: allImages.map(img => img.url),
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
              onClick={() => setSelectedCategory('all')}
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
                onClick={() => setSelectedCategory(category.name)}
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
                className="max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300"
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
    </div>
  );
};

export default Gallery;

