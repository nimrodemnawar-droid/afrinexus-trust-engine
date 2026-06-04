import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: string;
  full_name: string;
  email: string;
  company: string;
  role: string;
  context: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusMeta: Record<string, { icon: typeof Clock; label: string; className: string }> = {
  pending: { icon: Clock, label: "Under Review", className: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  approved: { icon: CheckCircle2, label: "Approved", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  rejected: { icon: XCircle, label: "Not Selected", className: "bg-destructive/15 text-destructive border-destructive/30" },
  in_progress: { icon: Clock, label: "In Progress", className: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
};

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
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Your Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Signed in as {userEmail}</p>
          </div>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <h2 className="font-serif text-xl text-foreground mb-4">Your Early Access Applications</h2>

        {apps.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No applications yet.</p>
            <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-gold-dark">
              <a href="/early-access">Apply for Early Access</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((a) => {
              const meta = statusMeta[a.status] ?? statusMeta.pending;
              const Icon = meta.icon;
              return (
                <div key={a.id} className="rounded-lg border bg-card p-6 hover:shadow-gold transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-foreground">{a.company}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{a.role}</p>
                      <p className="text-xs text-muted-foreground mt-3">
                        Submitted {new Date(a.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className={meta.className}>
                      <Icon className="h-3 w-3 mr-1" />
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="mt-4 text-sm text-foreground/80 whitespace-pre-wrap line-clamp-3">
                    {a.context}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}
