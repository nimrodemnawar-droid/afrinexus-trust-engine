import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2, LogOut, ShieldAlert, FileText, Mail, Clock, CheckCircle2,
  Search, Download, Save,
} from "lucide-react";

interface Application {
  id: string;
  full_name: string;
  email: string;
  company: string;
  role: string;
  country: string | null;
  context: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const APP_STATUSES = ["pending", "in_progress", "approved", "rejected"];
const MSG_STATUSES = ["new", "in_progress", "resolved"];

function toCsv(rows: Record<string, any>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => {
    const s = v === null || v === undefined ? "" : String(v);
    return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [msgs, setMsgs] = useState<ContactMessage[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState<string>("all");
  const [msgSearch, setMsgSearch] = useState("");
  const [msgStatusFilter, setMsgStatusFilter] = useState<string>("all");

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

  const saveNote = async (kind: "app" | "msg", id: string) => {
    setSavingNote(true);
    const table = kind === "app" ? "early_access_applications" : "contact_submissions";
    const { error } = await supabase.from(table).update({ admin_notes: noteDraft }).eq("id", id);
    setSavingNote(false);
    if (error) {
      toast({ title: "Failed to save note", description: error.message, variant: "destructive" });
      return;
    }
    if (kind === "app") {
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, admin_notes: noteDraft } : a)));
      if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, admin_notes: noteDraft });
    } else {
      setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, admin_notes: noteDraft } : m)));
      if (selectedMsg?.id === id) setSelectedMsg({ ...selectedMsg, admin_notes: noteDraft });
    }
    toast({ title: "Note saved" });
  };

  const openApp = (a: Application) => {
    setSelectedApp(a);
    setNoteDraft(a.admin_notes ?? "");
  };
  const openMsg = (m: ContactMessage) => {
    setSelectedMsg(m);
    setNoteDraft(m.admin_notes ?? "");
  };

  const filteredApps = useMemo(() => {
    const q = appSearch.trim().toLowerCase();
    return apps.filter((a) => {
      if (appStatusFilter !== "all" && a.status !== appStatusFilter) return false;
      if (!q) return true;
      return [a.full_name, a.email, a.company, a.role, a.country, a.context]
        .some((f) => f?.toLowerCase().includes(q));
    });
  }, [apps, appSearch, appStatusFilter]);

  const filteredMsgs = useMemo(() => {
    const q = msgSearch.trim().toLowerCase();
    return msgs.filter((m) => {
      if (msgStatusFilter !== "all" && m.status !== msgStatusFilter) return false;
      if (!q) return true;
      return [m.full_name, m.email, m.subject, m.message]
        .some((f) => f?.toLowerCase().includes(q));
    });
  }, [msgs, msgSearch, msgStatusFilter]);

  const exportApps = () => {
    const rows = filteredApps.map(({ id, full_name, email, company, role, country, status, context, admin_notes, created_at }) =>
      ({ id, full_name, email, company, role, country, status, context, admin_notes, created_at }));
    downloadCsv(`applications-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  };
  const exportMsgs = () => {
    const rows = filteredMsgs.map(({ id, full_name, email, subject, message, status, admin_notes, created_at }) =>
      ({ id, full_name, email, subject, message, status, admin_notes, created_at }));
    downloadCsv(`messages-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
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

          {/* Applications */}
          <TabsContent value="applications" className="mt-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, company, role, context..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={appStatusFilter} onValueChange={setAppStatusFilter}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {APP_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={exportApps} variant="outline" disabled={filteredApps.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
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
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No applications match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredApps.map((a) => (
                    <TableRow key={a.id} className="cursor-pointer" onClick={() => openApp(a)}>
                      <TableCell className="font-medium">{a.full_name}</TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.company}</TableCell>
                      <TableCell>{a.role}</TableCell>
                      <TableCell>{a.country ?? "—"}</TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                      <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Showing {filteredApps.length} of {apps.length}
            </p>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages" className="mt-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, subject, message..."
                  value={msgSearch}
                  onChange={(e) => setMsgSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={msgStatusFilter} onValueChange={setMsgStatusFilter}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {MSG_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={exportMsgs} variant="outline" disabled={filteredMsgs.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>

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
                  {filteredMsgs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No messages match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredMsgs.map((m) => (
                    <TableRow key={m.id} className="cursor-pointer" onClick={() => openMsg(m)}>
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
            <p className="text-xs text-muted-foreground mt-2">
              Showing {filteredMsgs.length} of {msgs.length}
            </p>
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
              <Row label="Country" value={selectedApp.country ?? "—"} />
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
              <div>
                <dt className="font-semibold mb-1">Internal admin notes</dt>
                <Textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Private notes (calls, follow-ups, decisions)..."
                  rows={4}
                />
                <Button
                  onClick={() => saveNote("app", selectedApp.id)}
                  disabled={savingNote}
                  size="sm"
                  className="mt-2 bg-accent text-accent-foreground hover:bg-gold-dark"
                >
                  <Save className="mr-2 h-3 w-3" /> {savingNote ? "Saving..." : "Save note"}
                </Button>
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
              <div>
                <dt className="font-semibold mb-1">Internal admin notes</dt>
                <Textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Private notes..."
                  rows={4}
                />
                <Button
                  onClick={() => saveNote("msg", selectedMsg.id)}
                  disabled={savingNote}
                  size="sm"
                  className="mt-2 bg-accent text-accent-foreground hover:bg-gold-dark"
                >
                  <Save className="mr-2 h-3 w-3" /> {savingNote ? "Saving..." : "Save note"}
                </Button>
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
      <div className="max-w-2xl w-full rounded-lg border bg-card p-8 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
