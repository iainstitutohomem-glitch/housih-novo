-- Create companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  social_media JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  checklist JSONB DEFAULT '[]'::JSONB,
  observations TEXT,
  due_date TIMESTAMPTZ,
  assignee TEXT, -- Ou usar references auth.users(id) se houver usuários cadastrados no Auth
  status TEXT DEFAULT 'Não Iniciado', -- Não Iniciado, Em Andamento, Concluído, Cancelado, Atrasado
  priority TEXT DEFAULT 'Média', -- Alta, Média, Baixa
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'Membro',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view team members
CREATE POLICY "authenticated_select_team" ON team_members
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert (required for sign-up injection)
CREATE POLICY "authenticated_insert_team" ON team_members
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to delete (manager view)
CREATE POLICY "authenticated_delete_team" ON team_members
  FOR DELETE TO authenticated USING (true);

-- Note: All tables should have RLS enabled and policies configured for 'authenticated' roles.
