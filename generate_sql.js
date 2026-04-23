const fs = require('fs');

const mapping = {
    companies: {
        "Instituto Homem": "7632b410-ded6-47a4-81a0-288e6a8d5095",
        "Cheia de Charme": "b9ffe7fe-8995-42ac-946e-91d366a03aca",
        "Núcleo Slim": "2c4cbc12-0e9a-4052-8123-831b5ae068b0",
        "Arte Fórmulas": "b3b0507f-43a9-4308-a49b-a9e58c57eb43",
        "Homem Express": "31681add-87ce-4532-b635-ff3e7d00fbee",
        "2F Holding": "00132294-9e54-49db-9bbe-87760ccee480",
        "Dr. Flávio": "cfcb5687-e7ac-4d1f-87a6-1d6d25408265",
        "Bruna Ramalho": "c7f90ed2-2d3b-45f6-90bd-8a28b23f6e58",
        "IH People": "837fd77f-91ba-4e76-87e6-9979353c2ba5"
    },
    columns: {
        "Concluído": "e1eae891-336d-45fd-b309-4b97ddb77353",
        "Atrasado": "5186a5ca-633f-4da0-8dac-3807f186cbef",
        "Cancelado": "87e7a2b6-6dac-4230-af0b-62706d632d10",
        "Em Andamento": "c2dec47a-6a4b-4e0a-9447-633dafcddc6b",
        "Não Iniciado": "73398b80-534b-417c-ada1-4c604d189ac8",
        "Não iniciado": "73398b80-534b-417c-ada1-4c604d189ac8",
        "Planejada": "73398b80-534b-417c-ada1-4c604d189ac8",
        "Não Iniciada": "73398b80-534b-417c-ada1-4c604d189ac8"
    }
};

const geralBoardId = "12d35a8b-3b34-4670-8291-61652e2998d6";

function formatDate(d) {
    if (!d || d.trim() === "") return null;
    const parts = d.split('/');
    if (parts.length < 3) return null;
    return parts[2] + '-' + parts[1] + '-' + parts[0] + 'T12:00:00Z';
}

const rawContent = fs.readFileSync('tasks_abril.txt', 'utf8');
const lines = rawContent.trim().split('\n');

const sqlRows = lines.map((line, index) => {
    const parts = line.split('\t');
    if (parts.length < 7) return null;

    const createdAt = parts[0];
    const title = parts[1].trim();
    const assignee = parts[2].trim();
    const dueDateStr = parts[3];
    const status = parts[4].trim();
    const company = parts[5].trim();
    const priority = parts[6].trim();

    const companyId = mapping.companies[company] || null;
    const columnId = mapping.columns[status] || mapping.columns["Não Iniciado"];
    
    const cleanTitle = title.replace(/'/g, "''");
    const assigneeArr = JSON.stringify([assignee]);
    const createdAtIso = formatDate(createdAt);
    const dueDateIso = formatDate(dueDateStr);

    const createdSql = createdAtIso ? "'" + createdAtIso + "'" : "NULL";
    const dueSql = dueDateIso ? "'" + dueDateIso + "'" : "NULL";
    const companySql = companyId ? "'" + companyId + "'" : "NULL";

    return "('" + cleanTitle + "', '" + assigneeArr + "', " + dueSql + ", '" + status + "', " + companySql + ", '" + priority + "', '" + geralBoardId + "', '" + columnId + "', " + createdSql + ", " + (index * 10) + ")";
}).filter(r => r !== null);

const finalSql = "INSERT INTO tasks (title, assignee, due_date, status, company_id, priority, board_id, column_id, created_at, order_index) VALUES \n" + sqlRows.join(",\n") + ";";

fs.writeFileSync('migration_import_abril.sql', finalSql);
console.log("SUCESSO: migration_import_abril.sql gerado com " + sqlRows.length + " tarefas.");
