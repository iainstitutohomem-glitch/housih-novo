-- MIGRATION SCRIPT FOR MARCH DATA

-- 1. Inserir Empresas do Mês de Março
INSERT INTO companies (name) SELECT 'Instituto Homem' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Instituto Homem');
INSERT INTO companies (name) SELECT 'Homem Express' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Homem Express');
INSERT INTO companies (name) SELECT 'Núcleo Slim' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Núcleo Slim');
INSERT INTO companies (name) SELECT '2F Holding' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = '2F Holding');
INSERT INTO companies (name) SELECT 'Cheia de Charme' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Cheia de Charme');
INSERT INTO companies (name) SELECT 'Arte Fórmulas' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Arte Fórmulas');
INSERT INTO companies (name) SELECT 'Dr. Flávio' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Dr. Flávio');
INSERT INTO companies (name) SELECT 'Bruna Ramalho' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Bruna Ramalho');

-- 2. Inserir Membros da Equipe do Mês de Março
INSERT INTO team_members (name) SELECT 'Geovana' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Geovana');
INSERT INTO team_members (name) SELECT 'Marcelo' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Marcelo');
INSERT INTO team_members (name) SELECT 'Michel' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Michel');
INSERT INTO team_members (name) SELECT 'Vinicius' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Vinicius');
INSERT INTO team_members (name) SELECT 'Rafael' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Rafael');
INSERT INTO team_members (name) SELECT 'Renata' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Renata');
INSERT INTO team_members (name) SELECT 'Cristiano' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Cristiano');

