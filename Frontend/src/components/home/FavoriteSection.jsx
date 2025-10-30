import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Rings from "../../assets/images/category-1.png";
import Summar from "../../assets/images/summar.webp";
import OvalVideo from "../../assets/video/oval-video.mp4";
import { fetchCategories } from "../../store/slices/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { MoveRight } from "lucide-react";
const FavoriteSection = () => {
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter to only show parent categories (those without a parent)
  const parentCategories =
    categories?.filter((category) => !category.parent) || [];

  // Format categories for display
  const displayCategoriesFormatted = parentCategories.map((category) => ({
    title: category.name,
    image: category.image, // Use the image directly from API
    link: `/shop?category=${category.name.toLowerCase()}`,
  }));
  return (
    <>
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
          {loading && (
            <div className="col-span-full text-center">
              Loading categories...
            </div>
          )}
          {error && (
            <div className="col-span-full text-center text-red-500">
              Error loading categories: {error}
            </div>
          )}
          {displayCategoriesFormatted.map((item, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden cursor-pointer"
            >
              {/* Background image */}
              <div
                className="h-[500px] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>

              {/* Overlay - Always visible on mobile, hover on desktop */}
              <div
                className="absolute font-sorts-mill-gloudy inset-0 flex flex-col items-center justify-center 
                      bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100
                      transition-opacity duration-500 
                      pointer-events-auto"
              >
                <h3 className="text-white text-[54px] mb-2 capitalize">
                  {item.title}
                </h3>
                <Link
                  to={item.link}
                  className="mt-2 px-6 py-3 bg-primary-dark text-white font-medium rounded-md hover:bg-primary transition"
                >
                  — Discover
                </Link>
              </div>

              {/* Title - Only visible on desktop until hover */}
              <h3
                className="absolute inset-0 font-sorts-mill-gloudy hidden items-center justify-center 
                      text-white text-[54px] font-medium 
                      pointer-events-none capitalize
                      md:flex md:group-hover:opacity-0 transition-opacity duration-500"
              >
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* <div className="mt-[50px] relative h-[500px]">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Summar})` }}
        ></div>


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
      </div> */}
      </div>

      {/* Video and Text Section */}
      <div className="my-8 px-6 md:px-16 xl:px-32 md:py-16 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-12">
          {/* Left Side - Large Video */}
          <div className="w-full lg:w-[55%]">
            <div className="relative h-[600px]  overflow-hidden shadow-lg">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={OvalVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="w-full lg:w-[35%] flex flex-col justify-center space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary-dark font-montserrat-medium-500 mb-3">
                RADIATE BEAUTY WITH BRACELETS
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy leading-tight text-black font-thin mb-4">
                A Symbol Of Love, Beauty, And Sophistication
                <span className="text-primary">.</span>
              </h2>
              <p className="text-lg md:text-xl font-sorts-mill-gloudy font-extralight text-black-light leading-relaxed">
                Gracefully Wrapped Around Your Wrist
              </p>
            </div>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Each bracelet in our collection is crafted to embody timeless
              elegance and effortless charm. Whether adorned with sparkling
              diamonds or polished metals, our designs celebrate individuality,
              capturing the delicate balance between modern artistry and classic
              sophistication. Perfect for every occasion — from everyday
              radiance to unforgettable moments.
            </p>

            <div className="pt-4">
              <Link
                to="/bracelets"
                className="inline-flex uppercase items-center px-8 py-4 bg-primary-dark text-white font-medium rounded-md hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">Know More</span>
                <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Elegant Banner Section - Image with Circular Text */}
      <div className="px-6 md:px-16 xl:px-32 py-8 md:py-16 w-full bg-[#F5F1E8]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* LEFT SIDE - IMAGE WITH CURVED TEXT */}
          <div className="w-full lg:w-[70%] xl:w-[50%] 2xl:w-[35%] relative">
            <div className="relative rounded-tl-full rounded-tr-full overflow-hidden shadow-2xl h-full min-h-[700px] bg-white">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${Summar})` }}
              ></div>

              {/* Curved Top Text */}
              {/* <div className="absolute inset-0 flex items-start justify-center -translate-y-12 pointer-events-none">
              <svg
                className="w-[95%] h-[95%] mt-[-10px]"
                viewBox="0 0 500 500"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                 
                  <path
                    id="topArc"
                      d="M70,250 A180,180 0 0,1 430,250"
                    fill="none"
                  />
                </defs>
                <text
                  fill="white"
                  fontSize="30"
                  fontFamily="'Georgia', 'serif'"
                  fontWeight="500"
                  letterSpacing="2"
                  textAnchor="middle"
                  style={{
                    textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                  }}
                >
                  <textPath href="#topArc" startOffset="50%">
                    Where Beauty And Love Intertwine Perfectly
                  </textPath>
                </text>
              </svg>
            </div> */}

              {/* Circular Shop Now Button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <Link
                  to="/earrings"
                  className="flex items-center justify-center w-28 h-28 md:w-32 md:h-32 bg-white/80 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
                >
                  <div className="text-center leading-tight">
                    <span className="block text-black font-semibold text-sm uppercase tracking-wide">
                      Shop
                    </span>
                    <span className="block text-black font-semibold text-sm uppercase tracking-wide">
                      Now
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - TEXT CONTENT */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center bg-[#F5F1E8] pl-0 lg:pl-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black font-montserrat-medium-500">
              Timeless Earings Treasures
            </p>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy text-black leading-tight font-normal mt-4">
              Unleash Your Style With Our Unique Earings
              <span className="text-primary">.</span>
            </h2>

            <p className="text-base md:text-lg text-black-light leading-relaxed font-montserrat-regular-400 max-w-[600px] mt-6">
              Earings are a great way to add a touch of elegance to your outfit.
              They are also a great way to add a touch of elegance to your
              outfit.
            </p>

            <div className="pt-6">
              <Link
                to="/earrings"
                className="inline-flex items-center px-8 py-4 bg-primary-dark text-white font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="mr-3 uppercase tracking-wide">Shop Now</span>
                <MoveRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FavoriteSection;
