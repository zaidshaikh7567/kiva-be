import React from 'react';
import CurrencyTest from '../components/CurrencyTest';

const CurrencyTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Currency Conversion Test</h1>
          <CurrencyTest />
        </div>
      </div>
    </div>
  );
};

export default CurrencyTestPage;
