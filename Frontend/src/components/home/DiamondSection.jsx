import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Gem } from "lucide-react";

const DiamondSection = () => {
  const diamondTypes = [
    {
      id: 1,
      title: "Lab Grown Diamonds",
      description:
        "Ethically created diamonds with the same brilliance and quality as natural diamonds, offering exceptional value and sustainability.",
      icon: Sparkles,
      link: "/lab-grown",
      gradient: "from-primary to-primary-dark",
      bgColor: "bg-primary-light",
    },
    {
      id: 2,
      title: "Natural Diamonds",
      description:
        "Rare and timeless natural diamonds, formed over billions of years, representing the ultimate symbol of luxury and elegance.",
      icon: Gem,
      link: "/natural-diamond",
      gradient: "from-primary-dark to-primary",
      bgColor: "bg-primary-light",
    },
  ];

  return (
    <section className="px-6 md:px-8 xl:px-16 py-12 md:py-20 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy text-black mb-4">
            Discover Our Diamond Collection
          </h2>
          <div className="border-b-2 border-primary w-16 md:w-24 mx-auto mb-4"></div>
          <p className="text-base md:text-lg font-montserrat-regular-400 text-black-light max-w-2xl mx-auto">
            Choose from our exquisite selection of lab grown and natural diamonds, each crafted to perfection
          </p>
        </div>

        {/* Diamond Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch">
          {diamondTypes.map((diamond) => {
            const IconComponent = diamond.icon;
            return (
              <Link
                key={diamond.id}
                to={diamond.link}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col"
              >
                {/* Background Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${diamond.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative p-8 md:p-10 lg:p-12 flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${diamond.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-sorts-mill-gloudy text-black text-center mb-4 group-hover:text-primary transition-colors duration-300">
                    {diamond.title}
                  </h3>

                  {/* Divider */}
                  <div className="border-b-2 border-primary w-12 mx-auto mb-6"></div>

                  {/* Description */}
                  <p className="text-base md:text-lg font-montserrat-regular-400 text-black-light text-center mb-8 leading-relaxed flex-grow">
                    {diamond.description}
                  </p>

                  {/* Button - Pushed to bottom */}
                  <div className="flex justify-center mt-auto">
                    <div className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-montserrat-medium-500 text-base md:text-lg group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                      Explore Collection
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-primary/5 rounded-full blur-lg group-hover:bg-primary/10 transition-colors duration-300"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DiamondSection;

