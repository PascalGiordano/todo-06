import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Added Link import
import PricingCard from '../components/PricingCard';
import { Menu, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const LandingPageWrapper = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-deep-blue text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-deep-blue/70 backdrop-filter backdrop-blur-lg border-b border-gray-700/50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white font-poppins transition-transform duration-300 ease-in-out hover:scale-105 group">
            Todo<span className="text-bright-blue group-hover:text-vibrant-purple transition-colors duration-300 ease-in-out">Ultra</span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            <a href="#hero" className="text-gray-300 hover:text-white transition-colors">Accueil</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Prix</a>
            <a href="#footer" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Menu className="text-white cursor-pointer" size={28} onClick={toggleMobileMenu} />
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 bg-deep-blue/90 backdrop-filter backdrop-blur-lg shadow-lg rounded-b-lg border-x border-b border-gray-700/50 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <nav className="flex flex-col items-center space-y-4 py-4">
            <a href="#hero" className="text-gray-200 hover:text-white transition-colors" onClick={toggleMobileMenu}>Accueil</a>
            <a href="#pricing" className="text-gray-200 hover:text-white transition-colors" onClick={toggleMobileMenu}>Prix</a>
            <a href="#footer" className="text-gray-200 hover:text-white transition-colors" onClick={toggleMobileMenu}>Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="hero" className="h-screen flex flex-col items-center justify-center text-center p-6 bg-deep-blue">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight font-poppins">
            Organisez votre <span className="text-bright-blue">monde</span>,
            <br />
            une tâche à la <span className="text-vibrant-purple">fois</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
            Todo Ultra-Moderne est votre nouvelle solution pour une productivité maximale. Design élégant, fonctionnalités puissantes, et une expérience utilisateur intuitive.
          </p>
          <Link to="/dashboard">
            <button className="bg-gradient-to-r from-vibrant-purple to-bright-blue hover:from-bright-blue hover:to-vibrant-purple text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out animate-subtle-pulse active:scale-95 active:shadow-inner">
              Commencer gratuitement
            </button>
          </Link>
        </section>

        <section id="demo" className="py-20 bg-deep-blue border-t border-gray-700/50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white font-poppins">Démonstration Interactive</h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Découvrez la puissance et la fluidité de Todo Ultra-Moderne. Une visite guidée de nos fonctionnalités clés sera bientôt disponible ici.
            </p>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500 text-2xl">La démo interactive arrive bientôt !</p>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-dark-slate border-t border-gray-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-12 text-white font-poppins">Des plans pour chaque besoin</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard
                planName="Basique"
                price="9€"
                features={[
                  "10 Projets",
                  "5GB Stockage",
                  "Collaboration basique",
                  "Support Email"
                ]}
              />
              <PricingCard
                planName="Pro"
                price="19€"
                features={[
                  "Projets illimités",
                  "50GB Stockage",
                  "Fonctionnalités Pro",
                  "Support Prioritaire",
                  "Intégrations"
                ]}
                isFeatured={true}
                ctaText="Commencer l'essai Pro"
              />
              <PricingCard
                planName="Entreprise"
                price="49€"
                features={[
                  "Tout du plan Pro",
                  "Analytiques avancées",
                  "Sécurité renforcée",
                  "Support dédié 24/7",
                  "SLA Garanti"
                ]}
              />
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-deep-blue border-t border-gray-700/50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white font-poppins">Ce que nos utilisateurs disent</h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Nous sommes fiers de la confiance que nos clients nous accordent. Leurs témoignages apparaîtront bientôt dans un carrousel dynamique.
            </p>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500 text-2xl">Le carrousel de témoignages arrive bientôt !</p>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-deep-blue text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 font-poppins">Todo Ultra-Moderne</h3>
              <p className="text-sm">
                La meilleure façon de gérer vos tâches, projets, et bien plus encore.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 font-poppins">Liens Rapides</h4>
              <ul className="space-y-2">
                <li><a href="#hero" className="hover:text-bright-blue transition-colors">Accueil</a></li>
                <li><a href="#demo" className="hover:text-bright-blue transition-colors">Démo</a></li>
                <li><a href="#pricing" className="hover:text-bright-blue transition-colors">Prix</a></li>
                {/* Ajouter d'autres liens pertinents */}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 font-poppins">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-bright-blue transition-colors"><Facebook size={24} /></a>
                <a href="#" className="hover:text-bright-blue transition-colors"><Twitter size={24} /></a>
                <a href="#" className="hover:text-bright-blue transition-colors"><Instagram size={24} /></a>
                <a href="#" className="hover:text-bright-blue transition-colors"><Linkedin size={24} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Todo Ultra-Moderne. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageWrapper; // Renamed export
