CREATE POLICY "Admins can insert site_text" ON public.site_text FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
