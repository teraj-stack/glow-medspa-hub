INSERT INTO public.doctors (
  slug,
  full_name,
  title,
  bio,
  photo_url,
  active,
  display_order,
  professional_title,
  experience_summary,
  specializations,
  education
) VALUES (
  'jan-bujok',
  'dr Jan Bujok',
  'chirurg, twórca technologiczny MedTech',
  'Twórca platformy MySkinCode, Mazowieckiego Centrum Medycyny Laserowej i marki Bujok Medical. Łączy kunszt operacyjny z zaawansowaną inżynierią biomedyczną.',
  '/__l5e/assets-v1/05f928ba-ccbf-4ecf-8bee-67ed08371f5a/bujok.jpeg',
  true,
  0,
  'chirurg · innowator MedTech',
  'Jestem chirurgiem i twórcą technologicznym, którego pasją jest projektowanie nowoczesnych rozwiązań dla medycyny estetycznej i regeneracyjnej. Moja działalność opiera się na bezkompromisowym łączeniu kunsztu operacyjnego z zaawansowaną inżynierią biomedyczną.' || E'\n\n' ||
  'Twórca platformy MySkinCode – zaawansowanego systemu SaaS wykorzystującego autorski silnik sztucznej inteligencji (AI engine) do tworzenia spersonalizowanych, wielotechnologicznych protokołów zabiegowych, dedykowanych nowoczesnym centrom estetycznym hi-tech.' || E'\n\n' ||
  'Inicjator projektu Mazowieckiego Centrum Medycyny Laserowej – autorskiej koncepcji, która redefiniuje standardy wczesnej opieki pooperacyjnej i prehabilitacji tkankowej.' || E'\n\n' ||
  'Twórca i dystrybutor marki Bujok Medical – autorskiej linii certyfikowanych urządzeń medycznych i platform zabiegowych hi-tech.',
  ARRAY[
    'Konsultacje i projektowanie protokołów zabiegowych',
    'Terapie rewitalizujące i anti-aging / longevity',
    'Platformy laserowe – fotoakustyka, Er:Glass, Nd:YAG submilisekundowy',
    'Fuzja plazmy zimnej i ciepłej (CAP)',
    'HIFU / LipoHIFU – stymulacja falami akustycznymi',
    'Frakcyjna radiofrekwencja mikroigłowa (RF)',
    'Fototerapia, fotobiomodulacja i systemy DPL',
    'Stymulacja powięziowa polem magnetycznym'
  ],
  ARRAY[]::text[]
)
ON CONFLICT (slug) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  photo_url = EXCLUDED.photo_url,
  active = EXCLUDED.active,
  display_order = EXCLUDED.display_order,
  professional_title = EXCLUDED.professional_title,
  experience_summary = EXCLUDED.experience_summary,
  specializations = EXCLUDED.specializations,
  education = EXCLUDED.education;