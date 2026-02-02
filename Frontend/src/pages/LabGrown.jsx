import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts, selectProductsLoading } from '../store/slices/productsSlice';
import ShopProductCard from '../components/ShopProductCard';
import CustomDropdown from '../components/CustomDropdown';
import AnimatedSection from '../components/home/AnimatedSection';
import { Sparkles, Leaf, DollarSign, Award, Heart } from 'lucide-react';
import { SORT_OPTIONS } from '../constants';

const LabGrown = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);

  const [sortBy, setSortBy] = useState('newest');

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 1000, reset: true }));
  }, [dispatch]);

  // Filter products for lab grown diamonds
  // This filters products that contain "lab grown" or "lab-grown" in title, description, or subDescription
  const labGrownProducts = useMemo(() => {
    return products.filter(product => {
      const title = product.title?.toLowerCase() || '';
      const description = typeof product.description === 'string' 
        ? product.description.toLowerCase() 
        : JSON.stringify(product.description || {}).toLowerCase();
      const subDescription = product.subDescription?.toLowerCase() || '';
      
      return title.includes('lab grown') || 
             title.includes('lab-grown') ||
             description.includes('lab grown') ||
             description.includes('lab-grown') ||
             subDescription.includes('lab grown') ||
             subDescription.includes('lab-grown');
    });
  }, [products]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...labGrownProducts];
    
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
  }, [labGrownProducts, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="py-8 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-light flex items-center justify-center">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-montserrat-medium-500 mb-3 md:mb-4">
              LAB GROWN DIAMONDS
            </p>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-sorts-mill-gloudy leading-tight mb-3 md:mb-6 text-black">
              Lab Grown Diamonds <span className="text-primary">.</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl font-montserrat-regular-400 mb-4 md:mb-8 max-w-2xl mx-auto text-black-light px-2 md:px-4">
              Discover our exquisite collection of lab grown diamonds. Ethically created with the same brilliance and quality as natural diamonds, offering exceptional value and sustainability.
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
                  What Are Lab Grown Diamonds?
                </h2>
                <div className="space-y-4 text-base md:text-lg font-montserrat-regular-400 text-black-light leading-relaxed">
                  <p>
                    Lab grown diamonds are real diamonds created in a controlled laboratory environment using advanced technological processes that replicate the natural conditions under which diamonds form in the earth.
                  </p>
                  <p>
                    These diamonds have the same physical, chemical, and optical properties as natural diamonds, including the same crystal structure, hardness, and brilliance. The only difference is their origin.
                  </p>
                  <p>
                    Lab grown diamonds are certified by the same gemological laboratories that certify natural diamonds, ensuring they meet the highest standards of quality and authenticity.
                  </p>
                </div>
              </div>
              <div className="bg-secondary rounded-2xl p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-sorts-mill-gloudy text-black mb-6">
                  Key Benefits
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Leaf, text: 'Environmentally friendly and sustainable' },
                    { icon: DollarSign, text: 'Exceptional value - typically 30-40% less expensive' },
                    { icon: Award, text: 'Same quality and brilliance as natural diamonds' },
                    { icon: Heart, text: 'Ethically sourced with no mining concerns' }
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

      {/* Quality & Certification Section */}
      <AnimatedSection animationType="fadeInUp" delay={300}>
        <section className="py-12 md:py-16 lg:py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-sorts-mill-gloudy text-black mb-4">
                Quality & Certification
              </h2>
              <div className="w-16 md:w-24 h-1 bg-primary mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: '4C Standards',
                  description: 'Lab grown diamonds are graded using the same 4C standards (Cut, Color, Clarity, Carat) as natural diamonds, ensuring consistent quality assessment.'
                },
                {
                  title: 'Gemological Certification',
                  description: 'Each lab grown diamond comes with certification from recognized gemological laboratories, providing assurance of authenticity and quality.'
                },
                {
                  title: 'Indistinguishable Beauty',
                  description: 'To the naked eye and even under magnification, lab grown diamonds are virtually indistinguishable from natural diamonds, offering the same stunning beauty.'
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
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              No lab grown diamond products found
            </p>
            <p className="text-base font-montserrat-regular-400 text-black-light">
              Check back soon for our latest lab grown diamond collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabGrown;

