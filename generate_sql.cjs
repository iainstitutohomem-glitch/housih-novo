<<<<<<< HEAD
const fs = require('fs');

const csvData = `Data Criação,Tarefa,Responsável,Data Final,Status,Empresa,Prioridade
30/03/2026,Influencers IH,Geovana,01/03/2026,Finalizado,Instituto Homem,Média
02/03/2026,Edição de vídeos HE,Geovana,02/03/2026,Finalizado,Homem Express,Baixa
02/03/2026,Fechamento do B.I. de ROAS,Marcelo,02/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Reunião de Marketing - Djory (NS),Michel,02/03/2026,Finalizado,Núcleo Slim,Baixa
02/03/2026,Onboarding com agência VSX,Michel,02/03/2026,Finalizado,Núcleo Slim,Baixa
02/03/2026,Fechamento da Semanal de resultados,Michel,02/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Iniciar criação de marca Podcas - Código Homem,Michel,02/03/2026,Cancelado,2F Holding,Baixa
02/03/2026,Edição de Reels - Dr. Alceu CWB,Vinicius,02/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Arte sorteio cesta Dia da Mulher,Vinicius,02/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Edição de videos AF,Geovana,03/03/2026,Finalizado,Arte Fórmulas,Baixa
02/03/2026,Legenda e programação sorteio cesta,Geovana,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,"Legenda, capa e programação video charmosinha dia da mulher",Geovana,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Programar videos HE seguindo o que está no trello,Geovana,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Fazer legenda e Programar stories e carrossel dia da mulher - promoções,Geovana,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Vídeo Charmosinha Dia das Mulheres,Marcelo,03/03/2026,Finalizado,Cheia de Charme,Baixa
03/03/2026,Criação da LP AF p/ conversão de contatos,Marcelo,03/03/2026,Finalizado,Arte Fórmulas,Baixa
03/03/2026,Adicionar Números na BM,Marcelo,03/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Dashboard Weekly,Marcelo,03/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Verificar perfil do Facebook NS,Marcelo,03/03/2026,Finalizado,Núcleo Slim,Baixa
03/03/2026,Novos Criativos Núcleo Slim,Marcelo,03/03/2026,Finalizado,Núcleo Slim,Baixa
03/03/2026,Publicar Vídeo 01 Dr. Alceu CWB (Instagram),Michel,03/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Levantamento de sobra de orçamento Google e distribuição mês 03,Rafael,03/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Pautar LP arte fórumlas,Rafael,03/03/2026,Finalizado,Arte Fórmulas,Baixa
03/03/2026,Otimização Google todas as Contas Conforme Checkin e Ata,Rafael,03/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Planejamento videos posicionamento Bruna,Renata,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Roteiros CC segunda quinzena de março,Renata,03/03/2026,Finalizado,Cheia de Charme,Baixa
03/03/2026,Edição vídeo Youtube - Dr. Flavio,Vinicius,03/03/2026,Finalizado,Dr. Flávio,Baixa
02/03/2026,Mudar Bio Bruna,Cristiano,03/03/2026,Finalizado,Cheia de Charme,Baixa
04/03/2026,Adicionar mês de Março no BI,Marcelo,03/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Criativo de Emagrecimento NS (grupo de mkt),Marcelo,04/03/2026,Finalizado,Núcleo Slim,Baixa
03/03/2026,telas tv HE,Renata,04/03/2026,Finalizado,Homem Express,Baixa
04/03/2026,Gravação Comunicado Interno - Dr. Flávio,Geovana,04/03/2026,Finalizado,Dr. Flávio,Baixa
03/03/2026,Ajustes Dashboard Obras,Marcelo,04/03/2026,Finalizado,2F Holding,Baixa
02/03/2026,Impulsionar Vídeo Formulinha,Marcelo,04/03/2026,Finalizado,Arte Fórmulas,Baixa
03/03/2026,Gravar takes da clínica para Reels (Dimas Moura),Michel,04/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Atualização de Campos do CRM,Michel,04/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Acrescentar usuários no RD CRM,Michel,04/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Resposas Contas GMB,Rafael,04/03/2026,Finalizado,2F Holding,Baixa
03/03/2026,Gravação videos CC,Renata,04/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Edição de vídeos NS,Vinicius,04/03/2026,Finalizado,Núcleo Slim,Baixa
02/03/2026,Edição de vídeos CC,Vinicius,04/03/2026,Finalizado,Cheia de Charme,Baixa
03/03/2026,Capas e Legendas videos Bruna,Vinicius,04/03/2026,Finalizado,Bruna Ramalho,Baixa
02/03/2026,Artes combos dia da mulher,Vinicius,04/03/2026,Finalizado,Cheia de Charme,Baixa
04/03/2026,Atualizar faixa para SBC - Clube Aramaçan,Vinicius,04/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Programar vídeos 2 e 3 Dr. Alceu (Instagram),Cristiano,04/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Envio de Comissão de Agência,Cristiano,04/03/2026,Finalizado,2F Holding,Baixa
07/03/2026,Renovação de Contratos Mídia Off,Cristiano,04/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Edição Vídeo Geral ISSM Porto,Cristiano,04/03/2026,Finalizado,2F Holding,Baixa
10/03/2026,Atualização Planilha de Contratos Mídias Off,Cristiano,04/03/2026,Finalizado,2F Holding,Baixa
04/03/2026,"colocar o trackeamento com whatsapp - tirar""api.whatsapp"" em todas as contas",Rafael,05/03/2026,Finalizado,Instituto Homem,Baixa
05/03/2026,Roteiros gravação semanal AF,Geovana,05/03/2026,Finalizado,Arte Fórmulas,Baixa
05/03/2026,Subir Criativos Semana da Mulher CC Sorocaba - Meta ADS,Rafael,05/03/2026,Finalizado,Cheia de Charme,Baixa
05/03/2026,Limpeza de Termos Urologicos e Doenças - contas Google,Rafael,05/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Gravação de Conteúdos NS - (Quéren),Geovana,06/03/2026,Finalizado,Núcleo Slim,Baixa
03/03/2026,Edição video Antes e depois HE,Geovana,06/03/2026,Finalizado,Homem Express,Baixa
03/03/2026,Adicionar Video LP Joinville dr. flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Adicionar Video LP Bauru dr. flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Adicionar video LP Ribeirao Preto Dr. flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Adicionar video LP SBC Dr. Flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Adicionar video LP Campo Grande Dr. Flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Subir novos criativos / ADS HE,Rafael,06/03/2026,Finalizado,Homem Express,Baixa
04/03/2026,Artes Banners digitais Rafael para Google ADS,Vinicius,06/03/2026,Finalizado,Instituto Homem,Baixa
05/03/2026,Subir todos os formatos de imagem nas contas google p/ PMAX,Rafael,06/03/2026,Finalizado,Instituto Homem,Baixa
05/03/2026,Brainstorm para atualização da marca Dr. Flávio,Michel,06/03/2026,Finalizado,Dr. Flávio,Baixa
06/03/2026,Procurar influencers - Unidades IH,Cristiano,06/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Análise Mensal de mídia Off,Cristiano,06/03/2026,Finalizado,2F Holding,Baixa
05/03/2026,Programar Conteúdos Bruna,Cristiano,06/03/2026,Finalizado,Bruna Ramalho,Baixa
08/03/2026,Plano de Expansão - 2º Passo,Cristiano,06/03/2026,Finalizado,2F Holding,Baixa
03/03/2026,Pautar Conteúdos Redes Sociais,Cristiano,06/03/2026,Finalizado,2F Holding,Baixa
06/03/2026,Atualizar Tabela de Preços na IA - CC Osasco,Marcelo,06/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Criação Manual de marca - Núcleo Slim,Vinicius,06/03/2026,Finalizado,Núcleo Slim,Baixa
06/03/2026,Criar Criativo Dr. Alkatab,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Taguear a nova página da AF,Rafael,06/03/2026,Finalizado,Arte Fórmulas,Baixa
06/03/2026,Atualizar marca - Dr. Flavio Machado,Vinicius,06/03/2026,Finalizado,Dr. Flávio,Baixa
06/03/2026,Promoção mês da mulher CC,Vinicius,06/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Assinar Servidor VPN para V4 e passar o acesso,Rafael,06/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Subir novos Criativos Semana da Mulher CC Osasco,Rafael,06/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Campanha Google AF orientada para receita / orientada para E-commerce,Rafael,07/03/2026,Finalizado,Arte Fórmulas,Baixa
06/03/2026,Análise Campanhas Google ADS (unidades),Rafael,07/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,gravação CC casamento,Renata,07/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Gravação arte fórmulas fifty fight,Geovana,08/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Blog NS,Geovana,09/03/2026,Finalizado,Núcleo Slim,Baixa
02/03/2026,Blog FM,Geovana,09/03/2026,Finalizado,Dr. Flávio,Baixa
02/03/2026,Blog AF,Geovana,09/03/2026,Finalizado,Arte Fórmulas,Baixa
02/03/2026,Blos IH,Geovana,09/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Página de vendas wanessa,Marcelo,09/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Foguete do Fabio,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Colocar tag do tintim nos botões da lp em todas as unidade,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Agendamento API CC,Renata,09/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Análise do Fechamento Semanal (resultados),Michel,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Apresentação PPT da estrutura do CRM,Michel,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Reunião Semanal Social Media (atualização),Michel,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Reunião Lista Mais - Pres. Prudente (resultados),Michel,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Reuniçao semanal de MKT - Dr. Djory (NS),Michel,09/03/2026,Finalizado,Núcleo Slim,Baixa
09/03/2026,Gravação de Conteúdos NS - (Quéren e ADS),Geovana,09/03/2026,Finalizado,Núcleo Slim,Baixa
09/03/2026,Envio de boletos de mídia,Cristiano,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Publicar Blogs,Geovana,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Responder redes sociais,Geovana,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Responder GMB,Rafael,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Adicionar acessos VSX no Meta Ads,Marcelo,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Enviar pagamentos para todas as marcas de Meta Ads,Marcelo,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Atualizar Analise de Faturamentos,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Análise Google ADS - Performance 01-09 fav. e març,Rafael,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Separação fotos protocolos,Renata,09/03/2026,Cancelado,Cheia de Charme,Baixa
09/03/2026,Página de vendas Afro,Renata,09/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Campanha afro,Renata,09/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Organição conteúdos CC segunda quinzena março,Renata,09/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Reunião com agência Dash I.A.,Michel,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Reunião de alinhamento Cris CC e HE,Renata,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Configurar e-mail contact@institutohomem.com,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Enviar pagamento Infobip para Arte Fórmulas,Marcelo,09/03/2026,Finalizado,Arte Fórmulas,Baixa
09/03/2026,Atualizar dashboard atendimento,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Evento mulheres,Renata,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Colocar selecionador de idioma na LP de Foz,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Subir a Campanha do Dylan de mechas,Rafael,09/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Edição video reparação CC,Geovana,10/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Apresentar o projeto CRM - Gestores,Michel,10/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Gravação com Gustavo Benedeti e Dr. Flávio,Michel,10/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Devolutiva Rodrigo Maioto - Marketing e vendas IH,Michel,10/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Inserir a conta de Faria Lima na MCC (Faturamento),Rafael,10/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Colocar video Dr. Flavio na LP de P. Prudente,Marcelo,10/03/2026,Finalizado,Dr. Flávio,Baixa
09/03/2026,Programação videos CC até 03 de abril,Cristiano,10/03/2026,Finalizado,Cheia de Charme,Baixa
10/03/2026,Impulsionar video Dr. Flavio,Marcelo,10/03/2026,Finalizado,Dr. Flávio,Baixa
10/03/2026,Reestruturar a campanha de foz na nova LP bilingue,Rafael,10/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Assinar contrato de renovação Londrina,Cristiano,10/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Programar Conteúdos Vídeos Influencer Victor Perfil IH CWB,Cristiano,10/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Capa protocolos,Vinicius,10/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Atualização dos Vídeos do Foguete,Cristiano,11/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Reunião com Executivo TV Gazeta - Marcos Santana,Michel,11/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Projeto de Divulgação Faria Lima - Evento,Michel,11/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Projeto Exposição Faria Lima - IH (Vinicius),Vinicius,11/03/2026,Finalizado,Instituto Homem,Baixa
11/03/2026,Envio de Novos Spots Rádio 105FM Jundiai + Dumont FM,Cristiano,11/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Tabela CC sorocaba,Vinicius,11/03/2026,Finalizado,Cheia de Charme,Baixa
11/03/2026,Alterar Spot Jundiaí,Marcelo,11/03/2026,Finalizado,Instituto Homem,Baixa
11/03/2026,Aniversariantes Mês,Vinicius,11/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Análise de resultado Semanal - Marketing e Vendas,Michel,30/03/2026,Finalizado,Instituto Homem,Média
25/03/2026,Negociação patrocínio Alessandra Campos,Geovana,31/03/2026,Finalizado,Arte Fórmulas,Baixa
23/03/2026,Planejamento Arte Fórmulas,Vinicius,31/03/2026,Finalizado,Arte Fórmulas,Alta
23/03/2026,Planejamento Instituto Homem,Vinicius,31/03/2026,Finalizado,Instituto Homem,Alta
23/03/2026,Planejamento Bruna Ramalho,Vinicius,31/03/2026,Finalizado,Bruna Ramalho,Alta
23/03/2026,Planejamento Homem Express,Vinicius,31/03/2026,Finalizado,Homem Express,Alta
23/03/2026,Planejamento Dr. Flavio Machado,Vinicius,31/03/2026,Finalizado,Dr. Flávio,Alta
23/03/2026,Planejamento Cheia de Charme Sorocaba,Vinicius,31/03/2026,Finalizado,Cheia de Charme,Alta
23/03/2026,Planejamento Cheia de Charme Osasco,Vinicius,31/03/2026,Finalizado,Cheia de Charme,Alta
23/03/2026,Edição vídeos Youtube,Vinicius,31/03/2026,Finalizado,Dr. Flávio,Alta
30/03/2026,Adicionar Médicos no Grupo de Redes Sociais,Cristiano,31/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Correção Site Instituto Homem,Cristiano,31/03/2026,Finalizado,Instituto Homem,Alta
30/03/2026,Programar Conteúdos Abril - Instituto Homem,Cristiano,31/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Programar Conteúdos Abril - Dr. Flavio Machado,Cristiano,31/03/2026,Finalizado,Dr. Flávio,Baixa
30/03/2026,Programar Conteúdos Abril - Arte Fórmulas,Cristiano,31/03/2026,Finalizado,Arte Fórmulas,Baixa
30/03/2026,Programar Conteúdos Abril - Cheia de Charme Sorocaba,Cristiano,31/03/2026,Finalizado,Cheia de Charme,Baixa
30/03/2026,Programar Conteúdos Abril - Cheia de Charme Osasco,Cristiano,31/03/2026,Finalizado,Cheia de Charme,Baixa
30/03/2026,Programar Conteúdos Abril - Bruna Ramalho,Cristiano,31/03/2026,Finalizado,Bruna Ramalho,Baixa
30/03/2026,Programar YouTube Shorts - Dr. Flavio,Cristiano,31/03/2026,Finalizado,Dr. Flávio,Baixa
30/03/2026,Programar YouTube Shorts - Instituto Homem,Cristiano,31/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Programar Conteúdos Abril - Homem Express,Cristiano,31/03/2026,Finalizado,Homem Express,Baixa
30/03/2026,Programar Conteúdos TikTok - Dr. Flavio,Cristiano,31/03/2026,Finalizado,Dr. Flávio,Baixa
30/03/2026,Programar Conteúdos TikTok - Instituto Homem,Cristiano,31/03/2026,Finalizado,Dr. Flávio,Baixa
30/03/2026,Assinatura de Contratos - Rádios,Cristiano,31/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Novo contrato com Newton Coelho,Michel,31/03/2026,Em atraso,Instituto Homem,Média
30/03/2026,Nova Atualização do Site (Processo CFM),Marcelo,31/03/2026,Finalizado,Instituto Homem,Alta
30/03/2026,Gravação de Conteúdo para Projeto Redes Sociais,Michel,31/03/2026,Em Andamento,Instituto Homem,Média
30/03/2026,Edição do vídeo projeto Redes Sociais,Vinicius,31/03/2026,Finalizado,Instituto Homem,Alta
31/03/2026,Campanha Meta Ads - Produtos,Marcelo,31/03/2026,Finalizado,Arte Fórmulas,Média
31/03/2026,Subir vídeo Monica como Video View (3 dias),Marcelo,31/03/2026,Finalizado,Arte Fórmulas,Média
31/03/2026,levantar produtos para Ebook AF,Rafael,31/03/2026,Finalizado,Arte Fórmulas,Média
31/03/2026,Pesquisa interna HE google form (para Paulo),Renata,31/03/2026,Finalizado,2F Holding,Alta
31/03/2026,Duplicar LP Faria Lima para VSX,Marcelo,31/03/2026,Finalizado,Núcleo Slim,Baixa
31/03/2026,Análise de Campanhas - Google e Meta,Michel,31/03/2026,Finalizado,Arte Fórmulas,Baixa`;

