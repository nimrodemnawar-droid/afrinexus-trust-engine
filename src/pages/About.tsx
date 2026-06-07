import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const values = [
  { title: "Trust Over Growth", desc: "We will never sacrifice the integrity of our verification process for faster user acquisition." },
  { title: "Proof Over Promises", desc: "Every claim, agreement, and action on Afrinexus is documented and auditable." },
  { title: "Privacy Over Exposure", desc: "Your business information is yours. We don't display, sell, or monetize your data." },
  { title: "Execution Over Connection", desc: "We measure success by deals completed — not connections made." },
];

const futureFeatures = [
  "Escrow integration for milestone-based payments",
  "Smart contract support for automated deal enforcement",
  "Multi-currency settlement for cross-border transactions",
  "API access for enterprise integration",
  "Regulatory compliance modules for specific markets",
];

export default function About() {
  return (
    <Layout>
      <SEO title="About Afrinexus — Our Mission" description="Afrinexus exists to make cross-border deals safe, documented, and enforceable for Kenyan SMEs and the global diaspora." />
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="About"
            title="Why Afrinexus Exists"
            description="Because cross-border business in Africa shouldn't require blind faith."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every year, thousands of cross-border deals involving Kenyan SMEs and diaspora investors 
              fail — not because the opportunities weren't real, but because there was no way to verify 
              the people, document the terms, or enforce the agreements.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Afrinexus was created to fix this. We are trust infrastructure — the missing layer between 
              "I found a partner" and "The deal is done." We don't replace lawyers, banks, or advisors. 
              We give them — and you — the verified, documented, auditable foundation that makes 
              cross-border deals work.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gold-subtle py-20">
        <div className="container">
          <SectionHeading label="Values" title="What We Stand For" />
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {values.map((v, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-gold"
                style={{ animation: `fade-in 0.6s ease-out ${i * 80}ms both` }}
              >
                <h3 className="font-serif text-lg text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-3xl">
          <SectionHeading label="Roadmap" title="What's Coming" description="These features are planned for future releases — clearly marked as coming later." />
          <ul className="space-y-3 max-w-lg mx-auto">
            {futureFeatures.map((f, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark">
              <Link to="/early-access">Join Early Access <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
