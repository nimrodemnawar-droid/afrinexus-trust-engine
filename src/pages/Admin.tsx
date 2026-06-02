import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";

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

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserEmail(session.user.email ?? null);

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      const { data, error } = await supabase
        .from("early_access_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "Failed to load applications", description: error.message, variant: "destructive" });
      } else {
        setApps((data as Application[]) ?? []);
      }
      setLoading(false);
    };
    init();
  }, [navigate, toast]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
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

  if (!isAdmin) {
    return (
      <Layout>
        <section className="container py-20 max-w-xl">
          <div className="rounded-lg border bg-card p-8 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 font-serif text-2xl text-foreground">Access Denied</h1>
            <p className="mt-2 text-muted-foreground">
              Your account ({userEmail}) does not have admin privileges.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              To grant admin access, run this in your backend SQL editor:
              <br />
              <code className="mt-2 inline-block rounded bg-muted px-2 py-1 text-xs">
                INSERT INTO public.user_roles (user_id, role) VALUES ('{`<your-user-id>`}', 'admin');
              </code>
            </p>
            <Button onClick={signOut} variant="outline" className="mt-6">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Early Access Applications</h1>
            <p className="text-sm text-muted-foreground mt-1">{apps.length} total · signed in as {userEmail}</p>
          </div>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No applications yet.
                  </TableCell>
                </TableRow>
              )}
              {apps.map((a) => (
                <TableRow key={a.id} className="cursor-pointer" onClick={() => setSelected(a)}>
                  <TableCell className="font-medium">{a.full_name}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.company}</TableCell>
                  <TableCell>{a.role}</TableCell>
                  <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                  <TableCell><Button size="sm" variant="ghost">View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4" onClick={() => setSelected(null)}>
            <div className="max-w-2xl w-full rounded-lg border bg-card p-8 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-serif text-2xl text-foreground">{selected.full_name}</h2>
              <p className="text-sm text-muted-foreground">{selected.email}</p>
              <dl className="mt-6 space-y-3 text-sm">
                <div><dt className="font-semibold">Company</dt><dd>{selected.company}</dd></div>
                <div><dt className="font-semibold">Role</dt><dd>{selected.role}</dd></div>
                <div><dt className="font-semibold">Status</dt><dd>{selected.status}</dd></div>
                <div><dt className="font-semibold">Submitted</dt><dd>{new Date(selected.created_at).toLocaleString()}</dd></div>
                <div><dt className="font-semibold">Context</dt><dd className="whitespace-pre-wrap mt-1">{selected.context}</dd></div>
              </dl>
              <Button onClick={() => setSelected(null)} variant="outline" className="mt-6">Close</Button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
