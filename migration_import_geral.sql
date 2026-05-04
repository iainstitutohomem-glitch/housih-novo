-- MIGRATION: IMPORTAÇÃO DE TAREFAS DA PLANILHA (269 TAREFAS)
-- DATA: 2026-04-30
-- OBS: Este script insere as tarefas no QUADRO GERAL existente.

DO $$
DECLARE
    v_board_id UUID;
    v_task_count INTEGER := 0;
BEGIN
    -- 1. Localizar o Quadro Geral (Case Insensitive)
    SELECT id INTO v_board_id FROM boards WHERE name ILIKE '%Geral%' LIMIT 1;

    IF v_board_id IS NULL THEN
        RAISE EXCEPTION 'ERRO: Quadro Geral não encontrado no sistema. A importação foi abortada.';
    END IF;

    -- 2. Inserção em Massa das Tarefas

    -- TAREFA 1
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Análise da Proposta - Wesley',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Atrasado%' LIMIT 1),
        'Atrasado',
        'Baixa',
        '2026-04-07T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 2
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Atualização de Calendário de Aniversário IH',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 3
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gerar Pixel da Nucleo slim meta para VSX',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 4
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Tagear Campanha Google Faria lima para VSX',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 5
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Roteiros CC para maio',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 6
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Novos Conteúdos Telas Cabines Instituto Homem',
        '',
        '["Vinicius"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 7
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião de Marketing - Alex Ruivo',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 8
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião de Marketing - VSX',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 9
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação de novas cenas vídeo do MKT',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 10
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ajuste no Projeto CRM',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-01T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 11
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'adaptação de contrato de patrocinio Alessandra Campos',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-01T12:00:00Z',
        '2026-04-01T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 12
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Blog Semanal IH',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-01T12:00:00Z',
        '2026-04-01T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 13
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ajustar dashboard Obras',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-01T12:00:00Z',
        '2026-04-01T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 14
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar email arquitetura',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-01T12:00:00Z',
        '2026-04-01T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 15
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Adicionar Youtube IH no Mlabs',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-01T12:00:00Z',
        '2026-04-01T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 16
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Envio de direcionamento para gravação de conteúdos - Médicos',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 17
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Confirmação de Mídias Canceladas - Março',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-28T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 18
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Análise de Mídias Offline - Para ações em Abril',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 19
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Roteiros Novos Vídeos Colab. CC OZ + HE',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 20
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Textos para Ação de Merchandising - TV Record',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 21
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planilha de Fechamento de Custo de Mídia Off',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 22
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião de Resultados - TV Tem',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-02T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 23
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação CC',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 24
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Almoço com Vitor Faria',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 25
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião Semanal de Pergormance - Growth',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 26
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Atualização do Projeto HE',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 27
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Edição do vídeo de Marketing',
        '',
        '["Vinicius"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 28
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reorganização de Demandas MKT',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 29
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Contratação da plataforma Kommo Mensagens',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Atrasado%' LIMIT 1),
        'Atrasado',
        'Alta',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 30
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Novos Criativos com mascotes',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 31
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'influencers IH',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-04-01T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 32
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar LP de Indicação para Faria Lima',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-02T12:00:00Z',
        '2026-04-01T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 33
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Alinhamento de Cultura - Paulo Ruivo',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 34
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Pagamento patrocinio alessandra',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-02T12:00:00Z',
        '2026-04-02T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 35
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Pedido influencers Abril',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-02T12:00:00Z',
        '2026-04-02T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 36
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Fazer fechamento BI',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-02T12:00:00Z',
        '2026-04-02T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 37
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Fazer fechamento ROAS',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-02T12:00:00Z',
        '2026-04-02T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 38
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'criar email Paulo Ruivo',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-02T12:00:00Z',
        '2026-04-02T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 39
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gráfico Consulta Agendada no BI',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-02T12:00:00Z',
        '2026-04-02T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 40
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Retomada de contato com Influenciadores Locais para o Instituto Homem',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-03T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 41
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Atualizar foto do médico RT de FLN',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-03T12:00:00Z',
        '2026-03-25T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 42
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Fechamento do faturamento Google mês março/ sobra abril',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-04T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 43
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Analise de performance fev / março Campanha google',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-04T12:00:00Z',
        '2026-03-30T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 44
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Fazer nova campanha de objetivo de vendas Google AF',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-04T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 45
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Resolver pag seguro monica AF site junto a agencia',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-04T12:00:00Z',
        '2026-04-02T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 46
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Distribuição de verba para google Abril em todas as campanhas',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 47
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Finalizar Ebook Arte Fórmulas',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 48
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar LP para Ebook Arte Fórmulas',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 49
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reeditar vídeo Equipe de Marketing - IH People',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%IH People%' LIMIT 1)
    );

    -- TAREFA 50
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Editar Story Café - Equipe de Marketing - IH People',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%IH People%' LIMIT 1)
    );

    -- TAREFA 51
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Renovação de Contratos de Mídias Off',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 52
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Relatório de Mídias Offline referente a Março',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 53
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Relatório de Conversão de Unidades - Referente a Março',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 54
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião com Giovana - Projetos Externos',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 55
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Call com Metropolitana FM',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 56
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião Social Media Cheia de Charme Sorocaba',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 57
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião Social Media Cheia Charme Osasco',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 58
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião Homem Express',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 59
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento Conteúdos LinkedIn - Instituto Homem',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 60
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Aprovação Primeira Leva de Influenciadores Instituto Homem',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 61
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Regularizar Posts Dr. Flavio com CRM',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-08T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 62
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Regularizar Posts Instituto Homem com CRM',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-08T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 63
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Pauta de Novo Criativo com Charmosinha',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 64
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Pauta de Novo Criativo com Formulinha',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 65
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Datas Aniversários Cidades',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 66
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Datas Comemorativas',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 67
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Edição Vídeo Transformação Vanessa para Ads',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-10T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 68
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Arte Carrossel Combos Ads - Cheia de Charme',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-10T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 69
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ação Sorteio Seguidor Rádio',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Cancelado%' LIMIT 1),
        'Cancelado',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 70
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Roteiros Dr. Flavio para o YouTube',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-07T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 71
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Roteiros Dr. Flavio para o Reels e TikTok',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-07T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 72
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Envio de Comissão Agência do Instituto Homem',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-10T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 73
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Envio de Comissão Agência da Arte Fórmulas',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-10T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 74
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Envio de Boletos de Mídias Arte Fórmulas',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-10T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 75
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Envio de Boletos de Mídias Offline IH',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-10T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 76
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Envio de Mídias Canceladas',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 77
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Refazer rateio de Mídias da Grande São Paulo (pedido do Fábio)',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 78
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Envio de Rateio de Mídias Grande São Paulo - Lembrete',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 79
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criação de Assinatura de E-mail Padrão Instituto Homem',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 80
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Novas Telas Instituto Homem - TV Record',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-08T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 81
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Novos Roteiros Ação Merchandising Gravado - TV Record',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-08T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 82
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Falar com Tibor e Tainara - Evento Arnold',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 83
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reajustar Textos do Merchandising TV Record',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 84
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto Arnold - Custos e Ações',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-11T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 85
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Adicionar Abril no BI',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 86
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Pesquisa sobre Indexização sobre www.institutohomem.com.br',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 87
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Alinhamento redes sociais CC e HE',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 88
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Alinhamento tráfego CC e HE',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 89
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Organizar e subir trello videos Wanessa',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 90
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação VSX Dr Ronaldo',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 91
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de criação de conteúdo em eventos',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 92
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Roteiro trend apresentando a clínica',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 93
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'responder redes sociais',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 94
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Responder redes sociais',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 95
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para unidades do Instituto Homem',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 96
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para Cheia de Charme Sorocaba',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 97
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para Cheia de Charme Osasco',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 98
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para Homem Express',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 99
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Analises de Campanhas CC Meta Ads',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 100
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'analises de Campanhass HE Meta Ads',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 101
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para Arte Fórmulas',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 102
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Varredura termos negativados Google Ads',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 103
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Revisão de Conteúdo AF E-book',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 104
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Subir nova campanha HE- Pacotes',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 105
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Editar os videos + legenda do Remarketing Wanessa e subir na campanha',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-06T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 106
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto de Implantação de UTM (Marcelo e Rafael)',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-07T12:00:00Z',
        '2026-03-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 107
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ação com influencer AF',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-07T12:00:00Z',
        '2026-04-01T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 108
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Blog mensal IH',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 109
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação trend IH',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Cancelado%' LIMIT 1),
        'Cancelado',
        'Média',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 110
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação trend AF',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 111
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Atualizar GMB Faria Lima - Fotos do proprietário',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 112
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Subir campanha de remarketing Wanessa Camaleoa',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 113
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Organizar e passar pro marcelo alterações pagina de vendas',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 114
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Alteração formulário Paulo/Jonas',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-07T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 115
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Roteiros videos gravação quinta - promoções',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-08T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 116
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto Workshop Cabelos cacheados',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Em Andamento%' LIMIT 1),
        'Em Andamento',
        'Média',
        '2026-04-23T12:00:00Z',
        '2026-03-23T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 117
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Mapeamento de eventos',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-10T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 118
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto branding IH',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Em Andamento%' LIMIT 1),
        'Em Andamento',
        'Média',
        '2026-04-30T12:00:00Z',
        '2026-03-31T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 119
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Respostas GMB da semana',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 120
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto eventos 2° semestre',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Em Andamento%' LIMIT 1),
        'Em Andamento',
        'Planejada',
        '2026-04-24T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 121
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião de implantação leads 360',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-07T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 122
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Acompanhamento IA CC',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-09T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 123
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Antes e Depois progressivas CC Osasco',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-08T12:00:00Z',
        '2026-04-04T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 124
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Analise de Meta ADs',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-07T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 125
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Edição LP Wanessa',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-08T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 126
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Revisão roteiros Dr Flávio',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-07T12:00:00Z',
        '2026-04-07T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 127
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião leads 360',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-09T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 128
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Impulsionando Vídeo Homem Express Ozônio',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Cancelado%' LIMIT 1),
        'Cancelado',
        'Baixa',
        '2026-04-08T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 129
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Novos Títulos para os Vídeos',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 130
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Novas Thumbnails para o Canal do Instituto Homem - 4 Thumbs',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 131
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Adicionar video do Dr. flavio na LP de Santos',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-09T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 132
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Levantamento de campanhas com Taxa de conversão que caíram',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-08T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 133
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Adicionar video do Dr. flavio na LP de Jundiaí',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-09T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 134
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Adicionar video do Dr. flavio na LP de 1s. Jose do Rio Preto',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-09T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 135
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Novos Criativos Premium',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-08T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 136
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Subir novos criativos Premium',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-08T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 137
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'postagem semanal blog IH',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-09T12:00:00Z',
        '2026-04-08T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 138
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criação de conteudo para linkedin',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-11T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 139
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Fazer integração com as plataformas - Leads 360',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-09T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 140
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Remanejamento de sobra de orçamento para Google',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-09T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 141
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Fazer integração com a plataforma CLAUDE - Google ADS',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-09T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 142
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Fazer foto para Dr. Samuel',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-09T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 143
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Atualizar IA',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-09T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 144
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ajustar Geo localização Campanhas high ticket Santos',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-09T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 145
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ajustar novo orçamento de "sobra" Google conforme novo teto',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-09T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 146
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Organização videos gravação 09/04 Osasco',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-11T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 147
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar criativos Concessionárias de carro de luxo Meta Ads',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 148
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Subir novo vídeo Wanessa Camaleoa Youtube não listado',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 149
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Nova campanha com LP da Wanessa de Rmkt',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 150
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar Campanhas High ticket Ribeirão Preto Google Ads',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 151
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Analise de redes sociais',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 152
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Simulação de cliente em clinica concorrente',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-09T12:00:00Z',
        '2026-04-09T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 153
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Blog mensal NS',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 154
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Blog mensal AF',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 155
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Blog mensal FM',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 156
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ajuste BI Tags',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 157
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar vídeo Formulinha',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Cancelado%' LIMIT 1),
        'Cancelado',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 158
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar video Charmosinha',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Cancelado%' LIMIT 1),
        'Cancelado',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 159
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar apresentação de "como" performou o Google e deu certo em março',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 160
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Alterações Campanhas high ticket Curitiba',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 161
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar campanha High ticket SBC',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-10T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 162
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Checar Tags de conversão de Campo Grande',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 163
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar campanha High ticket Campo Grande',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-11T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 164
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Subir Campanha CC - Notas "R$ 100,00 Reais"',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 165
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar tag de conversão LON e FOZ para high ticket',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Atrasado%' LIMIT 1),
        'Atrasado',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 166
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Edição video sorteio cesta osasco',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-10T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 167
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Análise do sistema Leads 360',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-14T12:00:00Z',
        '2026-04-11T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 168
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar conta do Marcelo da Leads 360',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-13T12:00:00Z',
        '2026-04-11T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 169
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Super Daily - Demandas da Semana',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 170
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião de Alinhamento de MKT - Dr. Djory',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-13T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 171
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Percepção dos Gestores - Perfil Pacientes',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Atrasado%' LIMIT 1),
        'Atrasado',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 172
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião de Conteúdo VSX',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 173
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião de Performance Semanal - Growth',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 174
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ajuste de CRM com o Rafael',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 175
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Integração de Whatsapp - Kommo',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 176
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Alinhamento Semanal - Arte Fórmulas',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-14T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 177
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião de Liderança - Paulo Ruivo',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Cancelado%' LIMIT 1),
        'Cancelado',
        'Alta',
        '2026-04-14T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 178
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ajuste do CRM - RD Station',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-14T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 179
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Alinhamento estratégico VSX',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-14T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 180
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Warroom - Resultados de Campanhas',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-15T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 181
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Check List de Demandas Weekly',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-15T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 182
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião Online do Google',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-16T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 183
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento Estratégico (Ações)',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-16T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 184
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de Imagem (Shopping M)',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 185
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Apresentação de Conteúdo VSX',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 186
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação com médicos (Tatuapé e SBC) Projeto Newton',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-17T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 187
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Showcase mantica costuráveis',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Planejada',
        '2026-04-23T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 188
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'roteiros youtube Dr Flávio',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-15T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 189
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'roteiros arte fórmulas',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-16T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 190
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Conheça o time linkedin - michel',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-15T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 191
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Publicação blog mensal AF',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-17T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 192
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Publicação blog mensal NS',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-17T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 193
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Publicação blog semanal IH',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-17T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 194
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Edição de Vìdeo Sorteio Cheia de Charme Osasco',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 195
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Publicar a parcial das unidades "IH tá On"',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-13T12:00:00Z',
        '2026-04-12T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 196
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Apresentação de Propostas Novas Unidades ao Fábio',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 197
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de Conteúdos Instituto Homem',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-20T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 198
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de Conteúdos Dr. Flavio',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-20T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 199
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de Conteúdos Arte Fórmulas',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-20T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 200
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de Conteúdos Cheia de Charme Sorocaba',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Baixa',
        '2026-04-28T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 201
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de Conteúdos Cheia de Charme Osasco',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Baixa',
        '2026-04-28T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 202
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de Conteúdos LinkedIn',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-20T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 203
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Planejamento de Conteúdos Bruna',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Baixa',
        '2026-04-20T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Bruna Ramalho%' LIMIT 1)
    );

    -- TAREFA 204
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Nova Comunicação Instituto Homem',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Baixa',
        '2026-04-20T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 205
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Programar Conteúdos de TikTok - Cheia de Charme Osasco',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-14T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 206
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Programar Conteúdos de TikTok - Cheia de Charme Sorocaba',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-14T12:00:00Z',
        '2026-04-06T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 207
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Análise de Conteúdos de Redes Sociais Instituto Homem',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 208
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Aprovar influenciadores Ribeirão Preto',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-14T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 209
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Briefing Ação Tibor + Tainara - Instituto Homem Evento Arnold',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 210
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Assinatura de Renovações de Contrato de Rádios',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 211
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto TikTokShop',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Média',
        '2026-04-30T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 212
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Arte Cardápio Arte Fórmulas',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-16T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 213
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Programar Stories Promoções Cheia de Charme',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-17T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 214
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Aprovar Roteiros de Reels',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-17T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 215
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Edição Vídeos Promoções CC Osasco',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-17T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 216
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Nova Leva de Propostas Mídia Off Novas Unidades',
        '',
        '["Cristiano"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-20T12:00:00Z',
        '2026-04-20T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 217
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reajustar Orçamentos Google - Abril - conforme novo teto',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 218
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Termos de Pesquisa - Arte Fórmulas',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 219
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Termos de Pesquisa para Conteúdos Instituto Homem',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 220
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para unidades do Instituto Homem',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 221
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para Cheia de Charme Sorocaba',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 222
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para Cheia de Charme Osasco',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 223
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para Homem Express',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 224
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Enviar pagamentos Meta para Arte Fórmulas',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 225
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'escrever legenda para video 2 colab com influencer',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 226
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Desenhos progressivas',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 227
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar acesso para recepcionistas',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-14T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 228
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião Organização redes sociais CC e HE',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-14T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 229
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Responder avaliações GMB da semana',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-17T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 230
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Treinamento IA recepcionsistas Sorocaba',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-14T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 231
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Campanha A+ Concessionárias',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-13T12:00:00Z',
        '2026-04-13T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 232
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Briefing influencer RP - agrishow',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-14T12:00:00Z',
        '2026-04-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 233
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Folheto HE - alteração e impressão',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 234
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Campanha Ebook Arte Fórmulas',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-14T12:00:00Z',
        '2026-04-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Arte Fórmulas%' LIMIT 1)
    );

    -- TAREFA 235
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar Campanhas High ticket  Google Ads Osasco',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-14T12:00:00Z',
        '2026-04-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 236
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar Campanhas High ticket o Google Ads Bauru',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-14T12:00:00Z',
        '2026-04-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 237
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar Campanhas High ticket  Preto Google Ads Joinville',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-14T12:00:00Z',
        '2026-04-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 238
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Criar novas campanhas Publico A+ MEta',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-14T12:00:00Z',
        '2026-04-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 239
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação de Conteúdos Dr. Djory',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-15T12:00:00Z',
        '2026-04-14T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 240
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Passar para o rafael artes de high ticket usados no meta',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 241
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Colocar recurso de imagens em todas as campanhas High Ticket',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 242
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Ata reunião War Room',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 243
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Análise campanhas CC e HE c/ Rafael',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        '',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 244
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Flyer HE - Design Grafico',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 245
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Subir reels da Wanessa Camaleoa youtube',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 246
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Leads 360 CRM',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-16T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 247
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Analisar e subir campanhas CC',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 248
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Leads 360 CRM',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 249
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Subir Campanha high Ticket-Tatuapé',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-15T12:00:00Z',
        '2026-04-15T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 250
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Protocolos para Dr. Flavio',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Baixa',
        '2026-04-16T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 251
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Acompanhamento treinamento IA e CRM - Sorocaba',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Em Andamento%' LIMIT 1),
        'Em Andamento',
        'Planejada',
        '2026-04-30T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 252
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Implantação IA Osasco',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Média',
        '2026-04-20T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 253
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Acompanhamento treinamento IA e CRM Osasco',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Planejada',
        '2026-05-10T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 254
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Implantação Instagram IA Sorocaba',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-16T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 255
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião Leads 360',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 256
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Fechamento Tabela de Preços',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Homem Express%' LIMIT 1)
    );

    -- TAREFA 257
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Reunião Leads 360',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 258
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Conteúdo Google Tag Gateway',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-16T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%2F Holding%' LIMIT 1)
    );

    -- TAREFA 259
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Acompanhamento e Ajustes de Orçamento atualizado Google Ads',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-16T12:00:00Z',
        '2026-04-16T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 260
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação videos youtube Dr Flávio',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Planejada',
        '2026-04-17T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 261
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação reels Dr Flávio',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-17T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Dr. Flávio%' LIMIT 1)
    );

    -- TAREFA 262
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Gravação Marcelo NS',
        '',
        '["Geovana"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Atrasado%' LIMIT 1),
        'Atrasado',
        'Média',
        '2026-04-17T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Núcleo Slim%' LIMIT 1)
    );

    -- TAREFA 263
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto de Expansão',
        '',
        '["Marcelo"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-17T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 264
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto de Expansão',
        '',
        '["Michel"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-17T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 265
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Projeto de Expansão',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-17T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 266
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Roteiros Reels Cheia de Charme',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Não Iniciado%' LIMIT 1),
        'Não Iniciado',
        'Baixa',
        '2026-04-21T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 267
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Briefing e Roteiro Dia das Mães',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Alta',
        '2026-04-24T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    -- TAREFA 268
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Nova Campanha SJC',
        '',
        '["Rafael"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-17T12:00:00Z',
        '2026-04-17T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Instituto Homem%' LIMIT 1)
    );

    -- TAREFA 269
    INSERT INTO tasks (title, description, assignee, board_id, column_id, status, priority, due_date, created_at, company_id)
    VALUES (
        'Estruturação reunião Fabio CC',
        '',
        '["Renata"]'::jsonb,
        v_board_id,
        (SELECT id FROM board_columns WHERE board_id = v_board_id AND title ILIKE '%Concluído%' LIMIT 1),
        'Concluído',
        'Média',
        '2026-04-20T12:00:00Z',
        '2026-04-18T12:00:00Z',
        (SELECT id FROM companies WHERE name ILIKE '%Cheia de Charme%' LIMIT 1)
    );

    RAISE NOTICE 'Importação concluída com sucesso no Quadro Geral.';
END $$;
