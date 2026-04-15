<<<<<<< HEAD
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://navwqvjgyjuipfkqbfrz.supabase.co',
    'sb_publishable_q96SjdUYwWa5ocpdHBcTng_XZP7thWc'
);

async function testInsert() {
    const task = {
        title: 'Test Task',
        status: 'Não Iniciado',
        priority: 'Média',
        due_date: new Date().toISOString(),
        observations: 'test',
        checklist: []
    };

    console.log("Attempting insert...");
    const { data, error } = await supabase.from('tasks').insert([task]).select();

    if (error) {
        console.error("ERROR:", error);
    } else {
        console.log("SUCCESS:", data);
    }
}

testInsert();
=======
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://navwqvjgyjuipfkqbfrz.supabase.co',
    'sb_publishable_q96SjdUYwWa5ocpdHBcTng_XZP7thWc'
);

async function testInsert() {
    const task = {
        title: 'Test Task',
        status: 'Não Iniciado',
        priority: 'Média',
        due_date: new Date().toISOString(),
        observations: 'test',
        checklist: []
    };

    console.log("Attempting insert...");
    const { data, error } = await supabase.from('tasks').insert([task]).select();

    if (error) {
        console.error("ERROR:", error);
    } else {
        console.log("SUCCESS:", data);
    }
}

testInsert();
>>>>>>> d9227a2 (initial commit)
