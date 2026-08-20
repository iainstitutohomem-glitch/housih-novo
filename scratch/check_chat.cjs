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
  // 1. Create a dummy task with past due date and status 'Em Andamento'
  const { data: board } = await supabase.from('boards').select('id').limit(1).single();
  const { data: cols } = await supabase.from('board_columns').select('id, title').eq('board_id', board.id);
  const emAndamentoCol = cols.find(c => c.title === 'Em Andamento') || cols[0];

  console.log("Inserting test task with status 'Em Andamento' and past due_date...");
  const { data: newTask, error: insertErr } = await supabase.from('tasks').insert([{
    title: 'TEST_OVERDUE_TASK_EM_ANDAMENTO',
    status: 'Em Andamento',
    board_id: board.id,
    column_id: emAndamentoCol.id,
    due_date: '2026-08-01T12:00:00.000Z',
    unit: 'Corporativo',
    sector: 'Comercial'
  }]).select().single();

  if (insertErr) {
    console.error("Insert error:", insertErr);
    process.exit(1);
  }

  console.log("Created task:", newTask.id, "Status:", newTask.status, "Column:", newTask.column_id);

  // 2. Call update_overdue_tasks RPC
  console.log("Executing update_overdue_tasks RPC...");
  await supabase.rpc('update_overdue_tasks');

  // 3. Fetch task after RPC
  const { data: taskAfter } = await supabase.from('tasks').select('id, title, status, column_id').eq('id', newTask.id).single();
  console.log("Task AFTER update_overdue_tasks RPC:", taskAfter);

  // Clean up
  await supabase.from('tasks').delete().eq('id', newTask.id);

  process.exit(0);
}
main();
