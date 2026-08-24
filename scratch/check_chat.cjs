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
  const { data: squadBoard } = await supabase.from('boards').select('*').eq('name', 'Squad de Criação').single();
  const { data: cols } = await supabase.from('board_columns').select('*').eq('board_id', squadBoard.id).order('order_index');
  const { data: tasks } = await supabase.from('tasks').select('*').eq('board_id', squadBoard.id);

  console.log(`Squad de Criação has ${cols.length} columns and ${tasks.length} tasks.`);

  const normalizeText = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  for (const col of cols) {
    const tasksInCol = tasks.filter(t => {
      if (t.column_id && t.column_id === col.id) return true;
      if (t.status && col.title && normalizeText(t.status) === normalizeText(col.title)) return true;
      return false;
    });
    console.log(`Column "${col.title}" (${col.id}): ${tasksInCol.length} tasks`);
    for (const t of tasksInCol) {
      console.log(`   - "${t.title}" (status: ${t.status}, col_id: ${t.column_id})`);
    }
  }

  process.exit(0);
}
main();
