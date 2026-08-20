const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = 'C:/Users/cleve/.gemini/antigravity/scratch/crm-system/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const envConfig = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    envConfig[key] = value.replace(/(^['"]|['"]$)/g, '').trim();
  }
});

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndxdmpneWp1aXBma3FiZnJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkxOTM3NSwiZXhwIjoyMDkxNDk1Mzc1fQ.2EVjKOBXB1LQD1g2lQKETDxVfQb8RP4k7OorqY1k0dE';
const supabase = createClient(envConfig.VITE_SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  const { data: tasks } = await supabase.from('tasks').select('id, title, status, board_id, column_id, unit, sector');
  const { data: cols } = await supabase.from('board_columns').select('*');
  const { data: boards } = await supabase.from('boards').select('*');

  console.log(`Checking ${tasks ? tasks.length : 0} tasks for repair...`);

  let fixedCount = 0;

  for (const t of tasks || []) {
    let needsFix = false;
    let newColumnId = t.column_id;
    let newBoardId = t.board_id;
    let newStatus = t.status;

    let col = cols.find(c => c.id === t.column_id);
    let board = boards.find(b => b.id === t.board_id);

    // If column_id is null or invalid/orphan, find matching column by board_id and status
    if (!col || col.board_id !== t.board_id) {
      needsFix = true;
      const bCols = cols.filter(c => c.board_id === t.board_id);
      let matchCol = bCols.find(c => c.title.toLowerCase().trim() === (t.status || '').toLowerCase().trim());
      if (!matchCol && bCols.length > 0) {
        matchCol = bCols[0];
      }
      if (matchCol) {
        newColumnId = matchCol.id;
        console.log(`Fixing column_id for "${t.title}": was "${t.column_id}" -> now "${newColumnId}" (${matchCol.title})`);
      }
    } else if (col.title !== t.status) {
      // Sync status to column title if status was outdated
      needsFix = true;
      newStatus = col.title;
      console.log(`Fixing status for "${t.title}": was "${t.status}" -> now "${newStatus}"`);
    }

    if (needsFix) {
      const { error } = await supabase.from('tasks').update({
        column_id: newColumnId,
        board_id: newBoardId,
        status: newStatus
      }).eq('id', t.id);

      if (error) {
        console.error(`Error repairing task "${t.title}":`, error);
      } else {
        fixedCount++;
      }
    }
  }

  console.log(`Successfully repaired ${fixedCount} tasks in Supabase!`);
  process.exit(0);
}
main();
