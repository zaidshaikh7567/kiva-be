import React from "react";
import Set from "../../assets/icon/gold.svg";
import Gems from "../../assets/icon/gems.svg";
import Designer from "../../assets/icon/designer.svg";

const SubHeroSection = () => {
  // 🔹 Dynamic data
  const features = [
    {
      id: 1,
      icon: Gems,
      title: "Gems and Natural Stones",
      description:
        "We use precious and semi-precious stones: diamonds, emeralds, sapphires, etc. and also work with Swarovski crystals.",
    },
    {
      id: 2,
      icon: Set,
      title: "Gold & Precious Metals",
      description:
        "Our jewelry is crafted from the finest gold, platinum, and other premium metals to ensure timeless elegance.",
    },
    {
      id: 3,
      icon: Designer,
      title: "Exclusive Designer Touch",
      description:
        "We create exquisite fine jewelry. Each collection has a soul and a certain message that resonates in the hearts of our customers.",
    },
  ];

  return (
    <div className="px-6 md:px-8 xl:px-16 py-8 md:py-16">
      <div className="grid md:grid-cols-3  lg:gap-32 gap-8">
        {features.map((item) => (
          <div key={item.id} className="flex flex-col items-center text-center">
            <img src={item.icon} alt={item.title} className="w-[100px] h-[100px]" />
            <p className="mt-4 text-[26px] font-sorts-mill-gloudy text-black">
              {item.title}
            </p>
            <div className="border-b-2 border-primary w-[40px] my-2"></div>
            <p className="text-[16px] font-montserrat-regular-400 text-black-light ">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubHeroSection;
