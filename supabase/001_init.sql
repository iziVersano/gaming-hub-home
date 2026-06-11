-- ============================================================
-- Gaming Hub — Supabase schema + seed
-- Run this once in: Supabase → SQL Editor → New query
-- ============================================================

-- Products
CREATE TABLE IF NOT EXISTS products (
  id          BIGSERIAL PRIMARY KEY,
  sku         TEXT,
  image_url   TEXT NOT NULL DEFAULT '',
  price       DECIMAL(10,2) NOT NULL DEFAULT 0,
  flags       TEXT,
  translations JSONB NOT NULL DEFAULT '[]'
);

-- Warranty submissions
CREATE TABLE IF NOT EXISTS warranty_submissions (
  id                 BIGSERIAL PRIMARY KEY,
  row_key            TEXT NOT NULL UNIQUE,
  customer_name      TEXT NOT NULL,
  email              TEXT NOT NULL,
  product            TEXT NOT NULL,
  serial_number      TEXT NOT NULL,
  invoice_url        TEXT,
  invoice_file_name  TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Good deeds
CREATE TABLE IF NOT EXISTS good_deeds (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  city       TEXT NOT NULL,
  deed       TEXT NOT NULL,
  category   TEXT NOT NULL,
  proof_url  TEXT,
  points     INTEGER DEFAULT 1,
  vouches    INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kotel Wall wishes
CREATE TABLE IF NOT EXISTS wishes (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  city       TEXT NOT NULL,
  wish       TEXT NOT NULL,
  category   TEXT NOT NULL,
  for_whom   TEXT,
  place_name TEXT,
  candles    INTEGER DEFAULT 0,
  points     INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily streaks (keyed by user name)
CREATE TABLE IF NOT EXISTS streaks (
  name      TEXT PRIMARY KEY,
  last_date DATE NOT NULL,
  streak    INTEGER DEFAULT 1
);

-- Community places
CREATE TABLE IF NOT EXISTS places (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'other',
  city        TEXT NOT NULL,
  address     TEXT,
  website     TEXT,
  phone       TEXT,
  mitzvot     TEXT[] DEFAULT '{}',
  description TEXT,
  approved    BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Seed: 25 community places
-- ============================================================
INSERT INTO places (name, type, city, mitzvot, website, approved) VALUES
  ('Chabad of Jerusalem',           'chabad',           'ישראל',       ARRAY['chesed','tzedakah','bikur','orchim','avelim','horim','olam','gmilut'], NULL, true),
  ('Hadassah Medical Center',       'hospital',         'ישראל',       ARRAY['bikur','chesed'],                                                    NULL, true),
  ('Mayanei HaYeshua Hospital',     'hospital',         'ישראל',       ARRAY['bikur','chesed'],                                                    NULL, true),
  ('Leket Israel Food Bank',        'charity',          'ישראל',       ARRAY['tzedakah','olam'],                                                   'https://www.leket.org', true),
  ('Yad Sarah',                     'charity',          'ישראל',       ARRAY['chesed','bikur','gmilut'],                                           'https://www.yadsarah.org.il', true),
  ('Chabad of Manhattan',           'chabad',           'New York',    ARRAY['chesed','tzedakah','bikur','orchim','avelim','horim','olam','gmilut'], 'https://www.chabadofmanhattan.com', true),
  ('Bikur Cholim of Greater NY',    'charity',          'New York',    ARRAY['bikur','chesed','avelim'],                                           NULL, true),
  ('UJA-Federation of New York',    'charity',          'New York',    ARRAY['tzedakah','olam'],                                                   'https://www.ujafedny.org', true),
  ('Mount Sinai Hospital',          'hospital',         'New York',    ARRAY['bikur','chesed'],                                                    NULL, true),
  ('Jewish Home Lifecare',          'community_center', 'New York',    ARRAY['horim','bikur','chesed'],                                            NULL, true),
  ('Chabad de Paris',               'chabad',           'Paris',       ARRAY['chesed','tzedakah','bikur','orchim','avelim','horim','olam','gmilut'], NULL, true),
  ('Hôpital Rothschild',            'hospital',         'Paris',       ARRAY['bikur','chesed'],                                                    NULL, true),
  ('FSJU — Fonds Social Juif Unifié','charity',         'Paris',       ARRAY['tzedakah','olam','chesed'],                                          'https://www.fsju.org', true),
  ('Association Bikour Holim Paris','charity',          'Paris',       ARRAY['bikur','chesed','avelim'],                                           NULL, true),
  ('Chabad de Buenos Aires',        'chabad',           'Buenos Aires',ARRAY['chesed','tzedakah','bikur','orchim','avelim','horim','olam','gmilut'], NULL, true),
  ('AMIA',                          'community_center', 'Buenos Aires',ARRAY['tzedakah','olam','chesed','gmilut'],                                 'https://www.amia.org.ar', true),
  ('Hospital Israelita',            'hospital',         'Buenos Aires',ARRAY['bikur','chesed'],                                                    NULL, true),
  ('Fundación Tzedaká',             'charity',          'Buenos Aires',ARRAY['tzedakah','olam'],                                                   'https://www.tzedaka.org.ar', true),
  ('Chabad of London',              'chabad',           'London',      ARRAY['chesed','tzedakah','bikur','orchim','avelim','horim','olam','gmilut'], NULL, true),
  ('Jewish Care',                   'charity',          'London',      ARRAY['chesed','bikur','horim','tzedakah'],                                 'https://www.jewishcare.org', true),
  ('World Jewish Relief',           'charity',          'London',      ARRAY['tzedakah','olam'],                                                   'https://www.worldjewishrelief.org', true),
  ('Bikur Cholim London',           'charity',          'London',      ARRAY['bikur','chesed','avelim'],                                           NULL, true),
  ('Chabad Moscow — Marina Roscha', 'chabad',           'Moscow',      ARRAY['chesed','tzedakah','bikur','orchim','avelim','horim','olam','gmilut'], NULL, true),
  ('Federation of Jewish Communities','community_center','Moscow',     ARRAY['tzedakah','olam','chesed'],                                          NULL, true),
  ('Hesed Avot Social Services',    'charity',          'Moscow',      ARRAY['horim','chesed','bikur','gmilut'],                                   NULL, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: 8 products (same as JsonStorageService seed)
-- ============================================================
INSERT INTO products (id, sku, image_url, price, flags, translations) VALUES
  (1, 'NS2-2024', '/images/nintendo-switch-2-product.jpg', 449.99, 'featured,new',
   '[{"locale":"en","title":"Nintendo Switch 2","description":"The next generation of Nintendo gaming.","category":"New Arrivals","badges":"Featured,Hot"},{"locale":"he","title":"נינטנדו סוויץ'' 2","description":"הדור הבא של משחקי נינטנדו.","category":"מוצרים חדשים","badges":"מומלץ,לוהט"}]'),
  (2, 'PS5-STD', '/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png', 499.99, 'featured,new',
   '[{"locale":"en","title":"PlayStation 5","description":"Next-generation gaming console with ultra-fast SSD.","category":"New Arrivals","badges":"Featured"},{"locale":"he","title":"פלייסטיישן 5","description":"קונסולת משחקים מהדור הבא.","category":"מוצרים חדשים","badges":"מומלץ"}]'),
  (3, 'XSX-2024', '/images/78a95f48-606e-44b6-950e-af0555a3f04f.png', 449.99, 'new',
   '[{"locale":"en","title":"Xbox Series X","description":"The most powerful Xbox ever.","category":"New Arrivals"},{"locale":"he","title":"אקסבוקס סדרה X","description":"ה-Xbox החזק ביותר אי פעם.","category":"מוצרים חדשים"}]'),
  (4, 'DRN-PRO', '/images/07ba8bc0-8d14-4d62-a534-659913ac5f99.png', 1299.99, NULL,
   '[{"locale":"en","title":"Professional Drones","description":"High-performance drones for commercial photography.","category":"Drones"},{"locale":"he","title":"רחפנים מקצועיים","description":"רחפנים בעלי ביצועים גבוהים.","category":"רחפנים"}]'),
  (5, 'EBIKE-SMART', '/images/a0bd3ab6-05d5-4312-b6ec-f0e256d7a63a.png', 1899.99, NULL,
   '[{"locale":"en","title":"Smart E-Bikes","description":"Electric bikes with smart connectivity.","category":"E-Bikes"},{"locale":"he","title":"אופניים חשמליים חכמים","description":"אופניים חשמליים עם קישוריות חכמה.","category":"אופניים חשמליים"}]'),
  (6, 'TV-4K-55', '/images/6df37998-af04-426e-b749-365ffeb66787.png', 799.99, NULL,
   '[{"locale":"en","title":"4K Smart TVs","description":"Ultra-high definition smart TVs with AI upscaling.","category":"TVs"},{"locale":"he","title":"טלוויזיות חכמות 4K","description":"טלוויזיות חכמות ברזולוציה גבוהה.","category":"טלוויזיות"}]'),
  (7, 'GAME-ACC', '/images/bd80e124-a5e2-4d34-9c82-ebc0dbd6a697.png', 149.99, NULL,
   '[{"locale":"en","title":"Gaming Accessories","description":"Premium gaming peripherals.","category":"Gaming"},{"locale":"he","title":"אביזרי גיימינג","description":"ציוד היקפי משחקים פרימיום.","category":"משחקים"}]'),
  (8, 'SMART-HOME', '/images/6df37998-af04-426e-b749-365ffeb66787.png', 299.99, NULL,
   '[{"locale":"en","title":"Smart Home Electronics","description":"Connected home devices.","category":"Electronics"},{"locale":"he","title":"אלקטרוניקה לבית חכם","description":"מכשירים מחוברים לבית.","category":"אלקטרוניקה"}]')
ON CONFLICT DO NOTHING;

-- Reset sequences so new inserts get ids > 8 / > 25
SELECT setval(pg_get_serial_sequence('products','id'), COALESCE((SELECT MAX(id) FROM products), 1));
SELECT setval(pg_get_serial_sequence('places','id'),   COALESCE((SELECT MAX(id) FROM places),   1));
