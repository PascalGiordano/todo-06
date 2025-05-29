{/* Performance Note: Critical CSS is managed by Vite's build process. 
    Ensure global CSS (globals.css, customEffects.css) is minimal 
    and Tailwind's JIT mode is active for optimal CSS delivery. 
    Font loading strategies can be further optimized if needed. 
*/}
import React from 'react';
import Navbar from './LandingPage/components/Navbar'; // Path relative to src/pages/
import HeroSection from './LandingPage/sections/HeroSection';
import FeaturesSection from './LandingPage/sections/FeaturesSection';
import PricingSection from './LandingPage/sections/PricingSection';
import SocialProofSection from './LandingPage/sections/SocialProofSection';
import FooterSection from './LandingPage/sections/FooterSection';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <SocialProofSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default LandingPage;
