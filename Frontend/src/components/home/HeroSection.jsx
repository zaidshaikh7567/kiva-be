import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "../IconButton";
import { ShoppingBag } from "lucide-react";
import { selectMedia } from "../../store/slices/mediaSlice";
import { useSelector } from "react-redux";
const HeroSection = () => {
  const media = useSelector(selectMedia) || [];
  const [isVisible, setIsVisible] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between  lg:pl-16 xl:pl-32   h-[90vh] overflow-hidden">
      {/* Background Image on Mobile */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src={media.find(item => item.page === 'home' && item.section === 'home-banner' && item.type === 'image')?.url}
          alt="Kiva Diamond"
          className="w-full h-full object-cover object-center"
        />
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      </div>

      {/* Left Text Content */}
      <div className="flex-1 flex flex-col justify-center lg:justify-end  lg:bottom-36  text-center  lg:text-left h-full relative z-10 ">
        {/* Multiple Jewelry-inspired decorative elements for text content */}
        <div className="absolute top-0 left-8 w-16 h-16 bg-primary/20 rounded-full blur-xl z-0"></div>
        <div className="absolute top-8 left-16 w-8 h-8 bg-primary/30 rounded-full blur-lg z-0"></div>
        <div className="absolute bottom-32 left-12 w-12 h-12 bg-primary/25 rounded-full blur-lg z-0"></div>
        <div className="absolute bottom-16 left-8 w-6 h-6 bg-primary/35 rounded-full blur-md z-0"></div>
        <div className="absolute top-24 left-4 w-10 h-10 bg-primary/15 rounded-full blur-lg z-0"></div>
        <div className="absolute bottom-24 left-6 w-8 h-8 bg-primary/20 rounded-full blur-md z-0"></div>
        
        {/* Diamond-shaped decorative elements */}
        <div 
          className="absolute top-12 right-8 w-6 h-6 bg-primary/30 rotate-45 z-0"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-12 w-4 h-4 bg-primary/40 rotate-45 z-0"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
          }}
        ></div>
        <div 
          className="absolute top-32 left-12 w-5 h-5 bg-primary/25 rotate-45 z-0"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
          }}
        ></div>
        
        {/* Ring-shaped decorative elements */}
        <div className="absolute top-20 left-4 w-10 h-10 border-2 border-primary/30 rounded-full z-0"></div>
        <div className="absolute bottom-24 left-6 w-8 h-8 border-2 border-primary/25 rounded-full z-0"></div>
        <div className="absolute top-28 right-4 w-6 h-6 border border-primary/20 rounded-full z-0"></div>
        <div className="absolute bottom-28 left-10 w-4 h-4 border border-primary/15 rounded-full z-0"></div>
        
        {/* Gemstone decorative elements */}
        <div 
          className="absolute top-2 left-12 w-5 h-8 bg-primary/25 z-0"
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
          }}
        ></div>
        <div 
          className="absolute bottom-28 left-10 w-3 h-6 bg-primary/30 z-0"
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
          }}
        ></div>
        <div 
          className="absolute top-36 right-6 w-4 h-7 bg-primary/20 z-0"
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
          }}
        ></div>
        
        {/* Chain link decorative elements */}
        <div className="absolute top-40 left-8 w-12 h-2 bg-primary/20 rounded-full z-0"></div>
        <div className="absolute bottom-20 left-4 w-8 h-1 bg-primary/15 rounded-full z-0"></div>
        <div className="absolute top-44 right-8 w-6 h-1 bg-primary/25 rounded-full z-0"></div>
        
        {/* Sparkle decorative elements */}
        <div className="absolute top-14 right-4 w-2 h-2 bg-primary/40 rotate-45 z-0"></div>
        <div className="absolute bottom-18 left-14 w-1 h-1 bg-primary/50 rotate-45 z-0"></div>
        <div className="absolute top-38 right-12 w-1 h-1 bg-primary/35 rotate-45 z-0"></div>
        <div className="absolute bottom-32 right-6 w-2 h-2 bg-primary/30 rotate-45 z-0"></div>

        <p 
          className={`text-sm uppercase tracking-widest md:text-primary-dark text-white font-montserrat-medium-500 mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          Jewelry
        </p>
        <div 
          className={`md:text-[92px] sm:text-6xl text-4xl font-sorts-mill-gloudy leading-none lg:text-black text-white !font-thin transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          Shine Bright <br /> With Kiva Diamond<span className="  text-primary">.</span>
        </div>
        <p 
          className={`mt-4 text-[22px] italic font-sorts-mill-gloudy font-extralight lg:text-black-light text-white transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          Every day is your special day with our fine jewelry!
        </p>
        <div className="flex lg:justify-start justify-center">
        <IconButton className="mt-8" onClick={() => navigate("/shop")}  rightIcon={ShoppingBag}>Shop Now</IconButton>
        </div>
         {/* <Link to="/shop" 
           className={`w-fit  rounded-md mt-8 px-6 py-3 bg-primary-dark text-white font-medium hover:bg-primary transition mx-auto lg:mx-0 duration-700 ${
             isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
           }`}
           style={{ transitionDelay: '700ms' }}
         >
           — Shop
         </Link> */}
      </div>

      {/* Right Image (only visible on desktop split layout) */}
      <div className="hidden lg:flex flex-1 relative justify-center md:justify-end w-full md:w-1/2 h-full">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Jewelry-inspired decorative elements */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-12 left-8 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
          {/* Diamond-shaped accent */}
          {/* Luxury jewelry atmosphere */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-12 left-8 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
          
          {/* Real brilliant cut diamond accent */}
          <div 
            className="absolute top-16 left-16 w-12 h-12 bg-gradient-to-br from-white/30 to-primary/40"
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 100% 62%, 50% 100%, 0% 62%, 0% 38%)",
              boxShadow: "0 0 20px rgba(255,255,255,0.3), inset 0 0 10px rgba(255,255,255,0.2)"
            }}
          ></div>
          
          {/* Princess cut diamond accent */}
          <div 
            className="absolute top-24 right-20 w-8 h-8 bg-gradient-to-br from-white/25 to-primary/35 rotate-45"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              boxShadow: "0 0 15px rgba(255,255,255,0.2)"
            }}
          ></div>
          
          {/* Ring setting with prongs */}
          <div className="absolute bottom-20 right-16 w-16 h-16 border-2 border-primary/50 rounded-full blur-sm">
            <div className="absolute top-1 left-1/2 w-1 h-2 bg-primary/60 transform -translate-x-1/2"></div>
            <div className="absolute bottom-1 left-1/2 w-1 h-2 bg-primary/60 transform -translate-x-1/2"></div>
            <div className="absolute left-1 top-1/2 w-2 h-1 bg-primary/60 transform -translate-y-1/2"></div>
            <div className="absolute right-1 top-1/2 w-2 h-1 bg-primary/60 transform -translate-y-1/2"></div>
          </div>
          
          {/* Emerald cut accent */}
          <div 
            className="absolute bottom-16 left-20 w-10 h-16 bg-gradient-to-br from-white/20 to-primary/30"
            style={{
              clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              boxShadow: "0 0 12px rgba(255,255,255,0.15)"
            }}
          ></div>
          
          {/* Pear shape accent */}
          <div 
            className="absolute top-32 left-8 w-6 h-10 bg-gradient-to-br from-white/25 to-primary/35"
            style={{
              clipPath: "polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)",
              boxShadow: "0 0 10px rgba(255,255,255,0.2)"
            }}
          ></div>
          
           {/* Third Image - Left Bottom Corner (Outside Main Container) */}
           <div 
             className={`absolute bottom-[188px] -left-8 w-60 h-60 rounded-full overflow-visible shadow-lg border-2 border-white z-30 transition-all duration-1000 ${
               isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
             }`}
             style={{ transitionDelay: '600ms' }}
           >
             <img
               src={media.find(item => item.page === 'home' && item.section === 'home-banner' && item.type === 'image')?.url}
               alt="Kiva Diamond Detail"
               className="object-cover w-full h-full rounded-full"
             />
           </div>

           {/* Main image container with jewelry-inspired shape */}
           <div
             className={`relative overflow-hidden w-4/5 h-4/5 shadow-2xl rounded-t-full z-20 transition-all duration-1000 ${
               isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
             }`}
             style={{ transitionDelay: '400ms' }}
           >
             <img
               src={media.find(item => item.page === 'home' && item.section === 'home-banner' && item.type === 'image')?.url}
               alt="Kiva Diamond"
               className="object-cover w-full h-full"
             />
             {/* Jewelry-themed overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"></div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
