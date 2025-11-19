import React from 'react';
import { RefreshCw, CheckCircle, XCircle, Package, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import Container from '../components/Container';
import { Link } from 'react-router-dom';

const ReturnsExchanges = () => {
  const EMAIL_URL = import.meta.env.VITE_EMAIL_URL;
  const returnSteps = [
    {
      step: 1,
      title: 'Contact Us',
      description: 'Email or call our customer service within 30 days of receiving your order',
      time: 'Within 30 days'
    },
    {
      step: 2,
      title: 'Get Authorization',
      description: 'Receive a Return Authorization (RA) number and prepaid shipping label',
      time: '1 business day'
    },
    {
      step: 3,
      title: 'Pack & Ship',
      description: 'Pack item securely in original packaging and ship with provided label',
      time: 'At your convenience'
    },
    {
      step: 4,
      title: 'Inspection',
      description: 'We inspect the returned item to ensure it meets return conditions',
      time: '2-3 business days'
    },
    {
      step: 5,
      title: 'Refund Processed',
      description: 'Refund issued to original payment method',
      time: '5-7 business days'
    },
  ];

  const eligibleItems = [
    'Unworn jewelry in original condition',
    'Items with original tags and packaging',
    'Non-personalized, non-engraved pieces',
    'Products without signs of wear or damage',
    'Items returned within 30 days of delivery',
  ];

  const nonEligibleItems = [
    'Custom-made or personalized jewelry',
    'Engraved items',
    'Earrings (for hygiene reasons)',
    'Items worn or showing signs of wear',
    'Products without original packaging',
    'Items purchased on final sale',
  ];

  const exchangeReasons = [
    {
      icon: RefreshCw,
      title: 'Wrong Size',
      description: 'We\'ll exchange for the correct size at no additional cost',
    },
    {
      icon: Package,
      title: 'Different Style',
      description: 'Exchange for a different item. Price difference will be charged or refunded',
    },
    {
      icon: AlertTriangle,
      title: 'Defective Item',
      description: 'Immediate replacement or full refund for any manufacturing defects',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <Container>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-sorts-mill-gloudy font-bold mb-4">
              Returns & Exchanges
            </h1>
            <p className="text-xl font-montserrat-regular-400 text-white/90 max-w-2xl mx-auto">
              Your satisfaction is our priority. Easy returns and hassle-free exchanges.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* 30-Day Guarantee */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center mb-12">
            <CheckCircle className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-3xl font-sorts-mill-gloudy font-bold mb-2">
              30-Day Money-Back Guarantee
            </h2>
            <p className="font-montserrat-regular-400 text-white/90 text-lg">
              Not completely satisfied? Return unworn items within 30 days for a full refund.
            </p>
          </div>

          {/* Return Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-6">
              How to Return an Item
            </h2>
            <div className="space-y-4">
              {returnSteps.map((step) => (
                <div key={step.step} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <span className="text-white font-montserrat-bold text-xl">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-montserrat-semibold-600 text-black">
                          {step.title}
                        </h3>
                        <span className="text-sm font-montserrat-medium-500 text-primary bg-primary-light px-3 py-1 rounded-full">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-black-light font-montserrat-regular-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligible vs Non-Eligible */}
          <div className="mb-12">
            <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-6">
              Return Eligibility
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Eligible */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-montserrat-semibold-600 text-green-900">
                    Eligible for Return
                  </h3>
                </div>
                <ul className="space-y-2">
                  {eligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2 text-lg">✓</span>
                      <span className="text-green-900 font-montserrat-regular-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Eligible */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <XCircle className="w-6 h-6 text-red-600 mr-2" />
                  <h3 className="text-xl font-montserrat-semibold-600 text-red-900">
                    Not Eligible for Return
                  </h3>
                </div>
                <ul className="space-y-2">
                  {nonEligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-600 mr-2 text-lg">✗</span>
                      <span className="text-red-900 font-montserrat-regular-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="mb-12">
            <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-6">
              Exchange Policy
            </h2>
            <p className="text-black-light font-montserrat-regular-400 mb-6 text-lg">
              Need a different size, style, or color? We make exchanges easy and convenient.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {exchangeReasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-black-light font-montserrat-regular-400 text-sm">
                      {reason.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exchange Process */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-6">
              How Exchanges Work
            </h2>
            <div className="space-y-4 text-black-light font-montserrat-regular-400">
              <p>
                <strong>1. Contact Us:</strong> Reach out within 30 days with your order number and exchange request
              </p>
              <p>
                <strong>2. Return Original:</strong> We'll provide a prepaid shipping label to return the original item
              </p>
              <p>
                <strong>3. Receive Replacement:</strong> Once we receive the return, we'll ship your exchange item
              </p>
              <p>
                <strong>4. Price Adjustments:</strong> If the exchange item costs more, we'll charge the difference. 
                If it costs less, we'll refund the difference to your original payment method.
              </p>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <div className="flex items-center mb-6">
              <DollarSign className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                Refund Information
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-montserrat-semibold-600 text-black mb-3">Processing Time</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• Items inspected within 2-3 business days of receipt</li>
                  <li>• Refund processed within 5-7 business days</li>
                  <li>• Bank processing may take additional 3-5 days</li>
                  <li>• Email notification when refund is issued</li>
                </ul>
              </div>
              <div>
                <h3 className="font-montserrat-semibold-600 text-black mb-3">Refund Method</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• Refunded to original payment method</li>
                  <li>• Gift card purchases refunded as store credit</li>
                  <li>• Shipping costs refunded for defective items</li>
                  <li>• Original shipping not refunded for change of mind</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Defective Items */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-12">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-montserrat-semibold-600 text-red-900 mb-3">
                  Received a Defective or Damaged Item?
                </h3>
                <div className="space-y-2 text-red-900 font-montserrat-regular-400">
                  <p>
                    We sincerely apologize if you received a defective or damaged item. Please contact us immediately:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Contact us within 48 hours of delivery</li>
                    <li>• Provide photos of the defect or damage</li>
                    <li>• We'll arrange immediate replacement or full refund</li>
                    <li>• Prepaid return shipping label provided</li>
                    <li>• Original shipping costs fully refunded</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Return Shipping */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-6">
              Return Shipping
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-montserrat-semibold-600 text-primary mb-3">Domestic Returns (USA)</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• Free prepaid return shipping label provided</li>
                  <li>• Drop off at any authorized carrier location</li>
                  <li>• Tracking number included</li>
                  <li>• Fully insured during return transit</li>
                </ul>
              </div>
              <div>
                <h3 className="font-montserrat-semibold-600 text-primary mb-3">International Returns</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• Return shipping responsibility varies by country</li>
                  <li>• Contact us for return instructions</li>
                  <li>• May incur customs fees on return</li>
                  <li>• Original duties/taxes are non-refundable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Store Credit Option */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-sorts-mill-gloudy font-bold mb-3">
                Prefer Store Credit?
              </h2>
              <p className="font-montserrat-regular-400 text-white/90 mb-4">
                Get an extra 10% bonus when you choose store credit instead of a refund!
              </p>
              <p className="text-sm font-montserrat-regular-400 text-white/80">
                Store credit never expires and can be used on any future purchase.
              </p>
            </div>
          </div>

          {/* Special Circumstances */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-6">
              Special Circumstances
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                  Lost or Stolen Packages
                </h3>
                <p className="text-black-light font-montserrat-regular-400">
                  If your package is marked as delivered but you didn't receive it, contact us within 7 days. 
                  We'll file a claim with the carrier and arrange for a replacement or refund once the investigation is complete.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                  Wrong Item Received
                </h3>
                <p className="text-black-light font-montserrat-regular-400">
                  If you receive the wrong item, contact us immediately. We'll arrange for the correct item to be shipped 
                  at no additional cost and provide a prepaid label to return the incorrect item.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                  Warranty Claims
                </h3>
                <p className="text-black-light font-montserrat-regular-400">
                  Manufacturing defects discovered after the 30-day return window may be covered by our lifetime warranty. 
                  Contact us with details and photos for warranty evaluation and repair or replacement options.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12">
            <h3 className="text-xl font-montserrat-semibold-600 text-blue-900 mb-4">
              Important Notes
            </h3>
            <ul className="space-y-2 text-blue-900 font-montserrat-regular-400">
              <li>• All returns require a Return Authorization (RA) number</li>
              <li>• Items must be returned in original condition and packaging</li>
              <li>• Refunds are processed after inspection of returned items</li>
              <li>• Sale or clearance items may have different return policies (stated at purchase)</li>
              <li>• Custom orders require 50% non-refundable deposit</li>
              <li>• Exchanges are subject to product availability</li>
            </ul>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-6">
              Common Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-montserrat-semibold-600 text-black mb-2">
                  Do I have to pay for return shipping?
                </h3>
                <p className="text-black-light font-montserrat-regular-400">
                  No! We provide a free prepaid return shipping label for all domestic returns. 
                  For defective items, we cover return shipping worldwide.
                </p>
              </div>
              <div>
                <h3 className="font-montserrat-semibold-600 text-black mb-2">
                  How long does it take to get my refund?
                </h3>
                <p className="text-black-light font-montserrat-regular-400">
                  Once we receive and inspect your return (2-3 business days), we process the refund within 5-7 business days. 
                  Your bank may take an additional 3-5 days to reflect the credit in your account.
                </p>
              </div>
              <div>
                <h3 className="font-montserrat-semibold-600 text-black mb-2">
                  Can I exchange for a different product?
                </h3>
                <p className="text-black-light font-montserrat-regular-400">
                  Absolutely! You can exchange for any item on our website. If there's a price difference, 
                  we'll either charge or refund the difference accordingly.
                </p>
              </div>
              <div>
                <h3 className="font-montserrat-semibold-600 text-black mb-2">
                  What if my item arrives damaged?
                </h3>
                <p className="text-black-light font-montserrat-regular-400">
                  Contact us immediately with photos of the damage. We'll send a replacement right away 
                  and provide a prepaid label for the damaged item. No need to wait for the return to be processed.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
            <RefreshCw className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold mb-3">
              Need to Start a Return or Exchange?
            </h2>
            <p className="font-montserrat-regular-400 text-white/90 mb-6 max-w-2xl mx-auto">
              Our customer service team is ready to help you with your return or exchange.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                hretof="/contact"
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-montserrat-semibold-600 hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href={`mailto:${EMAIL_URL}`}
                className="inline-block bg-white/20 text-white border-2 border-white px-8 py-3 rounded-lg font-montserrat-semibold-600 hover:bg-white/30 transition-colors"
              >
                Email Returns Team
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ReturnsExchanges;

