import { FileCheck2 } from "lucide-react";
import { StagePage } from "@/components/StagePage";

export default function Contracts() {
  return (
    <StagePage
      stage="Stage 3"
      title="Contract Signing"
      icon={FileCheck2}
      lead="Agreed terms become a signed, dated record that both parties can rely on later."
      seoDescription="How Afrinexus turns agreed trade terms into signed, dated contracts with a clear audit trail for cross-border deals."
      sections={[
        {
          title: "From terms to contract",
          text: "The terms accepted in the Deal Room are assembled into a single document. Nothing is added quietly: every clause maps to something both parties already agreed.",
          points: [
            "Goods, specification, quantity and inspection basis",
            "Price, currency, payment milestones and who bears which cost",
            "Delivery terms, timelines and responsibility for transport and duties",
            "What happens if goods are late, short, damaged or rejected",
          ],
        },
        {
          title: "Signature and record",
          text: "Each party signs the same version. The signed copy, the signing time and the identity of each signatory are stored together, so the agreement can be produced intact if it is ever questioned.",
        },
        {
          title: "Afrinexus is not your lawyer",
          text: "We provide structure, templates and a record. We do not give legal, tax or financial advice, and for high-value or unusual deals you should have your own adviser review the contract before signing.",
        },
      ]}
      status="Document templates and signing are prepared with each early-access deal by the Afrinexus team. In-platform signing comes later."
      prev={{ label: "Deal Room", href: "/journey/deal-room" }}
      next={{ label: "Next: Logistics", href: "/journey/logistics" }}
    />
  );
}
