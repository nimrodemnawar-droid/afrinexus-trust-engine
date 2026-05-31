import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";

export default function Terms() {
  return (
    <Layout>
      <section className="bg-navy-gradient py-20">
        <div className="container">
          <SectionHeading
            light
            label="Legal"
            title="Terms of Service"
            description="The rules of engagement when you use Afrinexus."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl space-y-8 text-foreground">
          <p className="text-sm text-muted-foreground">Last updated: May 31, 2026</p>

          <div>
            <h2 className="font-serif text-2xl mb-3">1. Acceptance</h2>
            <p className="text-muted-foreground">By accessing Afrinexus or applying for early access, you agree to these Terms. If you do not agree, do not use the service.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">2. Eligibility</h2>
            <p className="text-muted-foreground">Afrinexus is intended for legally registered businesses, founders, investors, and diaspora-backed partners engaged in lawful cross-border activity involving Kenya. We reserve the right to decline or revoke access at our discretion.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">3. Manual Vetting</h2>
            <p className="text-muted-foreground">Submitting an application does not guarantee access. All applicants undergo manual identity and business verification. Approval decisions are final.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">4. Acceptable Use</h2>
            <p className="text-muted-foreground">You will not use Afrinexus for fraud, money laundering, sanctions evasion, misrepresentation, or any activity prohibited by Kenyan, EU, or US law. Violations result in immediate termination and may be reported to authorities.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">5. Confidentiality</h2>
            <p className="text-muted-foreground">Information shared between parties on the platform is confidential. You agree not to disclose counterparty information outside the scope of the deal.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">Afrinexus provides trust infrastructure but is not a party to deals between users. We are not liable for losses arising from counterparty actions, deal outcomes, or third-party failures.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">7. Governing Law</h2>
            <p className="text-muted-foreground">These Terms are governed by the laws of Kenya. Disputes will be resolved in the courts of Nairobi.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">8. Contact</h2>
            <p className="text-muted-foreground">Questions? Email legal@afrinexus.co.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
