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
  const { data: members } = await supabase.from('team_members').select('units');
  const { data: tasks } = await supabase.from('tasks').select('unit');

  const allUnits = new Set();
  (members || []).forEach(m => {
    if (Array.isArray(m.units)) m.units.forEach(u => u && allUnits.add(u.trim()));
    else if (m.units) allUnits.add(m.units.trim());
  });

  (tasks || []).forEach(t => {
    if (t.unit) allUnits.add(t.unit.trim());
  });

  console.log("ALL DISTINCT UNIDADES IN DB:", Array.from(allUnits).sort());
  process.exit(0);
}
main();
