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
  const { data: board } = await supabase.from('boards').select('*').eq('id', '12d35a8b-3b34-4670-8291-61652e2998d6').single();
  console.log('Board:', board);

  const { data: column } = await supabase.from('board_columns').select('*').eq('id', '5186a5ca-633f-4da0-8dac-3807f186cbef').single();
  console.log('Column:', column);

  const { data: allColumns } = await supabase.from('board_columns').select('*').eq('board_id', '12d35a8b-3b34-4670-8291-61652e2998d6');
  console.log('All columns for board:', allColumns);

  process.exit(0);
}
main();
