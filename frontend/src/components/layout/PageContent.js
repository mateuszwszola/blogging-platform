import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const PageContent = ({ children }) => (
  <>
    <Header />
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-auto flex-shrink-0 font-sans bg-gray-100 text-gray-900 overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  </>
);

export default PageContent;
