-- Full schema export — generated 2026-06-20
-- (cleaned: removed stray psql output lines, fixed boolean literal,
--  reordered so tables exist before functions reference them)

-- ===== ENUMS =====
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.inquiry_type AS ENUM ('choreography', 'appearance', 'other');

-- ===== TABLES =====

CREATE TABLE public.appearances (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  title_ja text DEFAULT ''::text NOT NULL,
  title_en text DEFAULT ''::text NOT NULL,
  venue_ja text,
  venue_en text,
  event_date date,
  description_ja text,
  description_en text,
  link_url text,
  image_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  title_zh text,
  venue_zh text,
  description_zh text
);

CREATE TABLE public.biography (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name_ja text DEFAULT ''::text NOT NULL,
  name_en text DEFAULT ''::text NOT NULL,
  body_ja text DEFAULT ''::text NOT NULL,
  body_en text DEFAULT ''::text NOT NULL,
  portrait_url text,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  name_zh text,
  body_zh text
);

CREATE TABLE public.choreography (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  title_ja text DEFAULT ''::text NOT NULL,
  title_en text DEFAULT ''::text NOT NULL,
  year integer,
  client_ja text,
  client_en text,
  description_ja text,
  description_en text,
  image_url text,
  video_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  title_zh text,
  client_zh text,
  description_zh text
);

CREATE TABLE public.contact_info (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  email text,
  management_ja text,
  management_en text,
  instagram text,
  twitter text,
  youtube text,
  note_ja text,
  note_en text,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  management_zh text,
  note_zh text
);

CREATE TABLE public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  inquiry_type inquiry_type NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  organization text,
  phone text,
  event_date date,
  budget text,
  subject text,
  message text NOT NULL,
  lang text,
  emailed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.news (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  title_ja text DEFAULT ''::text NOT NULL,
  title_en text DEFAULT ''::text NOT NULL,
  body_ja text DEFAULT ''::text NOT NULL,
  body_en text DEFAULT ''::text NOT NULL,
  published_at date DEFAULT CURRENT_DATE NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  title_zh text,
  body_zh text
);

CREATE TABLE public.records (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  title_ja text DEFAULT ''::text NOT NULL,
  title_en text DEFAULT ''::text NOT NULL,
  release_date date,
  format_ja text,
  format_en text,
  description_ja text,
  description_en text,
  cover_url text,
  link_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  title_zh text,
  format_zh text,
  description_zh text
);

CREATE TABLE public.site_settings (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  is_public boolean DEFAULT true NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.site_text (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  key text NOT NULL,
  value_ja text,
  value_en text,
  value_zh text,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.slideshow_images (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  image_url text NOT NULL,
  caption_ja text,
  caption_en text,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.user_roles (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  role app_role DEFAULT 'user'::app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- ===== CONSTRAINTS =====
ALTER TABLE public.appearances ADD CONSTRAINT appearances_pkey PRIMARY KEY (id);
ALTER TABLE public.biography ADD CONSTRAINT biography_pkey PRIMARY KEY (id);
ALTER TABLE public.choreography ADD CONSTRAINT choreography_pkey PRIMARY KEY (id);
ALTER TABLE public.contact_info ADD CONSTRAINT contact_info_pkey PRIMARY KEY (id);
ALTER TABLE public.contact_submissions ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);
ALTER TABLE public.news ADD CONSTRAINT news_pkey PRIMARY KEY (id);
ALTER TABLE public.records ADD CONSTRAINT records_pkey PRIMARY KEY (id);
ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);
ALTER TABLE public.site_text ADD CONSTRAINT site_text_pkey PRIMARY KEY (id);
ALTER TABLE public.site_text ADD CONSTRAINT site_text_key_key UNIQUE (key);
ALTER TABLE public.slideshow_images ADD CONSTRAINT slideshow_images_pkey PRIMARY KEY (id);
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

-- ===== FUNCTIONS =====
-- (created after tables, since has_role() / handle_new_user() reference user_roles)

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END; $function$
;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $function$
;

-- ===== RLS ENABLE =====
ALTER TABLE public.appearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biography ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.choreography ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_text ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slideshow_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ===== POLICIES =====
CREATE POLICY "Admins manage appearances" ON public.appearances AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone view appearances" ON public.appearances AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins manage biography" ON public.biography AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone view biography" ON public.biography AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins manage choreography" ON public.choreography AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone view choreography" ON public.choreography AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins manage contact" ON public.contact_info AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone view contact" ON public.contact_info AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins can delete submissions" ON public.contact_submissions AS PERMISSIVE FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update submissions" ON public.contact_submissions AS PERMISSIVE FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view submissions" ON public.contact_submissions AS PERMISSIVE FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit valid form" ON public.contact_submissions AS PERMISSIVE FOR INSERT TO authenticated, anon WITH CHECK ((((length(name) >= 1) AND (length(name) <= 200)) AND ((length(email) >= 3) AND (length(email) <= 320)) AND (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'::text) AND ((length(message) >= 1) AND (length(message) <= 5000))));
CREATE POLICY "Admins manage news" ON public.news AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view news" ON public.news AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins manage records" ON public.records AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone view records" ON public.records AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings AS PERMISSIVE FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view site settings" ON public.site_settings AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins can insert site_text" ON public.site_text AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update site_text" ON public.site_text AS PERMISSIVE FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view site_text" ON public.site_text AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins manage slideshow" ON public.slideshow_images AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view slideshow" ON public.slideshow_images AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Users can view own roles" ON public.user_roles AS PERMISSIVE FOR SELECT TO authenticated USING ((auth.uid() = user_id));

-- ===== TRIGGERS =====
CREATE TRIGGER trg_appearances_updated BEFORE UPDATE ON public.appearances FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bio_updated BEFORE UPDATE ON public.biography FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_choreo_updated BEFORE UPDATE ON public.choreography FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_contact_updated BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_records_updated BEFORE UPDATE ON public.records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_site_text_updated_at BEFORE UPDATE ON public.site_text FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_slideshow_updated BEFORE UPDATE ON public.slideshow_images FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===== STORAGE BUCKETS =====
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES ('artist-media', 'artist-media', false, NULL, '{}') ON CONFLICT (id) DO NOTHING;

-- ===== STORAGE POLICIES (storage.objects) =====
CREATE POLICY "Admins delete artist media" ON storage.objects AS PERMISSIVE FOR DELETE TO authenticated USING (((bucket_id = 'artist-media'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins update artist media" ON storage.objects AS PERMISSIVE FOR UPDATE TO authenticated USING (((bucket_id = 'artist-media'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins upload artist media" ON storage.objects AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (((bucket_id = 'artist-media'::text) AND has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Public read artist media" ON storage.objects AS PERMISSIVE FOR SELECT TO PUBLIC USING ((bucket_id = 'artist-media'::text));
