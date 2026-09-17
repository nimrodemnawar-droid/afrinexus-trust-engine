export interface PricingPlan {
  id?: string;
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  escrow_rate: string;
  cta_label: string;
  cta_href: string;
  badge: string | null;
  highlighted: boolean;
  published: boolean;
  sort_order: number;
}

export interface PlatformFee {
  id?: string;
  label: string;
  value: string;
  description: string;
  published: boolean;
  sort_order: number;
}

export const defaultPlans: PricingPlan[] = [
  { name: "FREE", price: "KSh 0", cadence: "/month", tagline: "For businesses getting started with cross-border trade.", features: ["Business profile", "Buyer & supplier discovery", "Basic Deal Rooms", "Business messaging", "Green Africa access", "Logistics requests", "Trade education"], escrow_rate: "2.5% on trades up to KSh 250K", cta_label: "Join Free", cta_href: "/early-access", badge: null, highlighted: false, published: true, sort_order: 1 },
  { name: "PRO", price: "KSh 1,500", cadence: "/month", tagline: "For growing SMEs actively trading across borders.", features: ["Everything in Free", "Unlimited Deal Rooms", "Advanced buyer/supplier discovery", "Trade analytics", "Document templates", "Advanced logistics comparison", "Priority support", "Export assistance"], escrow_rate: "Lower fees as deal value grows", cta_label: "Choose Pro", cta_href: "/early-access", badge: "For active traders", highlighted: true, published: true, sort_order: 2 },
  { name: "BUSINESS", price: "KSh 5,000", cadence: "/month", tagline: "For established SMEs and growing companies.", features: ["Everything in Pro", "Multiple team members", "Advanced analytics", "Multiple trade corridors", "Priority logistics coordination", "Advanced documentation", "Dedicated account support", "Business intelligence"], escrow_rate: "Negotiated support for larger trades", cta_label: "Choose Business", cta_href: "/early-access", badge: null, highlighted: false, published: true, sort_order: 3 },
];

export const defaultFees: PlatformFee[] = [
  { label: "KSh 0–250K", value: "2.5%", description: "Deal Room transaction fee", published: true, sort_order: 1 },
  { label: "KSh 250K–1M", value: "2%", description: "Deal Room transaction fee", published: true, sort_order: 2 },
  { label: "KSh 1M–5M", value: "1.5%", description: "Deal Room transaction fee", published: true, sort_order: 3 },
  { label: "KSh 5M–25M", value: "1%", description: "Deal Room transaction fee", published: true, sort_order: 4 },
  { label: "KSh 25M+", value: "Negotiated", description: "Deal Room transaction fee", published: true, sort_order: 5 },
  { label: "Logistics Centre", value: "3–8%", description: "Target service margin, depending on the route and service.", published: true, sort_order: 6 },
  { label: "Green Africa", value: "1–3%", description: "Typical commission target on successful green trade transactions.", published: true, sort_order: 7 },
];
