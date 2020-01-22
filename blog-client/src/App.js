import React from 'react';
import PageContent from './components/layout/PageContent';
import LandingPage from './components/LandingPage';
import About from './components/About';

function App() {
  return (
    <>
      <PageContent>
        <LandingPage />
        <About />
      </PageContent>
    </>
  );
}

export default App;
