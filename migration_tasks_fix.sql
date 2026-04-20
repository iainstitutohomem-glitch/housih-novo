-- SCRIPT PARA CORREÇÃO DA TABELA DE TAREFAS (TASKS)
-- Rode este script no SQL Editor do seu Dashboard Supabase

-- 1. Adicionar a coluna 'attachments' se não existir
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::JSONB;

-- 2. Corrigir a coluna 'assignee' (Remover default antigo para evitar erro de cast)
ALTER TABLE tasks ALTER COLUMN assignee DROP DEFAULT;

ALTER TABLE tasks ALTER COLUMN assignee TYPE JSONB USING (
  CASE 
    WHEN assignee IS NULL THEN '[]'::jsonb
    ELSE to_jsonb(assignee)
  END
);

-- 3. Definir o valor padrão da coluna 'assignee' como um array vazio
ALTER TABLE tasks ALTER COLUMN assignee SET DEFAULT '[]'::JSONB;

-- 4. Notificar o Supabase para recarregar o cache do esquema (opcional, mas recomendado)
NOTIFY pgrst, 'reload schema';
