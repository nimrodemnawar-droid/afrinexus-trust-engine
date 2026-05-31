import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";

export default function Privacy() {
  return (
    <Layout>
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Legal"
            title="Privacy Policy"
            description="How Afrinexus collects, uses, and protects your information."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl prose prose-slate space-y-8 text-foreground">
          <p className="text-sm text-muted-foreground">Last updated: May 31, 2026</p>

          <div>
            <h2 className="font-serif text-2xl mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground">When you apply for early access, we collect your full name, email, company, role, and the context you share about your cross-border needs. We do not collect tracking data, behavioural profiles, or third-party advertising identifiers.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">2. How We Use It</h2>
            <p className="text-muted-foreground">Information is used exclusively to vet your application, contact you about Afrinexus, and improve our onboarding process. We never sell, rent, or share your data with advertisers or unrelated third parties.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">3. Data Storage & Security</h2>
            <p className="text-muted-foreground">Applications are stored in an encrypted database with row-level security. Access is restricted to authorised Afrinexus staff. We retain data only as long as necessary for vetting and operational follow-up.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">4. Your Rights</h2>
            <p className="text-muted-foreground">You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@afrinexus.co. We will respond within 30 days.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">5. Cookies</h2>
            <p className="text-muted-foreground">Afrinexus uses only essential cookies required for the site to function. No analytics or advertising cookies are set without your consent.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">6. Contact</h2>
            <p className="text-muted-foreground">Questions about this policy? Email privacy@afrinexus.co.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
