import React from 'react';

const Widget = ({ title, children, className = '' }) => {
  return (
    <div 
      className={`bg-dark-slate/60 backdrop-filter backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg p-4 md:p-6 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-poppins font-semibold text-white mb-4">
          {title}
        </h2>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};

export default Widget;
