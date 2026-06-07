import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Compass,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Globe2,
  Handshake,
  Banknote,
  Briefcase,
  Truck,
  Palette,
  ArrowRight,
} from "lucide-react";

const swot = [
  {
    title: "Strengths",
    icon: Sparkles,
    tone: "text-accent",
    items: [
      "Pan-African philosophy that resonates with youth, innovators and reformists.",
      "Sustainability and green innovation built into the core product.",
      "A digital deal room that is a first for Africa's marketplace.",
      "AI-driven systems designed for remote operations and low overhead.",
      "Cross-cutting position across logistics, trade and sustainability.",
      "Visionary founder with an authentic Pan-African mindset.",
    ],
  },
  {
    title: "Weaknesses",
    icon: AlertTriangle,
    tone: "text-amber-500",
    items: [
      "Still in MVP phase — needs technical infrastructure and capital to scale.",
      "Limited brand recognition at the continental level.",
      "Dependent on self-funding and small-scale investment early on.",
      "Limited human capital across markets.",
      "Navigating different trade laws, taxes and digital regulations across Africa.",
      "Need for clearer data protection and cybersecurity frameworks.",
    ],
  },
  {
    title: "Opportunities",
    icon: TrendingUp,
    tone: "text-emerald",
    items: [
      "AfCFTA unlocks massive intra-African trade demand.",
      "Rapid digital transformation across the continent.",
      "Global investors actively seeking African green and tech ventures.",
      "No unified trade-tech platform integrating logistics, deals and sustainability.",
      "Strategic alliances with BRICS, pan-African banks and green-tech investors.",
      "Government and development agency backing for youth-led platforms.",
    ],
  },
  {
    title: "Threats",
    icon: ShieldAlert,
    tone: "text-destructive",
    items: [
      "Big tech could localise quickly once the model is proven.",
      "Political and economic instability in some African states.",
      "Currency volatility and weak digital infrastructure in rural areas.",
      "Cybersecurity risks and the cost of data breaches.",
      "Resistance from entrenched interests threatened by Pan-African independence.",
      "Investor skepticism due to Africa's perceived risk profile.",
    ],
  },
];

const expansions = [
  {
    icon: Briefcase,
    title: "Caprica",
    desc: "A private equity brokerage system operating as an internal capital arm of Afrinexus.",
  },
  {
    icon: Truck,
    title: "Afrinexus Logistics Co.",
    desc: "A real-world delivery and supply-chain operator integrated with the Logistics Centre.",
  },
  {
    icon: Palette,
    title: "Afrinexus Fashion & Art",
    desc: "A curated marketplace for African creators, designers and cultural exporters.",
  },
];

const partners = [
  { icon: Globe2, label: "BRICS corridors" },
  { icon: Banknote, label: "Pan-African banks" },
  { icon: Sparkles, label: "Green-tech investors" },
  { icon: Handshake, label: "Development agencies" },
];

export default function Vision() {
  return (
    <Layout>
      <SEO title="Vision — Afrinexus" description="Building the trust infrastructure that unlocks billions in cross-border deals between Africa and its diaspora." />
      {/* Hero */}
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Vision & Strategy"
            title="A Continental Trade Operating System"
            description="Afrinexus is building the digital bridge for verified partnerships, climate-smart trade and intelligent logistics across Africa — and outward to the world."
          />
        </div>
      </section>

      {/* Pillars of vision */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Compass,
                title: "Pan-African by design",
                desc: "Rooted in African ideology — built for the continent's traders, transporters and creators, not retrofitted from elsewhere.",
              },
              {
                icon: Globe2,
                title: "AfCFTA-ready infrastructure",
                desc: "Engineered to ride the African Continental Free Trade Area wave, with cross-border deal flow as a first-class citizen.",
              },
              {
                icon: Sparkles,
                title: "Climate-smart growth",
                desc: "Sustainability is a feature, not a footnote — every transaction can be scored, certified and improved.",
              },
            ].map((v, i) => (
              <Reveal key={i} delay={i}>
                <div className="rounded-xl border bg-card p-6 h-full hover:shadow-gold transition-all hover:-translate-y-1">
                  <v.icon className="h-7 w-7 text-accent mb-4" />
                  <h3 className="font-serif text-xl text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SWOT */}
      <section className="bg-gold-subtle py-20">
        <div className="container max-w-6xl">
          <SectionHeading
            label="Honest Assessment"
            title="SWOT — Where We Stand"
            description="We don't pretend the road is smooth. Here is the unvarnished view of our strengths, weaknesses, opportunities and threats."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {swot.map((s, i) => (
              <Reveal key={i} delay={i}>
                <div className="h-full rounded-xl border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                      <s.icon className={`h-5 w-5 ${s.tone}`} />
                    </div>
                    <h3 className="font-serif text-xl text-foreground">{s.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {s.items.map((it, j) => (
                      <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent`} />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Future expansions */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <SectionHeading
            label="Roadmap"
            title="What Comes After the MVP"
            description="Three planned arms extend the ecosystem from a software platform into a full continental trade operator."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {expansions.map((e, i) => (
              <Reveal key={i} delay={i}>
                <div className="h-full rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-gold">
                  <e.icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl text-foreground">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic partners */}
      <section className="bg-navy-gradient py-16">
        <div className="container max-w-5xl text-center">
          <h2 className="font-serif text-3xl text-primary-foreground">
            Strategic partnership lanes
          </h2>
          <p className="mt-3 text-primary-foreground/70 max-w-xl mx-auto">
            Conversations are open with the alliances that matter for continental scale.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 flex flex-col items-center gap-3"
              >
                <p.icon className="h-7 w-7 text-accent" />
                <span className="text-sm text-primary-foreground">{p.label}</span>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-10 bg-accent text-accent-foreground hover:bg-gold-dark shadow-gold">
            <Link to="/early-access">
              Join the founding cohort <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
