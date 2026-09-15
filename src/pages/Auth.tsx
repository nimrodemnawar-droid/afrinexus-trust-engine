import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";

type Mode = "signin" | "signup" | "reset";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard");
    });
  }, [navigate]);

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setGoogleLoading(false);
    if (result.error) {
      toast({
        title: "Google sign-in failed",
        description: result.error.message ?? "Please try again.",
        variant: "destructive",
      });
      return;
    }
    if (result.redirected) return; // Browser is heading to Google
    navigate("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "Check your email to verify, then sign in." });
        setMode("signin");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast({
          title: "Reset link sent",
          description: "If an account exists for that email, you'll receive a reset link shortly.",
        });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Authentication failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "signin" ? "Sign In" : mode === "signup" ? "Create Your Account" : "Reset Password";
  const cta =
    mode === "signin" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link";

  return (
    <Layout>
      <section className="py-20">
        <div className="container max-w-md">
          <div className="rounded-lg border bg-card p-8">
            <h1 className="font-serif text-3xl text-foreground mb-2">{title}</h1>
            <p className="text-sm text-muted-foreground mb-6">
              {mode === "reset"
                ? "Enter your email and we'll send a secure link to reset your password."
                : "Access your Afrinexus account."}
            </p>
            {mode !== "reset" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="w-full"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {googleLoading ? "Please wait..." : "Continue with Google"}
                </Button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
                  </div>
                </div>
              </>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              {mode !== "reset" && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-gold-dark"
              >
                {loading ? "Please wait..." : cta}
              </Button>
            </form>

            <div className="mt-4 flex flex-col gap-2 text-sm text-center">
              {mode === "signin" && (
                <>
                  <button
                    onClick={() => setMode("reset")}
                    className="text-muted-foreground hover:text-accent"
                  >
                    Forgot password?
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    className="text-muted-foreground hover:text-accent"
                  >
                    Need an account? Sign up
                  </button>
                </>
              )}
              {mode === "signup" && (
                <button
                  onClick={() => setMode("signin")}
                  className="text-muted-foreground hover:text-accent"
                >
                  Already have an account? Sign in
                </button>
              )}
              {mode === "reset" && (
                <button
                  onClick={() => setMode("signin")}
                  className="text-muted-foreground hover:text-accent"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
