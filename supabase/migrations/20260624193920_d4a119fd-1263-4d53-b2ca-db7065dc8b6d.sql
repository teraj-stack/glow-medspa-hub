CREATE POLICY "Admins manage doctor portraits"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'doctor-portraits' AND private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'doctor-portraits' AND private.has_role(auth.uid(), 'admin'::app_role));