import { Handshake } from "lucide-react";
import { StagePage } from "@/components/StagePage";

export default function DealRoom() {
  return (
    <StagePage
      stage="Stage 2"
      title="Deal Room"
      icon={Handshake}
      lead="A private workspace where a buyer and a seller move from conversation to agreed, written terms."
      seoDescription="The Afrinexus Deal Room: a private workspace for negotiation, documents and agreed terms between verified buyers and sellers."
      sections={[
        {
          title: "One deal, one room",
          text: "Each transaction gets its own room. Only the parties to that deal, and the Afrinexus team where support is requested, can see what is inside it. There is no public activity, no feed and no browsing of other people's deals.",
        },
        {
          title: "What happens inside",
          text: "The room keeps the whole negotiation in one place so nothing depends on scattered messages.",
          points: [
            "Structured offer and counter-offer on price, quantity, quality and timelines",
            "Specification sheets, proforma invoices and compliance documents in one file list",
            "A single agreed version of terms rather than competing drafts",
            "A record of who said what and when, for use if a dispute arises",
          ],
        },
        {
          title: "Handover to execution",
          text: "When both sides accept the terms, the deal moves to contract signing and then into logistics. The room stays as the reference record for the rest of the transaction.",
        },
      ]}
      status="Deal Rooms are being built for the first verified cohort. During early access, our team coordinates deals directly with both parties."
      prev={{ label: "Verification", href: "/journey/verification" }}
      next={{ label: "Next: Contract signing", href: "/journey/contracts" }}
    />
  );
}
