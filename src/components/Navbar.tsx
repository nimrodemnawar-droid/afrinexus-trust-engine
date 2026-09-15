import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { label: "Platform", href: "/platform" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Vision", href: "/vision" },
  { label: "Security", href: "/security" },
  { label: "Who It's For", href: "/who-its-for" },
  { label: "About", href: "/about" },
  { label: "Ask Nexus", href: "/chat" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-accent" />
          <span className="font-serif text-xl text-foreground">Afrinexus</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === l.href ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to={signedIn ? "/dashboard" : "/auth"}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
          >
            <User className="h-4 w-4" />
            {signedIn ? "Dashboard" : "Sign In"}
          </Link>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-gold-dark">
            <Link to="/early-access">Apply for Early Access</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background px-4 pb-6 pt-4 md:hidden animate-fade-in">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to={signedIn ? "/dashboard" : "/auth"}
            onClick={() => setOpen(false)}
            className="block py-3 text-sm font-medium text-muted-foreground hover:text-accent"
          >
            {signedIn ? "Dashboard" : "Sign In"}
          </Link>
          <Button asChild className="mt-4 w-full bg-accent text-accent-foreground hover:bg-gold-dark">
            <Link to="/early-access" onClick={() => setOpen(false)}>Apply for Early Access</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