function parseDate(dateStr) {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}T12:00:00Z`;
}

function mapStatus(status) {
    if (status === 'Finalizado') return 'Concluído';
    if (status === 'Em atraso') return 'Atrasado';
    return status; // Em Andamento, Cancelado
}

const rows = csvData.trim().split('\n').slice(1);
const companies = new Set();
const members = new Set();

rows.forEach(row => {
    // Basic CSV split (caution with quotes)
    const parts = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
    const empresa = (parts[5] || 'Nenhuma').replace(/"/g, '').trim();
    const responsavel = (parts[2] || 'Sem Responsável').replace(/"/g, '').trim();
    if (empresa) companies.add(empresa);
    if (responsavel) members.add(responsavel);
});

let sql = `-- MIGRATION SCRIPT FOR MARCH DATA\n\n`;

// 1. Ensure Companies
sql += `-- 1. Inserir Empresas do Mês de Março\n`;
companies.forEach(name => {
    sql += `INSERT INTO companies (name) SELECT '${name.replace(/'/g, "''")}' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = '${name.replace(/'/g, "''")}');\n`;
});

// 2. Ensure Team Members
sql += `\n-- 2. Inserir Membros da Equipe do Mês de Março\n`;
members.forEach(name => {
    sql += `INSERT INTO team_members (name) SELECT '${name.replace(/'/g, "''")}' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = '${name.replace(/'/g, "''")}');\n`;
});

// 3. Insert Tasks
sql += `\n-- 3. Inserir Tarefas de Março\n`;
rows.forEach(row => {
    const parts = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
    const title = (parts[1] || 'Sem Título').replace(/"/g, '').trim();
    const assignee = (parts[2] || 'Sem Responsável').replace(/"/g, '').trim();
    const due_date = parseDate(parts[3]);
    const status = mapStatus((parts[4] || '').replace(/"/g, '').trim());
    const empresa = (parts[5] || 'Nenhuma').replace(/"/g, '').trim();
    const priority = (parts[6] || 'Média').replace(/"/g, '').trim();

    sql += `INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    '${title.replace(/'/g, "''")}', 
    '${assignee.replace(/'/g, "''")}', 
    '${status}', 
    '${priority}', 
    '${due_date}', 
    (SELECT id FROM companies WHERE name = '${empresa.replace(/'/g, "''")}' LIMIT 1);\n`;
});

