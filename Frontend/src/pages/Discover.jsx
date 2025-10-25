import React, { useState, useEffect } from 'react';
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
  List
} from 'lucide-react';

const Discover = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [muted, setMuted] = useState(true);
  const [likedItems, setLikedItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Collections data with real images and videos for testing
  const collections = [
    {
      id: 1,
      title: "Youth Collection",
      subtitle: "Trendy & Delicate",
      images: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&crop=center"
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      category: "necklaces",
      isNew: true,
      isFeatured: true,
      description: "Trendy gold chains in bracelets and necklaces look very delicate"
    },
    {
      id: 2,
      title: "Elegance Series",
      subtitle: "Sophisticated & Timeless",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop&crop=center"
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      category: "rings",
      isNew: false,
      isFeatured: true,
      description: "Sophisticated pieces for special occasions"
    },
    {
      id: 3,
      title: "Minimalist Gold",
      subtitle: "Clean & Contemporary",
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop&crop=center"
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      category: "earrings",
      isNew: true,
      isFeatured: false,
      description: "Clean lines and contemporary design"
    },
    {
      id: 4,
      title: "Vintage Revival",
      subtitle: "Classic & Modern",
      images: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop&crop=center"
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      category: "bracelets",
      isNew: false,
      isFeatured: false,
      description: "Classic designs with modern twist"
    },
    {
      id: 5,
      title: "Pearl Dreams",
      subtitle: "Timeless & Elegant",
      images: [
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop&crop=center"
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      category: "necklaces",
      isNew: true,
      isFeatured: true,
      description: "Timeless elegance with freshwater pearls"
    },
    {
      id: 6,
      title: "Diamond Sparkle",
      subtitle: "Luxury & Brilliant",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&crop=center"
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      category: "rings",
      isNew: false,
      isFeatured: true,
      description: "Brilliant diamonds in contemporary settings"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Collections', count: collections.length },
    { id: 'necklaces', name: 'Necklaces', count: collections.filter(c => c.category === 'necklaces').length },
    { id: 'rings', name: 'Rings', count: collections.filter(c => c.category === 'rings').length },
    { id: 'earrings', name: 'Earrings', count: collections.filter(c => c.category === 'earrings').length },
    { id: 'bracelets', name: 'Bracelets', count: collections.filter(c => c.category === 'bracelets').length }
  ];

  const filteredCollections = selectedCategory === 'all' 
    ? collections 
    : collections.filter(c => c.category === selectedCategory);

  // Auto-advance video slider
  useEffect(() => {
    if (isVideoPlaying) {
      const interval = setInterval(() => {
        setCurrentVideoIndex(prev => (prev + 1) % filteredCollections.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVideoPlaying, filteredCollections.length]);

  const toggleLike = (id) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
      `}</style>

      {/* Elegant Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-24 h-24 sm:w-40 sm:h-40 bg-primary-light/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 bg-primary-dark/5 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
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
              <button className="group w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-primary text-white font-montserrat-medium-500 rounded-xl hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Watch Collections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 border-2 border-gray-300 text-gray-700 font-montserrat-medium-500 rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-3">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Browse Gallery</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Slider Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-sorts-mill-gloudy font-thin text-gray-900 mb-2 sm:mb-4">
              Collection Videos
            </h2>
            <p className="text-gray-600 font-montserrat-regular-400">
              Watch our collections come to life
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-black shadow-2xl">
              <div className="aspect-video">
                <video
                  className="w-full h-full object-cover"
                  src={filteredCollections[currentVideoIndex]?.video}
                  muted
                  loop
                  autoPlay
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
                  >
                    {isVideoPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-primary-dark" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 text-primary-dark ml-1" />}
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <h3 className="text-white text-lg sm:text-xl font-sorts-mill-gloudy font-medium mb-1">
                    {filteredCollections[currentVideoIndex]?.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm font-montserrat-regular-400">
                    {filteredCollections[currentVideoIndex]?.subtitle}
                  </p>
                </div>
              </div>

              {/* Navigation */}
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

            {/* Video Thumbnails */}
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
          </div>
        </div>
      </section>

      {/* Beautiful Image Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-sorts-mill-gloudy font-thin text-gray-900 mb-2">
                Collection Gallery
              </h2>
              <p className="text-gray-600 font-montserrat-regular-400">
                Explore our collections in detail
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-2 rounded-full text-xs sm:text-sm font-montserrat-medium-500 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredCollections.map((collection) => (
                <div key={collection.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={collection.images[0]}
                      alt={collection.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => toggleVideo(collection.id)}
                        className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
                      >
                        <Play className="w-5 h-5 text-primary-dark ml-1" />
                      </button>
                    </div>

                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {collection.isNew && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-montserrat-medium-500">
                          NEW
                        </span>
                      )}
                      {collection.isFeatured && (
                        <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-montserrat-medium-500">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
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
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-sorts-mill-gloudy font-medium text-gray-900 mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-montserrat-regular-400 mb-4">
                      {collection.subtitle}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {collection.images.slice(0, 3).map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group/thumb"
                          onClick={() => setFullscreenImage({ collection: collection.title, image, index })}
                        >
                          <img
                            src={image}
                            alt={`${collection.title} ${index + 1}`}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          />
                          {index === 2 && collection.images.length > 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-xs font-montserrat-medium-500">
                                +{collection.images.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredCollections.map((collection) => (
                <div key={collection.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-80 aspect-square lg:aspect-auto relative">
                      <img
                        src={collection.images[0]}
                        alt={collection.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => toggleVideo(collection.id)}
                          className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg"
                        >
                          <Play className="w-5 h-5 text-primary-dark ml-1" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                      <h3 className="text-xl sm:text-2xl font-sorts-mill-gloudy font-medium text-gray-900 mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-gray-600 font-montserrat-regular-400 mb-4">
                        {collection.subtitle}
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {collection.images.slice(0, 4).map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group/thumb"
                            onClick={() => setFullscreenImage({ collection: collection.title, image, index })}
                          >
                            <img
                              src={image}
                              alt={`${collection.title} ${index + 1}`}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                            />
                            {index === 3 && collection.images.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-xs sm:text-sm font-montserrat-medium-500">
                                  +{collection.images.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Beautiful Marquee */}
      <section className="py-8 sm:py-12 bg-primary-light overflow-hidden mb-12">
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
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden">
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
                <source src={collections.find(c => c.id === activeVideo)?.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <h3 className="text-white text-lg font-sorts-mill-gloudy font-medium">
                {collections.find(c => c.id === activeVideo)?.title} - Collection Video
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
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black rounded-2xl overflow-hidden flex">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 flex items-center justify-center p-8">
              <img
                src={fullscreenImage.image}
                alt={`${fullscreenImage.collection} - Image ${fullscreenImage.index + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3">
                <h3 className="text-white text-lg font-sorts-mill-gloudy font-medium">
                  {fullscreenImage.collection}
                </h3>
                <p className="text-white/80 text-sm font-montserrat-regular-400">
                  Image {fullscreenImage.index + 1} from collection
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sorts-mill-gloudy font-thin mb-4 sm:mb-6">
            Ready to Explore?
          </h2>
          <p className="text-base sm:text-lg font-montserrat-regular-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-white/90">
            Discover the perfect jewelry pieces that reflect your unique style and personality.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary-dark font-montserrat-medium-500 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center justify-center gap-3">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Explore Collections</span>
            </button>
            <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 border-2 border-white text-white font-montserrat-medium-500 rounded-xl hover:bg-white hover:text-primary-dark transition-all duration-300 flex items-center justify-center gap-3">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Create Wishlist</span>
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Discover;