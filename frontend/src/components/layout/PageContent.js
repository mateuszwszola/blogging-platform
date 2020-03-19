import React from 'react';

const PageContent = ({ children }) => (
  <main className="min-h-screen font-sans bg-gray-100 text-gray-900 overflow-x-hidden flex flex-col flex-auto flex-shrink-0">
    {children}
  </main>
);

export default PageContent;
