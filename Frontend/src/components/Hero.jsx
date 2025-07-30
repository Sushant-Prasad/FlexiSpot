
import React from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white text-center py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
          Transform the Way You Work
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Smart desk reservations and seamless scheduling for modern workplaces.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition"
        >
          <FaSignInAlt />
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default Hero;
