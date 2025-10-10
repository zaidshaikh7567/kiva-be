import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Package, CreditCard, RefreshCw, Shield, Truck, Heart } from 'lucide-react';
import Container from '../components/Container';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'ordering', label: 'Ordering', icon: Package },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'returns', label: 'Returns', icon: RefreshCw },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'care', label: 'Care', icon: Heart },
  ];

  const faqs = [
    {
      category: 'ordering',
      question: 'How do I place an order?',
      answer: 'Simply browse our collection, select your desired items, choose your size and quantity, and add them to your cart. When ready, proceed to checkout, fill in your shipping information, and complete the payment process. You\'ll receive a confirmation email once your order is placed.'
    },
    {
      category: 'ordering',
      question: 'Can I customize or personalize my jewelry?',
      answer: 'Yes! We offer customization services for many of our pieces. You can add engravings, choose different gemstones, or request specific metal types. Contact our customer service team to discuss your customization needs and we\'ll create a unique piece just for you.'
    },
    {
      category: 'ordering',
      question: 'What if an item is out of stock?',
      answer: 'If an item is out of stock, you can sign up for email notifications to be alerted when it becomes available again. Many pieces can also be custom-made with a 2-4 week lead time. Contact us for more information about availability and custom orders.'
    },
    {
      category: 'shipping',
      question: 'What are your shipping options?',
      answer: 'We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Overnight Shipping. All orders are fully insured and tracked. Free standard shipping is available on orders over $200.'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping times vary by location (typically 7-14 business days). Customs duties and taxes may apply depending on your country. All international orders are fully insured and trackable.'
    },
    {
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website. You can also check your order status by logging into your account dashboard.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All transactions are processed through secure, encrypted payment gateways to protect your information.'
    },
    {
      category: 'payment',
      question: 'Is it safe to use my credit card on your website?',
      answer: 'Absolutely! We use industry-standard SSL encryption to protect all transactions. We never store your complete credit card information on our servers. All payment processing is handled securely through certified payment processors.'
    },
    {
      category: 'payment',
      question: 'Do you offer payment plans or financing?',
      answer: 'Yes, we partner with financing providers to offer flexible payment plans for purchases over $500. You can choose from 3, 6, or 12-month payment options with competitive rates. The financing option will be available at checkout for eligible orders.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unworn, undamaged items in original packaging. Custom-made and personalized items cannot be returned unless defective. To initiate a return, contact our customer service team, and we\'ll provide a return shipping label.'
    },
    {
      category: 'returns',
      question: 'How do I exchange an item?',
      answer: 'To exchange an item, contact our customer service within 30 days of delivery. We\'ll arrange for the return of the original item and ship the replacement. If there\'s a price difference, we\'ll either refund or charge the difference accordingly.'
    },
    {
      category: 'returns',
      question: 'When will I receive my refund?',
      answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be issued to your original payment method. Depending on your bank, it may take an additional 3-5 business days to appear in your account.'
    },
    {
      category: 'care',
      question: 'How should I clean my jewelry?',
      answer: 'For most jewelry, use warm water with mild soap and a soft cloth or brush. Rinse thoroughly and pat dry. For specific materials like pearls or opals, use only a damp cloth. We recommend professional cleaning every 6-12 months for valuable pieces.'
    },
    {
      category: 'care',
      question: 'How should I store my jewelry?',
      answer: 'Store each piece separately in soft pouches or lined jewelry boxes to prevent scratching. Keep jewelry in a cool, dry place away from direct sunlight. Silver pieces should be stored in anti-tarnish bags to prevent oxidation.'
    },
    {
      category: 'care',
      question: 'Do you offer repair services?',
      answer: 'Yes! We offer comprehensive repair services including resizing, stone replacement, chain repair, and restoration. Contact us with details about the repair needed, and we\'ll provide a quote. Most repairs are completed within 1-2 weeks.'
    },
    {
      category: 'ordering',
      question: 'Do you offer gift wrapping?',
      answer: 'Yes! All our jewelry comes in elegant gift boxes at no extra charge. We also offer premium gift wrapping with personalized messages for a small fee. Select the gift wrapping option during checkout.'
    },
    {
      category: 'ordering',
      question: 'Can I buy a gift certificate?',
      answer: 'Absolutely! Gift certificates are available in any denomination and can be purchased on our website. They\'re delivered via email and never expire, making them the perfect gift for any jewelry lover.'
    },
    {
      category: 'care',
      question: 'How often should I get my jewelry professionally inspected?',
      answer: 'We recommend having valuable pieces professionally inspected annually. This helps catch issues like loose stones, worn prongs, or damaged clasps before they become serious problems. We offer complimentary inspections for all jewelry purchased from us.'
    },
    {
      category: 'shipping',
      question: 'Is my shipment insured?',
      answer: 'Yes, all shipments are fully insured against loss, theft, or damage during transit at no additional cost to you. In the unlikely event of an issue, we\'ll work with you to resolve it quickly, either with a replacement or full refund.'
    },
    {
      category: 'payment',
      question: 'Can I use multiple payment methods for one order?',
      answer: 'Currently, each order can only be paid with one payment method. However, if you\'re using a gift certificate, you can apply it first and then pay the remaining balance with your preferred payment method.'
    },
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <Container>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-sorts-mill-gloudy font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl font-montserrat-regular-400 text-white/90 max-w-2xl mx-auto">
              Find answers to common questions about our jewelry and services
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-lg font-montserrat-semibold-600 text-black mb-4">Filter by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setOpenIndex(null);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-montserrat-medium-500 transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-black-light border border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-montserrat-semibold-600 text-black pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-2">
                    <p className="text-black-light font-montserrat-regular-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 text-center">
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
        </div>
      </Container>
    </div>
  );
};

export default FAQ;

