import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { Spinner } from "@/components/ui/spinner";

/**
 * Auth callback page that handles OAuth redirects from Supabase.
 * After Google (or other OAuth) login, Supabase redirects here with
 * auth tokens in the URL hash fragment. This page processes those
 * tokens and then redirects to the intended destination.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically detects the hash fragment and exchanges it
        // for a session when we call getSession after an OAuth redirect
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/login", { replace: true });
          return;
        }

        if (session) {
          // Successfully authenticated — go to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // No session found, might need to wait for onAuthStateChange
          // Set up a listener as fallback
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (session) {
                navigate("/dashboard", { replace: true });
                subscription.unsubscribe();
              }
            }
          );

          // Timeout fallback — if no session after 5s, redirect to login
          setTimeout(() => {
            subscription.unsubscribe();
            navigate("/login", { replace: true });
          }, 5000);
        }
      } catch (err) {
        console.error("Auth callback unexpected error:", err);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
