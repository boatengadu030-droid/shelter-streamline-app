CREATE OR REPLACE FUNCTION public.get_landing_stats()
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'donations_24h', COALESCE((
      SELECT SUM(amount) FROM public.donations
      WHERE created_at >= now() - interval '24 hours'
    ), 0),
    'donations_currency', COALESCE((
      SELECT currency FROM public.donations
      WHERE created_at >= now() - interval '24 hours'
      ORDER BY created_at DESC LIMIT 1
    ), 'GHS'),
    'donations_spark', COALESCE((
      SELECT jsonb_agg(amt ORDER BY h)
      FROM (
        SELECT date_trunc('hour', generate_series(now() - interval '6 hours', now(), interval '1 hour')) AS h
      ) hours
      LEFT JOIN LATERAL (
        SELECT COALESCE(SUM(amount), 0) AS amt
        FROM public.donations d
        WHERE date_trunc('hour', d.created_at) = hours.h
      ) s ON true
    ), '[]'::jsonb),
    'new_sponsors_today', COALESCE((
      SELECT COUNT(*) FROM public.sponsors
      WHERE created_at::date = CURRENT_DATE
    ), 0),
    'children_count', COALESCE((SELECT COUNT(*) FROM public.children), 0)
  )
$$;

GRANT EXECUTE ON FUNCTION public.get_landing_stats() TO anon, authenticated;