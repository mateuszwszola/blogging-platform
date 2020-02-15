import React from 'react';
import bloggingImg from '../../img/undraw_blogging.svg';
import devFocusImg from '../../img/undraw_dev_focus.svg';
import teamSpiritImg from '../../img/undraw_team_spirit.svg';

const About = () => (
  <main className="bg-gray-100">
    <div className="py-8 px-6 max-w-6xl mx-auto">
      <h2 className="capitalize text-3xl text-center my-8">How it works?</h2>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center py-12 md:py-16">
        <img className="max-w-sm" src={bloggingImg} alt="blogging" />
        <div className="text-center mt-4 md:mt-0 leading-loose md:mx-6 md:max-w-lg md:text-lg">
          Blogging about what you just learned, your ideas and things you are
          interested in it's a good way to improve yourself. Blogging Platform
          is a place to help you create space where you can share your
          creativity
        </div>
      </div>
      <div className="flex flex-col md:flex-row-reverse md:justify-between md:items-center py-12 md:py-16">
        <img className="max-w-sm" src={devFocusImg} alt="blogging" />
        <div className="text-center mt-4 md:mt-0 leading-loose md:mx-6 md:max-w-lg md:text-lg">
          The process is simple. Create an account, a blog, give it a name, and
          start writing your posts!
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center py-12 md:py-16">
        <img className="max-w-sm" src={teamSpiritImg} alt="blogging" />
        <div className="text-center mt-4 md:mt-0 leading-loose md:mx-6 md:max-w-lg md:text-lg">
          Explore other bloggers, search by topics you are interested the most
          about, and enjoy!
        </div>
      </div>
    </div>
  </main>
);

export default About;
