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
