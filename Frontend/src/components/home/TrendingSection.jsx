import React from "react";
import  Img1 from "../../assets/images/Ring-home-1.jpeg";
import  Img2 from "../../assets/images/necklace-home.jpeg";
import  Img3 from "../../assets/images/earrings-home.jpeg";
import  Img4 from "../../assets/images/bracelate-home.jpeg";
import { useNavigate } from 'react-router-dom';
import { MoveRight } from "lucide-react";
import IconButton from "../IconButton";
const TrendingSection = () => {
  const navigate = useNavigate();
  const products = [
    {
      id: 1,
      image: Img1,
      name: "Diamond Ring",
      price: "1200",
      path: "/rings",
    },
    {
      id: 2,
      image: Img4,
      name: "Sapphire Bracelet",
      price: "670",
      path: "/bracelets",
    },
     {
      id: 3,
      image: Img3,
      name: "Emerald Earrings",
      price: "450",
      path: "/earrings",
    },
    {
      id: 4,
      image: Img2,
      name: "Necklace",
      price: "980",
      path: "/necklaces",
    },
  ];

  return (
    <div className="px-6 md:px-8 xl:px-16  py-8 md:py-16 w-full">
      {/* Section Heading */}
      <div className="flex-1 flex flex-col justify-center text-center w-full">
        <p className="text-sm uppercase tracking-widest text-primary-dark font-montserrat-medium-500 mb-3">
          TRENDING
        </p>
        <div className="mt-4 md:text-[54px] sm:text-4xl text-3xl font-sorts-mill-gloudy leading-none text-black !font-thin">
          Best-Selling Items<span className="text-primary">.</span>
        </div>
        <p className="mt-8 flex m-auto w-full md:text-[22px] text-[20px] leading-1 max-w-[700px] italic font-sorts-mill-gloudy font-extralight text-black-light">
          In this section, you will find fine jewelry chosen by hundreds of our
          customers around the world. Best price guaranteed.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        {products?.map((product) => (
          <div
            key={product?.id}
            className="flex bg-white flex-col items-center text-center  p-6  shadow-sm hover:shadow-md transition"
          >
            <img
              src={product?.image}
              alt={product?.name}
              className="w-full h-80 md:object-contain rounded-md"
            />
            <div className="mt-4 text-xl font-montserrat-medium-500 text-black">
              {product?.name}
            </div>
            <div className="mt-2 text-lg font-montserrat-bold-700 text-primary">
              {/* {product.price} */}
              {/* <PriceDisplay variant="small" price={Number(product.price)} /> */}
            </div>
            <div className="flex justify-center">
              <IconButton onClick={() => navigate(product?.path)}  rightIcon={MoveRight}>Discover</IconButton>
            </div>
            {/* <button onClick={() => navigate(product?.path)} className="mt-6 px-6 py-3 bg-primary-dark text-white font-medium rounded-md hover:bg-primary transition">
              — Discover
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
