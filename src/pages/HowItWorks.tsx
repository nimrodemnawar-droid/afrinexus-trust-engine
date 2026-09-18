import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserCheck, FileSignature, ShieldCheck, Eye, ArrowRight } from "lucide-react";

const phases = [
  {
    icon: UserCheck,
    title: "1. Apply & Onboard",
    items: [
      "Submit your application with business details",
      "Our team reviews and verifies your identity and business legitimacy",
      "Concierge onboarding — a real person walks you through the process",
      "You're approved or given clear feedback on what's needed",
    ],
  },
  {
    icon: FileSignature,
    title: "2. Document Your Deal",
    items: [
      "Both parties agree to terms in a structured, versioned format",
      "Agreements are recorded and digitally signed",
      "All revisions are tracked — nothing hidden, nothing lost",
      "Clear milestones and deliverables are defined upfront",
    ],
  },
  {
    icon: ShieldCheck,
    title: "3. Execute with Accountability",
    items: [
      "Progress is logged against agreed milestones",
      "Both parties can flag issues through structured channels",
      "A complete audit trail is maintained for every deal",
      "If disputes arise, documented proof exists for resolution",
    ],
  },
  {
    icon: Eye,
    title: "4. Audit Trail & Closure",
    items: [
      "Every action, agreement, and communication is recorded",
      "Deal completion is confirmed and documented",
      "Both parties can reference the full history at any time",
      "Data is stored securely and never shared without consent",
    ],
  },
];

export default function HowItWorks() {
  return (
    <Layout>
      <SEO title="How It Works — Afrinexus" description="See how Afrinexus vets parties, documents agreements, and creates a verifiable audit trail for every cross-border deal." />
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Process"
            title="How Afrinexus Works"
            description="Manual-first. Human-verified. Built for deals that must get done — not connections that go nowhere."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="space-y-16">
            {phases.map((phase, i) => (
              <Reveal key={i} delay={i}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
                    <phase.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground">{phase.title}</h3>
                </div>
                <ul className="space-y-3 pl-16">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <SectionHeading
            label="End to end"
            title="The Afrinexus Trade Flow"
            description="Every transaction follows the same documented path — from discovery to delivery, payment and repeat trade."
          />
          <TradeJourney />

          <div className="mt-16 text-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark">
              <Link to="/early-access">Start Your Application <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
