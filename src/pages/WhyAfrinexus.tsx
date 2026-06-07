import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const rows = [
  { feature: "Human-verified partners", us: true, them: false },
  { feature: "Structured deal documentation", us: true, them: false },
  { feature: "Full audit trail", us: true, them: false },
  { feature: "Dispute resolution with proof", us: true, them: false },
  { feature: "Privacy-first — no public profiles", us: true, them: false },
  { feature: "Focus on deal closure", us: true, them: false },
  { feature: "Concierge onboarding", us: true, them: false },
  { feature: "Social feeds & likes", us: false, them: true },
  { feature: "Algorithmic matching", us: false, them: true },
];

const reasons = [
  {
    title: "Closure, Not Connections",
    desc: "Other platforms measure success by how many people you meet. We measure it by how many deals you close — safely.",
  },
  {
    title: "Proof, Not Promises",
    desc: "Every agreement, revision, and milestone is documented. If something goes wrong, you have evidence — not just a conversation history.",
  },
  {
    title: "Risk Reduction, Not Visibility",
    desc: "We're not here to make you famous. We're here to make sure your next cross-border deal doesn't fail.",
  },
];

export default function WhyAfrinexus() {
  return (
    <Layout>
      <SEO title="Why Afrinexus — The Trust Layer for Cross-Border Deals" description="Why Kenyan SMEs and diaspora investors trust Afrinexus to remove fraud, document deals, and protect both sides." />
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Differentiation"
            title="Why Afrinexus Is Different"
            description="We're not a networking platform. We're trust infrastructure."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <SectionHeading
            label="Comparison"
            title="Afrinexus vs. Networking Platforms"
          />
          <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border">
            <div className="grid grid-cols-3 bg-muted px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Capability</span>
              <span className="text-center">Afrinexus</span>
              <span className="text-center">Others</span>
            </div>
            {rows.map((r, i) => (
              <div key={i} className={`grid grid-cols-3 items-center px-6 py-4 ${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
                <span className="text-sm font-medium text-foreground">{r.feature}</span>
                <span className="flex justify-center">
                  {r.us ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-muted-foreground/30" />}
                </span>
                <span className="flex justify-center">
                  {r.them ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-muted-foreground/30" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-subtle py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {reasons.map((r, i) => (
              <Reveal key={i} delay={i} className="rounded-lg border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-gold">
                <h3 className="font-serif text-xl text-foreground mb-3">{r.title}</h3>
                <p className="text-muted-foreground text-sm">{r.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark">
              <Link to="/early-access">Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
