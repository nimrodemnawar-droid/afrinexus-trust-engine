import { Truck } from "lucide-react";
import { StagePage } from "@/components/StagePage";

export default function Logistics() {
  return (
    <StagePage
      stage="Stage 4"
      title="Logistics Centre"
      icon={Truck}
      lead="A signed contract only creates value when the goods actually move. The Logistics Centre connects the deal to transport."
      seoDescription="The Afrinexus Logistics Centre connects verified SMEs to transport providers with comparable quotes, clear documentation and coordinated handover."
      sections={[
        {
          title: "Comparable options, not guesswork",
          text: "Requirements from the deal are turned into a single request that providers quote against, so the options can be compared on the same basis.",
          points: [
            "Route, mode and realistic transit time",
            "All-in cost, including handling and known surcharges",
            "Documentation the carrier will and will not handle",
            "Insurance cover and what it excludes",
          ],
        },
        {
          title: "Carrier selection and handover",
          text: "Once a provider is chosen, pickup, loading and documentation are coordinated against the contract. Both parties see the same booking details, so neither side depends on a forwarded message.",
        },
        {
          title: "How Afrinexus earns here",
          text: "Afrinexus works with logistics partners on a transparent service margin, typically in the 3–8% range depending on the route and service. The margin is disclosed rather than hidden in the freight price.",
        },
      ]}
      status="Logistics coordination is handled with partner providers during early access. Self-service quote comparison comes later."
      prev={{ label: "Contract signing", href: "/journey/contracts" }}
      next={{ label: "Next: Tracking", href: "/journey/tracking" }}
    />
  );
}
