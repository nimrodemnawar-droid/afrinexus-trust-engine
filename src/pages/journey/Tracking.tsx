import { Route } from "lucide-react";
import { StagePage } from "@/components/StagePage";

export default function Tracking() {
  return (
    <StagePage
      stage="Stage 5"
      title="Tracking & Delivery"
      icon={Route}
      lead="Both sides follow the same shipment record from departure to receipt, including the problems."
      seoDescription="Afrinexus tracking: shared shipment milestones, exception alerts, border documentation and confirmed delivery for cross-border trade."
      sections={[
        {
          title: "Shared milestones",
          text: "A shipment is tracked against the milestones that matter commercially, not just a map pin.",
          points: [
            "Collected, loaded and departed",
            "In transit, with expected arrival kept current",
            "Border and customs documentation lodged and cleared",
            "Delivered and confirmed received by the buyer",
          ],
        },
        {
          title: "Exceptions are surfaced, not buried",
          text: "Delays, inspections, route changes and damage are recorded on the shipment as they happen, so both parties can act early instead of arguing afterwards.",
        },
        {
          title: "Closing the transaction",
          text: "Confirmed receipt closes the delivery side of the deal and releases the remaining payment milestone. The completed record joins the trade history that strengthens the next transaction.",
        },
      ]}
      status="Tracking updates are provided by the Afrinexus team alongside carrier data during early access. Live in-platform tracking comes later."
      prev={{ label: "Logistics", href: "/journey/logistics" }}
      next={{ label: "See pricing", href: "/pricing" }}
    />
  );
}
