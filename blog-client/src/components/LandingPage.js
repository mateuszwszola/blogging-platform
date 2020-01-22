import React from 'react';
import { Header } from './layout/Header';
import { ArrowDownIcon } from '../Icons';

function LandingPage() {
  return (
    <div className="h-screen bg-gray-900 text-gray-100 relative">
      <Header />
      <div className="absolute bottom-0 left-0 text-center w-full flex justify-center mb-4">
        <ArrowDownIcon className="w-6 h-6 fill-current text-gray-600" />
      </div>
    </div>
  );
}

export default LandingPage;
