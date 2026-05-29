import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { FAQ } from "@/components/FAQ";
import { Shield, FileCheck, Search, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const problems = [
  { icon: AlertTriangle, text: "Fake or unverifiable business partners" },
  { icon: XCircle, text: "Broken agreements with no recourse" },
  { icon: AlertTriangle, text: "Disputes with no documented proof" },
  { icon: XCircle, text: "Cross-border execution failure" },
];

const steps = [
  { icon: Search, title: "Apply & Get Verified", desc: "Submit your application. Our team manually vets every party — no automated shortcuts." },
  { icon: FileCheck, title: "Document Your Deal", desc: "Agreements are recorded, versioned, and signed. Every term is clear and auditable." },
  { icon: Shield, title: "Execute with Confidence", desc: "A full audit trail protects both sides. Disputes have proof. Deals get done." },
];

const comparisons = [
  { feature: "Party verification", us: true, them: false },
  { feature: "Documented agreements", us: true, them: false },
  { feature: "Audit trail & proof", us: true, them: false },
  { feature: "Dispute resolution support", us: true, them: false },
  { feature: "Deal closure focus", us: true, them: false },
  { feature: "Privacy-first architecture", us: true, them: false },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-gradient">
        <div className="absolute inset-0 opacity-20">
          <motion.img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent" />
        <div className="container relative z-10 py-24 md:py-32">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block mb-4 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent ring-1 ring-accent/20">
              Trust Infrastructure for Africa
            </span>
            <h1 className="font-serif text-4xl leading-tight text-primary-foreground md:text-6xl md:leading-tight">
              Where Cross-Border Deals Go When Failure Is Not an Option
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/70">
              Afrinexus eliminates the biggest risk in cross-border business: trusting people you've never met, with money you can't afford to lose.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-gold-dark shadow-gold group">
                <Link to="/early-access">
                  Apply for Early Access
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20">
        <div className="container">
          <SectionHeading
            label="The Problem"
            title="Cross-Border Business Is Broken by Trust Gaps"
            description="Kenyan SMEs and diaspora investors lose money, time, and opportunities because there's no infrastructure for trust."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {problems.map((p, i) => (
              <Reveal key={i} delay={i} className="rounded-lg border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-gold">
                <p.icon className="h-8 w-8 text-destructive mb-4" />
                <p className="font-medium text-card-foreground">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gold-subtle py-20">
        <div className="container">
          <SectionHeading
            label="How It Works"
            title="Three Steps to a Safer Deal"
            description="No algorithms. No AI matching. Just verified humans, documented terms, and auditable proof."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={i} delay={i} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
                  <s.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">Step {i + 1}</div>
                <h3 className="font-serif text-xl text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20">
        <div className="container">
          <SectionHeading
            label="Why Afrinexus"
            title="We Don't Just Connect — We Close"
            description="Platforms that focus on networking leave you with contacts. We leave you with completed deals."
          />
          <Reveal className="mx-auto max-w-2xl overflow-hidden rounded-lg border shadow-sm">
            <div className="grid grid-cols-3 bg-muted px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Feature</span>
              <span className="text-center">Afrinexus</span>
              <span className="text-center">Networking Platforms</span>
            </div>
            {comparisons.map((c, i) => (
              <div key={i} className={`grid grid-cols-3 items-center px-6 py-4 ${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
                <span className="text-sm font-medium text-foreground">{c.feature}</span>
                <span className="flex justify-center"><CheckCircle2 className="h-5 w-5 text-accent" /></span>
                <span className="flex justify-center"><XCircle className="h-5 w-5 text-muted-foreground/40" /></span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <FAQ />

      {/* CTA */}
      <section className="bg-navy-gradient py-20">
        <motion.div
          className="container text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-3xl text-primary-foreground md:text-4xl">
            Ready to Do Business Without the Risk?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
            Afrinexus is currently in early access. Apply now to be among the first verified members.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-gold-dark shadow-gold">
            <Link to="/early-access">Apply for Early Access <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
}
