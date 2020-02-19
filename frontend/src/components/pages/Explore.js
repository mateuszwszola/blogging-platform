import React from 'react';
import profileImg from '../../img/undraw_profile.svg';
import { Footer } from '../layout/Footer';

function Explore() {
  const cards = Array(10)
    .fill({})
    .map((el, idx) => (
      <div
        key={idx}
        className="bg-gray-200 shadow w-full mt-4 md:mx-2 md:max-w-sm py-4 px-2 flex items-center rounded"
      >
        <img src={profileImg} alt="profile" className="w-20 h-20" />
        <div className="ml-4">
          <h3 className="text-lg font-medium">Name</h3>
          <p>Description</p>
        </div>
      </div>
    ));
  return (
    <>
      <main className="bg-gray-100 font-sans">
        <div className="py-32">
          <h2 className="text-center text-3xl font-light">Explore Blogs</h2>

          <div className="px-4 py-2 mt-4">
            <div className="flex flex-col items-center md:justify-center md:flex-wrap md:flex-row max-w-screen-xl mx-auto">
              {cards}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Explore;
