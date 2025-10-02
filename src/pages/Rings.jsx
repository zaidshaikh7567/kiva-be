import React, { useState } from "react";
import ringImg1 from "../assets/images/product-1.png";
import ringImg2 from "../assets/images/product-2.jpg";
import ringImg3 from "../assets/images/product-3.jpg";
import ringImg4 from "../assets/images/product-4.jpg";
import ringImg5 from "../assets/images/product-5.png";
import ringImg6 from "../assets/images/product-6.png";
import { Heart, Star, ShoppingBag, Filter, Grid, List, ChevronDown } from "lucide-react";

const Rings = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Rings", icon: "💍" },
    { id: "round", name: "Round Ring", icon: "⭕" },
    { id: "oval", name: "Oval Ring", icon: "🥚" },
    { id: "emerald", name: "Emerald Ring", icon: "💚" },
    { id: "cushion", name: "Cushion Ring", icon: "🟫" },
    { id: "pear", name: "Pear Ring", icon: "🍐" },
    { id: "radiant", name: "Radiant Ring", icon: "✨" }
  ];

  const rings = [
    {
      id: 1,
      name: "Classic Round Solitaire",
      price: 1299,
      originalPrice: 1499,
      rating: 4.9,
      reviews: 124,
      image: ringImg1,
      category: "round",
      featured: true,
      description: "Timeless round brilliant cut diamond solitaire engagement ring"
    },
    {
      id: 2,
      name: "Vintage Oval Emerald",
      price: 899,
      originalPrice: 1099,
      rating: 4.8,
      reviews: 89,
      image: ringImg2,
      category: "oval",
      featured: true,
      description: "Elegant oval cut emerald ring with vintage rose gold setting"
    },
    {
      id: 3,
      name: "Modern Emerald Cut",
      price: 1599,
      originalPrice: null,
      rating: 4.7,
      reviews: 67,
      image: ringImg3,
      category: "emerald",
      featured: false,
      description: "Contemporary emerald cut diamond with channel-set side stones"
    },
    {
      id: 4,
      name: "Pear Shaped Diamond",
      price: 2199,
      originalPrice: 2499,
      rating: 4.9,
      reviews: 156,
      image: ringImg4,
      category: "pear",
      featured: true,
      description: "Stunning pear-shaped diamond in elegant platinum setting"
    },
    {
      id: 5,
      name: "Cushion Cut Classic",
      price: 299,
      originalPrice: 399,
      rating: 4.6,
      reviews: 203,
      image: ringImg5,
      category: "cushion",
      featured: false,
      description: "Delicate cushion cut diamond ring perfect for everyday wear"
    },
    {
      id: 6,
      name: "Radiant Cut Statement",
      price: 1899,
      originalPrice: null,
      rating: 4.8,
      reviews: 78,
      image: ringImg6,
      category: "radiant",
      featured: true,
      description: "Bold radiant cut diamond with geometric halo setting"
    }
  ];

  const filteredRings = rings.filter(ring => 
    selectedCategory === "all" || ring.category === selectedCategory
  );

  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
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

      {/* Category Tabs */}
      <section className="py-8 md:py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
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
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative px-4 py-3 font-montserrat-medium-500 text-base transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "text-black rounded-lg bg-primary-light/10"
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
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative px-3 py-2 font-montserrat-medium-500 text-sm transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "text-black rounded-lg bg-primary-light/10"
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
                {categories.slice(4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative px-3 py-2 font-montserrat-medium-500 text-sm transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "text-black rounded-lg bg-primary-light/10"
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
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative px-3 py-2 font-montserrat-medium-500 text-xs transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "text-black rounded-lg bg-primary-light/10"
                        : "text-black-light hover:text-black"
                    }`}
                  >
                    {category.name}
                    {selectedCategory === category.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Second Row - 3 tabs */}
              <div className="flex justify-center items-center space-x-3">
                {categories.slice(4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative px-3 py-2 font-montserrat-medium-500 text-xs transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "text-black rounded-lg bg-primary-light/10"
                        : "text-black-light hover:text-black"
                    }`}
                  >
                    {category.name}
                    {selectedCategory === category.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRings.map((ring) => (
              <div
                key={ring.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden h-64 sm:h-72 md:h-80">
                  <img
                    src={ring.image}
                    alt={ring.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {ring.featured && (
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-montserrat-medium-500">
                      Featured
                    </div>
                  )}
                  <button className="absolute top-3 right-3 md:top-4 md:right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-300">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-black-light" />
                  </button>
                  {ring.originalPrice && (
                    <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm font-montserrat-medium-500">
                      Sale
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-montserrat-medium-500 text-primary-dark uppercase tracking-wide">
                      {ring.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-montserrat-regular-400 text-black-light">
                        {ring.rating} ({ring.reviews})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-montserrat-semibold-600 text-black mb-2">
                    {ring.name}
                  </h3>

                  <p className="text-black-light font-montserrat-regular-400 text-xs md:text-sm mb-4">
                    {ring.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl md:text-2xl font-montserrat-bold-700 text-primary">
                        ${ring.price}
                      </span>
                      {ring.originalPrice && (
                        <span className="text-base md:text-lg font-montserrat-regular-400 text-black-light line-through">
                          ${ring.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="w-full bg-primary text-white font-montserrat-medium-500 py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center space-x-2 text-sm md:text-base">
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy mb-6 md:mb-8">
            Can't Find What You're Looking For<span className="text-primary">?</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl font-montserrat-regular-400 text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Our jewelry experts can help you create a custom ring or find the perfect piece from our private collection
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <button className="px-6 md:px-10 py-3 md:py-4 bg-primary text-white font-montserrat-medium-500 hover:bg-primary-dark transition-colors duration-300 rounded-lg text-base md:text-lg">
              Custom Design
            </button>
            <button className="px-6 md:px-10 py-3 md:py-4 border-2 border-primary text-primary font-montserrat-medium-500 hover:bg-primary hover:text-white transition-colors duration-300 rounded-lg text-base md:text-lg">
              Book Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rings;