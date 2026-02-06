import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, Clock, UserCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EarlyAccess() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Application Received",
        description: "Thank you. Our team will review your application and reach out within 48 hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <Layout>
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Early Access"
            title="Apply to Join Afrinexus"
            description="We manually vet every applicant. This isn't a sign-up form — it's the first step in building trust."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Info */}
            <div>
              <h3 className="font-serif text-2xl text-foreground mb-6">What to Expect</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <UserCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-foreground">Manual Review</h4>
                    <p className="text-sm text-muted-foreground">Every application is reviewed by a real person. We verify your identity and business legitimacy.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-foreground">48-Hour Response</h4>
                    <p className="text-sm text-muted-foreground">We aim to respond to every application within 48 hours with next steps or feedback.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-foreground">Your Data Is Safe</h4>
                    <p className="text-sm text-muted-foreground">Information submitted here is used solely for vetting. It will never be shared or sold.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required placeholder="Your full name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required placeholder="you@company.com" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="company">Company / Business Name</Label>
                <Input id="company" required placeholder="Your business name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="role">Your Role</Label>
                <Input id="role" required placeholder="e.g. Founder, Director, Investor" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="context">Tell us about your cross-border needs</Label>
                <Textarea id="context" required rows={4} placeholder="What kind of deal or partnership are you pursuing? What challenges have you faced?" className="mt-1.5" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground hover:bg-gold-dark">
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
