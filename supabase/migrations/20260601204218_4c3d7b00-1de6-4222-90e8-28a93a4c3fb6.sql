
-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- ROLES
-- =========================================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'content', 'sales', 'support', 'marketing');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = ANY(_roles));
$$;

CREATE POLICY "Users view their roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Super admins view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Bootstrap: claim super admin (only succeeds if no super admin exists yet)
CREATE OR REPLACE FUNCTION public.claim_super_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing_count INT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT COUNT(*) INTO existing_count FROM public.user_roles WHERE role = 'super_admin';
  IF existing_count > 0 THEN RETURN FALSE; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'super_admin');
  RETURN TRUE;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_super_admin() TO authenticated;

-- Super admins need to read profile info of other team members
CREATE POLICY "Super admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- =========================================
-- BULK QUOTES
-- =========================================
CREATE TABLE public.bulk_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  business_name TEXT NOT NULL CHECK (char_length(business_name) BETWEEN 1 AND 160),
  business_type TEXT NOT NULL CHECK (char_length(business_type) BETWEEN 1 AND 80),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  preferred_size TEXT CHECK (preferred_size IS NULL OR char_length(preferred_size) <= 80),
  monthly_volume TEXT CHECK (monthly_volume IS NULL OR char_length(monthly_volume) <= 120),
  delivery_location TEXT CHECK (delivery_location IS NULL OR char_length(delivery_location) <= 160),
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 2000),
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bulk_quotes TO anon, authenticated;
GRANT ALL ON public.bulk_quotes TO service_role;
ALTER TABLE public.bulk_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit bulk quote" ON public.bulk_quotes
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- =========================================
-- ADMIN POLICIES ON SUBMISSIONS
-- =========================================
CREATE POLICY "Staff view inquiries" ON public.inquiries
  FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','sales','support']::public.app_role[]));
CREATE POLICY "Staff update inquiries" ON public.inquiries
  FOR UPDATE TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','sales']::public.app_role[]));
CREATE POLICY "Super admin delete inquiries" ON public.inquiries
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Staff view distributor apps" ON public.distributor_applications
  FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','sales','support']::public.app_role[]));
CREATE POLICY "Staff update distributor apps" ON public.distributor_applications
  FOR UPDATE TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','sales']::public.app_role[]));
CREATE POLICY "Super admin delete distributor apps" ON public.distributor_applications
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Staff view bulk quotes" ON public.bulk_quotes
  FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','sales','support']::public.app_role[]));
CREATE POLICY "Staff update bulk quotes" ON public.bulk_quotes
  FOR UPDATE TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','sales']::public.app_role[]));
CREATE POLICY "Super admin delete bulk quotes" ON public.bulk_quotes
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
