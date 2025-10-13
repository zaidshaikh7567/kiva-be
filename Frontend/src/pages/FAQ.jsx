import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Plus, Minus } from 'lucide-react';
import Container from '../components/Container';
import faq1 from '../assets/images/product-10.png';
import faq2 from '../assets/images/product-6.png';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // First FAQ open by default

  const faqs = [
    {
      question: 'Where do you ship to?',
      answer: 'We ship worldwide. To get info about shipping methods and delivery price and time, please contact our support.'
    },
    {
      question: 'How can I make the order?',
      answer: 'Simply browse our collection, select your desired items, choose your size and quantity, and add them to your cart. When ready, proceed to checkout, fill in your shipping information, and complete the payment process.'
    },
    {
      question: 'Can I change my order after it is placed?',
      answer: 'You can modify your order within 24 hours of placement by contacting our customer service team. After that, changes may not be possible as production begins.'
    },
    {
      question: 'Do you have offline stores?',
      answer: 'We currently operate as an online-only jewelry store, but we offer virtual consultations and can arrange private viewings for special pieces.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order within 24 hours of placement. For custom-made pieces, cancellation may not be possible once production has begun.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-16 lg:py-24">
          {/* Desktop Layout */}
          <div className="grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
            {/* Left Column - FAQ Content */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="max-w-2xl">
                {/* Header */}
                <div className="mb-12">
                  <span className="text-sm font-montserrat-medium-500 text-primary uppercase tracking-wider">
                    FAQ
                  </span>
                  <h1 className="text-4xl xl:text-5xl font-sorts-mill-gloudy font-bold text-black mt-2 mb-4">
                    Need Help<span className="text-primary">?</span>
                  </h1>
                  <p className="text-lg text-black/70 font-montserrat-regular-400 italic">
                    If you have any questions, feel free to contact us in any convenient way.
                  </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-0">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                      >
                        <span className="text-lg font-montserrat-semibold-600 text-black pr-4">
                          {faq.question}
                        </span>
                        <div className="relative w-5 h-5 flex-shrink-0">
                          <Plus 
                            className={`absolute inset-0 w-5 h-5 text-black transition-all duration-300 ease-in-out ${
                              openIndex === index 
                                ? 'opacity-0 rotate-90 scale-0' 
                                : 'opacity-100 rotate-0 scale-100'
                            }`}
                          />
                          <Minus 
                            className={`absolute inset-0 w-5 h-5 text-black transition-all duration-300 ease-in-out ${
                              openIndex === index 
                                ? 'opacity-100 rotate-0 scale-100' 
                                : 'opacity-0 -rotate-90 scale-0'
                            }`}
                          />
                        </div>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openIndex === index 
                            ? 'max-h-96 opacity-100' 
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="pb-6">
                          <p className="text-black/80 font-montserrat-regular-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="lg:col-span-5 xl:col-span-4 relative">
              <div className="relative h-[600px] xl:h-[700px]">
                {/* Background W Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[200px] xl:text-[250px] font-bold text-white/20 select-none">
                    W
                  </div>
                </div>

                {/* Top Image */}
                <div className="absolute top-0 right-0 w-64 xl:w-72 h-80 xl:h-96 transform rotate-3 border border-gray-200 shadow-lg">
                  <img
                    src={faq1}
                    alt="Jewelry Collection"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bottom Image */}
                <div className="absolute bottom-0 left-0 w-72 xl:w-80 h-96 xl:h-[400px] transform -rotate-2 border border-gray-200 shadow-lg">
                  <img
                    src={faq2}
                    alt="Jewelry Details"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* FAQ Accordion */}
            {/* <div className="space-y-0 mb-8">
              {faqs.slice(2, 5).map((faq, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index + 2)}
                    className="w-full py-4 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <span className="text-base font-montserrat-semibold-600 text-black pr-4">
                      {faq.question}
                    </span>
                    <div className="relative w-4 h-4 flex-shrink-0">
                      <Plus 
                        className={`absolute inset-0 w-4 h-4 text-black transition-all duration-300 ease-in-out ${
                          openIndex === index + 2 
                            ? 'opacity-0 rotate-90 scale-0' 
                            : 'opacity-100 rotate-0 scale-100'
                        }`}
                      />
                      <Minus 
                        className={`absolute inset-0 w-4 h-4 text-black transition-all duration-300 ease-in-out ${
                          openIndex === index + 2 
                            ? 'opacity-100 rotate-0 scale-100' 
                            : 'opacity-0 -rotate-90 scale-0'
                        }`}
                      />
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index + 2 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pb-4">
                      <p className="text-black/80 font-montserrat-regular-400 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Mobile Images */}
            {/* <div className="relative h-64">
              Top Left Image
              <div className="absolute top-0 right-0 w-64 xl:w-72 h-80 xl:h-96 transform rotate-3 border border-gray-200 shadow-lg">
                  <img
                    src={faq1}
                    alt="Jewelry Collection"
                    className="w-full h-full object-cover"
                  />
                </div>

                Bottom Image
                <div className="absolute bottom-0 left-0 w-72 xl:w-80 h-96 xl:h-[400px] transform -rotate-2 border border-gray-200 shadow-lg">
                  <img
                    src={faq2}
                    alt="Jewelry Details"
                    className="w-full h-full object-cover"
                  />
                </div>
            </div> */}
          </div>
        </div>
        <div className="my-12 text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-3">
                Still Have Questions?
              </h2>
              <p className="text-black-light font-montserrat-regular-400 mb-6 max-w-xl mx-auto">
                Can't find the answer you're looking for? Our customer service team is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-montserrat-semibold-600 hover:bg-primary-dark transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="tel:+15551234567"
                  className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-montserrat-semibold-600 hover:bg-primary-light transition-colors"
                >
                  Call +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
      </Container>
    </div>
  );
};

export default FAQ;

