import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Mail,
  MapPin,
  Clock,
  Shield,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Globe,
  Building2,
  Navigation,
  Send,
  MessageCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { contactSchema } from "@/lib/validation";

const contactChannels = [
  {
    icon: Mail,
    title: "General Enquiries",
    value: "hello@afrinexus.co",
    desc: "Partnerships, press, and general questions.",
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    value: "privacy@afrinexus.co",
    desc: "Data requests and security disclosures.",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+254 700 123 456",
    desc: "Mon–Fri, 9:00 AM – 6:00 PM EAT.",
  },
  {
    icon: Clock,
    title: "Response Time",
    value: "Within 48 hours",
    desc: "Every message reaches a real human.",
  },
];

const socials = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "@afrinexus",
    href: "https://linkedin.com/company/afrinexus",
    color: "hover:text-[#0077B5]",
  },
  {
    icon: Twitter,
    label: "Twitter / X",
    handle: "@afrinexus",
    href: "https://twitter.com/afrinexus",
    color: "hover:text-sky-400",
  },
  {
    icon: Instagram,
    label: "Instagram",
    handle: "@afrinexus",
    href: "https://instagram.com/afrinexus",
    color: "hover:text-pink-500",
  },
  {
    icon: Facebook,
    label: "Facebook",
    handle: "@afrinexus",
    href: "https://facebook.com/afrinexus",
    color: "hover:text-blue-600",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    handle: "+254 700 123 456",
    href: "https://wa.me/254700123456",
    color: "hover:text-emerald",
  },
];

const locations = [
  {
    city: "Nairobi, Kenya",
    address: "One Africa Place, Tower C, 7th Floor\nWestlands, Nairobi 00100",
    role: "Global Headquarters",
    icon: Building2,
  },
  {
    city: "London, United Kingdom",
    address: "Level 39, One Canada Square\nCanary Wharf, London E14 5AB",
    role: "European Operations",
    icon: Globe,
  },
  {
    city: "New York, USA",
    address: "Coming Soon – Remote first\nDiaspora outreach hub launching Q3 2025",
    role: "North America Expansion",
    icon: Navigation,
  },
];

export default function Contact() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Contact"
            title="Talk to a real person"
            description="Afrinexus is built by humans, not bots. Reach out — we read every message."
          />
        </div>
      </section>

      {/* Contact Channels */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactChannels.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-6 hover:shadow-gold transition-shadow duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 mb-4">
                  <c.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-serif text-xl text-foreground">
                  {c.title}
                </h3>
                <p className="mt-1 font-medium text-accent">{c.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Social Media */}
          <div className="mt-16">
            <h2 className="font-serif text-3xl text-foreground text-center">
              Follow us on social media
            </h2>
            <p className="mt-3 text-muted-foreground text-center max-w-xl mx-auto">
              Stay updated with the latest news, partnership announcements, and
              insights from the Afrinexus team.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border bg-card p-6 hover:shadow-gold transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                  style={{ animationDelay: `${(i + 4) * 100}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                    <s.icon className={`h-6 w-6 text-accent ${s.color} transition-colors`} />
                  </div>
                  <h4 className="font-serif text-lg text-foreground">
                    {s.label}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors">
                    {s.handle}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="mt-20">
            <h2 className="font-serif text-3xl text-foreground text-center">
              Where to find us
            </h2>
            <p className="mt-3 text-muted-foreground text-center max-w-xl mx-auto">
              Our headquarters in Nairobi serves as the hub for cross-border
              operations, with regional presence expanding across key diaspora
              corridors.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {locations.map((loc, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card p-6 hover:shadow-gold transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                  style={{ animationDelay: `${(i + 9) * 100}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4">
                    <loc.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="font-serif text-xl text-foreground">
                    {loc.city}
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-accent uppercase tracking-wide">
                    {loc.role}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {loc.address}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick message CTA */}
          <div className="mt-16 rounded-xl bg-navy-gradient p-8 text-center animate-fade-up">
            <h3 className="font-serif text-2xl text-primary-foreground">
              Send us a quick message
            </h3>
            <p className="mt-2 text-primary-foreground/70 max-w-lg mx-auto">
              Prefer to write? Drop us a line at{" "}
              <a
                href="mailto:hello@afrinexus.co"
                className="text-accent underline underline-offset-4 hover:text-gold-light transition-colors"
              >
                hello@afrinexus.co
              </a>{" "}
              or reach out on any of our social channels above.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-gold-dark"
              >
                <a href="mailto:hello@afrinexus.co">
                  <Send className="h-4 w-4 mr-2" />
                  Email us now
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/early-access">Apply for Early Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
