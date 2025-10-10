import React, { useState } from 'react';
import { Ruler, Info, Circle, Move } from 'lucide-react';
import Container from '../components/Container';

const SizeGuide = () => {
  const [selectedTab, setSelectedTab] = useState('rings');

  // Ring size chart data
  const ringSizes = {
    us: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    circumference: [46.8, 48.0, 49.3, 50.6, 51.9, 53.1, 54.4, 55.7, 57.0, 58.3, 59.5, 60.8, 62.1, 63.4, 64.6, 65.9, 67.2],
    diameter: [14.9, 15.3, 15.7, 16.1, 16.5, 16.9, 17.3, 17.7, 18.2, 18.6, 19.0, 19.4, 19.8, 20.2, 20.6, 21.0, 21.4]
  };

  // Bracelet sizes
  const braceletSizes = [
    { size: 'XS', wrist: '5.5" - 6"', length: '6.5"', cm: '14 - 15.2 cm' },
    { size: 'S', wrist: '6" - 6.5"', length: '7"', cm: '15.2 - 16.5 cm' },
    { size: 'M', wrist: '6.5" - 7"', length: '7.5"', cm: '16.5 - 17.8 cm' },
    { size: 'L', wrist: '7" - 7.5"', length: '8"', cm: '17.8 - 19 cm' },
    { size: 'XL', wrist: '7.5" - 8"', length: '8.5"', cm: '19 - 20.3 cm' },
  ];

  // Necklace lengths
  const necklaceLengths = [
    { length: '14"', name: 'Collar', description: 'Sits high on neck, formal look' },
    { length: '16"', name: 'Choker', description: 'Sits at base of neck, most popular' },
    { length: '18"', name: 'Princess', description: 'Falls just below throat, versatile' },
    { length: '20"', name: 'Matinee', description: 'Falls at or above cleavage' },
    { length: '24"', name: 'Opera', description: 'Falls at or below cleavage' },
    { length: '30"+', name: 'Rope', description: 'Falls below bust line, dramatic' },
  ];

  // Earring types
  const earringTypes = [
    { type: 'Stud', size: '3-8mm', description: 'Classic and versatile for everyday wear' },
    { type: 'Hoop', size: '10-60mm', description: 'Small (10-20mm), Medium (20-40mm), Large (40mm+)' },
    { type: 'Drop', size: '15-50mm', description: 'Hangs below earlobe, elegant look' },
    { type: 'Dangle', size: '20-70mm', description: 'Moves freely, statement piece' },
  ];

  const tabs = [
    { id: 'rings', label: 'Rings', icon: Circle },
    { id: 'bracelets', label: 'Bracelets', icon: Circle },
    { id: 'necklaces', label: 'Necklaces', icon: Circle },
    { id: 'earrings', label: 'Earrings', icon: Circle },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <Container>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Ruler className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-sorts-mill-gloudy font-bold mb-4">
              Size Guide
            </h1>
            <p className="text-xl font-montserrat-regular-400 text-white/90 max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive sizing guide
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Info Alert */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-montserrat-medium-500 text-blue-900">
                  Need help finding your size?
                </p>
                <p className="text-sm font-montserrat-regular-400 text-blue-800 mt-1">
                  Contact our customer service team for personalized assistance. We're here to help you find the perfect fit!
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-montserrat-medium-500 transition-all duration-300 border-b-2 ${
                    selectedTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-black-light hover:text-black hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Rings Tab */}
          {selectedTab === 'rings' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-4">
                  Ring Size Guide
                </h2>
                <p className="text-black-light font-montserrat-regular-400 mb-6">
                  Find your perfect ring size using our conversion chart or measure your finger at home.
                </p>
              </div>

              {/* How to Measure */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4 flex items-center">
                  <Move className="w-5 h-5 mr-2 text-primary" />
                  How to Measure Your Ring Size
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-montserrat-medium-500 text-black mb-2">Method 1: Using a Ring</h4>
                    <ol className="list-decimal list-inside space-y-2 text-black-light font-montserrat-regular-400">
                      <li>Take a ring that fits the desired finger</li>
                      <li>Measure the inside diameter in millimeters</li>
                      <li>Match it to the chart below</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-montserrat-medium-500 text-black mb-2">Method 2: Using String</h4>
                    <ol className="list-decimal list-inside space-y-2 text-black-light font-montserrat-regular-400">
                      <li>Wrap string around the base of your finger</li>
                      <li>Mark where the string overlaps</li>
                      <li>Measure the length in millimeters</li>
                      <li>Find the circumference in the chart below</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Ring Size Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">US Size</th>
                        <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">Circumference (mm)</th>
                        <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">Diameter (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {ringSizes.us.map((size, index) => (
                        <tr key={size} className="hover:bg-primary-light/20 transition-colors">
                          <td className="px-6 py-3 font-montserrat-medium-500 text-black">{size}</td>
                          <td className="px-6 py-3 font-montserrat-regular-400 text-black-light">{ringSizes.circumference[index]} mm</td>
                          <td className="px-6 py-3 font-montserrat-regular-400 text-black-light">{ringSizes.diameter[index]} mm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Pro Tips</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• Measure your finger at the end of the day when it's at its largest</li>
                  <li>• Fingers can vary in size on each hand - measure the specific finger you'll wear the ring on</li>
                  <li>• If you're between sizes, choose the larger size</li>
                  <li>• Wide bands (6mm+) may require going up half a size for comfort</li>
                </ul>
              </div>
            </div>
          )}

          {/* Bracelets Tab */}
          {selectedTab === 'bracelets' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-4">
                  Bracelet Size Guide
                </h2>
                <p className="text-black-light font-montserrat-regular-400 mb-6">
                  Choose the right bracelet size for a comfortable, elegant fit.
                </p>
              </div>

              {/* How to Measure Wrist */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4 flex items-center">
                  <Move className="w-5 h-5 mr-2 text-primary" />
                  How to Measure Your Wrist
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-black-light font-montserrat-regular-400">
                  <li>Use a flexible measuring tape or string</li>
                  <li>Wrap it around your wrist bone (where you'd wear the bracelet)</li>
                  <li>Note the measurement in inches</li>
                  <li>Add 0.5" to 1" for a comfortable fit (depending on how loose you prefer)</li>
                  <li>Match your measurement to the chart below</li>
                </ol>
              </div>

              {/* Bracelet Size Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">Size</th>
                        <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">Wrist Measurement</th>
                        <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">Bracelet Length</th>
                        <th className="px-6 py-4 text-left text-sm font-montserrat-semibold-600">CM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {braceletSizes.map((size) => (
                        <tr key={size.size} className="hover:bg-primary-light/20 transition-colors">
                          <td className="px-6 py-3 font-montserrat-semibold-600 text-black">{size.size}</td>
                          <td className="px-6 py-3 font-montserrat-regular-400 text-black-light">{size.wrist}</td>
                          <td className="px-6 py-3 font-montserrat-regular-400 text-black-light">{size.length}</td>
                          <td className="px-6 py-3 font-montserrat-regular-400 text-black-light">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Pro Tips</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• For a snug fit, add 0.5" to your wrist measurement</li>
                  <li>• For a loose fit, add 1" to your wrist measurement</li>
                  <li>• Charm bracelets typically fit better with extra room (add 1-1.5")</li>
                  <li>• Bangles should slide over your hand - measure the widest part</li>
                </ul>
              </div>
            </div>
          )}

          {/* Necklaces Tab */}
          {selectedTab === 'necklaces' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-4">
                  Necklace Length Guide
                </h2>
                <p className="text-black-light font-montserrat-regular-400 mb-6">
                  Different necklace lengths create different looks. Find the perfect length for your style.
                </p>
              </div>

              {/* Visual Guide */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="max-w-md mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=600&fit=crop" 
                    alt="Necklace length guide"
                    className="w-full rounded-lg mb-6 object-cover"
                  />
                  <p className="text-center text-sm text-black-light font-montserrat-regular-400">
                    Visual representation of different necklace lengths
                  </p>
                </div>
              </div>

              {/* Necklace Length Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                {necklaceLengths.map((necklace) => (
                  <div key={necklace.length} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-montserrat-semibold-600 text-black">{necklace.name}</h3>
                      <span className="px-3 py-1 bg-primary text-white text-sm rounded-full font-montserrat-medium-500">
                        {necklace.length}
                      </span>
                    </div>
                    <p className="text-black-light font-montserrat-regular-400">{necklace.description}</p>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Styling Tips</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• Layer different lengths for a trendy, personalized look</li>
                  <li>• Consider your neckline: V-necks pair well with princess length</li>
                  <li>• Pendants look best with 18" or longer chains</li>
                  <li>• If unsure, 18" (princess length) is the most versatile choice</li>
                </ul>
              </div>
            </div>
          )}

          {/* Earrings Tab */}
          {selectedTab === 'earrings' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-4">
                  Earring Size Guide
                </h2>
                <p className="text-black-light font-montserrat-regular-400 mb-6">
                  Understanding earring sizes helps you choose the perfect style for any occasion.
                </p>
              </div>

              {/* Earring Types */}
              <div className="grid md:grid-cols-2 gap-6">
                {earringTypes.map((earring) => (
                  <div key={earring.type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-montserrat-semibold-600 text-black">{earring.type}</h3>
                      <span className="px-3 py-1 bg-primary-light text-primary text-sm rounded-full font-montserrat-medium-500">
                        {earring.size}
                      </span>
                    </div>
                    <p className="text-black-light font-montserrat-regular-400">{earring.description}</p>
                  </div>
                ))}
              </div>

              {/* Stud Size Reference */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-montserrat-semibold-600 text-black mb-4">Stud Earring Size Reference</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { mm: '3mm', description: 'Subtle' },
                    { mm: '4-5mm', description: 'Classic' },
                    { mm: '6-7mm', description: 'Noticeable' },
                    { mm: '8mm+', description: 'Statement' },
                  ].map((item) => (
                    <div key={item.mm} className="text-center p-4 bg-primary-light/10 rounded-lg">
                      <div className="font-montserrat-semibold-600 text-primary text-lg mb-1">{item.mm}</div>
                      <div className="text-sm text-black-light font-montserrat-regular-400">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="text-lg font-montserrat-semibold-600 text-black mb-3">Selection Tips</h3>
                <ul className="space-y-2 text-black-light font-montserrat-regular-400">
                  <li>• Consider your face shape: Round faces suit longer drop earrings</li>
                  <li>• Small studs (3-5mm) are perfect for everyday professional wear</li>
                  <li>• Hoops 20-30mm are versatile for most occasions</li>
                  <li>• Larger earrings work best with simpler hairstyles</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="pb-12">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold mb-3">
              Still Need Help?
            </h2>
            <p className="font-montserrat-regular-400 text-white/90 mb-6 max-w-2xl mx-auto">
              Our jewelry experts are here to help you find the perfect size. Contact us for personalized assistance.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-montserrat-semibold-600 hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SizeGuide;

