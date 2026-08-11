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
    else if (f.includes('sistemas') || f.match(/\bti\b/)) sectors.push('TI');
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
    console.log('Fetching all auth users...');
    const authUsers = new Map(); // email -> id
    let page = 1;
    let hasMore = true;
    while (hasMore) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) {
            console.error(error);
            break;
        }
        data.users.forEach(u => authUsers.set(u.email.toLowerCase(), u.id));
        if (data.users.length < 1000) hasMore = false;
        else page++;
    }
    
    console.log('Total auth users:', authUsers.size);

    console.log('Fetching all DB members...');
    const { data: dbMembers, error: dbErr } = await supabase.from('team_members').select('id, email, units, sectors, role');
    if (dbErr) {
        console.error(dbErr);
        return;
    }
    const dbMembersMap = new Map();
    dbMembers.forEach(m => {
        if (m.email) dbMembersMap.set(m.email.toLowerCase(), m);
    });

    console.log('Reading CSV...');
    const csvContent = fs.readFileSync('C:\\\\Users\\\\cleve\\\\.gemini\\\\antigravity\\\\brain\\\\d24ca233-7cee-42ff-abaa-d6adb94d31ca\\\\.system_generated\\\\steps\\\\2179\\\\content.md', 'utf8');
    const lines = csvContent.split('\n');
    let dataStarted = false;
    
    const userMap = new Map();
    
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
                
                if (role === 'Líder') entry.role = 'Líder';
                entry.units.add(unit);
                sectors.forEach(s => entry.sectors.add(s));
            }
        }
    }
    
    console.log(`Encontrados ${userMap.size} usuários únicos na planilha.`);
    
    let createdAuth = 0;
    let updatedDb = 0;

    for (const [email, entry] of userMap.entries()) {
        let authId = authUsers.get(email);
        
        if (!authId) {
            // Create in Auth
            const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
                email: email,
                password: 'IH@2026',
                email_confirm: true,
                user_metadata: { name: entry.name }
            });
            if (createErr) {
                console.error(`Failed to create auth for ${email}:`, createErr.message);
                continue;
            }
            authId = newUser.user.id;
            authUsers.set(email, authId);
            createdAuth++;
            
            // Wait 1 second to let trigger insert into team_members
            await new Promise(r => setTimeout(r, 1000));
        }

        const uniqueFinalUnits = Array.from(entry.units);
        const uniqueFinalSectors = Array.from(entry.sectors);
        
        const dbMember = dbMembersMap.get(email);

        const finalUnits = uniqueFinalUnits.map(cleanUnit);
        
        const finalSectors = uniqueFinalSectors.map(s => {
            if (s === 'Consultório') return 'Médicos';
            if (s === 'Gerência') return 'Gestor/Assessor';
            return s;
        });
        
        const finalRole = (entry.role === 'Líder' || dbMember?.role === 'Líder') ? 'Líder' : 'Membro';
        
        // Since trigger adds them, we always UPDATE
        const { error: updErr } = await supabase.from('team_members').update({
            units: Array.from(new Set(finalUnits)),
            sectors: Array.from(new Set(finalSectors)),
            role: finalRole,
            name: dbMember?.name || entry.name
        }).eq('id', authId);
        
        if (updErr) {
            console.error(`Failed to update ${email}:`, updErr.message);
        } else {
            updatedDb++;
            if (updatedDb % 10 === 0) console.log(`Atualizados ${updatedDb}`);
        }
    }
    
    console.log(`Resumo:`);
    console.log(`Novos Auth criados: ${createdAuth}`);
    console.log(`Atualizados no DB: ${updatedDb}`);
    process.exit(0);
}

run();
