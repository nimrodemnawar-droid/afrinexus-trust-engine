import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-accent" />
              <span className="font-serif text-lg">Afrinexus</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Trust infrastructure for cross-border business in Africa.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold mb-3 text-accent">Platform</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <Link to="/how-it-works" className="block hover:text-accent transition-colors">How It Works</Link>
              <Link to="/why-afrinexus" className="block hover:text-accent transition-colors">Why Afrinexus</Link>
              <Link to="/security" className="block hover:text-accent transition-colors">Security & Trust</Link>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold mb-3 text-accent">Company</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <Link to="/about" className="block hover:text-accent transition-colors">About</Link>
              <Link to="/who-its-for" className="block hover:text-accent transition-colors">Who It's For</Link>
              <Link to="/contact" className="block hover:text-accent transition-colors">Contact</Link>
              <Link to="/early-access" className="block hover:text-accent transition-colors">Early Access</Link>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold mb-3 text-accent">Legal</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <Link to="/privacy" className="block hover:text-accent transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="block hover:text-accent transition-colors">Terms of Service</Link>
              <Link to="/security" className="block hover:text-accent transition-colors">Security</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Afrinexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
