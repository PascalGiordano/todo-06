import React from 'react';
import Typewriter from 'typewriter-effect';
import { Button } from '@/components/ui/button'; // Adjusted path
import { ArrowRight, Briefcase, Users, BarChart } from 'lucide-react'; // Example icons

const HeroSection: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex flex-col justify-center items-center p-6 pt-24 md:pt-32 bg-background" // Added padding top for navbar
    >
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content Area */}
        <div className="space-y-6 text-center lg:text-left animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            <Typewriter
              options={{
                strings: ["Organisez.", "Collaborez.", "Réussissez."],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
                wrapperClassName: 'text-primary', // Apply primary color to the animated part
              }}
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("Organisez.")
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("Collaborez.")
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("Réussissez.")
                  .pauseFor(2500)
                  .start();
              }}
            />
             <span className="block md:inline">Avec PromptComplet.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            PromptComplet est la solution tout-en-un pour gérer vos tâches, projets et idées avec une fluidité et une intelligence inégalées.
          </p>
          <Button 
            size="lg" 
            className="hover-lift animate-pulse-slow group" // Added group for icon animation
            onClick={() => alert('CTA Clicked! Navigation to signup page.')}
          >
            Essayer Gratuitement 
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Social Proof Snippets Placeholder */}
          <div className="mt-10 text-sm text-muted-foreground space-y-3 pt-4">
            <p className="font-semibold mb-2 text-foreground">Rejoignez des milliers d'utilisateurs satisfaits :</p>
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <Briefcase className="h-5 w-5 text-primary" /> <span>Professionnels</span>
              <Users className="h-5 w-5 text-primary" /> <span>Équipes Agiles</span>
              <BarChart className="h-5 w-5 text-primary" /> <span>Startups en Croissance</span>
            </div>
            <p className="pt-2 animate-pulse-slow">[+1000 utilisateurs actifs et ça continue !]</p>
          </div>
        </div>

        {/* Screenshot/Demo Placeholder Area */}
        {/* 
          PERFORMANCE BEST PRACTICE FOR IMAGES:
          When replacing this placeholder with an actual image, use the <picture> element 
          to serve modern formats like WebP with fallbacks for older browsers, 
          and always include loading="lazy" for images below the fold or non-critical.

          Example:
          <picture>
            <source srcset="path/to/your-image.webp" type="image/webp" />
            <source srcset="path/to/your-image.jpg" type="image/jpeg" />
            <img src="path/to/your-image.jpg" alt="Descriptive Alt Text for Accessibility" loading="lazy" className="w-full h-full object-cover rounded-lg" />
          </picture>
        */}
        <div className="mt-8 lg:mt-0 h-72 sm:h-96 md:h-[500px] bg-muted/30 rounded-xl p-6 sm:p-8 border border-border shadow-xl animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="w-full h-full border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center glass-panel">
            <p className="text-lg sm:text-xl font-semibold text-primary/80">
              Application Screenshot/Demo Placeholder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
