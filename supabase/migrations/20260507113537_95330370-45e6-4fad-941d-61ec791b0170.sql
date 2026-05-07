
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category text;

CREATE INDEX IF NOT EXISTS documents_owner_table_idx ON public.documents(owner_table);
CREATE INDEX IF NOT EXISTS documents_category_idx ON public.documents(category);
CREATE INDEX IF NOT EXISTS documents_tags_idx ON public.documents USING GIN(tags);

INSERT INTO storage.buckets (id, name, public) VALUES ('general-docs', 'general-docs', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "general-docs read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'general-docs' AND public.can_read(auth.uid()));

CREATE POLICY "general-docs write" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'general-docs' AND public.is_staff_or_admin(auth.uid()));

CREATE POLICY "general-docs update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'general-docs' AND public.is_staff_or_admin(auth.uid()));

CREATE POLICY "general-docs delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'general-docs' AND public.has_role(auth.uid(), 'admin'));
