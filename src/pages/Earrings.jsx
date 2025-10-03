import React, { useState } from "react";
import earringImg1 from "../assets/images/product-1.png";
import earringImg2 from "../assets/images/product-2.jpg";
import earringImg3 from "../assets/images/product-3.jpg";
import earringImg4 from "../assets/images/product-4.jpg";
import earringImg5 from "../assets/images/product-5.png";
import earringImg6 from "../assets/images/product-6.png";
import { Grid, List } from "lucide-react";
import ProductCard from "../components/ProductCard";

const Earrings = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  const earrings = [
    {
      id: 1,
      name: "Classic Diamond Studs",
      price: 899,
      originalPrice: 1099,
      rating: 4.9,
      reviews: 156,
      image: earringImg1,
      featured: true,
      description: "Timeless diamond stud earrings perfect for everyday elegance"
    },
    {
      id: 2,
      name: "Vintage Gold Hoops",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 203,
      image: earringImg2,
      featured: true,
      description: "Classic gold hoop earrings with vintage-inspired design"
    },
    {
      id: 3,
      name: "Pearl Drop Earrings",
      price: 599,
      originalPrice: null,
      rating: 4.7,
      reviews: 89,
      image: earringImg3,
      featured: false,
      description: "Elegant pearl drop earrings for special occasions"
    },
    {
      id: 4,
      name: "Crystal Chandelier",
      price: 1299,
      originalPrice: 1499,
      rating: 4.9,
      reviews: 124,
      image: earringImg4,
      featured: true,
      description: "Stunning crystal chandelier earrings for glamorous evenings"
    },
    {
      id: 5,
      name: "Modern Ear Cuffs",
      price: 199,
      originalPrice: null,
      rating: 4.6,
      reviews: 167,
      image: earringImg5,
      featured: false,
      description: "Contemporary ear cuffs for a bold, modern look"
    },
    {
      id: 6,
      name: "Delicate Huggie Earrings",
      price: 399,
      originalPrice: 499,
      rating: 4.8,
      reviews: 145,
      image: earringImg6,
      featured: true,
      description: "Comfortable huggie earrings with subtle sparkle"
    }
  ];

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

  const sortedEarrings = sortEarrings(earrings);

  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <section className="py-8 md:py-16 lg:py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
            JEWELRY COLLECTION
          </p>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
            Earring Collection<span className="text-primary">.</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
            Discover our stunning collection of earrings, from delicate studs to statement pieces
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
                {sortedEarrings.length} earrings available
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary rounded-lg  text-white" : "text-black-light hover:bg-gray-50"}`}
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
            {sortedEarrings.map((earring) => (
              <ProductCard
                key={earring.id}
                product={earring}
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
            Our jewelry experts can help you find the perfect earrings or create a custom design just for you
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

export default Earrings;
