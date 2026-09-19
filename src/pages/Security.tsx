import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { motion } from "framer-motion";
import { Lock, Eye, ShieldCheck, Server, UserX, FileKey } from "lucide-react";

const principles = [
  {
    icon: Lock,
    title: "Data Protection by Design",
    desc: "Security isn't an afterthought. Every system is built with encryption, access controls, and data minimization from day one.",
  },
  {
    icon: Eye,
    title: "No Social Exposure",
    desc: "There are no public profiles, no social feeds, and no way for third parties to browse your business information.",
  },
  {
    icon: ShieldCheck,
    title: "Confidential by Default",
    desc: "Your deal terms, documents, and communications are visible only to the parties involved. Period.",
  },
  {
    icon: Server,
    title: "Audit-Ready Architecture",
    desc: "Every action is logged immutably. This protects you in disputes and supports regulatory compliance.",
  },
  {
    icon: UserX,
    title: "No Data Resale",
    desc: "We will never sell, share, or monetize your data. Our business model is built on trust — not surveillance.",
  },
  {
    icon: FileKey,
    title: "Neutral Platform",
    desc: "Afrinexus doesn't take sides. We provide the infrastructure for fair, documented, and accountable deals.",
  },
];

export default function Security() {
  return (
    <Layout>
      <SEO title="Security — Afrinexus" description="How Afrinexus protects your identity, agreements, and deal data with privacy-first architecture and strict access controls." />
      <section className="relative overflow-hidden bg-navy-gradient py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-emerald/20 blur-3xl" />
        </div>
        <div className="container relative z-10 grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionHeading
              light
              label="Security & Trust"
              title="Your Business Data Is Sacred"
              description="Afrinexus is built for people who take confidentiality seriously. We do too."
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-primary-foreground/15 bg-primary/40 p-6 backdrop-blur-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Security posture</p>
            <div className="mt-5 space-y-4">
              {[
                { icon: Lock, title: "Encrypted in transit and at rest", text: "Deal data is protected end to end." },
                { icon: ShieldCheck, title: "Row-level access controls", text: "Only parties to a deal can read its records." },
                { icon: UserX, title: "No data resale, ever", text: "Your information is never sold or brokered." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 border-b border-primary-foreground/10 pb-4 last:border-0 last:pb-0">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">{item.title}</p>
                    <p className="text-sm text-primary-foreground/60">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto [perspective:1200px]">
            {principles.map((p, i) => (
              <Reveal key={i} delay={i}>
                <TiltCard className="h-full rounded-lg border bg-card p-6 transition-colors hover:border-accent/40 hover:shadow-gold">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 mb-4">
                    <p.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-subtle py-16">
        <div className="container max-w-2xl text-center">
          <h3 className="font-serif text-2xl text-foreground mb-4">Our Commitment</h3>
          <p className="text-muted-foreground">
            We understand that for cross-border business to work, confidentiality isn't optional — it's the foundation. 
            Afrinexus will never compromise your data for growth, partnerships, or revenue. 
            If we can't be trusted with your information, we have no business existing.
          </p>
        </div>
      </section>
    </Layout>
  );
}
