import React from "react";
import heroImage from "../../assets/images/hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between  md:pl-16 lg:pl-32 xl:pl-64  h-[90vh] overflow-hidden">
      {/* Background Image on Mobile */}
      <div className="absolute inset-0 md:hidden">
        <img
          src={heroImage}
          alt="Aurora Jewelry"
          className="w-full h-full object-cover"
        />
        {/* overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Left Text Content */}
      <div className="flex-1 flex flex-col justify-center md:justify-end  md:bottom-36  text-center  md:text-left h-full relative z-10 ">
        <p className="text-sm uppercase tracking-widest md:text-primary-dark text-white font-montserrat-medium-500  mb-3">
          Jewelry
        </p>
        <div className=" md:text-[92px] sm:text-6xl text-4xl font-sorts-mill-gloudy leading-none  md:text-black text-white !font-thin">
          Shine Bright <br /> With Aurora<span className="  text-primary">.</span>
        </div>
        <p className="mt-4 text-[22px] italic font-sorts-mill-gloudy font-extralight md:text-black-light text-white">
          Every day is your special day with our fine jewelry!
        </p>
        <button className=" w-fit mt-8 px-6 py-3 bg-primary-dark text-white font-medium hover:bg-primary transition">
          — Shop
        </button>

        
      </div>
    

      {/* Right Image (only visible on desktop split layout) */}
      <div className="hidden md:flex flex-1 relative justify-center md:justify-end w-full md:w-1/2 h-full">
        <div
          className="overflow-hidden w-full h-full"
          style={{
            clipPath: "ellipse(100% 85% at 100% 20%)",
          }}
        >
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
