import { useState } from "react";
import { supabase } from "@/lib/supabase";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate, useLocation } from "react-router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (flow === "signIn") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      }
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Textures */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,oklch(0_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.05)_1px,transparent_1px)]" />
      
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center mb-6 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-black rounded-2xl p-2 border border-border/50">
            <img src="/logo.png" alt="TrackYourAPI Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter uppercase">TrackYourAPI</h2>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground uppercase">
              {flow === "signIn" ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest text-muted-foreground/70">
              {flow === "signIn"
                ? "Enter your credentials to continue"
                : "Enter your details to get started"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 rounded-none border-border/50 h-11 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" title="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 rounded-none border-border/50 h-11 text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-none font-bold uppercase tracking-[0.2em] transition-all hover:opacity-90 bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : null}
                {flow === "signIn" ? "Login" : "Register"}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-card px-2 text-muted-foreground/70">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-none font-bold uppercase tracking-widest transition-all hover:bg-background border-border/50 text-foreground"
                onClick={async () => {
                  const callbackUrl = new URL(from, window.location.origin).toString();
                  await supabase.auth.signInWithOAuth({ 
                    provider: 'google',
                    options: { redirectTo: callbackUrl }
                  });
                }}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Google
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                >
                  {flow === "signIn"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

