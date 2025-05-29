import React from 'react';
import { useAuth } from '@/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg shadow-xl bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Tableau de Bord</CardTitle>
          <CardDescription>Bienvenue sur votre espace personnalisé.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {currentUser ? (
            <>
              <p className="text-lg mb-2">
                Connecté en tant que : <span className="font-semibold text-primary">{currentUser.name || currentUser.email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                ID Utilisateur : {currentUser.id}
              </p>
              <Button 
                onClick={logout} 
                variant="destructive" 
                className="w-full max-w-xs mx-auto"
              >
                Se déconnecter
              </Button>
            </>
          ) : (
            <p className="text-lg text-destructive">
              Impossible de charger les informations utilisateur.
            </p>
          )}
        </CardContent>
      </Card>
      <p className="mt-8 text-sm text-muted-foreground">
        Ceci est une page protégée, accessible uniquement aux utilisateurs connectés.
      </p>
    </div>
  );
};

export default DashboardPage;
