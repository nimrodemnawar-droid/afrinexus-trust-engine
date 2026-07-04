import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Globe, Handshake, ArrowRight, Package, ShoppingCart, Truck, Leaf, Wheat, Factory, Boxes, Sun } from "lucide-react";

const tradeRoles = [
  { icon: Package, title: "Exporters & Manufacturers", desc: "Seeking new markets without payment risks." },
  { icon: ShoppingCart, title: "Distributors & Buyers", desc: "Looking for reliable sourcing and guaranteed delivery." },
  { icon: Truck, title: "Logistics Operators", desc: "Wanting steady contracts with guaranteed freight payments." },
  { icon: Leaf, title: "Green Entrepreneurs", desc: "Scaling sustainable products across the continent." },
];

const industries = [
  { icon: Package, label: "FMCG" },
  { icon: Wheat, label: "Agriculture & Agri-processing" },
  { icon: Factory, label: "Manufacturing" },
  { icon: Boxes, label: "Commodities" },
  { icon: Sun, label: "Green & Sustainable Products" },
  { icon: Truck, label: "Transport & Logistics" },
];

const audiences = [
  {
    icon: Building2,
    title: "Kenyan SMEs",
    desc: "You're expanding beyond Kenya or working with international suppliers and partners. You need to know that the party on the other side is real, reliable, and accountable.",
    examples: [
      "Importing goods from a new supplier abroad",
      "Partnering with a foreign distributor",
      "Seeking investment from international sources",
    ],
  },
  {
    icon: Globe,
    title: "Diaspora Operators & Investors",
    desc: "You're investing in or building businesses in Kenya from abroad. Distance makes trust harder. Afrinexus gives you verification, documentation, and proof — so you don't have to rely on faith.",
    examples: [
      "Funding a business venture in Kenya remotely",
      "Managing operations through local partners",
      "Structuring agreements that hold up across borders",
    ],
  },
  {
    icon: Handshake,
    title: "Cross-Border Dealmakers",
    desc: "You're a founder, operator, or professional involved in deals that cross national boundaries. You need infrastructure that matches the seriousness of your work.",
    examples: [
      "Joint ventures between Kenyan and international firms",
      "Trade agreements requiring verified counterparties",
      "Any deal where trust is the difference between profit and loss",
    ],
  },
];

export default function WhoItsFor() {
  return (
    <Layout>
      <SEO title="Who Afrinexus Is For — SMEs, Diaspora, Investors" description="Built for Kenyan SMEs, diaspora investors, and cross-border partners who need verifiable trust before transacting." />
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Audience"
            title="Built for Serious Dealmakers"
            description="Afrinexus is not for casual browsing. It's for people who have real money on the line and need real protection."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="space-y-12">
            {audiences.map((a, i) => (
              <Reveal key={i} delay={i} className="rounded-lg border bg-card p-8 transition-all hover:border-accent/40 hover:shadow-gold">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
                    <a.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground">{a.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{a.desc}</p>
                <ul className="space-y-2">
                  {a.examples.map((ex, j) => (
                    <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <div className="mt-20">
            <SectionHeading
              label="Trade Roles"
              title="Who Afrinexus Serves in Trade"
              description="From producers to logistics — every role in a cross-border deal has a home on Afrinexus."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {tradeRoles.map((r, i) => (
                <Reveal key={i} delay={i} className="rounded-lg border bg-card p-6 hover:border-accent/40 hover:shadow-gold transition-all">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20 mb-4">
                    <r.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="font-serif text-lg text-foreground">{r.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <SectionHeading
              label="Target Industries"
              title="Optimised for Physical Goods Across Africa"
              description="Our platform is built for the sectors driving continental trade."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:border-accent/40 transition-colors">
                  <ind.icon className="h-5 w-5 text-accent shrink-0" />
                  <span className="font-sans text-sm font-medium text-foreground">{ind.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark">
              <Link to="/early-access">Apply for Early Access <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
