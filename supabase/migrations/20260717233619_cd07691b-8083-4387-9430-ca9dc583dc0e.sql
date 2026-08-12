
-- 1) Remove race-prone public claim function
DROP FUNCTION IF EXISTS public.claim_super_admin();

-- 2) Lock down SECURITY DEFINER helpers: revoke public execute, keep for authenticated only for has_role
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_any_role(uuid, public.app_role[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_any_role(uuid, public.app_role[]) TO authenticated, service_role;

-- 3) Audit log for every role change (immutable append-only from app; only super_admin can read)
CREATE TABLE IF NOT EXISTS public.role_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  target_user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  action text NOT NULL CHECK (action IN ('granted','revoked')),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.role_audit_log TO authenticated;
GRANT ALL ON public.role_audit_log TO service_role;
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins read role audit" ON public.role_audit_log;
CREATE POLICY "Super admins read role audit" ON public.role_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- No INSERT/UPDATE/DELETE policies => only service_role (bypasses RLS) can write. Trigger below runs as definer.

-- 4) Trigger that records every role grant/revoke
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (actor_id, target_user_id, role, action)
    VALUES (auth.uid(), NEW.user_id, NEW.role, 'granted');
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log (actor_id, target_user_id, role, action)
    VALUES (auth.uid(), OLD.user_id, OLD.role, 'revoked');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.log_role_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_log_role_change_insert ON public.user_roles;
DROP TRIGGER IF EXISTS trg_log_role_change_delete ON public.user_roles;
CREATE TRIGGER trg_log_role_change_insert
  AFTER INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_change();
CREATE TRIGGER trg_log_role_change_delete
  AFTER DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_change();

-- 5) Harden user_roles: users may only manage roles if they are super_admin
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') AND user_id <> auth.uid());
-- prevents a super_admin from accidentally removing their own last super_admin row via the app
