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
