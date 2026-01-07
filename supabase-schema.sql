-- Phoenix Real Estate Quiz - Supabase Schema
-- Run this SQL in your Supabase SQL Editor to create the leads table

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  budget_score INTEGER NOT NULL CHECK (budget_score >= 1 AND budget_score <= 5),
  timeline_score INTEGER NOT NULL CHECK (timeline_score >= 1 AND timeline_score <= 5),
  lead_temperature TEXT NOT NULL CHECK (lead_temperature IN ('cold', 'warm', 'hot', 'on-fire')),
  property_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  neighborhood_match TEXT NOT NULL,
  answers JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lead_temperature ON leads(lead_temperature);
CREATE INDEX IF NOT EXISTS idx_leads_neighborhood_match ON leads(neighborhood_match);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anonymous inserts (for quiz submissions)
CREATE POLICY "Allow anonymous inserts" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create a policy that allows anonymous reads (for admin dashboard)
-- Note: In production, you may want to restrict this to authenticated users only
CREATE POLICY "Allow anonymous reads" ON leads
  FOR SELECT
  TO anon
  USING (true);

-- Create a policy that allows anonymous deletes (for admin dashboard)
-- Note: In production, you should restrict this to authenticated admins only
CREATE POLICY "Allow anonymous deletes" ON leads
  FOR DELETE
  TO anon
  USING (true);

-- Optional: Create a view for lead statistics
CREATE OR REPLACE VIEW lead_stats AS
SELECT
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE lead_temperature = 'hot' OR lead_temperature = 'on-fire') as hot_leads,
  ROUND(AVG(budget_score)::numeric, 1) as avg_budget_score,
  ROUND(AVG(timeline_score)::numeric, 1) as avg_timeline_score,
  neighborhood_match,
  COUNT(*) as neighborhood_count
FROM leads
GROUP BY neighborhood_match;
