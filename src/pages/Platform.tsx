import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Truck,
  FileSignature,
  Leaf,
  Bot,
  MapPin,
  Wallet,
  BadgeCheck,
  Route,
  Radar,
  ShieldCheck,
  FileSearch,
  PenLine,
  MessagesSquare,
  Gauge,
  Sun,
  Recycle,
  Sprout,
  LineChart,
  Sparkles,
  Scale,
  Brain,
  ArrowRight,
} from "lucide-react";

const pillars = [
  {
    id: "logistics",
    icon: Truck,
    label: "Pillar 01",
    title: "Logistics Centre",
    tagline:
      "A pan-African freight ecosystem connecting shippers, transporters and customs agents — transparent, reliable, and green.",
    features: [
      { icon: Radar, title: "Smart Freight Matching", desc: "Match shippers to verified transporters by route, capacity, price and reputation." },
      { icon: Route, title: "Route Optimisation AI", desc: "Cheapest and safest routes using traffic, fuel cost and weather data." },
      { icon: MapPin, title: "Real-Time Tracking", desc: "Live GPS location, delivery ETA and route-deviation alerts." },
      { icon: Wallet, title: "Escrow & Payments", desc: "Funds held in escrow until delivery is confirmed. M-Pesa, bank and card." },
      { icon: BadgeCheck, title: "Verified Partners", desc: "KYC-vetted carriers with ratings and an Afrinexus verification badge." },
    ],
  },
  {
    id: "deal-room",
    icon: FileSignature,
    label: "Pillar 02",
    title: "Digital Deal Room",
    tagline:
      "A secure, AI-assisted hub where African entrepreneurs, investors and institutions execute deals without fear of fraud.",
    features: [
      { icon: ShieldCheck, title: "Secure Document Vault", desc: "Encrypted storage with granular view, comment and sign permissions." },
      { icon: FileSearch, title: "AI Due Diligence", desc: "Shishi scans for missing clauses, legal inconsistencies and red flags." },
      { icon: PenLine, title: "E-Signatures", desc: "Legally binding signatures with timestamp, IP log and unique signature ID." },
      { icon: Gauge, title: "Investor Dashboard", desc: "Filter verified deals by sector, country, return rate and risk." },
      { icon: MessagesSquare, title: "Confidential Negotiation", desc: "Encrypted chat with optional secure mode that auto-deletes after closure." },
    ],
  },
  {
    id: "green-africa",
    icon: Leaf,
    label: "Pillar 03",
    title: "Green Africa Section",
    tagline:
      "The digital hub for climate-smart trade — connecting green entrepreneurs, NGOs, researchers and investors across the continent.",
    features: [
      { icon: Sun, title: "Green Business Directory", desc: "Verified businesses in renewable energy, recycling, eco-manufacturing and sustainable agri." },
      { icon: Sprout, title: "Climate-Smart Project Hub", desc: "Post and fund green projects with funding goals, maps and progress updates." },
      { icon: LineChart, title: "Carbon Impact Tracker", desc: "Shishi computes footprint, efficiency score and a public Green Scorecard." },
      { icon: Recycle, title: "Green Verification", desc: "Earn the Green Certified Badge through document review and impact checks." },
    ],
  },
  {
    id: "shishi",
    icon: Bot,
    label: "Pillar 04",
    title: "AI Shishi",
    tagline:
      "The smart African trade assistant — Shishi means wisdom, guidance and vigilance. Pan-African in tone, professional in execution.",
    features: [
      { icon: Brain, title: "Business Assistant", desc: "Drafts contracts, proposals and investor briefs in seconds." },
      { icon: Scale, title: "Legal & Compliance Analyst", desc: "Scans documents for risk and verifies legitimacy of counterparties." },
      { icon: Route, title: "Logistics Analyst", desc: "Predicts freight delays and recommends optimised routes." },
      { icon: Leaf, title: "Green Advisor", desc: "Calculates carbon impact and recommends sustainable alternatives." },
      { icon: Sparkles, title: "Data Intelligence", desc: "Generates insights, forecasts and reports from ecosystem activity." },
    ],
  },
];

export default function Platform() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="The Platform"
            title="Four Pillars. One Pan-African Ecosystem."
            description="Afrinexus is a digital ecosystem connecting Africa's trade, logistics and green innovation sectors — anchored by an AI that understands the continent."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="group rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-primary-foreground/10 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/30 mb-4">
                  <p.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="text-xs uppercase tracking-widest text-accent">{p.label}</div>
                <div className="mt-1 font-serif text-lg text-primary-foreground">{p.title}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      {pillars.map((p, idx) => (
        <section
          key={p.id}
          id={p.id}
          className={`py-20 scroll-mt-20 ${idx % 2 === 1 ? "bg-gold-subtle" : ""}`}
        >
          <div className="container max-w-6xl">
            <Reveal>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                  <p.icon className="h-5 w-5 text-accent" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  {p.label}
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">{p.title}</h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{p.tagline}</p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {p.features.map((f, j) => (
                <Reveal key={j} delay={j}>
                  <div className="h-full rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-gold">
                    <f.icon className="h-7 w-7 text-accent mb-4" />
                    <h3 className="font-serif text-lg text-foreground">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-navy-gradient py-20">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground">
            Build the continental trade layer with us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            Early-access members shape the roadmap across all four pillars — Logistics, Deal Room,
            Green Africa and Shishi.
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
