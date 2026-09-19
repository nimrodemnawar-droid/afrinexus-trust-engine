import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import type { PricingPlan, PlatformFee } from "@/lib/pricing";

type PlanRow = PricingPlan & { id: string };
type FeeRow = PlatformFee & { id: string };

export function PricingManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [fees, setFees] = useState<FeeRow[]>([]);

  const load = async () => {
    const [{ data: p }, { data: f }] = await Promise.all([
      supabase.from("pricing_plans").select("*").order("sort_order"),
      supabase.from("platform_fees").select("*").order("sort_order"),
    ]);
    setPlans((p as PlanRow[]) ?? []);
    setFees((f as FeeRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const savePlan = async (plan: PlanRow) => {
    setSavingId(plan.id);
    const { id, ...rest } = plan;
    const { error } = await supabase.from("pricing_plans").update(rest).eq("id", id);
    setSavingId(null);
    toast(error ? { title: "Could not save", description: error.message, variant: "destructive" } : { title: "Plan saved" });
  };

  const saveFee = async (fee: FeeRow) => {
    setSavingId(fee.id);
    const { id, ...rest } = fee;
    const { error } = await supabase.from("platform_fees").update(rest).eq("id", id);
    setSavingId(null);
    toast(error ? { title: "Could not save", description: error.message, variant: "destructive" } : { title: "Fee saved" });
  };

  const addFee = async () => {
    const { error } = await supabase.from("platform_fees").insert({
      label: "New fee",
      value: "0%",
      description: "",
      published: false,
      sort_order: fees.length + 1,
    });
    if (error) return toast({ title: "Could not add", description: error.message, variant: "destructive" });
    await load();
  };

  const addPlan = async () => {
    const { error } = await supabase.from("pricing_plans").insert({
      name: "New plan",
      price: "KSh 0",
      cadence: "/month",
      tagline: "",
      features: [],
      escrow_rate: "",
      cta_label: "Apply for Early Access",
      cta_href: "/early-access",
      badge: null,
      highlighted: false,
      published: false,
      sort_order: plans.length + 1,
    });
    if (error) return toast({ title: "Could not add", description: error.message, variant: "destructive" });
    await load();
  };

  const deletePlan = async (id: string) => {
    const { error } = await supabase.from("pricing_plans").delete().eq("id", id);
    if (error) return toast({ title: "Could not delete", description: error.message, variant: "destructive" });
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteFee = async (id: string) => {
    const { error } = await supabase.from("platform_fees").delete().eq("id", id);
    if (error) return toast({ title: "Could not delete", description: error.message, variant: "destructive" });
    setFees((prev) => prev.filter((f) => f.id !== id));
  };

  const setPlan = (id: string, patch: Partial<PlanRow>) =>
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const setFee = (id: string, patch: Partial<FeeRow>) =>
    setFees((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-serif text-xl text-foreground">Plans</h3>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className="space-y-3 rounded-xl border bg-card p-5">
              <Input value={p.name} onChange={(e) => setPlan(p.id, { name: e.target.value })} placeholder="Plan name" />
              <div className="grid grid-cols-2 gap-3">
                <Input value={p.price} onChange={(e) => setPlan(p.id, { price: e.target.value })} placeholder="KSh 0" />
                <Input value={p.cadence} onChange={(e) => setPlan(p.id, { cadence: e.target.value })} placeholder="/month" />
              </div>
              <Textarea value={p.tagline} onChange={(e) => setPlan(p.id, { tagline: e.target.value })} placeholder="Short description" rows={2} />
              <div>
                <Label className="text-xs text-muted-foreground">Features (one per line)</Label>
                <Textarea
                  rows={8}
                  value={p.features.join("\n")}
                  onChange={(e) => setPlan(p.id, { features: e.target.value.split("\n").filter((l) => l.trim() !== "") })}
                />
              </div>
              <Input value={p.escrow_rate} onChange={(e) => setPlan(p.id, { escrow_rate: e.target.value })} placeholder="Transaction fee note" />
              <div className="grid grid-cols-2 gap-3">
                <Input value={p.cta_label} onChange={(e) => setPlan(p.id, { cta_label: e.target.value })} placeholder="Button text" />
                <Input value={p.cta_href} onChange={(e) => setPlan(p.id, { cta_href: e.target.value })} placeholder="/early-access" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input value={p.badge ?? ""} onChange={(e) => setPlan(p.id, { badge: e.target.value || null })} placeholder="Badge (optional)" />
                <Input
                  type="number"
                  value={p.sort_order}
                  onChange={(e) => setPlan(p.id, { sort_order: Number(e.target.value) })}
                  placeholder="Order"
                />
              </div>
              <div className="flex items-center gap-6 pt-1">
                <div className="flex items-center gap-2">
                  <Switch checked={p.highlighted} onCheckedChange={(v) => setPlan(p.id, { highlighted: v })} />
                  <Label className="text-sm">Highlighted</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={p.published} onCheckedChange={(v) => setPlan(p.id, { published: v })} />
                  <Label className="text-sm">Published</Label>
                </div>
              </div>
              <Button onClick={() => savePlan(p)} disabled={savingId === p.id} className="w-full bg-accent text-accent-foreground hover:bg-gold-dark">
                {savingId === p.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save plan
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-foreground">Fees & rates</h3>
          <Button variant="outline" onClick={addFee}>
            <Plus className="mr-2 h-4 w-4" /> Add fee
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {fees.map((f) => (
            <div key={f.id} className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_140px_2fr_auto]">
              <Input value={f.label} onChange={(e) => setFee(f.id, { label: e.target.value })} placeholder="Label" />
              <Input value={f.value} onChange={(e) => setFee(f.id, { value: e.target.value })} placeholder="2.5%" />
              <Input value={f.description} onChange={(e) => setFee(f.id, { description: e.target.value })} placeholder="Description" />
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  className="w-20"
                  value={f.sort_order}
                  onChange={(e) => setFee(f.id, { sort_order: Number(e.target.value) })}
                />
                <Switch checked={f.published} onCheckedChange={(v) => setFee(f.id, { published: v })} />
                <Button size="icon" variant="outline" onClick={() => saveFee(f)} disabled={savingId === f.id}>
                  {savingId === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="outline" onClick={() => deleteFee(f.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
