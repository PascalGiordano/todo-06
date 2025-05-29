import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from 'lucide-react'; // Added XCircle for unavailable features

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlan {
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  description: string;
  features: PlanFeature[];
  ctaText: string;
  recommended?: boolean;
  annualSubtext?: string;
  monthlySubtext?: string;
}

const plansData: PricingPlan[] = [
  {
    name: "Gratuit",
    priceMonthly: "$0",
    priceAnnual: "$0",
    description: "Pour découvrir les fonctionnalités de base et démarrer vos projets personnels.",
    features: [
      { text: "Jusqu'à 3 projets", available: true },
      { text: "Gestion des tâches basique", available: true },
      { text: "Collaboration (2 membres)", available: true },
      { text: "Support communautaire", available: true },
      { text: "Stockage (1 Go)", available: false },
    ],
    ctaText: "Commencer Gratuitement",
    monthlySubtext: "Aucun frais caché",
    annualSubtext: "Toujours gratuit",
  },
  {
    name: "Pro",
    priceMonthly: "$12",
    priceAnnual: "$120", // Equivalent to $10/month
    description: "Pour les professionnels et petites équipes cherchant à optimiser leur productivité.",
    features: [
      { text: "Projets illimités", available: true },
      { text: "Gestion avancée des tâches", available: true },
      { text: "Collaboration (jusqu'à 10 membres)", available: true },
      { text: "Support prioritaire", available: true },
      { text: "Stockage (100 Go)", available: true },
      { text: "Automatisations (500/mois)", available: true },
    ],
    ctaText: "Choisir Pro",
    recommended: true,
    monthlySubtext: "/utilisateur/mois",
    annualSubtext: "/utilisateur/an (Équiv. $10/mois)",
  },
  {
    name: "Entreprise",
    priceMonthly: "Contact",
    priceAnnual: "Contact",
    description: "Pour les grandes organisations nécessitant des fonctionnalités sur mesure et un support dédié.",
    features: [
      { text: "Tout de Pro, et plus encore", available: true },
      { text: "SSO & Sécurité avancée", available: true },
      { text: "Gestion des rôles et permissions", available: true },
      { text: "Support dédié & SLA", available: true },
      { text: "Analytiques avancées", available: true },
      { text: "Automatisations illimitées", available: true },
    ],
    ctaText: "Contacter Ventes",
    monthlySubtext: "Solutions sur mesure",
    annualSubtext: "Tarification personnalisée",
  },
];

const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-muted text-muted-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Des plans <span className="text-primary">adaptés</span> à chaque équipe
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto">
            Que vous soyez un freelance, une startup en croissance ou une grande entreprise, trouvez le plan parfait pour vos besoins.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Label htmlFor="billing-cycle" className={!isAnnual ? 'text-primary font-semibold' : 'text-muted-foreground'}>
            Mensuel
          </Label>
          <Switch
            id="billing-cycle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            aria-label="Changer entre facturation mensuelle et annuelle"
          />
          <Label htmlFor="billing-cycle" className={isAnnual ? 'text-primary font-semibold' : 'text-muted-foreground'}>
            Annuel
          </Label>
          <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Économisez 2 mois !</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plansData.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col animate-fade-in ${plan.recommended ? 'border-primary border-2 shadow-primary/20 shadow-lg relative hover-lift' : 'hover-lift bg-card/60 backdrop-blur-sm glass-panel'}`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4">
                  <span className="bg-primary text-primary-foreground px-4 py-1.5 text-sm font-semibold rounded-full shadow-md animate-pulse-slow">
                    Recommandé
                  </span>
                </div>
              )}
              <CardHeader className="pt-8 text-center"> {/* Added pt-8 for badge space */}
                <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground h-12">{plan.description}</CardDescription> {/* Fixed height for alignment */}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center my-4">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <p className="text-sm text-muted-foreground/80 h-6">
                    {isAnnual ? plan.annualSubtext : plan.monthlySubtext}
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center space-x-2">
                      {feature.available ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                      )}
                      <span className={!feature.available ? 'line-through text-muted-foreground/70' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button 
                  size="lg" 
                  className={`w-full ${plan.recommended ? '' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  variant={plan.recommended ? 'default' : 'secondary'}
                  onClick={() => alert(`Action for ${plan.name}`)}
                >
                  {plan.ctaText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
