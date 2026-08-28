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
  const { data: tasks, error: tErr } = await supabase.from('tasks').select('*');
  const { data: members } = await supabase.from('team_members').select('*');

  console.log(`TOTAL TASKS IN DB: ${tasks ? tasks.length : 0}`);
  if (tErr) console.error("Error fetching tasks:", tErr);

  if (tasks && tasks.length > 0) {
    const units = new Set(tasks.map(t => t.unit));
    console.log("Distinct task units in DB:", Array.from(units));
    console.log("Sample tasks:", tasks.slice(0, 5).map(t => ({ id: t.id, title: t.title, unit: t.unit, board_id: t.board_id })));
  }

  process.exit(0);
}
main();
