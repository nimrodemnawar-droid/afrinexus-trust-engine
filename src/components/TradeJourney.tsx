import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Users, Handshake, MessageSquare, Files, FileCheck2, Leaf, Truck, Route, PackageCheck, CreditCard, History, Repeat2, ChevronDown, ArrowUpRight } from "lucide-react";

const journey = [
  { title: "Business discovery", text: "Find relevant, vetted opportunities.", icon: Search, href: "/journey/verification" },
  { title: "Buyer + seller", text: "Qualified parties enter a private process.", icon: Users, href: "/journey/verification" },
  { title: "Deal Room", text: "A secure workspace holds the transaction.", icon: Handshake, branch: true, href: "/journey/deal-room" },
  { title: "Contract signed", text: "Agreed terms become a clear record.", icon: FileCheck2, href: "/journey/contracts" },
  { title: "Green Africa", text: "Applied when sustainability criteria are relevant.", icon: Leaf, optional: true },
  { title: "Logistics Centre", text: "Compare routes and coordinate movement.", icon: Truck, href: "/journey/logistics" },
  { title: "Carrier selected", text: "Choose the right transport provider.", icon: Route, href: "/journey/logistics" },
  { title: "Shipment", text: "Goods begin moving across the corridor.", icon: Truck, href: "/journey/tracking" },
  { title: "Tracking + updates", text: "Both sides follow progress and exceptions.", icon: Route, href: "/journey/tracking" },
  { title: "Border / delivery", text: "Documentation and handover are recorded.", icon: PackageCheck, href: "/journey/tracking" },
  { title: "Buyer receives", text: "Receipt is confirmed against the deal.", icon: PackageCheck },
  { title: "Payment complete", text: "The transaction closes with a traceable record.", icon: CreditCard },
  { title: "Trade history", text: "Proof strengthens the next transaction.", icon: History },
  { title: "Next transaction", text: "Trusted execution becomes repeat growth.", icon: Repeat2 },
];

export function TradeJourney() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 border-y border-accent/30 py-4 text-center text-xs font-bold uppercase tracking-widest text-accent">Afrinexus</div>
      {journey.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.title}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .45 }} className="relative border bg-card px-5 py-5 shadow-sm md:px-7">
              <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground"><Icon className="h-5 w-5" /></div><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-serif text-xl capitalize">{step.title}</h3>{step.optional && <span className="border border-accent/40 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">When applicable</span>}</div><p className="mt-1 text-sm text-muted-foreground">{step.text}</p>{step.href && <Link to={step.href} className="mt-2 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-accent hover:underline">Learn more<ArrowUpRight className="ml-1 h-3 w-3" /></Link>}</div></div>
              {step.branch && <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4"><div className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="h-4 w-4 text-accent" />Negotiation</div><div className="flex items-center gap-2 text-sm font-medium"><Files className="h-4 w-4 text-accent" />Documents</div></div>}
            </motion.div>
            {index < journey.length - 1 && <div className="flex h-10 items-center justify-center"><ChevronDown className="h-5 w-5 text-accent" /></div>}
          </div>
        );
      })}
    </div>
  );
}
