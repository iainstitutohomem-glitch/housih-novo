-- MIGRATION: CRM CHAT SYSTEM V2
-- Este script configura as tabelas de chat, ativa o Realtime e cria o Grupo Geral.

-- 1. Criação das Tabelas
create table if not exists chat_conversations (
  id uuid default gen_random_uuid() primary key,
  name text,
  type text check (type in ('direct', 'group')) default 'direct',
  last_message_at timestamp with time zone default now() not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists chat_participants (
  conversation_id uuid references chat_conversations(id) on delete cascade,
  user_email text not null,
  joined_at timestamp with time zone default now() not null,
  primary key (conversation_id, user_email)
);

create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references chat_conversations(id) on delete cascade,
  sender_email text not null,
  sender_name text not null,
  content text,
  type text check (type in ('text', 'file', 'task')) default 'text',
  file_url text,
  file_name text,
  task_id uuid references tasks(id) on delete set null,
  created_at timestamp with time zone default now() not null
);

-- 2. Ativação do Realtime (Modo Robusto)
do $$
begin
  -- Tenta adicionar chat_conversations se ainda não estiver na publicação
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chat_conversations') then
    alter publication supabase_realtime add table chat_conversations;
  end if;

  -- Tenta adicionar chat_participants
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chat_participants') then
    alter publication supabase_realtime add table chat_participants;
  end if;

  -- Tenta adicionar chat_messages
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chat_messages') then
    alter publication supabase_realtime add table chat_messages;
  end if;
exception
  when others then
    -- Se a publicação não existir, cria ou informa. No Supabase por padrão existe.
    raise notice 'Erro ao configurar Realtime (pode ser ignorado se já estiver configurado): %', sqlerrm;
end $$;

-- 3. Políticas de Segurança (RLS)
alter table chat_conversations enable row level security;
alter table chat_participants enable row level security;
alter table chat_messages enable row level security;

-- Limpeza de políticas antigas
drop policy if exists "Users can see their conversations" on chat_conversations;
drop policy if exists "Users can see participants" on chat_participants;
drop policy if exists "Users can see participants of their conversations" on chat_participants;
drop policy if exists "Users can see messages" on chat_messages;
drop policy if exists "Users can see messages of their conversations" on chat_messages;
drop policy if exists "Users can insert participants" on chat_participants;
drop policy if exists "Users can insert participants for their conversations" on chat_participants;
drop policy if exists "Users can insert messages" on chat_messages;
drop policy if exists "Users can insert messages in their conversations" on chat_messages;
drop policy if exists "Users can create conversations" on chat_conversations;

-- Aplicação de Novas Políticas (Case Insensitive)
create policy "Users can see their conversations" on chat_conversations
  for select using (
    exists (
      select 1 from chat_participants
      where conversation_id = chat_conversations.id
      and lower(user_email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "Users can see participants" on chat_participants
  for select using (
    exists (
      select 1 from chat_participants as p
      where p.conversation_id = chat_participants.conversation_id
      and lower(p.user_email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "Users can see messages" on chat_messages
  for select using (
    exists (
      select 1 from chat_participants
      where conversation_id = chat_messages.conversation_id
      and lower(user_email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "Users can insert participants" on chat_participants
  for insert with check (true);

create policy "Users can insert messages" on chat_messages
  for insert with check (
    exists (
      select 1 from chat_participants
      where conversation_id = chat_messages.conversation_id
      and lower(user_email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "Users can create conversations" on chat_conversations
  for insert with check (true);

-- 4. Criação do Grupo Geral e Inclusão de Membros
do $$
declare
  gen_group_id uuid := '00000000-0000-0000-0000-000000000000';
  member_record record;
begin
  -- Cria a conversa se não existir
  if not exists (select 1 from chat_conversations where id = gen_group_id) then
    insert into chat_conversations (id, name, type) 
    values (gen_group_id, 'Equipe Geral', 'group');
  end if;

  -- Adiciona todos os membros da equipe que têm e-mail
  for member_record in select email from team_members where email is not null loop
    if not exists (select 1 from chat_participants where conversation_id = gen_group_id and user_email = member_record.email) then
      insert into chat_participants (conversation_id, user_email)
      values (gen_group_id, member_record.email);
    end if;
  end loop;
end $$;

-- 5. Trigger para adicionar novos membros da equipe ao Grupo Geral automaticamente
create or replace function public.handle_new_team_member_chat()
returns trigger as $$
begin
  insert into public.chat_participants (conversation_id, user_email)
  values ('00000000-0000-0000-0000-000000000000', new.email)
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_team_member_created_chat on team_members;
create trigger on_team_member_created_chat
  after insert on team_members
  for each row execute procedure public.handle_new_team_member_chat();
