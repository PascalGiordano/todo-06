import React from 'react';
import { Check } from 'lucide-react';

const PricingCard = ({ planName, price, features, ctaText = "Choisir ce plan", isFeatured = false }) => {
  const cardClasses = `
    p-6 rounded-lg transform transition-all duration-300 hover:scale-105
    ${isFeatured 
      ? 'bg-gradient-to-br from-vibrant-purple to-bright-blue text-white shadow-xl hover:shadow-2xl' 
      : 'bg-deep-blue/80 backdrop-filter backdrop-blur-md border border-gray-700/50 shadow-lg' 
    }
  `;
  const buttonClasses = `
    w-full py-3 mt-6 font-semibold rounded-lg transition-all duration-300
    ${isFeatured 
      ? 'bg-white text-vibrant-purple hover:bg-gray-200 active:scale-95' 
      : 'bg-vibrant-purple hover:bg-bright-blue text-white active:scale-95'
    }
  `;

  return (
    <div className={cardClasses}>
      <h3 className={`text-2xl font-bold mb-4 ${isFeatured ? 'text-white' : 'text-bright-blue'}`}>{planName}</h3> {/* Updated non-featured color to bright-blue */}
      <p className="text-4xl font-bold mb-1">
        {price}
        <span className={`text-sm font-normal ${isFeatured ? 'text-gray-200' : 'text-gray-400'}`}>/mois</span>
      </p>
      <p className={`mb-6 text-xs ${isFeatured ? 'text-gray-200' : 'text-gray-400'}`}>Facturé annuellement</p>
      
      <ul className="space-y-2 mb-6 text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check size={18} className={`mr-2 ${isFeatured ? 'text-green-300' : 'text-green-400'}`} /> {/* Assuming green-300 and green-400 are defined or default Tailwind */}
            {feature}
          </li>
        ))}
      </ul>
      <button className={buttonClasses}>
        {ctaText}
      </button>
    </div>
  );
};

export default PricingCard;
