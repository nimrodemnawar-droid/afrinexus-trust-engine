import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { planApplicationSchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

interface PlanApplicationFormProps {
  userId: string;
  email: string;
  onSubmitted: () => Promise<void>;
}

export function PlanApplicationForm({ userId, email, onSubmitted }: PlanApplicationFormProps) {
  const { toast } = useToast();
  const [plan, setPlan] = useState("FREE");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = planApplicationSchema.safeParse({
      plan,
      company: data.get("company"),
      contact_name: data.get("contact_name"),
      phone: data.get("phone"),
      country: data.get("country"),
      trade_focus: data.get("trade_focus"),
      monthly_volume: data.get("monthly_volume"),
      notes: data.get("notes"),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]?.toString() ?? "form";
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      toast({ title: "Check the highlighted fields", variant: "destructive" });
      return;
    }

    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("plan_applications").insert({
      ...parsed.data,
      user_id: userId,
      email,
      status: "pending",
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Could not submit application", description: "Please try again. If the problem continues, contact Afrinexus.", variant: "destructive" });
      return;
    }

    form.reset();
    setPlan("FREE");
    await onSubmitted();
    toast({ title: "Application received", description: "You can follow its status in your dashboard." });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label htmlFor="requested-plan">Plan</Label>
        <Select value={plan} onValueChange={setPlan}>
          <SelectTrigger id="requested-plan" className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="FREE">Free · KSh 0/month</SelectItem>
            <SelectItem value="PRO">Pro · KSh 1,500/month</SelectItem>
            <SelectItem value="BUSINESS">Business · KSh 5,000/month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="company" label="Business name" required error={errors.company} />
        <Field id="contact_name" label="Contact name" required error={errors.contact_name} />
        <Field id="phone" label="Phone" error={errors.phone} />
        <Field id="country" label="Country" error={errors.country} />
        <Field id="trade_focus" label="Trade focus" error={errors.trade_focus} />
        <Field id="monthly_volume" label="Expected monthly trade volume" error={errors.monthly_volume} />
      </div>
      <div>
        <Label htmlFor="plan-notes">How will Afrinexus support your trade?</Label>
        <Textarea id="plan-notes" name="notes" rows={3} maxLength={1500} className="mt-1.5" placeholder="Share the corridors, products, or support you need." />
        {errors.notes && <p className="mt-1 text-sm text-destructive">{errors.notes}</p>}
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        {submitting ? "Submitting…" : "Submit plan application"}
      </Button>
    </form>
  );
}

function Field({ id, label, required = false, error }: { id: string; label: string; required?: boolean; error?: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</Label>
      <Input id={id} name={id} required={required} maxLength={id === "company" ? 160 : id === "contact_name" ? 120 : 160} className="mt-1.5" />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}