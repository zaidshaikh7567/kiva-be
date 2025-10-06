import React from 'react';
import { Heart } from 'lucide-react';

const Favorites = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Favorites</h1>
        <p className="font-montserrat-regular-400 text-black-light">Track customer favorite items</p>
      </div>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">Favorites Coming Soon</h3>
        <p className="font-montserrat-regular-400 text-black-light">Favorites management features will be integrated next</p>
      </div>
    </div>
  );
};

export default Favorites;
