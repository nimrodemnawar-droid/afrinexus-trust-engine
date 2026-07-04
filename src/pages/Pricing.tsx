import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Percent, Users } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    cadence: "to apply",
    tagline: "For SMEs and diaspora dealmakers exploring their first cross-border transaction.",
    features: [
      "Verified profile after manual KYC review",
      "Access to the vetted partner directory",
      "Up to 1 active deal room",
      "Standard escrow: 2.5% per transaction",
      "Email support (48-hour response)",
    ],
    cta: { label: "Apply for Early Access", href: "/early-access" },
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$149",
    cadence: "per month",
    tagline: "For active exporters, distributors, and logistics operators running recurring deals.",
    features: [
      "Everything in Starter",
      "Up to 10 active deal rooms",
      "Reduced escrow: 1.8% per transaction",
      "Priority partner matching & logistics coordination",
      "Dedicated deal concierge",
      "Priority support (24-hour response)",
    ],
    cta: { label: "Apply for Growth", href: "/early-access" },
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual contract",
    tagline: "For trade associations, export councils, and institutions moving high-value volume.",
    features: [
      "Unlimited deal rooms & team seats",
      "Custom escrow rate (from 0.9%)",
      "White-glove onboarding for members",
      "API access & custom integrations",
      "Named account manager & SLA",
      "Custom legal & compliance workflows",
    ],
    cta: { label: "Talk to Sales", href: "/contact" },
    highlighted: false,
  },
];

const feeHighlights = [
  {
    icon: ShieldCheck,
    title: "Escrow-Backed",
    desc: "Funds are held securely and only released when delivery is verified. Zero fraud risk for buyers, guaranteed payment for sellers.",
  },
  {
    icon: Percent,
    title: "Transparent Fees",
    desc: "One escrow fee per transaction. No hidden charges, no wire fees, no FX markups beyond published rates.",
  },
  {
    icon: Users,
    title: "You Only Pay on Success",
    desc: "Applications are free. Escrow fees only apply when a deal is executed through the platform.",
  },
];

const faqs = [
  {
    q: "Do I pay anything to apply?",
    a: "No. Applications and manual vetting are free. You only pay when you transact through Afrinexus.",
  },
  {
    q: "How is the escrow fee calculated?",
    a: "The escrow fee is a percentage of the deal value, charged once per transaction when funds are released. Buyer and seller can agree on how to split it.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Upgrade or downgrade at any time. Enterprise pricing is negotiated based on volume and integration needs.",
  },
  {
    q: "What currencies do you support?",
    a: "USD, EUR, GBP, and KES at launch, with additional African currencies rolling out through 2026.",
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees on Starter or Growth. Enterprise onboarding may include a one-time integration fee depending on scope.",
  },
];

export default function Pricing() {
  return (
    <Layout>
      <SEO
        title="Pricing — Afrinexus"
        description="Transparent pricing for cross-border trade on Afrinexus. Free to apply. Membership tiers plus a single escrow fee per deal."
        canonicalPath="/pricing"
      />

      {/* Hero */}
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Pricing"
            title="Pay Only When Trust Is Delivered"
            description="Applications are free. Membership unlocks scale. Escrow fees apply only when a deal actually executes."
          />
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all hover:-translate-y-1 ${
                    t.highlighted
                      ? "border-accent bg-card shadow-gold ring-1 ring-accent/40"
                      : "bg-card hover:border-accent/40 hover:shadow-gold"
                  }`}
                >
                  {t.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                      {t.badge}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl text-foreground">{t.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-foreground">{t.price}</span>
                    <span className="text-sm text-muted-foreground">{t.cadence}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{t.tagline}</p>

                  <ul className="mt-6 space-y-3 flex-1">
                    {t.features.map((f, j) => (
                      <li key={j} className="flex gap-3 text-sm text-foreground/90">
                        <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={`mt-8 ${
                      t.highlighted
                        ? "bg-accent text-accent-foreground hover:bg-gold-dark"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    <Link to={t.cta.href}>
                      {t.cta.label} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Fee highlights */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {feeHighlights.map((h, i) => (
              <Reveal key={i} delay={i}>
                <div className="rounded-xl border bg-card p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20 mb-4">
                    <h.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="font-serif text-lg text-foreground">{h.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{h.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* FAQs */}
          <div className="mt-20">
            <SectionHeading
              label="Pricing FAQ"
              title="Straight Answers on Cost"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {faqs.map((f, i) => (
                <Reveal key={i} delay={i}>
                  <div className="rounded-lg border bg-card p-6">
                    <h4 className="font-serif text-lg text-foreground">{f.q}</h4>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-gradient py-20">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground">
            Trade With Trust. Trade With Afrinexus.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            Apply free today. Get vetted. Start closing cross-border deals with confidence.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-gold-dark shadow-gold">
            <Link to="/early-access">
              Apply for Early Access <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
