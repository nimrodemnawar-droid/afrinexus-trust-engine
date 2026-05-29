import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, Clock, UserCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { earlyAccessSchema } from "@/lib/validation";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";

const expectations = [
  { icon: UserCheck, title: "Manual Review", desc: "Every application is reviewed by a real person. We verify your identity and business legitimacy." },
  { icon: Clock, title: "48-Hour Response", desc: "We aim to respond to every application within 48 hours with next steps or feedback." },
  { icon: Shield, title: "Your Data Is Safe", desc: "Information submitted here is used solely for vetting. It will never be shared or sold." },
];

export default function EarlyAccess() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      full_name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      role: String(data.get("role") ?? ""),
      context: String(data.get("context") ?? ""),
    };

    const parsed = earlyAccessSchema.safeParse(payload);
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
    const { error } = await supabase.from("early_access_applications").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      company: parsed.data.company,
      role: parsed.data.role,
      context: parsed.data.context,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    form.reset();
    toast({
      title: "Application Received",
      description: "Thank you. Our team will review your application and reach out within 48 hours.",
    });
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
            <Reveal>
              <h3 className="font-serif text-2xl text-foreground mb-6">What to Expect</h3>
              <div className="space-y-6">
                {expectations.map((e, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <e.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-foreground">{e.title}</h4>
                      <p className="text-sm text-muted-foreground">{e.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={1}>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg border bg-card p-8 text-center"
                >
                  <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
                  <h3 className="mt-4 font-serif text-2xl text-foreground">Application Received</h3>
                  <p className="mt-2 text-muted-foreground">
                    Thank you for applying. Our team will review your application and reach out within 48 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 space-y-5" noValidate>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" required maxLength={120} placeholder="Your full name" className="mt-1.5" />
                    {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" required maxLength={255} placeholder="you@company.com" className="mt-1.5" />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="company">Company / Business Name</Label>
                    <Input id="company" name="company" required maxLength={160} placeholder="Your business name" className="mt-1.5" />
                    {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
                  </div>
                  <div>
                    <Label htmlFor="role">Your Role</Label>
                    <Input id="role" name="role" required maxLength={120} placeholder="e.g. Founder, Director, Investor" className="mt-1.5" />
                    {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role}</p>}
                  </div>
                  <div>
                    <Label htmlFor="context">Tell us about your cross-border needs</Label>
                    <Textarea id="context" name="context" required rows={4} maxLength={4000} placeholder="What kind of deal or partnership are you pursuing? What challenges have you faced?" className="mt-1.5" />
                    {errors.context && <p className="mt-1 text-xs text-destructive">{errors.context}</p>}
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground hover:bg-gold-dark">
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
