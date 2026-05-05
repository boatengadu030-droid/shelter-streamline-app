ALTER TABLE public.children REPLICA IDENTITY FULL;
ALTER TABLE public.sponsors REPLICA IDENTITY FULL;
ALTER TABLE public.donations REPLICA IDENTITY FULL;
ALTER TABLE public.inventory_items REPLICA IDENTITY FULL;
ALTER TABLE public.compliance_records REPLICA IDENTITY FULL;
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.children, public.sponsors, public.donations, public.inventory_items, public.compliance_records, public.events;