-- 3. Inserir Tarefas de Março
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Influencers IH', 
    'Geovana', 
    'Concluído', 
    'Média', 
    '2026-03-01T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição de vídeos HE', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-02T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Homem Express' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Fechamento do B.I. de ROAS', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-02T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Reunião de Marketing - Djory (NS)', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-02T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Onboarding com agência VSX', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-02T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Fechamento da Semanal de resultados', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-02T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Iniciar criação de marca Podcas - Código Homem', 
    'Michel', 
    'Cancelado', 
    'Baixa', 
    '2026-03-02T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição de Reels - Dr. Alceu CWB', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-02T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Arte sorteio cesta Dia da Mulher', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-02T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição de videos AF', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Legenda e programação sorteio cesta', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Legenda, capa e programação video charmosinha dia da mulher', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar videos HE seguindo o que está no trello', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Fazer legenda e Programar stories e carrossel dia da mulher - promoções', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Vídeo Charmosinha Dia das Mulheres', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Criação da LP AF p/ conversão de contatos', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar Números na BM', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Dashboard Weekly', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Verificar perfil do Facebook NS', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Novos Criativos Núcleo Slim', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Publicar Vídeo 01 Dr. Alceu CWB (Instagram)', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Levantamento de sobra de orçamento Google e distribuição mês 03', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Pautar LP arte fórumlas', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Otimização Google todas as Contas Conforme Checkin e Ata', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Planejamento videos posicionamento Bruna', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Roteiros CC segunda quinzena de março', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição vídeo Youtube - Dr. Flavio', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Mudar Bio Bruna', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar mês de Março no BI', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-03T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Criativo de Emagrecimento NS (grupo de mkt)', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'telas tv HE', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Homem Express' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Gravação Comunicado Interno - Dr. Flávio', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Ajustes Dashboard Obras', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Impulsionar Vídeo Formulinha', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Gravar takes da clínica para Reels (Dimas Moura)', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Atualização de Campos do CRM', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Acrescentar usuários no RD CRM', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Resposas Contas GMB', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Gravação videos CC', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição de vídeos NS', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição de vídeos CC', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Capas e Legendas videos Bruna', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Bruna Ramalho' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Artes combos dia da mulher', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Atualizar faixa para SBC - Clube Aramaçan', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar vídeos 2 e 3 Dr. Alceu (Instagram)', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Envio de Comissão de Agência', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Renovação de Contratos Mídia Off', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição Vídeo Geral ISSM Porto', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Atualização Planilha de Contratos Mídias Off', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-04T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'colocar o trackeamento com whatsapp - tirarapi.whatsapp em todas as contas', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-05T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Roteiros gravação semanal AF', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-05T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Subir Criativos Semana da Mulher CC Sorocaba - Meta ADS', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-05T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Limpeza de Termos Urologicos e Doenças - contas Google', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-05T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Gravação de Conteúdos NS - (Quéren)', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição video Antes e depois HE', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Homem Express' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar Video LP Joinville dr. flavio', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar Video LP Bauru dr. flavio', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar video LP Ribeirao Preto Dr. flavio', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar video LP SBC Dr. Flavio', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar video LP Campo Grande Dr. Flavio', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Subir novos criativos / ADS HE', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Homem Express' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Artes Banners digitais Rafael para Google ADS', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Subir todos os formatos de imagem nas contas google p/ PMAX', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Brainstorm para atualização da marca Dr. Flávio', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Procurar influencers - Unidades IH', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Análise Mensal de mídia Off', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Bruna', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Bruna Ramalho' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Plano de Expansão - 2º Passo', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Pautar Conteúdos Redes Sociais', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Atualizar Tabela de Preços na IA - CC Osasco', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Criação Manual de marca - Núcleo Slim', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Criar Criativo Dr. Alkatab', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Taguear a nova página da AF', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Atualizar marca - Dr. Flavio Machado', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Promoção mês da mulher CC', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Assinar Servidor VPN para V4 e passar o acesso', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Subir novos Criativos Semana da Mulher CC Osasco', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-06T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Campanha Google AF orientada para receita / orientada para E-commerce', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-07T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Análise Campanhas Google ADS (unidades)', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-07T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'gravação CC casamento', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-07T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Gravação arte fórmulas fifty fight', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-08T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Blog NS', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Blog FM', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Blog AF', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Blos IH', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Página de vendas wanessa', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Foguete do Fabio', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Colocar tag do tintim nos botões da lp em todas as unidade', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Agendamento API CC', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Análise do Fechamento Semanal (resultados)', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Apresentação PPT da estrutura do CRM', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Reunião Semanal Social Media (atualização)', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Reunião Lista Mais - Pres. Prudente (resultados)', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Reuniçao semanal de MKT - Dr. Djory (NS)', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Gravação de Conteúdos NS - (Quéren e ADS)', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Envio de boletos de mídia', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Publicar Blogs', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Responder redes sociais', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Responder GMB', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar acessos VSX no Meta Ads', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Enviar pagamentos para todas as marcas de Meta Ads', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Atualizar Analise de Faturamentos', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Análise Google ADS - Performance 01-09 fav. e març', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Separação fotos protocolos', 
    'Renata', 
    'Cancelado', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Página de vendas Afro', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Campanha afro', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Organição conteúdos CC segunda quinzena março', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Reunião com agência Dash I.A.', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Reunião de alinhamento Cris CC e HE', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Configurar e-mail contact@institutohomem.com', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Enviar pagamento Infobip para Arte Fórmulas', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Atualizar dashboard atendimento', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Evento mulheres', 
    'Renata', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Colocar selecionador de idioma na LP de Foz', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Subir a Campanha do Dylan de mechas', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-09T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição video reparação CC', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Apresentar o projeto CRM - Gestores', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Gravação com Gustavo Benedeti e Dr. Flávio', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Devolutiva Rodrigo Maioto - Marketing e vendas IH', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Inserir a conta de Faria Lima na MCC (Faturamento)', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Colocar video Dr. Flavio na LP de P. Prudente', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programação videos CC até 03 de abril', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Impulsionar video Dr. Flavio', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Reestruturar a campanha de foz na nova LP bilingue', 
    'Rafael', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Assinar contrato de renovação Londrina', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Vídeos Influencer Victor Perfil IH CWB', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Capa protocolos', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-10T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Atualização dos Vídeos do Foguete', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-11T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Reunião com Executivo TV Gazeta - Marcos Santana', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-11T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Projeto de Divulgação Faria Lima - Evento', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-11T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Projeto Exposição Faria Lima - IH (Vinicius)', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-11T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Envio de Novos Spots Rádio 105FM Jundiai + Dumont FM', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-11T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Tabela CC sorocaba', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-11T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Alterar Spot Jundiaí', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-11T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Aniversariantes Mês', 
    'Vinicius', 
    'Concluído', 
    'Baixa', 
    '2026-03-11T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Análise de resultado Semanal - Marketing e Vendas', 
    'Michel', 
    'Concluído', 
    'Média', 
    '2026-03-30T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Negociação patrocínio Alessandra Campos', 
    'Geovana', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Planejamento Arte Fórmulas', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Planejamento Instituto Homem', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Planejamento Bruna Ramalho', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Bruna Ramalho' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Planejamento Homem Express', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Homem Express' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Planejamento Dr. Flavio Machado', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Planejamento Cheia de Charme Sorocaba', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Planejamento Cheia de Charme Osasco', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição vídeos Youtube', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Adicionar Médicos no Grupo de Redes Sociais', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Correção Site Instituto Homem', 
    'Cristiano', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Abril - Instituto Homem', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Abril - Dr. Flavio Machado', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Abril - Arte Fórmulas', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Abril - Cheia de Charme Sorocaba', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Abril - Cheia de Charme Osasco', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Cheia de Charme' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Abril - Bruna Ramalho', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Bruna Ramalho' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar YouTube Shorts - Dr. Flavio', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar YouTube Shorts - Instituto Homem', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos Abril - Homem Express', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Homem Express' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos TikTok - Dr. Flavio', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Programar Conteúdos TikTok - Instituto Homem', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Dr. Flávio' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Assinatura de Contratos - Rádios', 
    'Cristiano', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Novo contrato com Newton Coelho', 
    'Michel', 
    'Atrasado', 
    'Média', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Nova Atualização do Site (Processo CFM)', 
    'Marcelo', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Gravação de Conteúdo para Projeto Redes Sociais', 
    'Michel', 
    'Em Andamento', 
    'Média', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Edição do vídeo projeto Redes Sociais', 
    'Vinicius', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Instituto Homem' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Campanha Meta Ads - Produtos', 
    'Marcelo', 
    'Concluído', 
    'Média', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Subir vídeo Monica como Video View (3 dias)', 
    'Marcelo', 
    'Concluído', 
    'Média', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'levantar produtos para Ebook AF', 
    'Rafael', 
    'Concluído', 
    'Média', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Pesquisa interna HE google form (para Paulo)', 
    'Renata', 
    'Concluído', 
    'Alta', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = '2F Holding' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Duplicar LP Faria Lima para VSX', 
    'Marcelo', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Núcleo Slim' LIMIT 1);
INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    'Análise de Campanhas - Google e Meta', 
    'Michel', 
    'Concluído', 
    'Baixa', 
    '2026-03-31T12:00:00Z', 
    (SELECT id FROM companies WHERE name = 'Arte Fórmulas' LIMIT 1);
