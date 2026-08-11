const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const env = fs.readFileSync('.env.local', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();

// Pega a Service Role Key do create_auth_users.js anterior (pra ter permissão de Admin Auth)
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndxdmpneWp1aXBma3FiZnJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkxOTM3NSwiZXhwIjoyMDkxNDk1Mzc1fQ.2EVjKOBXB1LQD1g2lQKETDxVfQb8RP4k7OorqY1k0dE';

const supabase = createClient(VITE_SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const DEFAULT_PASSWORD = 'IH@2026';

function mapRoleAndSectors(func, unidade) {
    let role = 'Membro';
    let sectors = [];
    
    const f = func.toLowerCase();
    
    // Identificar Líderes
    if (f.includes('gestor') || f.includes('supervisor')) {
        role = 'Líder';
    }
    
    // Mapear para Setores
    if (f.includes('recepção')) sectors.push('Recepção');
    else if (f.includes('enferm') || f.includes('enfermeiro')) sectors.push('Enfermagem');
    else if (f.includes('médico')) sectors.push('Consultório');
    else if (f.includes('marketing') || f.includes('designer') || f.includes('growth')) sectors.push('Comunicação & Marketing');
    else if (f.includes('rh') || f.includes('recursos humanos')) sectors.push('RH');
    else if (f.includes('financeiro')) sectors.push('Financeiro');
    else if (f.includes('jurídico')) sectors.push('Jurídico');
    else if (f.includes('sistemas') || f.includes('ti')) sectors.push('TI');
    else if (f.includes('facilite') || f.includes('operações')) sectors.push('Operações & Projetos Internos');
    else if (f.includes('sdr')) sectors.push('Atendimento Comercial');
    else if (f.includes('assessor comercial') || f.includes('comercial')) sectors.push('Comercial');
    else if (f.includes('gestor') && unidade !== 'Corporativo') sectors.push('Gerência');
    else sectors.push('Geral');
    
    return { role, sectors };
}

function parseDate(dateStr) {
    if (!dateStr || !dateStr.trim()) return null;
    // CSV Date format is M/D/YYYY
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
        const month = parts[0].padStart(2, '0');
        const day = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return null;
}

async function run() {
    const csvContent = fs.readFileSync('C:\\Users\\cleve\\.gemini\\antigravity\\brain\\d24ca233-7cee-42ff-abaa-d6adb94d31ca\\.system_generated\\steps\\2179\\content.md', 'utf8');
    
    const lines = csvContent.split('\n');
    let dataStarted = false;
    
    const usersToProcess = [];
    
    for (const line of lines) {
        if (line.startsWith('Unidade ,Função ,Nome Completo')) {
            dataStarted = true;
            continue;
        }
        if (!dataStarted || !line.trim()) continue;
        
        const cols = line.split(',');
        if (cols.length >= 5) {
            const unit = cols[0].trim();
            const func = cols[1].trim();
            const name = cols[2].trim();
            const email = cols[3].trim();
            const dobStr = cols[4].trim();
            
            if (email && name) {
                usersToProcess.push({ unit, func, name, email, dobStr });
            }
        }
    }
    
    console.log(`Encontrados ${usersToProcess.length} usuários para importar...`);
    
    let created = 0;
    const { data: listData } = await supabase.auth.admin.listUsers();
    const globalUserList = listData.users;
    let authExists = 0;
    let dbExists = 0;
    let errors = 0;
    
    for (const user of usersToProcess) {
        const emailLower = user.email.toLowerCase();
        
        // 1. Create in Auth
        const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
            email: emailLower,
            password: DEFAULT_PASSWORD,
            email_confirm: true,
            user_metadata: { name: user.name }
        });
        
        let userId = null;
        if (authErr) {
            if (authErr.message.includes('already exists') || authErr.message.includes('already been registered')) {
                authExists++;
                // Get user id
                const existing = globalUserList.find(u => u.email === emailLower);
                if (existing) userId = existing.id;
            } else {
                console.error(`Erro Auth [${user.email}]:`, authErr.message);
                errors++;
                continue;
            }
        } else {
            userId = authUser.user.id;
            created++;
        }
        
        if (!userId) continue;
        
        // 2. Map fields
        const { role, sectors } = mapRoleAndSectors(user.func, user.unit);
        const birth_date = parseDate(user.dobStr);
        
        // 3. Upsert in team_members
        const { error: dbErr } = await supabase.from('team_members').upsert({
            id: userId,
            name: user.name,
            email: emailLower,
            role: role,
            sectors: sectors,
            units: [user.unit],
            birth_date: birth_date,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
        }, { onConflict: 'id' });
        
        if (dbErr) {
            console.error(`Erro DB [${user.email}]:`, dbErr.message);
            errors++;
        } else {
            console.log(`✅ [${user.name}] -> Unidade: ${user.unit}, Função: ${user.func}, Role: ${role}, Sectors: ${sectors.join(',')}`);
        }
    }
    
    console.log('\n--- Resumo ---');
    console.log(`Novos criados no Auth: ${created}`);
    console.log(`Já existiam no Auth (Foram atualizados no DB): ${authExists}`);
    console.log(`Erros: ${errors}`);
}

run();
