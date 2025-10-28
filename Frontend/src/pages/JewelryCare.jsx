import React from 'react';
import { Sparkles, Shield, Droplet, Sun, Home, AlertTriangle } from 'lucide-react';
import Container from '../components/Container';
import { Link } from 'react-router-dom';

const JewelryCare = () => {
  const careCategories = [
    {
      icon: Sparkles,
      title: 'Daily Care',
      color: 'from-purple-500 to-purple-600',
      tips: [
        'Remove jewelry before washing hands, showering, or swimming',
        'Apply cosmetics, perfumes, and lotions before putting on jewelry',
        'Take off jewelry before exercising or doing physical activities',
        'Clean your jewelry regularly with a soft, lint-free cloth',
        'Inspect clasps and settings regularly for wear and tear',
      ]
    },
    {
      icon: Droplet,
      title: 'Cleaning Tips',
      color: 'from-blue-500 to-blue-600',
      tips: [
        'Use warm water and mild soap for most jewelry pieces',
        'Gently brush with a soft-bristled toothbrush for detailed pieces',
        'Rinse thoroughly and pat dry with a soft cloth',
        'Professional cleaning recommended every 6-12 months',
        'Avoid harsh chemicals and ultrasonic cleaners for delicate pieces',
      ]
    },
    {
      icon: Home,
      title: 'Storage',
      color: 'from-green-500 to-green-600',
      tips: [
        'Store each piece separately to prevent scratching',
        'Use soft pouches or lined jewelry boxes',
        'Keep jewelry in a cool, dry place away from sunlight',
        'Store silver in anti-tarnish bags to prevent oxidation',
        'Hang necklaces to prevent tangling',
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Things to Avoid',
      color: 'from-red-500 to-red-600',
      tips: [
        'Chlorine and harsh chemicals can damage metals and gemstones',
        'Direct sunlight can fade certain gemstones',
        'Extreme temperatures can damage delicate pieces',
        'Perfumes and hairsprays can tarnish metals',
        'Avoid wearing jewelry while sleeping or doing household chores',
      ]
    },
  ];

  const materialCare = [
    {
      material: 'Gold',
      care: [
        'Clean with warm soapy water and soft cloth',
        'Polish with a jewelry polishing cloth',
        'Store in a fabric-lined box',
        'Professional cleaning every 6-12 months',
      ],
      avoid: ['Harsh chemicals', 'Chlorine', 'Abrasive materials']
    },
    {
      material: 'Silver',
      care: [
        'Clean regularly to prevent tarnishing',
        'Use silver polishing cloth or silver cleaner',
        'Store in anti-tarnish bags',
        'Wear frequently - skin oils prevent tarnish',
      ],
      avoid: ['Rubber', 'Chlorine', 'Direct sunlight', 'Humidity']
    },
    {
      material: 'Diamonds',
      care: [
        'Clean weekly with warm soapy water',
        'Use soft brush for back of stone',
        'Professional cleaning every 6 months',
        'Check prongs and settings regularly',
      ],
      avoid: ['Oils and lotions', 'Impact and pressure', 'Harsh chemicals']
    },
    {
      material: 'Pearls',
      care: [
        'Wipe with soft, damp cloth after wearing',
        'Put on last after makeup and perfume',
        'Restring every 1-2 years if worn frequently',
        'Store separately in soft pouch',
      ],
      avoid: ['Water and moisture', 'Chemicals and perfumes', 'Ultrasonic cleaners', 'Steam cleaning']
    },
    {
      material: 'Gemstones',
      care: [
        'Clean with lukewarm water and mild soap',
        'Use soft brush for dirt in settings',
        'Dry thoroughly with soft cloth',
        'Professional inspection annually',
      ],
      avoid: ['Extreme temperature changes', 'Harsh chemicals', 'Ultrasonic cleaners (for some stones)', 'Direct impact']
    },
  ];

  const quickDos = [
    'Do remove jewelry before bed',
    'Do clean jewelry regularly',
    'Do store pieces separately',
    'Do get professional inspections',
    'Do remove before swimming or exercising',
    'Do apply cosmetics before wearing jewelry',
  ];

  const quickDonts = [
    "Don't expose to harsh chemicals",
    "Don't wear while cleaning or gardening",
    "Don't store all jewelry together",
    "Don't use paper towels (can scratch)",
    "Don't expose to extreme temperatures",
    "Don't forget to check clasps and prongs",
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <Container>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-sorts-mill-gloudy font-bold mb-4">
              Jewelry Care Guide
            </h1>
            <p className="text-xl font-montserrat-regular-400 text-white/90 max-w-2xl mx-auto">
              Keep your precious pieces sparkling for generations
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <p className="text-black-light font-montserrat-regular-400 text-lg leading-relaxed">
              Proper care ensures your jewelry maintains its beauty and value for years to come. 
              Follow these guidelines to keep your precious pieces in pristine condition.
            </p>
          </div>

          {/* Care Categories */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {careCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                      {category.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-black-light font-montserrat-regular-400">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Quick Do's and Don'ts */}
          <div className="mb-12">
            <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-6 text-center">
              Quick Do's & Don'ts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Do's */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-montserrat-semibold-600 text-green-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Do's
                </h3>
                <ul className="space-y-2">
                  {quickDos.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2 text-lg">✓</span>
                      <span className="text-green-900 font-montserrat-regular-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-montserrat-semibold-600 text-red-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Don'ts
                </h3>
                <ul className="space-y-2">
                  {quickDonts.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-600 mr-2 text-lg">✗</span>
                      <span className="text-red-900 font-montserrat-regular-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Material-Specific Care */}
          <div className="mb-12">
            <h2 className="text-3xl font-sorts-mill-gloudy font-bold text-black mb-6 text-center">
              Care by Material
            </h2>
            <div className="space-y-4">
              {materialCare.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4 flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">{item.material[0]}</span>
                    </div>
                    {item.material}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-montserrat-medium-500 text-primary mb-2">Care Instructions</h4>
                      <ul className="space-y-2">
                        {item.care.map((instruction, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span className="text-black-light font-montserrat-regular-400">{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-montserrat-medium-500 text-red-600 mb-2">Avoid</h4>
                      <ul className="space-y-2">
                        {item.avoid.map((avoid, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-red-600 mr-2">✗</span>
                            <span className="text-black-light font-montserrat-regular-400">{avoid}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Services */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white mb-12">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-sorts-mill-gloudy font-bold mb-3">
                Professional Cleaning & Maintenance
              </h2>
              <p className="font-montserrat-regular-400 text-white/90 mb-6 max-w-2xl mx-auto">
                We offer professional cleaning and inspection services to keep your jewelry looking its best. 
                Bring your pieces in for complimentary cleaning or schedule a full maintenance service.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-montserrat-semibold-600 hover:bg-gray-100 transition-colors"
              >
                Schedule Service
              </Link>
            </div>
          </div>

          {/* Emergency Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
              If Your Jewelry Gets Damaged
            </h3>
            <div className="space-y-3 text-black-light font-montserrat-regular-400">
              <p>• <strong>Lost Stone:</strong> Save the stone if found and bring it with the jewelry to us for resetting</p>
              <p>• <strong>Broken Chain/Clasp:</strong> Don't try to fix it yourself - bring it for professional repair</p>
              <p>• <strong>Tarnished Silver:</strong> Use appropriate silver cleaner or bring for professional polishing</p>
              <p>• <strong>Bent Prongs:</strong> Stop wearing immediately and get it repaired to prevent stone loss</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default JewelryCare;

