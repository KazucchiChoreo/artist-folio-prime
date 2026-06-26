-- Fix literal "\n" (backslash + n) that ended up stored as two characters
-- instead of an actual newline, because the data export wrote text values
-- with literal backslash-n rather than using Postgres's E'...' escape syntax.
--
-- Run this ONCE, right after 02_data.sql, on a fresh project.
-- Safe to re-run (replace() is idempotent once there's nothing left to replace).

UPDATE public.biography SET
  body_ja = replace(body_ja, '\n', E'\n'),
  body_en = replace(body_en, '\n', E'\n'),
  body_zh = replace(body_zh, '\n', E'\n');

UPDATE public.choreography SET
  description_ja = replace(description_ja, '\n', E'\n'),
  description_en = replace(description_en, '\n', E'\n'),
  description_zh = replace(description_zh, '\n', E'\n');

UPDATE public.news SET
  body_ja = replace(body_ja, '\n', E'\n'),
  body_en = replace(body_en, '\n', E'\n'),
  body_zh = replace(body_zh, '\n', E'\n');

UPDATE public.contact_info SET
  management_ja = replace(management_ja, '\n', E'\n'),
  management_en = replace(management_en, '\n', E'\n'),
  management_zh = replace(management_zh, '\n', E'\n'),
  note_ja = replace(note_ja, '\n', E'\n'),
  note_en = replace(note_en, '\n', E'\n'),
  note_zh = replace(note_zh, '\n', E'\n');

UPDATE public.site_text SET
  value_ja = replace(value_ja, '\n', E'\n'),
  value_en = replace(value_en, '\n', E'\n'),
  value_zh = replace(value_zh, '\n', E'\n');
