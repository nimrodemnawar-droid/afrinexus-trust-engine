import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, LogOut, FileText, Clock, CheckCircle2, XCircle, LayoutDashboard,
  Handshake, Truck, CreditCard, Package, Building2, BarChart3, Globe2, Settings,
  AlertTriangle, ArrowRight, MessageSquare,
} from "lucide-react";

interface Application {
  id: string;
  full_name: string;
  email: string;
  company: string;
  role: string;
  context: string;
  status: string;
  created_at: string;
}

const statusMeta: Record<string, { icon: typeof Clock; label: string; className: string }> = {
  pending: { icon: Clock, label: "Under Review", className: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  approved: { icon: CheckCircle2, label: "Approved", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  rejected: { icon: XCircle, label: "Not Selected", className: "bg-destructive/15 text-destructive border-destructive/30" },
  in_progress: { icon: Clock, label: "In Progress", className: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Deal Room", icon: Handshake },
  { label: "Logistics", icon: Truck },
  { label: "Payments", icon: CreditCard },
  { label: "Orders", icon: Package },
  { label: "Business", icon: Building2 },
  { label: "Analytics", icon: BarChart3 },
  { label: "Trade Hub", icon: Globe2 },
  { label: "Settings", icon: Settings },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<Application[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserEmail(session.user.email ?? null);
      const { data } = await supabase
        .from("early_access_applications")
        .select("*")
        .order("created_at", { ascending: false });
      setApps((data as Application[]) ?? []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const pending = apps.filter((a) => a.status === "pending" || a.status === "in_progress").length;
  const approved = apps.filter((a) => a.status === "approved").length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-primary text-primary-foreground md:flex">
        <Link to="/" className="border-b border-primary-foreground/10 px-6 py-5 font-serif text-xl">
          Afrinexus
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((n) => (
            <div
              key={n.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                n.active
                  ? "bg-accent/15 font-medium text-accent"
                  : "text-primary-foreground/60"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
              {!n.active && <span className="ml-auto text-[10px] uppercase tracking-wide text-primary-foreground/35">Soon</span>}
            </div>
          ))}
        </nav>
        <div className="border-t border-primary-foreground/10 p-4">
          <Button onClick={signOut} variant="outline" className="w-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b bg-background px-6 py-5">
          <div>
            <h1 className="font-serif text-2xl text-foreground">Your Trade Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {userEmail}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/chat"><MessageSquare className="mr-2 h-4 w-4" /> Ask Nexus</Link>
            </Button>
            <Button onClick={signOut} variant="outline" size="sm" className="md:hidden">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="space-y-6 p-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat icon={FileText} label="Applications" value={String(apps.length)} />
            <Stat icon={Clock} label="Pending Review" value={String(pending)} />
            <Stat icon={CheckCircle2} label="Approved" value={String(approved)} />
            <Stat icon={Handshake} label="Active Deals" value="—" note="Available once Deal Rooms launch" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Applications */}
            <section className="rounded-xl border bg-card p-6 lg:col-span-2">
              <h2 className="font-serif text-lg text-foreground">Your Applications</h2>
              {apps.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">No applications yet.</p>
                  <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-gold-dark">
                    <Link to="/early-access">Apply for Early Access</Link>
                  </Button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {apps.map((a) => {
                    const meta = statusMeta[a.status] ?? statusMeta.pending;
                    const Icon = meta.icon;
                    return (
                      <div key={a.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif text-base text-foreground">{a.company}</h3>
                            <p className="text-sm text-muted-foreground">{a.role}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Submitted {new Date(a.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className={meta.className}>
                            <Icon className="mr-1 h-3 w-3" /> {meta.label}
                          </Badge>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-foreground/80">{a.context}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Next best action */}
            <section className="rounded-xl border bg-card p-6">
              <h2 className="font-serif text-lg text-foreground">Next Best Action</h2>
              {apps.length === 0 ? (
                <ActionCard
                  title="Submit your application"
                  text="Verification is the first step to trading on Afrinexus."
                  cta="Apply now"
                  href="/early-access"
                />
              ) : pending > 0 ? (
                <ActionCard
                  title="Your application is under review"
                  text="Our team verifies every business manually. We will contact you by email."
                  cta="Contact the team"
                  href="/contact"
                />
              ) : (
                <ActionCard
                  title="Explore the platform"
                  text="See how Deal Rooms, Logistics Centre and Green Africa work together."
                  cta="View platform"
                  href="/platform"
                />
              )}
            </section>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Placeholder icon={Truck} title="Logistics" text="Shipment tracking and carrier comparison arrive with the Logistics Centre." />
            <Placeholder icon={CreditCard} title="Payments" text="Deal Room transaction records and receipts will appear here." />
            <Placeholder icon={BarChart3} title="Recent Activity" text="Your trade history builds as deals complete on the platform." />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, note }: { icon: typeof FileText; label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <p className="mt-3 font-serif text-3xl text-foreground">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

function ActionCard({ title, text, cta, href }: { title: string; text: string; cta: string; href: string }) {
  return (
    <div className="mt-4 rounded-lg border border-accent/30 bg-accent/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
      <Button asChild size="sm" className="mt-4 w-full bg-accent text-accent-foreground hover:bg-gold-dark">
        <Link to={href}>
          {cta} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function Placeholder({ icon: Icon, title, text }: { icon: typeof Truck; title: string; text: string }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" />
        <h3 className="font-serif text-base text-foreground">{title}</h3>
        <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">Coming later</span>
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
