import React from "react";
import heroImage from "../../assets/images/hero.jpg" // place your jewelry image in public/images

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between   py-12 bg-[#f9f8f6]">
      {/* Left Text Content */}
      <div className="flex-1 text-center md:text-left">
        <p className="text-sm uppercase tracking-widest text-[#c39d8f] mb-3">
          Jewelry
        </p>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1e2b38] leading-tight">
          Shine Bright <br /> With Aurora<span className="text-[#c39d8f]">.</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg italic">
          Every day is your special day with our fine jewelry!
        </p>
        <button className="mt-8 px-6 py-3 bg-[#e9cbb3] text-[#1e2b38] font-medium rounded-md hover:bg-[#d9b29e] transition">
          — Shop
        </button>
      </div>

      {/* Right Image */}
      <div className="flex-1 mt-10 md:mt-0 relative flex justify-center md:justify-end">
        <div className="rounded-l-full overflow-hidden w-72 md:w-[420px] lg:w-[500px]">
          <img
            src={heroImage}
            alt="Aurora Jewelry"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
