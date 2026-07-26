UPDATE public.nap_settings
SET hours_json = '[
  {"day": "Mon-Fri", "opens": "12:00", "closes": "20:00"}
]'::jsonb
WHERE id = true;