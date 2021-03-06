import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Alert from 'components/Alert';

const PageContent = ({ children }) => (
  <>
    <Header />
    <Alert />
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-auto flex-shrink-0 font-sans bg-gray-100 text-gray-900 text-sm sm:text-base">
        {children}
      </main>
      <Footer />
    </div>
  </>
);

export default PageContent;
