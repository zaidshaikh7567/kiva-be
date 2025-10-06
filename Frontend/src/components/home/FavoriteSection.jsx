import React from "react";
import { Link } from "react-router-dom";
import Necklaces from "../../assets/images/category-2.png";
import Bracelets from "../../assets/images/category-3.png";
import Rings from "../../assets/images/category-1.png";
import Earrings from "../../assets/images/category-4.png";
import Summar from "../../assets/images/summar.webp";

const FavoriteSection = () => {
  const categories = [
  
    {
      title: "Rings",
      image: Rings, // replace with real image
      link: "/rings",
    },
    {
      title: "Earrings",
      image: Earrings, // replace with real image
      link: "/earrings",
    },
    {
      title: "Bracelets",
      image: Bracelets, // replace with real image
      link: "/bracelets",
    },
    {
      title: "Necklaces",
      image: Necklaces, // replace with real image
      link: "/necklaces",
    },
  ];
  return (
    <div className="px-6 md:px-16  xl:px-32  py-8 md:py-16 w-full">
      <div className="flex-1 flex flex-col justify-center text-center w-full">
        <p className="text-sm uppercase tracking-widest text-primary-dark font-montserrat-medium-500 mb-3">
          CATEGORIES
        </p>
        <div className="mt-4 md:text-[54px] sm:text-4xl text-3xl font-sorts-mill-gloudy leading-none text-black !font-thin">
          Choose Your Favorites<span className="text-primary">.</span>
        </div>
        <p className="mt-8 flex  justify-center m-auto w-full md:text-[22px] text-[20px] leading-1 max-w-[700px] italic font-sorts-mill-gloudy font-extralight text-black-light">
          Choose the fine jewelry that you will shine in tomorrow.
        </p>
      </div>
      {/* Category Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((item, idx) => (
         <div
         key={idx}
         className="relative group overflow-hidden cursor-pointer"
       >
         {/* Background image */}
         <div
           className="h-[500px] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
           style={{ backgroundImage: `url(${item.image})` }}
         ></div>
       
         {/* Overlay */}
         <div
           className="absolute font-sorts-mill-gloudy inset-0 flex flex-col items-center justify-center 
                      bg-black/40 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-500 
                      pointer-events-none group-hover:pointer-events-auto"
         >
           <h3 className="text-white text-[54px] mb-2">{item.title}</h3>
           <Link
             to={item.link}
             className="mt-2 px-6 py-3 bg-primary-dark text-white font-medium rounded-md hover:bg-primary transition"
           >
             — Discover
           </Link>
         </div>
       
         {/* Title before hover */}
         <h3
           className="absolute inset-0 font-sorts-mill-gloudy flex items-center justify-center 
                      text-white text-[54px] font-medium 
                      group-hover:opacity-0 transition-opacity duration-500 
                      pointer-events-none"
         >
           {item.title}
         </h3>
       </div>
       
        ))}
      </div>

      <div className="mt-[50px] relative h-[500px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Summar})` }}
        ></div>

        {/* Overlay text */}
        <div className="absolute left-8 top-[20%] text-left max-w-[600px]">
          <p className="text-sm uppercase tracking-widest text-primary-dark font-montserrat-medium-500 mb-3">
            SUMMER 2025
          </p>
          <div className="mt-2 md:text-[54px] sm:text-4xl text-3xl font-sorts-mill-gloudy leading-none text-black !font-thin">
            Aurora Prom Set<span className="text-primary">.</span>
          </div>
          <p className="mt-6 md:text-[22px] text-[18px] italic font-sorts-mill-gloudy font-extralight text-black-light">
            Perfect match with:
          </p>
          <img
            src={Rings}
            className="h-[120px] w-[120px] rounded-full border-[3px] border-primary-light mt-3"
          />
          <p className="mt-6 md:text-[18px] text-[18px] italic font-sorts-mill-gloudy font-extralight text-black-light">
            <span className="text-primary">* </span>Full set for{" "}
            <span className="text-primary md:text-[22px] text-[18px]">
              $699
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoriteSection;
