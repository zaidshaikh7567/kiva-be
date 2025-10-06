import React from 'react';
import { Users } from 'lucide-react';

const Customers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sorts-mill-gloudy font-bold text-black">Customers</h1>
        <p className="font-montserrat-regular-400 text-black-light">Manage your customer database</p>
      </div>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-sorts-mill-gloudy font-bold text-black mb-2">Customers Coming Soon</h3>
        <p className="font-montserrat-regular-400 text-black-light">Customer management features will be integrated next</p>
      </div>
    </div>
  );
};

export default Customers;
