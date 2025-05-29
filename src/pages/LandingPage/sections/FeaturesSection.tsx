import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LayoutDashboard, KanbanSquare, ListChecks, FileText, Users, Zap, BarChartHorizontalBig } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  animationDelay?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description, animationDelay = '0s' }) => {
  return (
    <Card className="group hover-lift animate-fade-in bg-card/60 backdrop-blur-sm glass-panel" style={{ animationDelay }}>
      <CardHeader className="items-center text-center">
        <div className="p-3 rounded-full bg-primary/10 mb-3 transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-[-5deg]" />
        </div>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
         {/* TODO: Replace this div with an actual <img> or <picture> element for the feature visual.
              Ensure the image uses loading="lazy" attribute. Example:
              <img src="path/to/feature-visual.jpg" alt={title} loading="lazy" className="w-full h-auto rounded-md" />
              Consider using <picture> for WebP format.
         */}
        <div className="mt-4 bg-muted/50 rounded-md p-4 h-32 flex items-center justify-center border border-border">
          <p className="text-sm text-muted-foreground">[Feature Visual Placeholder]</p>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturesSection: React.FC = () => {
  const features: FeatureItemProps[] = [
    {
      icon: LayoutDashboard,
      title: "Tableaux de Bord Intuitifs",
      description: "Visualisez vos progrès et analysez vos données avec des widgets personnalisables et des graphiques interactifs.",
      animationDelay: "0.1s",
    },
    {
      icon: KanbanSquare,
      title: "Gestion de Projets Kanban",
      description: "Organisez vos tâches en colonnes flexibles, suivez les échéances et collaborez en temps réel avec votre équipe.",
      animationDelay: "0.2s",
    },
    {
      icon: ListChecks,
      title: "Suivi de Tâches Complet",
      description: "Créez des listes de tâches détaillées, assignez des responsables, définissez des priorités et ne manquez plus jamais une deadline.",
      animationDelay: "0.3s",
    },
    {
      icon: FileText,
      title: "Éditeur de Documents Intégré",
      description: "Prenez des notes, rédigez des documents et collaborez sur du contenu riche directement dans l'application.",
      animationDelay: "0.4s",
    },
    {
      icon: Users,
      title: "Collaboration d'Équipe Facilitée",
      description: "Partagez des projets, commentez des tâches et travaillez ensemble de manière transparente, où que vous soyez.",
      animationDelay: "0.5s",
    },
    {
      icon: Zap,
      title: "Automatisations Intelligentes",
      description: "Gagnez du temps en automatisant les tâches répétitives et les workflows grâce à notre moteur d'automatisation.",
      animationDelay: "0.6s",
    },
  ];

  return (
    <section id="features" className="py-20 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Découvrez une <span className="text-primary">puissance</span> inégalée
          </h2>
          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-3xl mx-auto">
            PromptComplet est conçu pour s'adapter à votre façon de travailler, que vous soyez seul ou en équipe. 
            Explorez les fonctionnalités qui transformeront votre productivité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: `${features.length * 0.1 + 0.2}s` }}>
          <Card className="max-w-3xl mx-auto p-6 sm:p-8 bg-card/60 backdrop-blur-sm glass-panel">
            <CardHeader>
              <div className="flex justify-center mb-3">
                 <BarChartHorizontalBig className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl text-center text-foreground">Comment PromptComplet se compare ?</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg text-center text-muted-foreground">
                Un tableau de comparaison détaillé face à Notion, ClickUp, Trello, MeisterTask et d'autres sera bientôt disponible ici. 
                Découvrez pourquoi PromptComplet est le choix évident pour une gestion de projet moderne.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
