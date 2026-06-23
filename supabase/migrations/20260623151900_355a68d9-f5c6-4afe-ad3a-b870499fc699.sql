-- Hide google_calendar_id from anon/authenticated Data API reads.
-- Column-level privileges override RLS column visibility regardless of policy.
-- Admin code paths use supabaseAdmin (service_role), which keeps full access.
REVOKE SELECT (google_calendar_id) ON public.doctors FROM anon;
REVOKE SELECT (google_calendar_id) ON public.doctors FROM authenticated;

-- Re-grant SELECT on all other columns explicitly so the Data API keeps working
-- for both roles. service_role retains ALL via its existing grant.
GRANT SELECT (
  id, slug, full_name, title, bio, photo_url,
  slot_minutes, buffer_minutes, default_price_cents,
  display_order, active, created_at, updated_at
) ON public.doctors TO anon, authenticated;