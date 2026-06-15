
ALTER TABLE public.appearances ADD COLUMN IF NOT EXISTS title_zh text, ADD COLUMN IF NOT EXISTS venue_zh text, ADD COLUMN IF NOT EXISTS description_zh text;
ALTER TABLE public.biography ADD COLUMN IF NOT EXISTS name_zh text, ADD COLUMN IF NOT EXISTS body_zh text;
ALTER TABLE public.choreography ADD COLUMN IF NOT EXISTS title_zh text, ADD COLUMN IF NOT EXISTS client_zh text, ADD COLUMN IF NOT EXISTS description_zh text;
ALTER TABLE public.contact_info ADD COLUMN IF NOT EXISTS management_zh text, ADD COLUMN IF NOT EXISTS note_zh text;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS title_zh text, ADD COLUMN IF NOT EXISTS body_zh text;
ALTER TABLE public.records ADD COLUMN IF NOT EXISTS title_zh text, ADD COLUMN IF NOT EXISTS format_zh text, ADD COLUMN IF NOT EXISTS description_zh text;
