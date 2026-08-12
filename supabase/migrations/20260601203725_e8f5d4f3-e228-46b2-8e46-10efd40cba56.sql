
-- Inquiries table (Contact form)
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  preferred_size TEXT CHECK (preferred_size IS NULL OR char_length(preferred_size) <= 80),
  quantity TEXT CHECK (quantity IS NULL OR char_length(quantity) <= 120),
  message TEXT CHECK (message IS NULL OR char_length(message) <= 2000),
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Distributor applications table
CREATE TABLE public.distributor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  business_name TEXT NOT NULL CHECK (char_length(business_name) BETWEEN 1 AND 160),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  region TEXT NOT NULL CHECK (char_length(region) BETWEEN 1 AND 160),
  capacity TEXT CHECK (capacity IS NULL OR char_length(capacity) <= 2000),
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.distributor_applications TO anon, authenticated;
GRANT ALL ON public.distributor_applications TO service_role;

ALTER TABLE public.distributor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply as distributor"
  ON public.distributor_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
