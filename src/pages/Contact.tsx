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
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const data = new FormData(e.currentTarget);
    const payload = {
      full_name: String(data.get("full_name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast({ title: "Please fix the highlighted fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Message received", description: "We'll respond within 48 hours." });
  };

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

          {/* Contact Form */}
          <div className="mt-16 rounded-xl bg-navy-gradient p-8 md:p-12 animate-fade-up">
            <div className="max-w-2xl mx-auto">
              <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground text-center">
                Send us a message
              </h3>
              <p className="mt-2 text-primary-foreground/70 text-center">
                Every message is read by a real person. We respond within 48 hours.
              </p>

              {submitted ? (
                <div className="mt-10 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
                  <h4 className="mt-4 font-serif text-xl text-primary-foreground">Message received</h4>
                  <p className="mt-2 text-primary-foreground/70">
                    Thank you. We'll be in touch within 48 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="mt-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Send another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="full_name" className="text-primary-foreground">Your name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        required
                        maxLength={120}
                        className="mt-2 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        placeholder="Jane Doe"
                      />
                      {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-primary-foreground">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={255}
                        className="mt-2 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-primary-foreground">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      maxLength={200}
                      className="mt-2 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                      placeholder="Partnership enquiry"
                    />
                    {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-primary-foreground">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      maxLength={4000}
                      className="mt-2 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                      placeholder="Tell us a bit about what you'd like to discuss…"
                    />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-accent text-accent-foreground hover:bg-gold-dark"
                    >
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending…</>
                      ) : (
                        <><Send className="h-4 w-4 mr-2" />Send Message</>
                      )}
                    </Button>
                    <Button
                      asChild
                      type="button"
                      variant="outline"
                      className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      <Link to="/early-access">Apply for Early Access</Link>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
