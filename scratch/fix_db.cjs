const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndxdmpneWp1aXBma3FiZnJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkxOTM3NSwiZXhwIjoyMDkxNDk1Mzc1fQ.2EVjKOBXB1LQD1g2lQKETDxVfQb8RP4k7OorqY1k0dE';
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(VITE_SUPABASE_URL, SERVICE_ROLE_KEY);

async function fix() {
  console.log('Fetching members...');
  const { data: members, error } = await supabase.from('team_members').select('id, units, sectors');
  if (error) {
    console.error('Fetch error:', error);
    return;
  }
  
  console.log('Fetched', members.length, 'members');
  
  let updatedCount = 0;
  
  for (const member of members) {
    let changed = false;
    
    // Fix units
    let newUnits = (member.units || []).map(u => {
      let nu = u.replace(/ - [A-Z]{2}$/, '').trim(); // Remove ' - SP', ' - SC', etc.
      if (nu !== u) changed = true;
      return nu;
    });
    
    // Fix sectors
    let newSectors = (member.sectors || []).map(s => {
      if (s === 'Consultório') { changed = true; return 'Médicos'; }
      if (s === 'Gerência') { changed = true; return 'Gestor/Assessor'; }
      return s;
    });
    
    if (changed) {
      const { error: updErr } = await supabase.from('team_members').update({
        units: newUnits,
        sectors: newSectors
      }).eq('id', member.id);
      if (updErr) console.error('Error updating', member.id, updErr);
      updatedCount++;
      if (updatedCount % 10 === 0) console.log('Updated', updatedCount);
    }
  }
  
  console.log('Fixed', updatedCount, 'members total');
  process.exit(0);
}
fix();
