-- Desabilitar RLS temporariamente para garantir funcionamento (ou adicionar políticas)
-- Se o usuário preferir segurança total, usar as políticas abaixo:

alter table public.notifications enable row level security;

-- Política: Usuários podem ver apenas suas próprias notificações
drop policy if exists "Users can view their own notifications" on public.notifications;
create policy "Users can view their own notifications"
on public.notifications for select
using ( recipient_email = auth.jwt() ->> 'email' );

-- Política: Qualquer usuário autenticado pode criar notificações (para outros)
drop policy if exists "Authenticated users can insert notifications" on public.notifications;
create policy "Authenticated users can insert notifications"
on public.notifications for insert
with check ( auth.role() = 'authenticated' );

-- Política: Usuários podem atualizar apenas suas notificações (marcar como lida)
drop policy if exists "Users can update their own notifications" on public.notifications;
create policy "Users can update their own notifications"
on public.notifications for update
using ( recipient_email = auth.jwt() ->> 'email' );

-- Política: Usuários podem excluir apenas suas notificações
drop policy if exists "Users can delete their own notifications" on public.notifications;
create policy "Users can delete their own notifications"
on public.notifications for delete
using ( recipient_email = auth.jwt() ->> 'email' );
