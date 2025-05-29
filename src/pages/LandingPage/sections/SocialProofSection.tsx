import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { UserCircle, Star, Award, Users, BarChart3 } from 'lucide-react'; // UserCircle as avatar placeholder

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company?: string; // Optional company
  avatar?: string; // URL to avatar image, if available
  rating?: number; // Number of stars
}

const testimonialsData: Testimonial[] = [
  {
    quote: "PromptComplet a transformé notre manière de gérer les projets. L'interface intuitive et les fonctionnalités puissantes nous ont permis de gagner un temps précieux et d'améliorer notre collaboration.",
    name: "Alice Dubois",
    role: "Chef de Projet",
    company: "Innovatech Solutions",
    rating: 5,
  },
  {
    quote: "En tant que freelance, l'organisation est clé. PromptComplet m'aide à suivre toutes mes tâches, mes idées et mes clients en un seul endroit. C'est un vrai game-changer !",
    name: "Marc Petit",
    role: "Développeur Freelance",
    rating: 5,
  },
  {
    quote: "Notre startup avait besoin d'un outil flexible et scalable. PromptComplet a dépassé nos attentes, facilitant la communication et la gestion de nos sprints de développement.",
    name: "Sophie Moreau",
    role: "CTO",
    company: "TechNova Inc.",
    rating: 4,
  },
  {
    quote: "J'ai essayé plusieurs outils de gestion de tâches, mais PromptComplet est de loin le plus complet et agréable à utiliser. Le support client est également très réactif.",
    name: "David Lefevre",
    role: "Consultant Marketing",
    rating: 5,
  }
];

const SocialProofSection: React.FC = () => {
  return (
    <section id="social-proof" className="py-20 bg-background text-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ils nous font <span className="text-primary">confiance</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez pourquoi des professionnels, des équipes et des entreprises de toutes tailles choisissent PromptComplet pour optimiser leur productivité et atteindre leurs objectifs.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {testimonialsData.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col justify-between h-full shadow-lg hover-lift bg-card/70 backdrop-blur-sm glass-panel">
                      <CardHeader>
                        <div className="flex items-center mb-4">
                          <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mr-4">
                            <UserCircle className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-foreground">{testimonial.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {testimonial.role} {testimonial.company && ` @ ${testimonial.company}`}
                            </CardDescription>
                          </div>
                        </div>
                        {testimonial.rating && (
                          <div className="flex items-center">
                            {Array(5).fill(0).map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < testimonial.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4">
                          "{testimonial.quote}"
                        </blockquote>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" /> {/* Hide controls on very small screens */}
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>

        {/* Case Studies Placeholder */}
        <div className="text-center mb-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Card className="max-w-3xl mx-auto p-6 sm:p-8 bg-secondary/50 glass-panel">
             <CardHeader>
                <div className="flex justify-center mb-3">
                    <Users className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-center text-secondary-foreground">Études de Cas Détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base sm:text-lg text-center text-secondary-foreground/80">
                Découvrez comment nos clients transforment leurs entreprises avec PromptComplet. Des analyses approfondies de succès réels seront bientôt disponibles.
                <br />
                <a href="#" className="text-primary hover:underline mt-2 inline-block">Explorer nos futures études de cas</a>
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Trust Badges/Certifications Placeholder */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-semibold text-foreground mb-6">Reconnu et Certifié</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-muted-foreground">
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg hover-lift glass-panel">
              <Award className="w-7 h-7 text-primary" />
              <span className="font-medium">[Badge de Confiance 1]</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg hover-lift glass-panel">
              <BarChart3 className="w-7 h-7 text-primary" />
              <span className="font-medium">[Certification Analytique]</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg hover-lift glass-panel">
              <Users className="w-7 h-7 text-primary" />
              <span className="font-medium">[Partenaire Communautaire]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
