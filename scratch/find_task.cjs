const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve('.env.local');
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
  const { data: tasks, error } = await supabase.from('tasks').select('*');
  console.log('Error:', error);
  console.log('Total tasks count:', tasks ? tasks.length : 0);
  
  if (tasks) {
    const matched = tasks.filter(t => 
      t.title?.toLowerCase().includes('housih') || 
      t.title?.toLowerCase().includes('lança') || 
      t.title?.toLowerCase().includes('lanca')
    );
    console.log('Matched tasks count:', matched.length);
    console.log(JSON.stringify(matched, null, 2));
    
    // Print all task titles to see what tasks exist in DB
    console.log('ALL TASK TITLES AND UNITS:');
    tasks.forEach(t => console.log(`- [${t.unit || 'NO UNIT'}] [${t.sector || 'NO SECTOR'}] ${t.title}`));
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
