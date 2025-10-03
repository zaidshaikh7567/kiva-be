import React from "react";
import collection from "../../assets/images/collection-img.avif";

const Collection = () => {
  return (
    <div className="md:pl-16 lg:pl-32  py-[100px] overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* left section */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left h-full relative z-10 px-4 md:px-0">
          <p className="text-sm uppercase tracking-widest md:text-primary-dark text-primary-dark font-montserrat-medium-500 mb-3">
            COLLECTION
          </p>
          <div className="md:text-[92px] sm:text-6xl text-4xl font-sorts-mill-gloudy leading-none md:text-black text-primary-dark !font-thin">
            Our Youth <br className="md:flex hidden" /> Collection on <br />
            Sale Now<span className="text-primary">.</span>
          </div>
          <div className="mt-[14px] text-[20px] italic font-sorts-mill-gloudy font-extralight text-black-light">
            from <span className="text-primary-dark">$199</span> | shop the{" "}
            <span className="text-primary-dark">limited</span> edition
          </div>

          <p className="mt-[14px] text-[16px] md:text-[20px] font-montserrat-regular-400 text-black-light max-w-[600px] mx-auto md:mx-0">
            This collection was created while thinking about youth and purity.
            Trendy gold chains in bracelets and necklaces look very delicate.
            The entire collection is very light, airy, and is a great fit for
            any occasion.
          </p>
          <button className="w-fit mt-8 px-6 py-3 bg-primary-dark text-white font-medium hover:bg-primary transition mx-auto md:mx-0">
            — Discover the collection
          </button>
        </div>

        {/* Right section */}
        <div className="hidden flex-1 h-full relative md:flex items-center justify-center mt-10 md:mt-0">
          {/* Oval Background behind the image */}
          <div className="absolute w-full h-[250px] sm:w-full sm:h-[300px] md:w-full md:h-[350px] lg:w-full lg:h-[400px] bg-primary-light "></div>

          {/* Image in front */}
          <img
            src={collection}
            alt="collection"
            className="relative z-10 max-w-[80%] h-[600px] sm:max-w-[70%] md:max-w-[500px] lg:max-w-[600px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Collection;
