import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, type LucideIcon } from "lucide-react";

export interface StageSection {
  title: string;
  text: string;
  points?: string[];
}

interface StagePageProps {
  stage: string;
  title: string;
  lead: string;
  seoDescription: string;
  icon: LucideIcon;
  sections: StageSection[];
  status: string;
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}

export function StagePage({
  stage,
  title,
  lead,
  seoDescription,
  icon: Icon,
  sections,
  status,
  prev,
  next,
}: StagePageProps) {
  return (
    <Layout>
      <SEO title={`${title} — Afrinexus`} description={seoDescription} />

      <section className="bg-navy-gradient py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Link
              to="/how-it-works"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-accent"
            >
              <ArrowLeft className="mr-2 h-3 w-3" /> Trade journey
            </Link>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/25">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">
                {stage}
              </span>
            </div>
            <h1 className="mt-5 font-serif text-4xl text-primary-foreground md:text-5xl">{title}</h1>
            <p className="mt-5 text-lg text-primary-foreground/70">{lead}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-3xl space-y-10">
          {sections.map((section, i) => (
            <Reveal key={section.title} delay={i}>
              <div className="rounded-xl border bg-card p-6 md:p-8">
                <h2 className="font-serif text-2xl text-foreground">{section.title}</h2>
                <p className="mt-3 text-muted-foreground">{section.text}</p>
                {section.points && (
                  <ul className="mt-5 space-y-3">
                    {section.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-foreground/85">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}

          <div className="rounded-xl border border-accent/30 bg-gold-subtle p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Current status</p>
            <p className="mt-2 text-sm text-foreground/85">{status}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-8">
            {prev ? (
              <Button asChild variant="outline">
                <Link to={prev.href}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {prev.label}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {next && (
              <Button asChild className="bg-accent text-accent-foreground hover:bg-gold-dark">
                <Link to={next.href}>
                  {next.label} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">Apply for a plan in your dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
