import React from "react";
import { Clock, Bell, Mail, Sparkles, Heart } from "lucide-react";
import { Link } from 'react-router-dom';
import AnimatedSection from "../components/home/AnimatedSection";

const Necklaces = () => {
  return (
    <div className="bg-secondary min-h-screen">
      {/* Hero Section */}
      <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="py-8 md:py-16 lg:py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
            JEWELRY COLLECTION
          </p>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
            Necklace Collection<span className="text-primary">.</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
            Discover our stunning collection of necklaces, from delicate chains to statement pieces
          </p>
          <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
        </div>
      </section>
      </AnimatedSection>

      {/* Coming Soon Section */}
      <AnimatedSection animationType="scaleIn" delay={200}>
        <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          {/* Coming Soon Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-primary-light/20 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy text-black mb-4">
              Coming Soon<span className="text-primary">.</span>
            </h2>
            <p className="text-lg md:text-xl font-montserrat-regular-400 text-black-light mb-8 max-w-2xl mx-auto">
              We're crafting something truly special for you. Our exquisite necklace collection is being carefully curated and will be available soon.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-secondary rounded-2xl">
              <div className="w-16 h-16 mx-auto bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                Handcrafted Excellence
              </h3>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                Each piece is meticulously crafted by our master jewelers using the finest materials
              </p>
            </div>

            <div className="text-center p-6 bg-secondary rounded-2xl">
              <div className="w-16 h-16 mx-auto bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                Timeless Designs
              </h3>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                From classic pearls to modern statement pieces, discover necklaces for every style
              </p>
            </div>

            <div className="text-center p-6 bg-secondary rounded-2xl">
              <div className="w-16 h-16 mx-auto bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                Exclusive Preview
              </h3>
              <p className="text-sm font-montserrat-regular-400 text-black-light">
                Be the first to know when our necklace collection launches with exclusive early access
              </p>
            </div>
          </div>

          {/* Notify Me Section */}
          <div className="bg-black text-white rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-sorts-mill-gloudy mb-4">
              Get Notified First<span className="text-primary">.</span>
            </h3>
            <p className="text-lg font-montserrat-regular-400 text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our exclusive list to be the first to see our new necklace collection and receive special launch offers.
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-black font-montserrat-regular-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-8 py-3 bg-primary text-white font-montserrat-medium-500 hover:bg-primary-dark transition-colors duration-300 rounded-lg flex items-center justify-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notify Me</span>
                </button>
              </div>
              <p className="text-xs font-montserrat-regular-400 text-gray-400 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-sorts-mill-gloudy text-black mb-8">
              What to Expect<span className="text-primary">.</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-montserrat-bold-700">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                      Collection Curation
                    </h4>
                    <p className="text-sm font-montserrat-regular-400 text-black-light">
                      Our designers are carefully selecting and creating unique necklace pieces that reflect our brand's elegance and quality standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-montserrat-bold-700">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                      Quality Assurance
                    </h4>
                    <p className="text-sm font-montserrat-regular-400 text-black-light">
                      Each necklace undergoes rigorous quality checks to ensure it meets our premium standards before reaching our customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-montserrat-bold-700">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                      Photography & Styling
                    </h4>
                    <p className="text-sm font-montserrat-regular-400 text-black-light">
                      Professional photography sessions are capturing every detail of our necklaces to showcase their beauty and craftsmanship.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-montserrat-bold-700">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                      Launch Preparation
                    </h4>
                    <p className="text-sm font-montserrat-regular-400 text-black-light">
                      Final preparations including inventory management, pricing, and website integration are underway for a seamless launch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection animationType="fadeInRight" delay={300}>
        <section className="py-16 md:py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sorts-mill-gloudy mb-6 md:mb-8">
            Explore Our Other Collections<span className="text-primary">.</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl font-montserrat-regular-400 text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            While you wait for our necklace collection, discover our beautiful rings, earrings, and bracelets
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link
              to="/rings"
              className="group bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">💍</div>
              <h3 className="text-lg font-montserrat-semibold-600 mb-2">Rings</h3>
              <p className="text-sm font-montserrat-regular-400 text-gray-300">
                Discover our exquisite ring collection
              </p>
            </Link>

            <Link
              to="/earrings"
              className="group bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">💎</div>
              <h3 className="text-lg font-montserrat-semibold-600 mb-2">Earrings</h3>
              <p className="text-sm font-montserrat-regular-400 text-gray-300">
                Browse our stunning earring collection
              </p>
            </Link>

            <Link
              to="/bracelets"
              className="group bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">📿</div>
              <h3 className="text-lg font-montserrat-semibold-600 mb-2">Bracelets</h3>
              <p className="text-sm font-montserrat-regular-400 text-gray-300">
                Explore our elegant bracelet collection
              </p>
            </Link>
          </div>
        </div>
      </section>
      </AnimatedSection>
    </div>
  );
};

export default Necklaces;
