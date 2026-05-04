
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'volunteer', 'auditor');
CREATE TYPE public.sponsor_type AS ENUM ('individual', 'foundation', 'corporate');
CREATE TYPE public.sponsorship_target AS ENUM ('child', 'event', 'inventory', 'general');
CREATE TYPE public.sponsorship_category AS ENUM ('education', 'feeding', 'health', 'clothing', 'other');
CREATE TYPE public.donation_frequency AS ENUM ('one_time', 'monthly', 'quarterly', 'yearly');
CREATE TYPE public.inventory_category AS ENUM ('food', 'clothing', 'medical', 'asset', 'other');
CREATE TYPE public.inventory_movement AS ENUM ('in', 'out', 'adjust', 'expired');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE public.compliance_status AS ENUM ('pending', 'compliant', 'overdue', 'expired');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff')) $$;

CREATE OR REPLACE FUNCTION public.can_read(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id) $$;

-- Auto-create profile + assign admin to first user, else staff
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _is_first BOOLEAN;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO _is_first;
  IF _is_first THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'staff');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ CHILDREN ============
CREATE SEQUENCE public.children_seq START 1;
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_code TEXT UNIQUE NOT NULL DEFAULT ('CH-' || lpad(nextval('public.children_seq')::text, 3, '0')),
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender gender_type,
  intake_date DATE NOT NULL DEFAULT CURRENT_DATE,
  health_notes TEXT,
  education_status TEXT,
  current_grade TEXT,
  guardian_info TEXT,
  photo_url TEXT,
  is_sensitive BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- ============ INVENTORY ============
CREATE SEQUENCE public.inventory_seq START 1;
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inv_code TEXT UNIQUE NOT NULL DEFAULT ('INV-' || lpad(nextval('public.inventory_seq')::text, 3, '0')),
  name TEXT NOT NULL,
  category inventory_category NOT NULL DEFAULT 'other',
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'unit',
  low_stock_threshold NUMERIC NOT NULL DEFAULT 5,
  expiry_date DATE,
  location TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  movement inventory_movement NOT NULL,
  quantity NUMERIC NOT NULL,
  reason TEXT,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- ============ SPONSORS / DONATIONS ============
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type sponsor_type NOT NULL DEFAULT 'individual',
  email TEXT,
  phone TEXT,
  address TEXT,
  contact_person TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GHS',
  frequency donation_frequency NOT NULL DEFAULT 'one_time',
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_type sponsorship_target NOT NULL DEFAULT 'general',
  target_child_id UUID REFERENCES public.children(id) ON DELETE SET NULL,
  target_event_id UUID,
  target_inventory_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
  category sponsorship_category,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- ============ EVENTS ============
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  location TEXT,
  status event_status NOT NULL DEFAULT 'upcoming',
  cover_image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  role TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- ============ STAFF ============
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  position TEXT,
  email TEXT,
  phone TEXT,
  hire_date DATE,
  is_volunteer BOOLEAN NOT NULL DEFAULT false,
  shift_schedule TEXT,
  background_check_done BOOLEAN NOT NULL DEFAULT false,
  background_check_date DATE,
  certifications TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- ============ COMPLIANCE ============
CREATE TABLE public.compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  status compliance_status NOT NULL DEFAULT 'pending',
  due_date DATE,
  completed_date DATE,
  responsible_user UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;

-- ============ DOCUMENTS (generic file refs) ============
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_table TEXT NOT NULL,  -- 'children' | 'staff' | 'compliance_records' | 'events'
  owner_id UUID NOT NULL,
  bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  doc_kind TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_documents_owner ON public.documents(owner_table, owner_id);

-- ============ AUDIT LOGS ============
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_table TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============
-- profiles: users see own + admins see all
CREATE POLICY "Profiles self read" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'auditor'));
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Profiles admin all" ON public.profiles FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- user_roles: only admins manage; users see own
CREATE POLICY "Roles self read" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Roles admin manage" ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Generic helper: signed-in roles can read; staff/admin can write
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['children','inventory_items','inventory_logs','sponsors','donations','events','event_attendees','staff','compliance_records','documents'])
  LOOP
    EXECUTE format('CREATE POLICY "%I read all roles" ON public.%I FOR SELECT TO authenticated USING (public.can_read(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%I write staff admin" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_staff_or_admin(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%I update staff admin" ON public.%I FOR UPDATE TO authenticated USING (public.is_staff_or_admin(auth.uid()))', t, t);
    EXECUTE format('CREATE POLICY "%I delete admin" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(),''admin''))', t, t);
  END LOOP;
END $$;

-- audit logs read for admins/auditors, insert by anyone authenticated
CREATE POLICY "Audit read" ON public.audit_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'auditor'));
CREATE POLICY "Audit insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- ============ Updated_at triggers ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DO $$ DECLARE t TEXT; BEGIN
  FOR t IN SELECT unnest(ARRAY['profiles','children','inventory_items','sponsors','staff','compliance_records'])
  LOOP
    EXECUTE format('CREATE TRIGGER trg_touch_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', t, t);
  END LOOP;
END $$;

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES
  ('child-docs','child-docs', false),
  ('staff-docs','staff-docs', false),
  ('compliance-docs','compliance-docs', false),
  ('event-images','event-images', true),
  ('avatars','avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: signed-in roles can read private buckets; staff/admin write
CREATE POLICY "Read private docs" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id IN ('child-docs','staff-docs','compliance-docs') AND public.can_read(auth.uid()));
CREATE POLICY "Write private docs" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('child-docs','staff-docs','compliance-docs') AND public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Update private docs" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('child-docs','staff-docs','compliance-docs') AND public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Delete private docs" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('child-docs','staff-docs','compliance-docs') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Public read images" ON storage.objects FOR SELECT TO public
USING (bucket_id IN ('event-images','avatars'));
CREATE POLICY "Auth write images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('event-images','avatars') AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth update images" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('event-images','avatars') AND auth.uid() IS NOT NULL);
