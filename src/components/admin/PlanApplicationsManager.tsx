import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Save } from "lucide-react";

export interface PlanApplication {
  id: string;
  user_id: string;
  email: string;
  plan: string;
  company: string;
  contact_name: string;
  phone: string | null;
  country: string | null;
  trade_focus: string | null;
  monthly_volume: string | null;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export const PLAN_APP_STATUSES = ["pending", "in_review", "approved", "rejected"];

export const planStatusStyles: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  in_review: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  approved: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function PlanApplicationsManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<PlanApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase
      .from("plan_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as PlanApplication[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (row: PlanApplication, patch: { status?: string; admin_notes?: string }) => {
    setSavingId(row.id);
    const { error } = await supabase.from("plan_applications").update(patch).eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...patch } : r)));
    toast({ title: "Application updated" });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesSearch =
        q === "" ||
        [r.company, r.contact_name, r.email, r.plan, r.country ?? ""].some((v) =>
          v.toLowerCase().includes(q)
        );
      return matchesStatus && matchesSearch;
    });
  }, [rows, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search company, contact, email or plan"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PLAN_APP_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No plan applications yet.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg text-foreground">{r.company}</h3>
                  <p className="text-sm text-muted-foreground">
                    {r.contact_name} · {r.email}
                    {r.phone ? ` · ${r.phone}` : ""}
                    {r.country ? ` · ${r.country}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-accent/40 text-accent">
                    {r.plan}
                  </Badge>
                  <Badge variant="outline" className={planStatusStyles[r.status] ?? ""}>
                    {r.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Trade focus</dt>
                  <dd className="text-foreground/85">{r.trade_focus || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Monthly volume</dt>
                  <dd className="text-foreground/85">{r.monthly_volume || "—"}</dd>
                </div>
              </dl>
              {r.notes && <p className="mt-3 text-sm text-foreground/80">{r.notes}</p>}

              <div className="mt-4 grid gap-3 md:grid-cols-[200px_1fr_auto] md:items-start">
                <Select value={r.status} onValueChange={(v) => update(r, { status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_APP_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  rows={2}
                  placeholder="Private admin notes"
                  value={notes[r.id] ?? r.admin_notes ?? ""}
                  onChange={(e) => setNotes((p) => ({ ...p, [r.id]: e.target.value }))}
                />
                <Button
                  variant="outline"
                  disabled={savingId === r.id}
                  onClick={() => update(r, { admin_notes: notes[r.id] ?? r.admin_notes ?? "" })}
                >
                  {savingId === r.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save notes
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
