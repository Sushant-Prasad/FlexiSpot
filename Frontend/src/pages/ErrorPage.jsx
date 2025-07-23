import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
