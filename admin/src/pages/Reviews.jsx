import React from 'react';
import { Star } from 'lucide-react';

const Reviews = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Reviews</h1>
        <p className="font-montserrat-regular-400 text-black-light">Manage customer reviews and ratings</p>
      </div>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">Reviews Coming Soon</h3>
        <p className="font-montserrat-regular-400 text-black-light">Review management features will be integrated next</p>
      </div>
    </div>
  );
};

export default Reviews;
