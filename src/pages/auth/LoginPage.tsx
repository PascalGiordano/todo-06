import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

type LoginFormValues = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const { login: loginUserAuth, isLoading, isAuthenticated, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  // const [error, setError] = React.useState<string | null>(null); // Replaced by authError
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null); // Keep for success feedback

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Effect to redirect if already authenticated (will be more robust with GuestRoute/ProtectedRoute later)
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); 
      // console.log("User is already authenticated, would redirect to dashboard.");
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(values: LoginFormValues) {
    clearError(); // Clear previous auth errors
    setSuccessMessage(null);
    try {
      const success = await loginUserAuth(values.email, values.password);
      if (success) {
        setSuccessMessage("Connexion réussie ! Redirection en cours...");
        // Navigation is primarily handled by useEffect watching isAuthenticated,
        // or by GuestRoute if already authenticated before page load.
        // No explicit navigate('/dashboard') here needed as useEffect will catch isAuthenticated change.
      } else {
        // Error message will be set in authError by AuthContext
        form.resetField("password");
      }
    } catch (err) { // This catch block might be redundant
        console.error("Unexpected error during login submission:", err);
        // setError("Une erreur finale inattendue s'est produite."); // Should be handled by authError
        form.resetField("password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Se connecter</CardTitle>
          <CardDescription>Accédez à votre espace PromptComplet pour continuer votre travail.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> {/* Increased space for better visual separation */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input autoFocus type="email" placeholder="exemple@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage /> {/* For password specific errors if any */}
                  </FormItem>
                )}
              />
              {authError && <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">{authError}</p>}
              {successMessage && !authError && <p className="text-sm font-medium text-green-600 bg-green-500/10 p-3 rounded-md">{successMessage}</p>}
              <Button type="submit" className="w-full !mt-8" disabled={isLoading}> {/* Increased top margin for button */}
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte?{' '}
            <Link to="/register" className="font-semibold underline hover:text-primary">
              S'inscrire
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
