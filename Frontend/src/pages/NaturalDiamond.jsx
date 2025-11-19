import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts, selectProductsLoading } from '../store/slices/productsSlice';
import ShopProductCard from '../components/ShopProductCard';
import CustomDropdown from '../components/CustomDropdown';
import AnimatedSection from '../components/home/AnimatedSection';
import { Gem, Crown, Clock, Award, Sparkles } from 'lucide-react';
import { SORT_OPTIONS } from '../constants';

const NaturalDiamond = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);

  const [sortBy, setSortBy] = useState('newest');

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 100, reset: true }));
  }, [dispatch]);

  // Filter products for natural diamonds
  // This filters products that contain "natural" in title, description, or subDescription
  // and excludes "lab grown" or "lab-grown"
  const naturalDiamondProducts = useMemo(() => {
    return products.filter(product => {
      const title = product.title?.toLowerCase() || '';
      const description = typeof product.description === 'string' 
        ? product.description.toLowerCase() 
        : JSON.stringify(product.description || {}).toLowerCase();
      const subDescription = product.subDescription?.toLowerCase() || '';
      
      const hasNatural = title.includes('natural') || 
                        description.includes('natural') ||
                        subDescription.includes('natural');
      
      const hasLabGrown = title.includes('lab grown') || 
                         title.includes('lab-grown') ||
                         description.includes('lab grown') ||
                         description.includes('lab-grown') ||
                         subDescription.includes('lab grown') ||
                         subDescription.includes('lab-grown');
      
      // Include if it has "natural" and doesn't have "lab grown"
      // Or if it has "diamond" and doesn't have "lab grown" (assuming natural by default)
      return (hasNatural && !hasLabGrown) || 
             (title.includes('diamond') && !hasLabGrown && !hasNatural);
    });
  }, [products]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...naturalDiamondProducts];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
        break;
    }
    
    return sorted;
  }, [naturalDiamondProducts, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="py-8 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-light flex items-center justify-center">
                <Gem className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
              NATURAL DIAMONDS
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
              Natural Diamonds <span className="text-primary">.</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
              Explore our rare and timeless collection of natural diamonds. Formed over billions of years, these diamonds represent the ultimate symbol of luxury and elegance.
            </p>
            <div className="w-12 md:w-24 h-1 bg-primary mx-auto"></div>
          </div>
        </section>
      </AnimatedSection>

      {/* Information Section */}
      <AnimatedSection animationType="fadeInUp" delay={200}>
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-sorts-mill-gloudy text-black mb-6">
                  The Timeless Beauty of Natural Diamonds
                </h2>
                <div className="space-y-4 text-base md:text-lg font-montserrat-regular-400 text-black-light leading-relaxed">
                  <p>
                    Natural diamonds are formed deep within the Earth's mantle over billions of years under extreme pressure and temperature conditions. Each diamond is a unique creation of nature, carrying with it millions of years of geological history.
                  </p>
                  <p>
                    These rare gems have been treasured for centuries as symbols of love, commitment, and luxury. Their natural origin and unique characteristics make each natural diamond truly one-of-a-kind.
                  </p>
                  <p>
                    Natural diamonds represent the pinnacle of luxury and are considered the ultimate investment in fine jewelry, with their value often appreciating over time.
                  </p>
                </div>
              </div>
              <div className="bg-secondary rounded-2xl p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-sorts-mill-gloudy text-black mb-6">
                  Why Choose Natural Diamonds?
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Crown, text: 'Rare and unique - each diamond is one-of-a-kind' },
                    { icon: Clock, text: 'Formed over billions of years in nature' },
                    { icon: Award, text: 'Traditional symbol of luxury and prestige' },
                    { icon: Sparkles, text: 'Potential for value appreciation over time' }
                  ].map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 mt-1">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-base font-montserrat-regular-400 text-black-light">
                          {benefit.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Quality & Heritage Section */}
      <AnimatedSection animationType="fadeInUp" delay={300}>
        <section className="py-12 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-sorts-mill-gloudy text-black mb-4">
                Quality & Heritage
              </h2>
              <div className="w-16 md:w-24 h-1 bg-primary mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: '4C Certification',
                  description: 'Every natural diamond is carefully graded using the 4C standards (Cut, Color, Clarity, Carat) by certified gemologists, ensuring you receive a diamond of exceptional quality.'
                },
                {
                  title: 'Natural Origin',
                  description: 'Each natural diamond carries a unique fingerprint of its geological journey, making it a truly one-of-a-kind treasure formed by nature over millions of years.'
                },
                {
                  title: 'Investment Value',
                  description: 'Natural diamonds have a long history of maintaining and appreciating in value, making them not just beautiful jewelry but also a meaningful investment for generations to come.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl md:text-2xl font-sorts-mill-gloudy text-black mb-4">
                    {item.title}
                  </h3>
                  <p className="text-base font-montserrat-regular-400 text-black-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Products Section */}
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Filters and Sort */}
        <div className="sm:flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-8 w-full">
          <div className="text-sm font-montserrat-regular-400 text-black-light w-full sm:pb-0 pb-4">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </div>
          
          <div className="flex items-center gap-4 w-full justify-end">
            <CustomDropdown
              options={SORT_OPTIONS.CATEGORY}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="sm:w-[200px] w-full"
            />
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <AnimatedSection key={product._id} animationType="fadeInUp" delay={100}>
                <ShopProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-montserrat-medium-500 text-black-light mb-4">
              No natural diamond products found
            </p>
            <p className="text-base font-montserrat-regular-400 text-black-light">
              Check back soon for our latest natural diamond collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NaturalDiamond;

