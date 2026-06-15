
DROP POLICY "Anyone can submit" ON public.contact_submissions;

CREATE POLICY "Anyone can submit valid form"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(message) BETWEEN 1 AND 5000
  );
