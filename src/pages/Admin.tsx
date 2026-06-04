import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, LogOut, ShieldAlert, FileText, Mail, Clock, CheckCircle2 } from "lucide-react";

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

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const APP_STATUSES = ["pending", "in_progress", "approved", "rejected"];
const MSG_STATUSES = ["new", "in_progress", "resolved"];

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [msgs, setMsgs] = useState<ContactMessage[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchAll = async () => {
    const [{ data: appsData }, { data: msgsData }] = await Promise.all([
      supabase.from("early_access_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
    ]);
    setApps((appsData as Application[]) ?? []);
    setMsgs((msgsData as ContactMessage[]) ?? []);
  };

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
      await fetchAll();
      setLoading(false);
    };
    init();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const updateAppStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("early_access_applications").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
      return;
    }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, status });
    toast({ title: "Status updated" });
  };

  const updateMsgStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
      return;
    }
    setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    if (selectedMsg?.id === id) setSelectedMsg({ ...selectedMsg, status });
    toast({ title: "Status updated" });
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
            <Button onClick={signOut} variant="outline" className="mt-6">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const pendingApps = apps.filter((a) => a.status === "pending").length;
  const approvedApps = apps.filter((a) => a.status === "approved").length;
  const newMsgs = msgs.filter((m) => m.status === "new").length;

  return (
    <Layout>
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Admin Console</h1>
            <p className="text-sm text-muted-foreground mt-1">Signed in as {userEmail}</p>
          </div>
          <Button onClick={signOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={FileText} label="Total Applications" value={apps.length} />
          <StatCard icon={Clock} label="Pending Review" value={pendingApps} />
          <StatCard icon={CheckCircle2} label="Approved" value={approvedApps} />
          <StatCard icon={Mail} label="New Messages" value={newMsgs} />
        </div>

        <Tabs defaultValue="applications">
          <TabsList>
            <TabsTrigger value="applications">Applications ({apps.length})</TabsTrigger>
            <TabsTrigger value="messages">Contact Messages ({msgs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <div className="rounded-lg border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
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
                    <TableRow key={a.id} className="cursor-pointer" onClick={() => setSelectedApp(a)}>
                      <TableCell className="font-medium">{a.full_name}</TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.company}</TableCell>
                      <TableCell>{a.role}</TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                      <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <div className="rounded-lg border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {msgs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No messages yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {msgs.map((m) => (
                    <TableRow key={m.id} className="cursor-pointer" onClick={() => setSelectedMsg(m)}>
                      <TableCell className="font-medium">{m.full_name}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{m.subject}</TableCell>
                      <TableCell><StatusBadge status={m.status} /></TableCell>
                      <TableCell>{new Date(m.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Application detail modal */}
        {selectedApp && (
          <Modal onClose={() => setSelectedApp(null)}>
            <h2 className="font-serif text-2xl text-foreground">{selectedApp.full_name}</h2>
            <p className="text-sm text-muted-foreground">{selectedApp.email}</p>
            <dl className="mt-6 space-y-3 text-sm">
              <Row label="Company" value={selectedApp.company} />
              <Row label="Role" value={selectedApp.role} />
              <Row label="Submitted" value={new Date(selectedApp.created_at).toLocaleString()} />
              <div>
                <dt className="font-semibold mb-1">Status</dt>
                <Select value={selectedApp.status} onValueChange={(v) => updateAppStatus(selectedApp.id, v)}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {APP_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <dt className="font-semibold">Context</dt>
                <dd className="whitespace-pre-wrap mt-1">{selectedApp.context}</dd>
              </div>
            </dl>
            <Button onClick={() => setSelectedApp(null)} variant="outline" className="mt-6">Close</Button>
          </Modal>
        )}

        {/* Message detail modal */}
        {selectedMsg && (
          <Modal onClose={() => setSelectedMsg(null)}>
            <h2 className="font-serif text-2xl text-foreground">{selectedMsg.subject}</h2>
            <p className="text-sm text-muted-foreground">
              From {selectedMsg.full_name} · <a className="text-accent underline" href={`mailto:${selectedMsg.email}`}>{selectedMsg.email}</a>
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <Row label="Received" value={new Date(selectedMsg.created_at).toLocaleString()} />
              <div>
                <dt className="font-semibold mb-1">Status</dt>
                <Select value={selectedMsg.status} onValueChange={(v) => updateMsgStatus(selectedMsg.id, v)}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MSG_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <dt className="font-semibold">Message</dt>
                <dd className="whitespace-pre-wrap mt-1">{selectedMsg.message}</dd>
              </div>
            </dl>
            <div className="mt-6 flex gap-2">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-gold-dark">
                <a href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}>Reply via Email</a>
              </Button>
              <Button onClick={() => setSelectedMsg(null)} variant="outline">Close</Button>
            </div>
          </Modal>
        )}
      </section>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <p className="mt-2 font-serif text-3xl text-foreground">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    new: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    in_progress: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    approved: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    resolved: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    rejected: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={map[status] ?? ""}>{status}</Badge>;
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4" onClick={onClose}>
      <div className="max-w-2xl w-full rounded-lg border bg-card p-8 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div><dt className="font-semibold">{label}</dt><dd>{value}</dd></div>
  );
}
