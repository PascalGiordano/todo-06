import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-150"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