fs.writeFileSync('migration_march.sql', sql);
console.log('SQL generated in migration_march.sql');
=======
const fs = require('fs');

const csvData = `Data Criação,Tarefa,Responsável,Data Final,Status,Empresa,Prioridade
30/03/2026,Influencers IH,Geovana,01/03/2026,Finalizado,Instituto Homem,Média
02/03/2026,Edição de vídeos HE,Geovana,02/03/2026,Finalizado,Homem Express,Baixa
02/03/2026,Fechamento do B.I. de ROAS,Marcelo,02/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Reunião de Marketing - Djory (NS),Michel,02/03/2026,Finalizado,Núcleo Slim,Baixa
02/03/2026,Onboarding com agência VSX,Michel,02/03/2026,Finalizado,Núcleo Slim,Baixa
02/03/2026,Fechamento da Semanal de resultados,Michel,02/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Iniciar criação de marca Podcas - Código Homem,Michel,02/03/2026,Cancelado,2F Holding,Baixa
02/03/2026,Edição de Reels - Dr. Alceu CWB,Vinicius,02/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Arte sorteio cesta Dia da Mulher,Vinicius,02/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Edição de videos AF,Geovana,03/03/2026,Finalizado,Arte Fórmulas,Baixa
02/03/2026,Legenda e programação sorteio cesta,Geovana,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,"Legenda, capa e programação video charmosinha dia da mulher",Geovana,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Programar videos HE seguindo o que está no trello,Geovana,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Fazer legenda e Programar stories e carrossel dia da mulher - promoções,Geovana,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Vídeo Charmosinha Dia das Mulheres,Marcelo,03/03/2026,Finalizado,Cheia de Charme,Baixa
03/03/2026,Criação da LP AF p/ conversão de contatos,Marcelo,03/03/2026,Finalizado,Arte Fórmulas,Baixa
03/03/2026,Adicionar Números na BM,Marcelo,03/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Dashboard Weekly,Marcelo,03/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Verificar perfil do Facebook NS,Marcelo,03/03/2026,Finalizado,Núcleo Slim,Baixa
03/03/2026,Novos Criativos Núcleo Slim,Marcelo,03/03/2026,Finalizado,Núcleo Slim,Baixa
03/03/2026,Publicar Vídeo 01 Dr. Alceu CWB (Instagram),Michel,03/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Levantamento de sobra de orçamento Google e distribuição mês 03,Rafael,03/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Pautar LP arte fórumlas,Rafael,03/03/2026,Finalizado,Arte Fórmulas,Baixa
03/03/2026,Otimização Google todas as Contas Conforme Checkin e Ata,Rafael,03/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Planejamento videos posicionamento Bruna,Renata,03/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Roteiros CC segunda quinzena de março,Renata,03/03/2026,Finalizado,Cheia de Charme,Baixa
03/03/2026,Edição vídeo Youtube - Dr. Flavio,Vinicius,03/03/2026,Finalizado,Dr. Flávio,Baixa
02/03/2026,Mudar Bio Bruna,Cristiano,03/03/2026,Finalizado,Cheia de Charme,Baixa
04/03/2026,Adicionar mês de Março no BI,Marcelo,03/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Criativo de Emagrecimento NS (grupo de mkt),Marcelo,04/03/2026,Finalizado,Núcleo Slim,Baixa
03/03/2026,telas tv HE,Renata,04/03/2026,Finalizado,Homem Express,Baixa
04/03/2026,Gravação Comunicado Interno - Dr. Flávio,Geovana,04/03/2026,Finalizado,Dr. Flávio,Baixa
03/03/2026,Ajustes Dashboard Obras,Marcelo,04/03/2026,Finalizado,2F Holding,Baixa
02/03/2026,Impulsionar Vídeo Formulinha,Marcelo,04/03/2026,Finalizado,Arte Fórmulas,Baixa
03/03/2026,Gravar takes da clínica para Reels (Dimas Moura),Michel,04/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Atualização de Campos do CRM,Michel,04/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Acrescentar usuários no RD CRM,Michel,04/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Resposas Contas GMB,Rafael,04/03/2026,Finalizado,2F Holding,Baixa
03/03/2026,Gravação videos CC,Renata,04/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Edição de vídeos NS,Vinicius,04/03/2026,Finalizado,Núcleo Slim,Baixa
02/03/2026,Edição de vídeos CC,Vinicius,04/03/2026,Finalizado,Cheia de Charme,Baixa
03/03/2026,Capas e Legendas videos Bruna,Vinicius,04/03/2026,Finalizado,Bruna Ramalho,Baixa
02/03/2026,Artes combos dia da mulher,Vinicius,04/03/2026,Finalizado,Cheia de Charme,Baixa
04/03/2026,Atualizar faixa para SBC - Clube Aramaçan,Vinicius,04/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Programar vídeos 2 e 3 Dr. Alceu (Instagram),Cristiano,04/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Envio de Comissão de Agência,Cristiano,04/03/2026,Finalizado,2F Holding,Baixa
07/03/2026,Renovação de Contratos Mídia Off,Cristiano,04/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Edição Vídeo Geral ISSM Porto,Cristiano,04/03/2026,Finalizado,2F Holding,Baixa
10/03/2026,Atualização Planilha de Contratos Mídias Off,Cristiano,04/03/2026,Finalizado,2F Holding,Baixa
04/03/2026,"colocar o trackeamento com whatsapp - tirar""api.whatsapp"" em todas as contas",Rafael,05/03/2026,Finalizado,Instituto Homem,Baixa
05/03/2026,Roteiros gravação semanal AF,Geovana,05/03/2026,Finalizado,Arte Fórmulas,Baixa
05/03/2026,Subir Criativos Semana da Mulher CC Sorocaba - Meta ADS,Rafael,05/03/2026,Finalizado,Cheia de Charme,Baixa
05/03/2026,Limpeza de Termos Urologicos e Doenças - contas Google,Rafael,05/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Gravação de Conteúdos NS - (Quéren),Geovana,06/03/2026,Finalizado,Núcleo Slim,Baixa
03/03/2026,Edição video Antes e depois HE,Geovana,06/03/2026,Finalizado,Homem Express,Baixa
03/03/2026,Adicionar Video LP Joinville dr. flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Adicionar Video LP Bauru dr. flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Adicionar video LP Ribeirao Preto Dr. flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Adicionar video LP SBC Dr. Flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
04/03/2026,Adicionar video LP Campo Grande Dr. Flavio,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Subir novos criativos / ADS HE,Rafael,06/03/2026,Finalizado,Homem Express,Baixa
04/03/2026,Artes Banners digitais Rafael para Google ADS,Vinicius,06/03/2026,Finalizado,Instituto Homem,Baixa
05/03/2026,Subir todos os formatos de imagem nas contas google p/ PMAX,Rafael,06/03/2026,Finalizado,Instituto Homem,Baixa
05/03/2026,Brainstorm para atualização da marca Dr. Flávio,Michel,06/03/2026,Finalizado,Dr. Flávio,Baixa
06/03/2026,Procurar influencers - Unidades IH,Cristiano,06/03/2026,Finalizado,Instituto Homem,Baixa
02/03/2026,Análise Mensal de mídia Off,Cristiano,06/03/2026,Finalizado,2F Holding,Baixa
05/03/2026,Programar Conteúdos Bruna,Cristiano,06/03/2026,Finalizado,Bruna Ramalho,Baixa
08/03/2026,Plano de Expansão - 2º Passo,Cristiano,06/03/2026,Finalizado,2F Holding,Baixa
03/03/2026,Pautar Conteúdos Redes Sociais,Cristiano,06/03/2026,Finalizado,2F Holding,Baixa
06/03/2026,Atualizar Tabela de Preços na IA - CC Osasco,Marcelo,06/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Criação Manual de marca - Núcleo Slim,Vinicius,06/03/2026,Finalizado,Núcleo Slim,Baixa
06/03/2026,Criar Criativo Dr. Alkatab,Marcelo,06/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Taguear a nova página da AF,Rafael,06/03/2026,Finalizado,Arte Fórmulas,Baixa
06/03/2026,Atualizar marca - Dr. Flavio Machado,Vinicius,06/03/2026,Finalizado,Dr. Flávio,Baixa
06/03/2026,Promoção mês da mulher CC,Vinicius,06/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Assinar Servidor VPN para V4 e passar o acesso,Rafael,06/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Subir novos Criativos Semana da Mulher CC Osasco,Rafael,06/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Campanha Google AF orientada para receita / orientada para E-commerce,Rafael,07/03/2026,Finalizado,Arte Fórmulas,Baixa
06/03/2026,Análise Campanhas Google ADS (unidades),Rafael,07/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,gravação CC casamento,Renata,07/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Gravação arte fórmulas fifty fight,Geovana,08/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Blog NS,Geovana,09/03/2026,Finalizado,Núcleo Slim,Baixa
02/03/2026,Blog FM,Geovana,09/03/2026,Finalizado,Dr. Flávio,Baixa
02/03/2026,Blog AF,Geovana,09/03/2026,Finalizado,Arte Fórmulas,Baixa
02/03/2026,Blos IH,Geovana,09/03/2026,Finalizado,Instituto Homem,Baixa
03/03/2026,Página de vendas wanessa,Marcelo,09/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Foguete do Fabio,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Colocar tag do tintim nos botões da lp em todas as unidade,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
06/03/2026,Agendamento API CC,Renata,09/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Análise do Fechamento Semanal (resultados),Michel,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Apresentação PPT da estrutura do CRM,Michel,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Reunião Semanal Social Media (atualização),Michel,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Reunião Lista Mais - Pres. Prudente (resultados),Michel,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Reuniçao semanal de MKT - Dr. Djory (NS),Michel,09/03/2026,Finalizado,Núcleo Slim,Baixa
09/03/2026,Gravação de Conteúdos NS - (Quéren e ADS),Geovana,09/03/2026,Finalizado,Núcleo Slim,Baixa
09/03/2026,Envio de boletos de mídia,Cristiano,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Publicar Blogs,Geovana,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Responder redes sociais,Geovana,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Responder GMB,Rafael,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Adicionar acessos VSX no Meta Ads,Marcelo,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Enviar pagamentos para todas as marcas de Meta Ads,Marcelo,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Atualizar Analise de Faturamentos,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Análise Google ADS - Performance 01-09 fav. e març,Rafael,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Separação fotos protocolos,Renata,09/03/2026,Cancelado,Cheia de Charme,Baixa
09/03/2026,Página de vendas Afro,Renata,09/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Campanha afro,Renata,09/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Organição conteúdos CC segunda quinzena março,Renata,09/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Reunião com agência Dash I.A.,Michel,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Reunião de alinhamento Cris CC e HE,Renata,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Configurar e-mail contact@institutohomem.com,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Enviar pagamento Infobip para Arte Fórmulas,Marcelo,09/03/2026,Finalizado,Arte Fórmulas,Baixa
09/03/2026,Atualizar dashboard atendimento,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Evento mulheres,Renata,09/03/2026,Finalizado,2F Holding,Baixa
09/03/2026,Colocar selecionador de idioma na LP de Foz,Marcelo,09/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Subir a Campanha do Dylan de mechas,Rafael,09/03/2026,Finalizado,Cheia de Charme,Baixa
06/03/2026,Edição video reparação CC,Geovana,10/03/2026,Finalizado,Cheia de Charme,Baixa
09/03/2026,Apresentar o projeto CRM - Gestores,Michel,10/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Gravação com Gustavo Benedeti e Dr. Flávio,Michel,10/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Devolutiva Rodrigo Maioto - Marketing e vendas IH,Michel,10/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Inserir a conta de Faria Lima na MCC (Faturamento),Rafael,10/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Colocar video Dr. Flavio na LP de P. Prudente,Marcelo,10/03/2026,Finalizado,Dr. Flávio,Baixa
09/03/2026,Programação videos CC até 03 de abril,Cristiano,10/03/2026,Finalizado,Cheia de Charme,Baixa
10/03/2026,Impulsionar video Dr. Flavio,Marcelo,10/03/2026,Finalizado,Dr. Flávio,Baixa
10/03/2026,Reestruturar a campanha de foz na nova LP bilingue,Rafael,10/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Assinar contrato de renovação Londrina,Cristiano,10/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Programar Conteúdos Vídeos Influencer Victor Perfil IH CWB,Cristiano,10/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Capa protocolos,Vinicius,10/03/2026,Finalizado,Cheia de Charme,Baixa
02/03/2026,Atualização dos Vídeos do Foguete,Cristiano,11/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Reunião com Executivo TV Gazeta - Marcos Santana,Michel,11/03/2026,Finalizado,Instituto Homem,Baixa
09/03/2026,Projeto de Divulgação Faria Lima - Evento,Michel,11/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Projeto Exposição Faria Lima - IH (Vinicius),Vinicius,11/03/2026,Finalizado,Instituto Homem,Baixa
11/03/2026,Envio de Novos Spots Rádio 105FM Jundiai + Dumont FM,Cristiano,11/03/2026,Finalizado,Instituto Homem,Baixa
10/03/2026,Tabela CC sorocaba,Vinicius,11/03/2026,Finalizado,Cheia de Charme,Baixa
11/03/2026,Alterar Spot Jundiaí,Marcelo,11/03/2026,Finalizado,Instituto Homem,Baixa
11/03/2026,Aniversariantes Mês,Vinicius,11/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Análise de resultado Semanal - Marketing e Vendas,Michel,30/03/2026,Finalizado,Instituto Homem,Média
25/03/2026,Negociação patrocínio Alessandra Campos,Geovana,31/03/2026,Finalizado,Arte Fórmulas,Baixa
23/03/2026,Planejamento Arte Fórmulas,Vinicius,31/03/2026,Finalizado,Arte Fórmulas,Alta
23/03/2026,Planejamento Instituto Homem,Vinicius,31/03/2026,Finalizado,Instituto Homem,Alta
23/03/2026,Planejamento Bruna Ramalho,Vinicius,31/03/2026,Finalizado,Bruna Ramalho,Alta
23/03/2026,Planejamento Homem Express,Vinicius,31/03/2026,Finalizado,Homem Express,Alta
23/03/2026,Planejamento Dr. Flavio Machado,Vinicius,31/03/2026,Finalizado,Dr. Flávio,Alta
23/03/2026,Planejamento Cheia de Charme Sorocaba,Vinicius,31/03/2026,Finalizado,Cheia de Charme,Alta
23/03/2026,Planejamento Cheia de Charme Osasco,Vinicius,31/03/2026,Finalizado,Cheia de Charme,Alta
23/03/2026,Edição vídeos Youtube,Vinicius,31/03/2026,Finalizado,Dr. Flávio,Alta
30/03/2026,Adicionar Médicos no Grupo de Redes Sociais,Cristiano,31/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Correção Site Instituto Homem,Cristiano,31/03/2026,Finalizado,Instituto Homem,Alta
30/03/2026,Programar Conteúdos Abril - Instituto Homem,Cristiano,31/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Programar Conteúdos Abril - Dr. Flavio Machado,Cristiano,31/03/2026,Finalizado,Dr. Flávio,Baixa
30/03/2026,Programar Conteúdos Abril - Arte Fórmulas,Cristiano,31/03/2026,Finalizado,Arte Fórmulas,Baixa
30/03/2026,Programar Conteúdos Abril - Cheia de Charme Sorocaba,Cristiano,31/03/2026,Finalizado,Cheia de Charme,Baixa
30/03/2026,Programar Conteúdos Abril - Cheia de Charme Osasco,Cristiano,31/03/2026,Finalizado,Cheia de Charme,Baixa
30/03/2026,Programar Conteúdos Abril - Bruna Ramalho,Cristiano,31/03/2026,Finalizado,Bruna Ramalho,Baixa
30/03/2026,Programar YouTube Shorts - Dr. Flavio,Cristiano,31/03/2026,Finalizado,Dr. Flávio,Baixa
30/03/2026,Programar YouTube Shorts - Instituto Homem,Cristiano,31/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Programar Conteúdos Abril - Homem Express,Cristiano,31/03/2026,Finalizado,Homem Express,Baixa
30/03/2026,Programar Conteúdos TikTok - Dr. Flavio,Cristiano,31/03/2026,Finalizado,Dr. Flávio,Baixa
30/03/2026,Programar Conteúdos TikTok - Instituto Homem,Cristiano,31/03/2026,Finalizado,Dr. Flávio,Baixa
30/03/2026,Assinatura de Contratos - Rádios,Cristiano,31/03/2026,Finalizado,Instituto Homem,Baixa
30/03/2026,Novo contrato com Newton Coelho,Michel,31/03/2026,Em atraso,Instituto Homem,Média
30/03/2026,Nova Atualização do Site (Processo CFM),Marcelo,31/03/2026,Finalizado,Instituto Homem,Alta
30/03/2026,Gravação de Conteúdo para Projeto Redes Sociais,Michel,31/03/2026,Em Andamento,Instituto Homem,Média
30/03/2026,Edição do vídeo projeto Redes Sociais,Vinicius,31/03/2026,Finalizado,Instituto Homem,Alta
31/03/2026,Campanha Meta Ads - Produtos,Marcelo,31/03/2026,Finalizado,Arte Fórmulas,Média
31/03/2026,Subir vídeo Monica como Video View (3 dias),Marcelo,31/03/2026,Finalizado,Arte Fórmulas,Média
31/03/2026,levantar produtos para Ebook AF,Rafael,31/03/2026,Finalizado,Arte Fórmulas,Média
31/03/2026,Pesquisa interna HE google form (para Paulo),Renata,31/03/2026,Finalizado,2F Holding,Alta
31/03/2026,Duplicar LP Faria Lima para VSX,Marcelo,31/03/2026,Finalizado,Núcleo Slim,Baixa
31/03/2026,Análise de Campanhas - Google e Meta,Michel,31/03/2026,Finalizado,Arte Fórmulas,Baixa`;

