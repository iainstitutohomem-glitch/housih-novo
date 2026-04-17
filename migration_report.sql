-- 1. Create table for shared report snapshots
CREATE TABLE IF NOT EXISTS shared_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company_name TEXT,
    report_data JSONB NOT NULL, -- The snapshot of filtered tasks
    companies_data JSONB,    -- Contextual data about companies (colors, names, logos)
    team_data JSONB,         -- Contextual data about team members (names, avatars)
    filters JSONB,           -- The filters active at time of creation
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 2. Enable RLS
ALTER TABLE shared_reports ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public read access to any report if they have the ID
CREATE POLICY "Enable public read access for specific reports" 
ON shared_reports 
FOR SELECT 
USING (true);

-- 4. Policy: Allow authenticated users to create reports
CREATE POLICY "Enable insert for authenticated users" 
ON shared_reports 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
