CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_role_key ON public.user_roles (user_id, role);

CREATE OR REPLACE FUNCTION public.add_admin_by_email(target_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email text := lower(trim(target_email));
  target_user_id uuid;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Only an existing admin can add another admin' USING ERRCODE = '42501';
  END IF;

  IF normalized_email IS NULL OR normalized_email = '' OR char_length(normalized_email) > 255 OR normalized_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Enter a valid account email address' USING ERRCODE = '22023';
  END IF;

  SELECT u.id
  INTO target_user_id
  FROM auth.users AS u
  WHERE lower(u.email) = normalized_email
  ORDER BY u.created_at
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'No registered account was found for that email' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.add_admin_by_email(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_admin_by_email(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.list_admin_accounts()
RETURNS TABLE (user_id uuid, email text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Only admins can view administrator accounts' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT ur.user_id, u.email::text, ur.created_at
  FROM public.user_roles AS ur
  JOIN auth.users AS u ON u.id = ur.user_id
  WHERE ur.role = 'admin'::public.app_role
  ORDER BY ur.created_at ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.list_admin_accounts() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_admin_accounts() TO authenticated, service_role;