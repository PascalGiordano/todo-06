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
  name: z.string().optional(),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"], // path of error
});

type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerUserAuth, isLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  // const [error, setError] = React.useState<string | null>(null); // Replaced by authError
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null); // Keep for success feedback

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    clearError(); // Clear previous auth errors
    setSuccessMessage(null);
    try {
      const success = await registerUserAuth(values.email, values.password, values.name);
      if (success) {
        setSuccessMessage("Inscription réussie ! Vous allez être redirigé vers la page de connexion.");
        form.reset(); // Clear form fields
        // Firebase onAuthStateChanged might auto-login if configured,
        // but explicit navigation to login is clearer for this app's flow.
        setTimeout(() => navigate('/login'), 2500); // Redirect after a delay
      } else {
        // Error message will be set in authError by AuthContext
        form.resetField("password");
        form.resetField("confirmPassword");
      }
    } catch (err) { // This catch block might be redundant if registerUserAuth handles all errors
        console.error("Unexpected error during registration submission:", err);
        // setError("Une erreur finale inattendue s'est produite."); // Should be handled by authError
        form.resetField("password");
        form.resetField("confirmPassword");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Créer un compte</CardTitle>
          <CardDescription>Entrez vos informations pour commencer votre aventure avec PromptComplet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom (Optionnel)</FormLabel>
                    <FormControl>
                      <Input autoFocus placeholder="Votre nom et prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemple@mail.com" {...field} />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {authError && <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">{authError}</p>}
              {successMessage && !authError && <p className="text-sm font-medium text-green-600 bg-green-500/10 p-3 rounded-md">{successMessage}</p>}
              <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
                {isLoading ? 'Création en cours...' : 'Créer un compte'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte?{' '}
            <Link to="/login" className="font-semibold underline hover:text-primary">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