function parseDate(dateStr) {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}T12:00:00Z`;
}

function mapStatus(status) {
    if (status === 'Finalizado') return 'Concluído';
    if (status === 'Em atraso') return 'Atrasado';
    return status; // Em Andamento, Cancelado
}

const rows = csvData.trim().split('\n').slice(1);
const companies = new Set();
const members = new Set();

rows.forEach(row => {
    // Basic CSV split (caution with quotes)
    const parts = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
    const empresa = (parts[5] || 'Nenhuma').replace(/"/g, '').trim();
    const responsavel = (parts[2] || 'Sem Responsável').replace(/"/g, '').trim();
    if (empresa) companies.add(empresa);
    if (responsavel) members.add(responsavel);
});

let sql = `-- MIGRATION SCRIPT FOR MARCH DATA\n\n`;

// 1. Ensure Companies
sql += `-- 1. Inserir Empresas do Mês de Março\n`;
companies.forEach(name => {
    sql += `INSERT INTO companies (name) SELECT '${name.replace(/'/g, "''")}' WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = '${name.replace(/'/g, "''")}');\n`;
});

// 2. Ensure Team Members
sql += `\n-- 2. Inserir Membros da Equipe do Mês de Março\n`;
members.forEach(name => {
    sql += `INSERT INTO team_members (name) SELECT '${name.replace(/'/g, "''")}' WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = '${name.replace(/'/g, "''")}');\n`;
});

// 3. Insert Tasks
sql += `\n-- 3. Inserir Tarefas de Março\n`;
rows.forEach(row => {
    const parts = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
    const title = (parts[1] || 'Sem Título').replace(/"/g, '').trim();
    const assignee = (parts[2] || 'Sem Responsável').replace(/"/g, '').trim();
    const due_date = parseDate(parts[3]);
    const status = mapStatus((parts[4] || '').replace(/"/g, '').trim());
    const empresa = (parts[5] || 'Nenhuma').replace(/"/g, '').trim();
    const priority = (parts[6] || 'Média').replace(/"/g, '').trim();

    sql += `INSERT INTO tasks (title, assignee, status, priority, due_date, company_id)
SELECT 
    '${title.replace(/'/g, "''")}', 
    '${assignee.replace(/'/g, "''")}', 
    '${status}', 
    '${priority}', 
    '${due_date}', 
    (SELECT id FROM companies WHERE name = '${empresa.replace(/'/g, "''")}' LIMIT 1);\n`;
});

fs.writeFileSync('migration_march.sql', sql);
console.log('SQL generated in migration_march.sql');
>>>>>>> d9227a2 (initial commit)
