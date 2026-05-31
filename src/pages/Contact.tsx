import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Mail, MapPin, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const channels = [
  { icon: Mail, title: "General Enquiries", value: "hello@afrinexus.co", desc: "Partnerships, press, and general questions." },
  { icon: Shield, title: "Security & Privacy", value: "privacy@afrinexus.co", desc: "Data requests and security disclosures." },
  { icon: MapPin, title: "Headquarters", value: "Nairobi, Kenya", desc: "Serving the diaspora corridor globally." },
  { icon: Clock, title: "Response Time", value: "Within 48 hours", desc: "Every message reaches a real human." },
];

export default function Contact() {
  return (
    <Layout>
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

      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-2">
            {channels.map((c, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 hover:shadow-gold transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 mb-4">
                  <c.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-serif text-xl text-foreground">{c.title}</h3>
                <p className="mt-1 font-medium text-accent">{c.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-navy-gradient p-8 text-center">
            <h3 className="font-serif text-2xl text-primary-foreground">Ready to apply?</h3>
            <p className="mt-2 text-primary-foreground/70">Skip the inbox — submit your early access application directly.</p>
            <Button asChild className="mt-5 bg-accent text-accent-foreground hover:bg-gold-dark">
              <Link to="/early-access">Apply for Early Access</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
