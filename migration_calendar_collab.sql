-- Create user_calendar_connections table
CREATE TABLE IF NOT EXISTS user_calendar_connections (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  refresh_token TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_calendar_connections ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to see who is connected
-- This is necessary so the Master user can fetch calendars of teammates
CREATE POLICY "Allow authenticated users to view connections"
ON user_calendar_connections
FOR SELECT
TO authenticated
USING (true);

-- Allow users to manage their own connection
CREATE POLICY "Allow users to manage their own connection"
ON user_calendar_connections
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create team_events_cache table to store a synchronized copy of calendars
CREATE TABLE IF NOT EXISTS team_events_cache (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  summary TEXT,
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  hangout_link TEXT,
  location TEXT,
  owner_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_events_cache ENABLE ROW LEVEL SECURITY;

-- Everyone can see everyone's events (transparency total)
CREATE POLICY "Allow all authenticated users to view team events"
ON team_events_cache
FOR SELECT
TO authenticated
USING (true);

-- Only owner can sync their own events
CREATE POLICY "Allow users to sync their own events"
ON team_events_cache
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
