CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_messages_user_created_idx ON public.chat_messages (user_id, created_at);

GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own chat messages"
ON public.chat_messages FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
ON public.chat_messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages"
ON public.chat_messages FOR DELETE TO authenticated
USING (auth.uid() = user_id);
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT 'Custom',
  cadence TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  escrow_rate TEXT NOT NULL DEFAULT '',
  cta_label TEXT NOT NULL DEFAULT 'Apply for Early Access',
  cta_href TEXT NOT NULL DEFAULT '/early-access',
  badge TEXT,
  highlighted BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pricing_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_plans TO authenticated;
GRANT ALL ON public.pricing_plans TO service_role;

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published plans" ON public.pricing_plans
  FOR SELECT TO anon, authenticated USING (published = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert plans" ON public.pricing_plans
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update plans" ON public.pricing_plans
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete plans" ON public.pricing_plans
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.platform_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.platform_fees TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_fees TO authenticated;
GRANT ALL ON public.platform_fees TO service_role;

ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published fees" ON public.platform_fees
  FOR SELECT TO anon, authenticated USING (published = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert fees" ON public.platform_fees
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update fees" ON public.platform_fees
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete fees" ON public.platform_fees
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_platform_fees_updated_at
  BEFORE UPDATE ON public.platform_fees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
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
