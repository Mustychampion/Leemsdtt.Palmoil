
-- 1. Move has_role / has_any_role to a private schema so PostgREST cannot expose them
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

-- Recreate helpers in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION private.has_any_role(_user_id uuid, _roles public.app_role[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = ANY(_roles));
$$;

-- RLS evaluates policy expressions as the querying role, so authenticated must be
-- able to EXECUTE the helper. Because the schema is not exposed to PostgREST,
-- clients cannot call it directly over the Data API.
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.has_any_role(uuid, public.app_role[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_any_role(uuid, public.app_role[]) TO authenticated, service_role;

-- 2. Rewrite policies to use private.* helpers
-- bulk_quotes
DROP POLICY IF EXISTS "Staff update bulk quotes" ON public.bulk_quotes;
DROP POLICY IF EXISTS "Staff view bulk quotes" ON public.bulk_quotes;
DROP POLICY IF EXISTS "Super admin delete bulk quotes" ON public.bulk_quotes;
DROP POLICY IF EXISTS "Anyone can submit bulk quote" ON public.bulk_quotes;

CREATE POLICY "Staff view bulk quotes" ON public.bulk_quotes FOR SELECT
  USING (private.has_any_role(auth.uid(), ARRAY['super_admin','sales','support']::public.app_role[]));
CREATE POLICY "Staff update bulk quotes" ON public.bulk_quotes FOR UPDATE
  USING (private.has_any_role(auth.uid(), ARRAY['super_admin','sales']::public.app_role[]));
CREATE POLICY "Super admin delete bulk quotes" ON public.bulk_quotes FOR DELETE
  USING (private.has_role(auth.uid(), 'super_admin'::public.app_role));
-- Constrained insert: require non-empty business name + email, sane lengths
CREATE POLICY "Anyone can submit bulk quote" ON public.bulk_quotes FOR INSERT
  WITH CHECK (
    length(coalesce(business_name, '')) BETWEEN 1 AND 200
    AND length(coalesce(email, '')) BETWEEN 3 AND 255
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- distributor_applications
DROP POLICY IF EXISTS "Staff update distributor apps" ON public.distributor_applications;
DROP POLICY IF EXISTS "Staff view distributor apps" ON public.distributor_applications;
DROP POLICY IF EXISTS "Super admin delete distributor apps" ON public.distributor_applications;
DROP POLICY IF EXISTS "Anyone can apply as distributor" ON public.distributor_applications;

CREATE POLICY "Staff view distributor apps" ON public.distributor_applications FOR SELECT
  USING (private.has_any_role(auth.uid(), ARRAY['super_admin','sales','support']::public.app_role[]));
CREATE POLICY "Staff update distributor apps" ON public.distributor_applications FOR UPDATE
  USING (private.has_any_role(auth.uid(), ARRAY['super_admin','sales']::public.app_role[]));
CREATE POLICY "Super admin delete distributor apps" ON public.distributor_applications FOR DELETE
  USING (private.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "Anyone can apply as distributor" ON public.distributor_applications FOR INSERT
  WITH CHECK (
    length(coalesce(full_name, '')) BETWEEN 1 AND 200
    AND length(coalesce(email, '')) BETWEEN 3 AND 255
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- inquiries
DROP POLICY IF EXISTS "Staff update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Staff view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Super admin delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;

CREATE POLICY "Staff view inquiries" ON public.inquiries FOR SELECT
  USING (private.has_any_role(auth.uid(), ARRAY['super_admin','sales','support']::public.app_role[]));
CREATE POLICY "Staff update inquiries" ON public.inquiries FOR UPDATE
  USING (private.has_any_role(auth.uid(), ARRAY['super_admin','sales']::public.app_role[]));
CREATE POLICY "Super admin delete inquiries" ON public.inquiries FOR DELETE
  USING (private.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries FOR INSERT
  WITH CHECK (
    length(coalesce(full_name, '')) BETWEEN 1 AND 200
    AND length(coalesce(email, '')) BETWEEN 3 AND 255
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- profiles
DROP POLICY IF EXISTS "Super admins view all profiles" ON public.profiles;
CREATE POLICY "Super admins view all profiles" ON public.profiles FOR SELECT
  USING (private.has_role(auth.uid(), 'super_admin'::public.app_role));

-- role_audit_log
DROP POLICY IF EXISTS "Super admins read role audit" ON public.role_audit_log;
CREATE POLICY "Super admins read role audit" ON public.role_audit_log FOR SELECT
  USING (private.has_role(auth.uid(), 'super_admin'::public.app_role));

-- user_roles
DROP POLICY IF EXISTS "Super admins delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users view their roles" ON public.user_roles;

CREATE POLICY "Users view their roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "Super admins insert roles" ON public.user_roles FOR INSERT
  WITH CHECK (private.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "Super admins update roles" ON public.user_roles FOR UPDATE
  USING (private.has_role(auth.uid(), 'super_admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "Super admins delete roles" ON public.user_roles FOR DELETE
  USING (private.has_role(auth.uid(), 'super_admin'::public.app_role) AND user_id <> auth.uid());

-- 3. Drop the old public helpers now that nothing references them
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.has_any_role(uuid, public.app_role[]);

-- 4. Ensure the old race-prone bootstrap RPC is gone
DROP FUNCTION IF EXISTS public.claim_super_admin();
