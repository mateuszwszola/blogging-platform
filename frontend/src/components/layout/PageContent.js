import React from 'react';

const PageContent = ({ children }) => (
  <div className="font-sans bg-gray-100 text-gray-900 overflow-x-hidden flex flex-col min-h-screen">
    {children}
  </div>
);

export default PageContent;
