ALTER TABLE public.early_access_applications ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS admin_notes TEXT;