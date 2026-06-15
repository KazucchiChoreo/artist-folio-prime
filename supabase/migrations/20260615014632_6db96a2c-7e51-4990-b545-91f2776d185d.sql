
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Slideshow images
CREATE TABLE public.slideshow_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption_ja TEXT,
  caption_en TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.slideshow_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.slideshow_images TO authenticated;
GRANT ALL ON public.slideshow_images TO service_role;
ALTER TABLE public.slideshow_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view slideshow" ON public.slideshow_images FOR SELECT USING (true);
CREATE POLICY "Admins manage slideshow" ON public.slideshow_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_slideshow_updated BEFORE UPDATE ON public.slideshow_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- News
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ja TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  body_ja TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL DEFAULT '',
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Admins manage news" ON public.news FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Appearances
CREATE TABLE public.appearances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ja TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  venue_ja TEXT,
  venue_en TEXT,
  event_date DATE,
  description_ja TEXT,
  description_en TEXT,
  link_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.appearances TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.appearances TO authenticated;
GRANT ALL ON public.appearances TO service_role;
ALTER TABLE public.appearances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view appearances" ON public.appearances FOR SELECT USING (true);
CREATE POLICY "Admins manage appearances" ON public.appearances FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_appearances_updated BEFORE UPDATE ON public.appearances FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Choreography
CREATE TABLE public.choreography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ja TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  year INT,
  client_ja TEXT,
  client_en TEXT,
  description_ja TEXT,
  description_en TEXT,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.choreography TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.choreography TO authenticated;
GRANT ALL ON public.choreography TO service_role;
ALTER TABLE public.choreography ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view choreography" ON public.choreography FOR SELECT USING (true);
CREATE POLICY "Admins manage choreography" ON public.choreography FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_choreo_updated BEFORE UPDATE ON public.choreography FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Biography (single row)
CREATE TABLE public.biography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ja TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  body_ja TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL DEFAULT '',
  portrait_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.biography TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.biography TO authenticated;
GRANT ALL ON public.biography TO service_role;
ALTER TABLE public.biography ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view biography" ON public.biography FOR SELECT USING (true);
CREATE POLICY "Admins manage biography" ON public.biography FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_bio_updated BEFORE UPDATE ON public.biography FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Records (releases)
CREATE TABLE public.records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ja TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  release_date DATE,
  format_ja TEXT,
  format_en TEXT,
  description_ja TEXT,
  description_en TEXT,
  cover_url TEXT,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.records TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.records TO authenticated;
GRANT ALL ON public.records TO service_role;
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view records" ON public.records FOR SELECT USING (true);
CREATE POLICY "Admins manage records" ON public.records FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_records_updated BEFORE UPDATE ON public.records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Contact info (single row)
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  management_ja TEXT,
  management_en TEXT,
  instagram TEXT,
  twitter TEXT,
  youtube TEXT,
  note_ja TEXT,
  note_en TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_info TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.contact_info TO authenticated;
GRANT ALL ON public.contact_info TO service_role;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view contact" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Admins manage contact" ON public.contact_info FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_contact_updated BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial biography and contact rows
INSERT INTO public.biography (name_ja, name_en, body_ja, body_en) VALUES (
  'アーティスト名', 'Artist Name',
  'ここにバイオグラフィーを記載します。ダンサー・振付家として国内外で活動。', 
  'Biography goes here. Active as a dancer and choreographer in Japan and abroad.'
);
INSERT INTO public.contact_info (email, management_ja, management_en) VALUES (
  'contact@example.com', 'マネジメント: Lovable Management', 'Management: Lovable Management'
);

-- Auto-grant first signup as admin (only if no admin exists yet)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
