CREATE TABLE public.site_text (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value_ja TEXT,
  value_en TEXT,
  value_zh TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_text TO anon;
GRANT SELECT, UPDATE ON public.site_text TO authenticated;
GRANT ALL ON public.site_text TO service_role;

ALTER TABLE public.site_text ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site_text"
  ON public.site_text FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site_text"
  ON public.site_text FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_site_text_updated_at
  BEFORE UPDATE ON public.site_text
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_text (key, value_ja, value_en, value_zh) VALUES
  ('home.role', 'プロダンサー / 振付師', 'DANCER / CHOREOGRAPHER', '专业舞者 / 编舞师'),
  ('home.hero_title', E'個性を活かし、\n観客の感情を動かす。', E'Choreography that moves\nthe audience.', E'释放个性，\n打动观众。'),
  ('home.hero_lead', 'ジャズ・ポップス・アイドルグループのフォーメーションダンスを軸に活動するプロダンサー／振付師。', 'Pro dancer and choreographer specializing in jazz, pop, and idol-group formation dance.', '以爵士、流行及偶像团体队形舞为核心的专业舞者 / 编舞师。');