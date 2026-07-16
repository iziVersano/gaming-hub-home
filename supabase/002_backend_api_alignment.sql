-- ============================================================
-- Align Supabase schema with the backend API (backend/api)
-- Run this once in: Supabase → SQL Editor → New query
-- (safe to re-run — all statements are idempotent)
-- ============================================================

-- Fields the warranty form collects but 001_init.sql predates
ALTER TABLE warranty_submissions ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE warranty_submissions ADD COLUMN IF NOT EXISTS purchase_date DATE;
ALTER TABLE warranty_submissions ADD COLUMN IF NOT EXISTS store_name TEXT;

-- Storage object path of the uploaded invoice inside the
-- warranty-invoices bucket (the API serves it via signed URLs)
ALTER TABLE warranty_submissions ADD COLUMN IF NOT EXISTS invoice_path TEXT;

-- Private bucket for invoice files. The backend accesses it with the
-- service-role key, which bypasses RLS — no storage policies needed.
INSERT INTO storage.buckets (id, name, public)
VALUES ('warranty-invoices', 'warranty-invoices', false)
ON CONFLICT DO NOTHING;
