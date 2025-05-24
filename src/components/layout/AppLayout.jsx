import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Assure-toi que lucide-react est installé

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-deep-blue text-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-deep-blue/70 backdrop-filter backdrop-blur-lg border-b border-gray-700/50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white font-poppins transition-transform duration-300 ease-in-out hover:scale-105 group">
            Todo<span className="text-bright-blue group-hover:text-vibrant-purple transition-colors duration-300 ease-in-out">Ultra</span>
          </Link>
          {/* Desktop Nav for App */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            {/* Placeholder pour un futur lien Paramètres */}
            {/* <Link to="/settings" className="text-gray-300 hover:text-white transition-colors">Paramètres</Link> */}
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Menu className="text-white cursor-pointer" size={28} onClick={toggleMobileMenu} />
          </div>
        </div>
        {/* Mobile Menu Dropdown for App */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 bg-deep-blue/90 backdrop-filter backdrop-blur-lg shadow-lg rounded-b-lg border-x border-b border-gray-700/50 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link to="/dashboard" className="text-gray-200 hover:text-white transition-colors" onClick={toggleMobileMenu}>Dashboard</Link>
            {/* <Link to="/settings" className="text-gray-200 hover:text-white transition-colors" onClick={toggleMobileMenu}>Paramètres</Link> */}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow pt-20 container mx-auto"> {/* pt-20 pour navbar fixe, ajout de container mx-auto */}
        <Outlet /> {/* Le contenu des routes enfants sera rendu ici */}
      </main>
    </div>
  );
};

export default AppLayout;
