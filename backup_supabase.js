import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('C:/Users/cleve/.gemini/antigravity/scratch/crm-system/.env.local');
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

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tables = [
  'companies',
  'tasks',
  'team_members',
  'boards',
  'board_columns',
  'notifications',
  'ai_chat_history'
];

const backupDir = path.resolve('C:/Users/cleve/.gemini/antigravity/scratch/supabase_backup_20260723');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTableKeyset(table, pageSize = 100) {
  let allData = [];
  let lastCreatedAt = '1970-01-01T00:00:00.000000+00:00';
  let hasMore = true;

  console.log(`Fetching table ${table} with keyset pagination (pageSize: ${pageSize})...`);
  while (hasMore) {
    console.log(`  Querying ${table} created_at > ${lastCreatedAt} limit ${pageSize}...`);
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .gt('created_at', lastCreatedAt)
      .order('created_at', { ascending: true })
      .limit(pageSize);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allData = allData.concat(data);
      lastCreatedAt = data[data.length - 1].created_at;
      if (data.length < pageSize) {
        hasMore = false;
      }
    }
    await sleep(50); // Be gentle to Supabase
  }
  return allData;
}

async function fetchTasksSmart() {
  let allData = [];
  let lastCreatedAt = '1970-01-01T00:00:00.000000+00:00';
  let hasMore = true;
  const pageSize = 20;

  console.log(`Starting smart task backup...`);
  while (hasMore) {
    console.log(`  Querying tasks created_at > ${lastCreatedAt} limit ${pageSize}...`);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .gt('created_at', lastCreatedAt)
        .order('created_at', { ascending: true })
        .limit(pageSize);

      if (error) throw error;

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allData = allData.concat(data);
        lastCreatedAt = data[data.length - 1].created_at;
        if (data.length < pageSize) {
          hasMore = false;
        }
      }
      await sleep(50); // Be gentle to Supabase
    } catch (err) {
      console.log(`  Batch failed: ${err.message}. Retrying this batch row-by-row...`);
      let tempCreatedAt = lastCreatedAt;
      let pageCount = 0;
      
      while (pageCount < pageSize) {
        await sleep(100); // Sleep longer on fallback mode
        try {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .gt('created_at', tempCreatedAt)
            .order('created_at', { ascending: true })
            .limit(1);

          if (error) throw error;

          if (!data || data.length === 0) {
            hasMore = false;
            break;
          }

          allData.push(data[0]);
          tempCreatedAt = data[0].created_at;
          pageCount++;
        } catch (singleErr) {
          console.log(`  Single task query failed: ${singleErr.message}. Fetching metadata-only for this task...`);
          await sleep(200);
          
          const { data: lightData, error: lightErr } = await supabase
            .from('tasks')
            .select('id, title, status, priority, due_date, company_id, assignee, created_at')
            .gt('created_at', tempCreatedAt)
            .order('created_at', { ascending: true })
            .limit(1);

          if (lightErr) {
            console.error(`  CRITICAL: Could not even fetch metadata for task after ${tempCreatedAt}:`, lightErr.message);
            const date = new Date(tempCreatedAt);
            date.setMilliseconds(date.getMilliseconds() + 1);
            tempCreatedAt = date.toISOString();
            pageCount++;
          } else if (lightData && lightData.length > 0) {
            const row = lightData[0];
            row.description = '[Payload too large to backup]';
            row.observations = '';
            row.attachments = [];
            row.checklist = [];
            allData.push(row);
            tempCreatedAt = row.created_at;
            pageCount++;
            console.log(`  Recovered task metadata for: ${row.title} (ID: ${row.id})`);
          } else {
            hasMore = false;
            break;
          }
        }
      }
      lastCreatedAt = tempCreatedAt;
    }
  }
  return allData;
}

async function runBackup() {
  console.log('Starting Supabase data backup (with smart pagination)...');
  for (const table of tables) {
    try {
      console.log(`Fetching table: ${table}...`);
      let data;
      if (table === 'tasks') {
        data = await fetchTasksSmart();
      } else if (table === 'notifications') {
        data = await fetchTableKeyset(table, 100);
      } else {
        const { data: directData, error } = await supabase.from(table).select('*');
        if (error) throw error;
        data = directData;
      }

      const file = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      console.log(`Saved ${data.length} rows to ${table}.json`);
      
      // Clean up error file if it exists from a previous run
      const errorFile = path.join(backupDir, `${table}_error.json`);
      if (fs.existsSync(errorFile)) {
        fs.unlinkSync(errorFile);
      }
    } catch (e) {
      console.error(`FAILED to backup table ${table}:`, e.message);
      fs.writeFileSync(
        path.join(backupDir, `${table}_error.json`),
        JSON.stringify({ error: e.message }, null, 2)
      );
    }
    await sleep(200); // Be gentle between tables
  }
  console.log('Backup process finished. Files saved in:', backupDir);
}

runBackup();
