CREATE TABLE public.plan_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  plan text NOT NULL,
  company text NOT NULL,
  contact_name text NOT NULL,
  phone text,
  country text,
  trade_focus text,
  monthly_volume text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.plan_applications TO authenticated;
GRANT ALL ON public.plan_applications TO service_role;

ALTER TABLE public.plan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own plan applications"
ON public.plan_applications FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can submit their own plan applications"
ON public.plan_applications FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND length(company) BETWEEN 1 AND 160
  AND length(contact_name) BETWEEN 1 AND 120
  AND length(plan) BETWEEN 1 AND 60
  AND status = 'pending'
);

CREATE POLICY "Admins can update plan applications"
ON public.plan_applications FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_plan_applications_updated_at
BEFORE UPDATE ON public.plan_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX plan_applications_user_idx ON public.plan_applications (user_id, created_at DESC);