-- Warranty registrations table
CREATE TABLE IF NOT EXISTS warranty_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product_model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  store_name TEXT NOT NULL,
  invoice_url TEXT,
  status TEXT DEFAULT 'pending'
);

-- Allow anonymous inserts (public form)
ALTER TABLE warranty_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON warranty_registrations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow admin reads" ON warranty_registrations
  FOR SELECT TO authenticated USING (true);

-- Storage bucket for invoices
INSERT INTO storage.buckets (id, name, public)
VALUES ('warranty-invoices', 'warranty-invoices', false)
ON CONFLICT DO NOTHING;

CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'warranty-invoices');

CREATE POLICY "Allow admin reads" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'warranty-invoices');
