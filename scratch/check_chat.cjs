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
  const { data: boards } = await supabase.from('boards').select('*');
  console.log('BOARDS:');
  const comMktParent = boards.find(b => b.name === 'Comunicação & Marketing' && !b.parent_board_id);
  console.log('Comunicação & Marketing parent board:', comMktParent);

  if (comMktParent) {
    const subBoards = boards.filter(b => b.parent_board_id === comMktParent.id);
    console.log('Subboards of Comunicação & Marketing:', subBoards);
    
    // Find Geral or first subboard of Comunicação & Marketing
    const targetBoard = subBoards.find(b => b.name === 'Geral') || subBoards[0] || comMktParent;
    console.log('Target board:', targetBoard);

    const { data: cols } = await supabase.from('board_columns').select('*').eq('board_id', targetBoard.id);
    console.log('Target board columns:', cols);

    const atrasadoCol = cols?.find(c => c.title === 'Atrasado') || cols?.[0];
    
    // Update task 0f9d4a60-c9b4-40ba-ab6e-4d87362f8ddb
    const { error: upErr } = await supabase.from('tasks').update({
      board_id: targetBoard.id,
      column_id: atrasadoCol?.id,
      unit: 'Corporativo',
      sector: 'Comunicação & Marketing'
    }).eq('id', '0f9d4a60-c9b4-40ba-ab6e-4d87362f8ddb');

    console.log('Task update result error:', upErr);
  }

  process.exit(0);
}
main();
