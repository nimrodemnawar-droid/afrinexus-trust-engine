import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { defaultPlans, defaultFees, type PricingPlan, type PlatformFee } from "@/lib/pricing";
import { Check, ArrowRight, Search, Handshake, Truck, TrendingUp } from "lucide-react";

const modelSteps = [
  { icon: Search, title: "Free to enter", text: "Create a business profile and start discovering partners at no cost." },
  { icon: Handshake, title: "Find & negotiate", text: "Deal Rooms hold messaging, documents and agreed terms in one place." },
  { icon: Truck, title: "Execute", text: "Logistics Centre coordinates movement with transparent service margins." },
  { icon: TrendingUp, title: "Afrinexus earns from value created", text: "Fees apply to completed transactions, not to trying." },
];

export default function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>(defaultPlans);
  const [fees, setFees] = useState<PlatformFee[]>(defaultFees);

  useEffect(() => {
    const load = async () => {
      const [{ data: planData }, { data: feeData }] = await Promise.all([
        supabase.from("pricing_plans").select("*").eq("published", true).order("sort_order"),
        supabase.from("platform_fees").select("*").eq("published", true).order("sort_order"),
      ]);
      if (planData && planData.length) setPlans(planData as PricingPlan[]);
      if (feeData && feeData.length) setFees(feeData as PlatformFee[]);
    };
    load();
  }, []);

  const dealFees = fees.filter((f) => f.label.startsWith("KSh"));
  const otherFees = fees.filter((f) => !f.label.startsWith("KSh"));

  return (
    <Layout>
      <SEO
        title="Pricing — Afrinexus"
        description="Afrinexus pricing: free to join, Pro at KSh 1,500/month, Business at KSh 5,000/month, plus transparent Deal Room transaction fees."
        canonicalPath="/pricing"
      />

      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Pricing"
            title="Free To Enter. Fees Only On Value Created."
            description="A hybrid model: affordable monthly membership for tools, and a transaction fee only when a deal actually completes."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((t, i) => (
              <Reveal key={t.id ?? t.name} delay={i}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all hover:-translate-y-1 ${
                    t.highlighted ? "border-accent bg-card shadow-gold ring-1 ring-accent/40" : "bg-card hover:border-accent/40 hover:shadow-gold"
                  }`}
                >
                  {t.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                      {t.badge}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl text-foreground">{t.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-foreground">{t.price}</span>
                    <span className="text-sm text-muted-foreground">{t.cadence}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{t.tagline}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {t.features.map((f, j) => (
                      <li key={j} className="flex gap-3 text-sm text-foreground/90">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {t.escrow_rate && (
                    <p className="mt-6 border-t pt-4 text-xs uppercase tracking-wide text-muted-foreground">{t.escrow_rate}</p>
                  )}

                  <Button
                    asChild
                    className={`mt-6 ${t.highlighted ? "bg-accent text-accent-foreground hover:bg-gold-dark" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                  >
                    <Link to={t.cta_href}>
                      {t.cta_label} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Transaction fees */}
          <div className="mt-20">
            <SectionHeading label="Deal Room" title="Transaction Fees" description="Charged on the value of a completed transaction. Larger trades pay a lower rate." />
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dealFees.map((f, i) => (
                <Reveal key={f.id ?? f.label} delay={i}>
                  <div className="rounded-xl border bg-card p-6">
                    <p className="text-sm text-muted-foreground">{f.label}</p>
                    <p className="mt-2 font-serif text-3xl text-foreground">{f.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Other revenue lines */}
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {otherFees.map((f, i) => (
              <Reveal key={f.id ?? f.label} delay={i}>
                <div className="h-full rounded-xl border bg-card p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-serif text-lg text-foreground">{f.label}</h4>
                    <span className="font-serif text-2xl text-accent">{f.value}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Model */}
          <div className="mt-20">
            <SectionHeading label="The Model" title="How Afrinexus Makes Money" />
            <div className="grid gap-6 md:grid-cols-4">
              {modelSteps.map((s, i) => (
                <Reveal key={s.title} delay={i}>
                  <div className="h-full rounded-xl border bg-card p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                      <s.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h4 className="font-serif text-lg text-foreground">{s.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-gradient py-20">
        <div className="container text-center">
          <h2 className="font-serif text-3xl text-primary-foreground md:text-4xl">Trade With Trust. Trade With Afrinexus.</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">Join free today. Get verified. Start closing cross-border deals with confidence.</p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground shadow-gold hover:bg-gold-dark">
            <Link to="/early-access">
              Apply for Early Access <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
