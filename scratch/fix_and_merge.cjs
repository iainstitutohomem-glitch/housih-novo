const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndxdmpneWp1aXBma3FiZnJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkxOTM3NSwiZXhwIjoyMDkxNDk1Mzc1fQ.2EVjKOBXB1LQD1g2lQKETDxVfQb8RP4k7OorqY1k0dE';
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(VITE_SUPABASE_URL, SERVICE_ROLE_KEY);

function mapRoleAndSectors(func, unidade) {
    let role = 'Membro';
    let sectors = [];
    
    const f = func.toLowerCase();
    
    if (f.includes('gestor') || f.includes('supervisor')) {
        role = 'Líder';
    }
    
    if (f.includes('recepção')) sectors.push('Recepção');
    else if (f.includes('enferm') || f.includes('enfermeiro')) sectors.push('Enfermagem');
    else if (f.includes('médico')) sectors.push('Médicos');
    else if (f.includes('marketing') || f.includes('designer') || f.includes('growth')) sectors.push('Comunicação & Marketing');
    else if (f.includes('rh') || f.includes('recursos humanos')) sectors.push('RH');
    else if (f.includes('financeiro')) sectors.push('Financeiro');
    else if (f.includes('jurídico')) sectors.push('Jurídico');
    else if (f.includes('sistemas') || f.includes('ti')) sectors.push('TI');
    else if (f.includes('facilite') || f.includes('operações')) sectors.push('Operações & Projetos Internos');
    else if (f.includes('sdr')) sectors.push('Atendimento Comercial');
    else if (f.includes('assessor comercial') || f.includes('comercial')) sectors.push('Comercial');
    else if (f.includes('gestor') && unidade !== 'Corporativo') sectors.push('Gestor/Assessor');
    else if (f.includes('assessor') && unidade !== 'Corporativo') sectors.push('Gestor/Assessor');
    else if (unidade !== 'Corporativo' && (f.includes('administrativo') || f.includes('auxiliar administrativo'))) sectors.push('Administrativo');
    else sectors.push('Geral');
    
    return { role, sectors };
}

function cleanUnit(unit) {
    return unit.replace(/ - [A-Z]{2}$/, '').trim();
}

async function run() {
    const csvContent = fs.readFileSync('C:\\Users\\cleve\\.gemini\\antigravity\\brain\\d24ca233-7cee-42ff-abaa-d6adb94d31ca\\.system_generated\\steps\\2179\\content.md', 'utf8');
    const lines = csvContent.split('\n');
    let dataStarted = false;
    
    const userMap = new Map(); // email -> { name, role, units: Set, sectors: Set }
    
    for (const line of lines) {
        if (line.startsWith('Unidade ,Função ,Nome Completo')) {
            dataStarted = true;
            continue;
        }
        if (!dataStarted || !line.trim()) continue;
        
        const cols = line.split(',');
        if (cols.length >= 5) {
            const rawUnit = cols[0].trim();
            const unit = cleanUnit(rawUnit);
            const func = cols[1].trim();
            const name = cols[2].trim();
            const email = cols[3].trim().toLowerCase();
            
            if (email && name) {
                if (!userMap.has(email)) {
                    userMap.set(email, { name, role: 'Membro', units: new Set(), sectors: new Set() });
                }
                const entry = userMap.get(email);
                
                const { role, sectors } = mapRoleAndSectors(func, unit);
                
                if (role === 'Líder') entry.role = 'Líder'; // Upgrade to Líder if any role is Líder
                entry.units.add(unit);
                sectors.forEach(s => entry.sectors.add(s));
            }
        }
    }
    
    console.log(`Encontrados ${userMap.size} usuários únicos na planilha.`);
    
    // Fetch all members from DB
    const { data: dbMembers, error: fetchErr } = await supabase.from('team_members').select('id, email, units, sectors, role');
    if (fetchErr) {
        console.error('Fetch error:', fetchErr);
        process.exit(1);
    }
    
    const dbMap = new Map();
    for (const m of dbMembers) {
        if (m.email) dbMap.set(m.email.toLowerCase(), m);
    }
    
    let updated = 0;
    
    for (const [email, entry] of userMap.entries()) {
        const dbMember = dbMap.get(email);
        if (dbMember) {
            // Merge units and sectors
            const mergedUnits = new Set([...(dbMember.units || []), ...entry.units]);
            // Clean up existing db units that have '- SP'
            const finalUnits = Array.from(mergedUnits).map(cleanUnit);
            const uniqueFinalUnits = Array.from(new Set(finalUnits));
            
            let mergedSectors = new Set([...(dbMember.sectors || []), ...entry.sectors]);
            // Replace old 'Consultório' with 'Médicos' and 'Gerência' with 'Gestor/Assessor' in existing db sectors
            const finalSectors = Array.from(mergedSectors).map(s => {
                if (s === 'Consultório') return 'Médicos';
                if (s === 'Gerência') return 'Gestor/Assessor';
                return s;
            });
            const uniqueFinalSectors = Array.from(new Set(finalSectors));
            
            // If the user's role was Líder in CSV, upgrade them in DB
            const finalRole = (entry.role === 'Líder' || dbMember.role === 'Líder') ? 'Líder' : 'Membro';
            
            const { error: updErr } = await supabase.from('team_members').update({
                units: uniqueFinalUnits,
                sectors: uniqueFinalSectors,
                role: finalRole
            }).eq('id', dbMember.id);
            
            if (updErr) {
                console.error(`Erro atualizando ${email}:`, updErr);
            } else {
                updated++;
                if (updated % 10 === 0) console.log(`Atualizados ${updated} usuários...`);
            }
        }
    }
    
    console.log(`Concluído! ${updated} usuários corrigidos e mesclados.`);
    process.exit(0);
}

run();
