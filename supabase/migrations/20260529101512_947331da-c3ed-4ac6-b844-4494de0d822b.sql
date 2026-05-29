CREATE TABLE public.early_access_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  context text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.early_access_applications TO anon, authenticated;
GRANT ALL ON public.early_access_applications TO service_role;

ALTER TABLE public.early_access_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.early_access_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(company) BETWEEN 1 AND 160
    AND length(role) BETWEEN 1 AND 120
    AND length(context) BETWEEN 10 AND 4000
  );