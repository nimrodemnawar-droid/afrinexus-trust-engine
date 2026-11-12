import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";

interface AdminAccount {
  user_id: string;
  email: string;
  created_at: string;
}

export function AdminAccountsManager() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.rpc("list_admin_accounts");
    if (error) {
      toast({ title: "Could not load administrators", description: error.message, variant: "destructive" });
    } else {
      setAccounts((data as AdminAccount[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const addAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) {
      toast({ title: "Enter a valid email address", variant: "destructive" });
      return;
    }
    setAdding(true);
    const { error } = await supabase.rpc("add_admin_by_email", { target_email: normalized });
    setAdding(false);
    if (error) {
      toast({ title: "Could not add administrator", description: error.message, variant: "destructive" });
      return;
    }
    setEmail("");
    await load();
    toast({ title: "Administrator added", description: "They can sign in with this email to access the admin console." });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-serif text-xl text-foreground">Add an administrator</h2>
        <p className="mt-1 text-sm text-muted-foreground">Only existing administrators can add another registered account.</p>
        <form onSubmit={addAdmin} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="new-admin-email">Account email</Label>
            <Input id="new-admin-email" type="email" autoComplete="email" required maxLength={255} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5" placeholder="name@example.com" />
          </div>
          <Button type="submit" disabled={adding}>
            {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Add administrator
          </Button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl text-foreground">Current administrators</h2>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
        ) : accounts.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">No administrator accounts found.</p>
        ) : (
          <ul className="mt-4 divide-y border-y">
            {accounts.map((account) => (
              <li key={account.user_id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <span className="flex min-w-0 items-center gap-3 break-all text-sm text-foreground"><ShieldCheck className="h-4 w-4 shrink-0 text-accent" />{account.email}</span>
                <span className="text-xs text-muted-foreground">Added {new Date(account.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}