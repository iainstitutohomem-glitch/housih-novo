-- Criação da tabela de notificações
create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    recipient_email text not null,
    sender_name text not null,
    task_id uuid references public.tasks(id) on delete cascade,
    task_title text,
    type text not null check (type in ('mention', 'transfer')),
    message text,
    read boolean default false,
    created_at timestamptz default now()
);

-- Habilitar Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for all tables;
commit;

-- Índices para performance
create index if not exists idx_notifications_recipient on public.notifications(recipient_email);
create index if not exists idx_notifications_read on public.notifications(read);
