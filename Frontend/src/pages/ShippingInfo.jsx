import React from 'react';
import { Truck, Package, MapPin, Clock, DollarSign, Globe, Shield } from 'lucide-react';
import Container from '../components/Container';
import { Link } from 'react-router-dom';

const ShippingInfo = () => {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      time: '5-7 Business Days',
      cost: 'Free on orders $200+, otherwise $9.99',
      icon: Truck,
      color: 'from-blue-500 to-blue-600',
      features: ['Trackable', 'Fully Insured', 'Signature not required']
    },
    {
      name: 'Express Shipping',
      time: '2-3 Business Days',
      cost: '$19.99',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      features: ['Trackable', 'Fully Insured', 'Signature required']
    },
    {
      name: 'Overnight Shipping',
      time: '1 Business Day',
      cost: '$34.99',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      features: ['Trackable', 'Fully Insured', 'Signature required', 'Next-day delivery']
    },
  ];

  const internationalZones = [
    { zone: 'Canada', time: '7-10 Business Days', cost: '$24.99' },
    { zone: 'Mexico', time: '10-14 Business Days', cost: '$29.99' },
    { zone: 'Europe', time: '10-14 Business Days', cost: '$39.99' },
    { zone: 'Asia', time: '12-18 Business Days', cost: '$44.99' },
    { zone: 'Australia/NZ', time: '12-18 Business Days', cost: '$44.99' },
    { zone: 'Rest of World', time: '14-21 Business Days', cost: '$49.99' },
  ];

  const processingInfo = [
    {
      title: 'In-Stock Items',
      time: '1-2 Business Days',
      description: 'Items currently in stock are processed and shipped within 1-2 business days of order placement.'
    },
    {
      title: 'Made-to-Order Items',
      time: '1-2 Weeks',
      description: 'Custom and personalized pieces require additional production time. We\'ll keep you updated throughout the process.'
    },
    {
      title: 'Engraved Items',
      time: '3-5 Business Days',
      description: 'Items requiring engraving need extra processing time before shipping.'
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
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-sorts-mill-gloudy font-bold mb-4">
              Shipping Information
            </h1>
            <p className="text-xl font-montserrat-regular-400 text-white/90 max-w-2xl mx-auto">
              Fast, secure, and fully insured delivery to your door
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Free Shipping Banner */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center mb-8">
            <DollarSign className="w-10 h-10 mx-auto mb-2" />
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold mb-2">
              Free Standard Shipping
            </h2>
            <p className="font-montserrat-regular-400 text-white/90">
              On all orders over $200 within the continental United States
            </p>
          </div>

          {/* Domestic Shipping Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-6">
              Domestic Shipping (USA)
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {shippingOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-montserrat-semibold-600 text-black mb-2">
                      {option.name}
                    </h3>
                    <div className="mb-4">
                      <p className="text-2xl font-sorts-mill-gloudy font-bold text-primary mb-1">
                        {option.time}
                      </p>
                      <p className="text-black-light font-montserrat-medium-500">
                        {option.cost}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          <span className="text-black-light font-montserrat-regular-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Processing Times */}
          <div className="mb-12">
            <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-6">
              Order Processing Time
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {processingInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                    {info.title}
                  </h3>
                  <p className="text-2xl font-sorts-mill-gloudy font-bold text-primary mb-3">
                    {info.time}
                  </p>
                  <p className="text-black-light font-montserrat-regular-400 text-sm">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* International Shipping */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Globe className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black">
                International Shipping
              </h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">Region</th>
                      <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">Delivery Time</th>
                      <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">Shipping Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {internationalZones.map((zone, index) => (
                      <tr key={index} className="hover:bg-primary-light/20 transition-colors">
                        <td className="px-6 py-4 font-montserrat-medium-500 text-black">{zone.zone}</td>
                        <td className="px-6 py-4 font-montserrat-regular-400 text-black-light">{zone.time}</td>
                        <td className="px-6 py-4 font-montserrat-semibold-600 text-primary">{zone.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-montserrat-regular-400 text-blue-900">
                <strong>Note:</strong> International customers are responsible for any customs duties, taxes, or import fees. 
                Delivery times may vary due to customs processing. All international shipments are fully tracked and insured.
              </p>
            </div>
          </div>

          {/* Tracking */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <MapPin className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black">
                Order Tracking
              </h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-black-light font-montserrat-regular-400 leading-relaxed mb-4">
                Track your order every step of the way:
              </p>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-montserrat-semibold-600">1</span>
                  <div>
                    <h3 className="font-montserrat-semibold-600 text-black">Order Confirmation</h3>
                    <p className="text-black-light font-montserrat-regular-400 text-sm">You'll receive an email confirming your order details</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-montserrat-semibold-600">2</span>
                  <div>
                    <h3 className="font-montserrat-semibold-600 text-black">Processing</h3>
                    <p className="text-black-light font-montserrat-regular-400 text-sm">Your order is being prepared for shipment</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-montserrat-semibold-600">3</span>
                  <div>
                    <h3 className="font-montserrat-semibold-600 text-black">Shipped</h3>
                    <p className="text-black-light font-montserrat-regular-400 text-sm">You'll receive a tracking number via email</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-montserrat-semibold-600">4</span>
                  <div>
                    <h3 className="font-montserrat-semibold-600 text-black">Delivered</h3>
                    <p className="text-black-light font-montserrat-regular-400 text-sm">Your beautiful jewelry arrives at your door</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Security & Insurance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                Security & Insurance
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-montserrat-semibold-600 text-black mb-3">Package Security</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• All packages shipped in discreet, unmarked boxes</li>
                  <li>• No indication of jewelry contents on exterior</li>
                  <li>• Tamper-evident sealing for added security</li>
                  <li>• GPS tracking available on all shipments</li>
                </ul>
              </div>
              <div>
                <h3 className="font-montserrat-semibold-600 text-black mb-3">Insurance Coverage</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• Full value insurance on all orders</li>
                  <li>• No additional insurance fees</li>
                  <li>• Immediate replacement or refund if lost/damaged</li>
                  <li>• Claims processed within 48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Delivery Issues */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">
              What If There's a Delivery Issue?
            </h3>
            <div className="space-y-3 text-black-light font-montserrat-regular-400">
              <p><strong>Package Not Received:</strong> Contact us immediately if your tracking shows delivered but you haven't received it. We'll investigate with the carrier and resolve the issue within 48 hours.</p>
              <p><strong>Damaged Package:</strong> Inspect your package upon delivery. If damaged, document it with photos and contact us within 24 hours for a replacement or refund.</p>
              <p><strong>Wrong Address:</strong> If you provided an incorrect address, contact us immediately. We may be able to redirect the package. Address changes after shipping may incur additional fees.</p>
              <p><strong>Delivery Delays:</strong> While rare, delays can occur due to weather or carrier issues. Check tracking for updates, and contact us if your package is significantly delayed.</p>
            </div>
          </div>

          {/* PO Boxes and Restrictions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-4">
              Shipping Restrictions
            </h2>
            <div className="space-y-4 text-black-light font-montserrat-regular-400">
              <p>
                <strong>PO Boxes:</strong> We can ship to PO Boxes for standard shipping only. Express and Overnight 
                shipments require a physical address due to signature requirements.
              </p>
              <p>
                <strong>APO/FPO/DPO Addresses:</strong> We're proud to ship to military addresses worldwide. Processing 
                and delivery times may vary. Please allow additional time for international military addresses.
              </p>
              <p>
                <strong>Restricted Locations:</strong> We cannot ship to certain locations due to carrier restrictions 
                or regulatory limitations. If your area is restricted, you'll be notified during checkout.
              </p>
            </div>
          </div>

          {/* Holiday Shipping */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-12">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-4">
              Holiday Shipping Deadlines
            </h2>
            <p className="text-black-light font-montserrat-regular-400 mb-4">
              Order by these dates to ensure delivery by major holidays:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-montserrat-semibold-600 text-black mb-1">Standard Shipping</h3>
                <p className="text-sm text-black-light font-montserrat-regular-400">Order 10 business days before the holiday</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-montserrat-semibold-600 text-black mb-1">Express Shipping</h3>
                <p className="text-sm text-black-light font-montserrat-regular-400">Order 5 business days before the holiday</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-montserrat-regular-400 text-blue-900">
                <strong>Note:</strong> Holiday deadlines are subject to change based on carrier schedules. 
                We recommend ordering early to ensure timely delivery during peak seasons.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold mb-3">
              Questions About Shipping?
            </h2>
            <p className="font-montserrat-regular-400 text-white/90 mb-6 max-w-2xl mx-auto">
              Our customer service team is here to help with any shipping questions or concerns.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-montserrat-semibold-600 hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShippingInfo;

