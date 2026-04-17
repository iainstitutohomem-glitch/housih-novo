-- ==========================================
-- SCRIPT: HISTÓRICO PERSISTENTE DA IA
-- Execute este código no SQL Editor do Supabase
-- ==========================================

-- 1. Criar a tabela de histórico
create table if not exists public.ai_chat_history (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default now() not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role text check (role in ('user', 'assistant')) not null,
    content text not null
);

-- 2. Ativar RLS (Segurança de Linha)
alter table public.ai_chat_history enable row level security;

-- 3. Criar política de privacidade (Marcelo não vê Geovana)
drop policy if exists "Users can manage their own AI chat history" on public.ai_chat_history;
create policy "Users can manage their own AI chat history"
on public.ai_chat_history
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 4. Ativar Realtime para atualizações instantâneas
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'ai_chat_history') then
    alter publication supabase_realtime add table ai_chat_history;
  end if;
exception
  when others then
    raise notice 'Realtime já configurado ou indisponível.';
end $$;
