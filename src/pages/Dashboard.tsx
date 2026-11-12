import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanApplicationForm } from "@/components/dashboard/PlanApplicationForm";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, LogOut, FileText, Clock, CheckCircle2, XCircle, LayoutDashboard,
  Handshake, Truck, CreditCard, BarChart3, ArrowRight, MessageSquare,
  ShieldCheck, Route, ClipboardList,
} from "lucide-react";

interface PlanApplication {
  id: string;
  plan: string;
  company: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const statusMeta: Record<string, { icon: typeof Clock; label: string; className: string }> = {
  pending: { icon: Clock, label: "Pending review", className: "border-amber-500/30 bg-amber-500/15 text-amber-600" },
  in_review: { icon: Clock, label: "In review", className: "border-blue-500/30 bg-blue-500/15 text-blue-600" },
  approved: { icon: CheckCircle2, label: "Approved", className: "border-emerald-500/30 bg-emerald-500/15 text-emerald-600" },
  rejected: { icon: XCircle, label: "Not approved", className: "border-destructive/30 bg-destructive/15 text-destructive" },
};

const workingLinks = [
  { label: "Trade process", href: "/how-it-works", icon: Route },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
  { label: "Ask Nexus", href: "/chat", icon: MessageSquare },
  { label: "Contact", href: "/contact", icon: ClipboardList },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<PlanApplication[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadApplications = useCallback(async (forUserId: string) => {
    const { data, error } = await supabase
      .from("plan_applications")
      .select("id, plan, company, status, admin_notes, created_at")
      .eq("user_id", forUserId)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Could not load your applications", description: "Please refresh the page or contact Afrinexus.", variant: "destructive" });
      return;
    }
    setApplications((data as PlanApplication[]) ?? []);
  }, [toast]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      setUserEmail(session.user.email ?? null);
      await loadApplications(session.user.id);
      if (mounted) setLoading(false);
    };
    void init();
    return () => { mounted = false; };
  }, [navigate, loadApplications]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  const pending = applications.filter((application) => application.status === "pending" || application.status === "in_review").length;
  const approved = applications.filter((application) => application.status === "approved").length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-60 shrink-0 flex-col bg-primary text-primary-foreground md:flex">
        <Link to="/" className="border-b border-primary-foreground/10 px-6 py-5 font-serif text-xl">Afrinexus</Link>
        <nav className="flex-1 space-y-1 p-3" aria-label="Dashboard navigation">
          <a href="#overview" className="flex items-center gap-3 rounded-md bg-accent/15 px-3 py-2.5 text-sm font-medium text-accent"><LayoutDashboard className="h-4 w-4" />Overview</a>
          <a href="#applications" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-primary-foreground/75 hover:bg-primary-foreground/10"><FileText className="h-4 w-4" />Plan applications</a>
          {workingLinks.map(({ label, href, icon: Icon }) => (
            <Link key={href} to={href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-primary-foreground/75 hover:bg-primary-foreground/10"><Icon className="h-4 w-4" />{label}</Link>
          ))}
        </nav>
        <div className="border-t border-primary-foreground/10 p-4">
          <Button onClick={signOut} variant="outline" className="w-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <header id="overview" className="border-b bg-background px-5 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Member workspace</p>
              <h1 className="mt-1 font-serif text-2xl text-foreground">Your Trade Dashboard</h1>
              <p className="mt-1 break-all text-sm text-muted-foreground">{userEmail}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm"><Link to="/chat"><MessageSquare className="mr-2 h-4 w-4" />Ask Nexus</Link></Button>
              <Button onClick={signOut} variant="outline" size="sm" className="md:hidden" aria-label="Sign out"><LogOut className="h-4 w-4" /></Button>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden" aria-label="Dashboard navigation">
            <a href="#applications" className="shrink-0 border px-3 py-2 text-sm">Applications</a>
            {workingLinks.map(({ label, href }) => <Link key={href} to={href} className="shrink-0 border px-3 py-2 text-sm">{label}</Link>)}
          </nav>
        </header>

        <div className="space-y-8 p-5 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat icon={FileText} label="Plan applications" value={String(applications.length)} />
            <Stat icon={Clock} label="Awaiting a decision" value={String(pending)} />
            <Stat icon={CheckCircle2} label="Approved" value={String(approved)} />
          </div>

          <section id="applications" className="scroll-mt-6 border-t pt-7">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-accent" />
                  <h2 className="font-serif text-xl text-foreground">Your plan applications</h2>
                </div>
                {applications.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">You have not submitted a plan application yet.</p>
                ) : (
                  <div className="mt-4 divide-y border-y">
                    {applications.map((application) => {
                      const meta = statusMeta[application.status] ?? statusMeta.pending;
                      const Icon = meta.icon;
                      return (
                        <article key={application.id} className="py-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="font-serif text-lg text-foreground">{application.company}</h3>
                              <p className="text-sm text-muted-foreground">{application.plan} plan · Submitted {new Date(application.created_at).toLocaleDateString()}</p>
                            </div>
                            <Badge variant="outline" className={meta.className}><Icon className="mr-1 h-3 w-3" />{meta.label}</Badge>
                          </div>
                          {application.status === "approved" && <p className="mt-3 text-sm text-emerald-700">Your application is approved. The Afrinexus team will contact you about onboarding.</p>}
                          {application.status === "rejected" && <p className="mt-3 text-sm text-muted-foreground">Contact Afrinexus if you would like clarification or to discuss next steps.</p>}
                          {application.admin_notes && <p className="mt-3 border-l-2 border-accent pl-3 text-sm text-muted-foreground">Team update: {application.admin_notes}</p>}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="border-l-0 pt-1 lg:border-l lg:pl-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <h2 className="font-serif text-xl text-foreground">Apply for a plan</h2>
                </div>
                <p className="mb-5 mt-2 text-sm text-muted-foreground">Applications are reviewed by the Afrinexus team. A request is not a payment or automatic approval.</p>
                {userId && userEmail && <PlanApplicationForm userId={userId} email={userEmail} onSubmitted={() => loadApplications(userId)} />}
              </div>
            </div>
          </section>

          <section className="border-t pt-7">
            <div className="flex items-center gap-3">
              <Handshake className="h-5 w-5 text-accent" />
              <h2 className="font-serif text-xl text-foreground">Trade process</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Review how verification, documented agreements, logistics coordination and delivery records work during Afrinexus early access.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="outline"><Link to="/how-it-works">Explore the trade journey<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button asChild variant="outline"><Link to="/journey/verification"><ShieldCheck className="mr-2 h-4 w-4" />Verification</Link></Button>
              <Button asChild variant="outline"><Link to="/journey/deal-room"><Handshake className="mr-2 h-4 w-4" />Deal Room</Link></Button>
              <Button asChild variant="outline"><Link to="/journey/logistics"><Truck className="mr-2 h-4 w-4" />Logistics</Link></Button>
              <Button asChild variant="outline"><Link to="/journey/tracking"><BarChart3 className="mr-2 h-4 w-4" />Tracking</Link></Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Live trade records, payments, shipment tracking and analytics are not yet available in the member workspace. Afrinexus coordinates these steps manually during early access.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="border bg-card p-5">
      <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><Icon className="h-4 w-4 text-accent" /></div>
      <p className="mt-3 font-serif text-3xl text-foreground">{value}</p>
    </div>
  );
}
