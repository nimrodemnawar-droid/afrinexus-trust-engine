-- Fix: the trigger `update_early_access_applications_updated_at`
-- (added in 20260604052133_7627de83-acaf-4897-835a-c0ea48b7432d.sql)
-- runs `NEW.updated_at = now()` on every UPDATE to
-- public.early_access_applications, but that table was created
-- (20260529101512_947331da-c3ed-4ac6-b844-4494de0d822b.sql) without an
-- updated_at column. This makes every UPDATE fail at the trigger,
-- including the admin approve/reject action in the Admin dashboard.
--
-- Fix: add the missing column, matching the sibling contact_submissions
-- table exactly. Additive only — no existing data or behavior changes.

ALTER TABLE public.early_access_applications
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
