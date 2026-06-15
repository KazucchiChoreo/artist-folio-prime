
CREATE POLICY "Public read artist media" ON storage.objects FOR SELECT
  USING (bucket_id = 'artist-media');
CREATE POLICY "Admins upload artist media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'artist-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update artist media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'artist-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete artist media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'artist-media' AND public.has_role(auth.uid(), 'admin'));
