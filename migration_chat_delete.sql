-- Permite que membros de uma conversa a excluam
-- Exceto o Grupo Geral (Equipe Geral) que tem ID zeros.

create policy "Users can delete their conversations" on chat_conversations
  for delete using (
    is_chat_member(id) AND 
    id != '00000000-0000-0000-0000-000000000000'::uuid
  );
