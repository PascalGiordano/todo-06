import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin, Facebook, Send } from 'lucide-react';

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const linkSections = [
    {
      title: "Produit",
      links: [
        { name: "Fonctionnalités", href: "#features" },
        { name: "Tarifs", href: "#pricing" },
        { name: "Intégrations (bientôt)", href: "#" },
        { name: "Sécurité", href: "#" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { name: "À propos de nous", href: "#" },
        { name: "Carrières (Nous embauchons !)", href: "#" },
        { name: "Contactez-nous", href: "#" },
        { name: "Blog (bientôt)", href: "#" },
      ],
    },
    {
      title: "Ressources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Support Client", href: "#" },
        { name: "API Développeurs (bientôt)", href: "#" },
        { name: "Tutoriels Vidéo", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { name: "GitHub", href: "#", icon: Github },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Facebook", href: "#", icon: Facebook },
  ];

  return (
    <footer id="footer" className="bg-foreground text-background animate-fade-in py-16">
      <div className="container mx-auto px-6">
        {/* Top section: Link columns and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {linkSections.map((section) => (
            <div key={section.title}>
              <h5 className="text-lg font-semibold text-primary mb-4">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-background/70 hover:text-background hover:underline transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Signup */}
          <div>
            <h5 className="text-lg font-semibold text-primary mb-4">Restez Informé</h5>
            <p className="text-background/70 text-sm mb-3">
              Abonnez-vous à notre newsletter pour les dernières mises à jour et offres.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Votre email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 flex-grow" 
                aria-label="Adresse email pour la newsletter"
              />
              <Button type="submit" variant="secondary" size="icon" aria-label="S'inscrire à la newsletter">
                <Send className="h-5 w-5" />
              </Button>
            </form>
             <p className="text-xs text-background/50 mt-2">
              Pas de spam, désinscription à tout moment.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-background/20 my-10" />

        {/* Bottom section: Copyright and Social Media */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div className="text-sm text-background/70 mb-4 sm:mb-0">
            &copy; {currentYear} PromptComplet. Tous droits réservés.
            <br />
            <a href="#" className="hover:underline">Politique de confidentialité</a> | <a href="#" className="hover:underline">Conditions d'utilisation</a>
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="text-background/70 hover:text-primary transition-colors p-2 rounded-full hover:bg-background/10"
              >
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
