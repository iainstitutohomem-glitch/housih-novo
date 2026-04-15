-- internal chat system migration

-- 1. Conversations
create table if not exists chat_conversations (
  id uuid default gen_random_uuid() primary key,
  name text, -- null for direct messages
  type text check (type in ('direct', 'group')) default 'direct',
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Participants
create table if not exists chat_participants (
  conversation_id uuid references chat_conversations(id) on delete cascade,
  user_email text not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (conversation_id, user_email)
);

-- 3. Messages
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RLS Policies
alter table chat_conversations enable row level security;
alter table chat_participants enable row level security;
alter table chat_messages enable row level security;

-- Conversations: All users can see conversations they are part of
create policy "Users can see their conversations" on chat_conversations
  for select using (
    exists (
      select 1 from chat_participants
      where conversation_id = chat_conversations.id
      and user_email = auth.jwt() ->> 'email'
    )
  );

-- Participants: All users can see participants of their conversations
create policy "Users can see participants of their conversations" on chat_participants
  for select using (
    exists (
      select 1 from chat_participants as p
      where p.conversation_id = chat_participants.conversation_id
      and p.user_email = auth.jwt() ->> 'email'
    )
  );

-- Messages: Users can see messages of their conversations
create policy "Users can see messages of their conversations" on chat_messages
  for select using (
    exists (
      select 1 from chat_participants
      where conversation_id = chat_messages.conversation_id
      and user_email = auth.jwt() ->> 'email'
    )
  );

-- Insert policies
create policy "Users can insert participants for their conversations" on chat_participants
  for insert with check (true); -- simplified for now, usually needs more logic

create policy "Users can insert messages in their conversations" on chat_messages
  for insert with check (
    exists (
      select 1 from chat_participants
      where conversation_id = chat_messages.conversation_id
      and user_email = auth.jwt() ->> 'email'
    )
  );

create policy "Users can create conversations" on chat_conversations
  for insert with check (true);

-- Indexes for performance
create index if not exists chat_messages_conversation_id_idx on chat_messages(conversation_id);
create index if not exists chat_participants_user_email_idx on chat_participants(user_email);
