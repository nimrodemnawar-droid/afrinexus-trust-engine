import { ShieldCheck } from "lucide-react";
import { StagePage } from "@/components/StagePage";

export default function Verification() {
  return (
    <StagePage
      stage="Stage 1"
      title="Verification"
      icon={ShieldCheck}
      lead="Before any party can trade on Afrinexus, we confirm that the business behind the name is real, registered and reachable."
      seoDescription="How Afrinexus verifies businesses before they trade: registration checks, ownership confirmation, contact validation and trade references."
      sections={[
        {
          title: "What we check",
          text: "Verification is carried out by our team, not by an automated score. Every applicant is reviewed individually.",
          points: [
            "Business registration and tax identifiers in the country of operation",
            "Directors or owners and who is authorised to commit the business",
            "Working contact channels — email, phone and physical presence",
            "Trade references or evidence of previous transactions where available",
            "The corridor and product categories the business intends to trade in",
          ],
        },
        {
          title: "What verification does not mean",
          text: "A verified badge confirms identity and standing at the time of review. It is not a credit rating, an endorsement, or a guarantee of performance. Terms still need to be documented and executed properly.",
        },
        {
          title: "Staying verified",
          text: "Verification is reviewed periodically and when a business changes ownership, registration details or trading corridor. Records that no longer match are suspended until corrected.",
        },
      ]}
      status="Verification runs manually during early access. Apply from your dashboard and our team will contact you directly."
      next={{ label: "Next: Deal Room", href: "/journey/deal-room" }}
    />
  );
}
