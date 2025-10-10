import React, { useState } from "react";
import braceletImg1 from "../assets/images/product-1.png";
import braceletImg2 from "../assets/images/product-2.jpg";
import braceletImg3 from "../assets/images/product-3.jpg";
import braceletImg4 from "../assets/images/product-4.jpg";
import braceletImg5 from "../assets/images/product-5.png";
import braceletImg6 from "../assets/images/product-6.png";
import { Grid, List } from "lucide-react";
import ProductCard from "../components/ProductCard";
import CustomDropdown from "../components/CustomDropdown";

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const Bracelets = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  const bracelets = [
    {
      id: 1,
      name: "Classic Gold Chain Bracelet",
      price: 699,
      originalPrice: 899,
      rating: 4.9,
      reviews: 178,
      image: braceletImg1,
      featured: true,
      description: "Timeless gold chain bracelet perfect for everyday elegance"
    },
    {
      id: 2,
      name: "Pearl Tennis Bracelet",
      price: 1299,
      originalPrice: 1599,
      rating: 4.8,
      reviews: 245,
      image: braceletImg2,
      featured: true,
      description: "Elegant pearl tennis bracelet with vintage-inspired design"
    },
    {
      id: 3,
      name: "Diamond Bangle Set",
      price: 1899,
      originalPrice: null,
      rating: 4.7,
      reviews: 134,
      image: braceletImg3,
      featured: false,
      description: "Stunning diamond bangle set for special occasions"
    },
    {
      id: 4,
      name: "Rose Gold Cuff Bracelet",
      price: 799,
      originalPrice: 999,
      rating: 4.9,
      reviews: 167,
      image: braceletImg4,
      featured: true,
      description: "Modern rose gold cuff bracelet with contemporary design"
    },
    {
      id: 5,
      name: "Charm Bracelet Collection",
      price: 399,
      originalPrice: null,
      rating: 4.6,
      reviews: 298,
      image: braceletImg5,
      featured: false,
      description: "Personalized charm bracelet collection for meaningful moments"
    },
    {
      id: 6,
      name: "Sterling Silver Link Bracelet",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 189,
      image: braceletImg6,
      featured: true,
      description: "Classic sterling silver link bracelet with adjustable sizing"
    }
  ];

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

  const sortedBracelets = sortBracelets(bracelets);

  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
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

      {/* Simple Filter Section */}
      <section className="py-4 md:py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Filters and Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-montserrat-medium-500 text-black-light">
                {sortedBracelets.length} bracelets available
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <CustomDropdown
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort by"
                className="min-w-[200px]"
              />

              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary rounded-lg text-white" : "text-black-light hover:bg-gray-50"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary rounded-lg text-white" : "text-black-light hover:bg-gray-50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-2 md:py-8 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`grid gap-4 md:gap-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {sortedBracelets.map((bracelet) => (
              <ProductCard
                key={bracelet.id}
                product={bracelet}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy mb-6 md:mb-8">
            Need Help Choosing<span className="text-primary">?</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl font-montserrat-regular-400 text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Our jewelry experts can help you find the perfect bracelet or create a custom design just for you
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

export default Bracelets;
