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
  // Test modifying update_overdue_tasks via raw SQL query if possible or inspect
  console.log("Checking update_overdue_tasks...");
  const { data: tasks } = await supabase.from('tasks').select('id, title, status, due_date, column_id, board_id').eq('status', 'Em Andamento');
  console.log("Tasks in Em Andamento:", tasks);
  process.exit(0);
}
main();
