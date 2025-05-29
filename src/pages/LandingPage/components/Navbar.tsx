import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '@/context'; // Import useAuth
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  // DrawerDescription, // No longer used directly
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react'; // Added LogOut, LayoutDashboard

const navLinks = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#social-proof", label: "Témoignages" },
  // { href: "#contact", label: "Contact" },
];

const Navbar: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (path?: string) => {
    setIsMobileMenuOpen(false);
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/'); // Redirect to home after logout
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md shadow-sm z-50 flex items-center justify-between px-4 sm:px-6">
      <a href="#hero" className="text-xl font-bold text-primary hover-scale transition-transform text-glow" onClick={handleLinkClick}>
        PromptComplet
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-2">
        {navLinks.map(link => (
          <a 
            key={link.label} 
            href={link.href} // These are anchor links, keep as <a>
            className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover-lift"
          >
            {link.label}
          </a>
        ))}
        {isAuthenticated ? (
          <>
            <Link 
              to="/dashboard" 
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover-lift flex items-center"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" /> Tableau de Bord
            </Link>
            <Button variant="ghost" onClick={handleLogout} size="sm" className="hover-lift">
              Déconnexion <LogOut className="ml-2 h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground ml-2 hidden lg:inline">
              ({currentUser?.name || currentUser?.email})
            </span>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" className="hover-lift">
              <Link to="/login">
                Se Connecter <LogIn className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="default" className="hover-lift animate-pulse-slow">
              <Link to="/register">
                S'inscrire Gratuitement
              </Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Button & Drawer */}
      <div className="md:hidden">
        <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Ouvrir le menu">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full w-[80vw] max-w-[320px]"> {/* Adjusted width */}
            <DrawerHeader className="flex justify-between items-center border-b pb-2">
              <DrawerTitle className="text-lg font-semibold text-primary">
                {isAuthenticated ? (currentUser?.name || currentUser?.email) : "Menu"}
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" aria-label="Fermer le menu">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            
            <div className="flex flex-col space-y-2 p-4 flex-grow">
              {navLinks.map(link => (
                <a 
                  key={link.label} 
                  href={link.href} // Anchor links
                  onClick={() => handleLinkClick()} // Just close drawer for anchor links
                  className="text-base py-3 px-3 rounded-md text-foreground hover:bg-muted hover:text-primary transition-colors block w-full text-left"
                >
                  {link.label}
                </a>
              ))}
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  onClick={() => handleLinkClick()} 
                  className="text-base py-3 px-3 rounded-md text-foreground hover:bg-muted hover:text-primary transition-colors block w-full text-left flex items-center"
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" /> Tableau de Bord
                </Link>
              )}
            </div>

            <DrawerFooter className="border-t border-border pt-4">
              {isAuthenticated ? (
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  Déconnexion <LogOut className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full" onClick={() => handleLinkClick()}>
                    <Link to="/login">
                      Se Connecter <LogIn className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full" onClick={() => handleLinkClick()}>
                    <Link to="/register">
                      S'inscrire
                    </Link>
                  </Button>
                </div>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;
