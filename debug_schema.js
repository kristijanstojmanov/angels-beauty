
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function inspectTable() {
    console.log('Inspecting appointments table...');

    // We can't easily get strict schema types via JS client without an item, 
    // but we can try to insert a dummy item and see the error, OR just check if the column exists by selecting.

    // Let's try to select 1 row to see keys if any exist.
    const { data, error } = await supabase.from('appointments').select('*').limit(1);

    if (error) {
        console.error('Error selecting:', error.message);
    } else if (data.length > 0) {
        console.log('Existing row keys:', Object.keys(data[0]));
    } else {
        console.log('Table exists but is empty. Cannot infer columns from data.');

        // Let's try to insert a bad record to trigger a "column does not exist" or "type mismatch" error which might reveal schema.
        console.log('Attempting probe insert...');
        const { error: insertError } = await supabase.from('appointments').insert([{
            service_id: '123e4567-e89b-12d3-a456-426614174000', // valid UUID format
            customer_name: 'Probe',
            // Missing others intentionally to see what it complains about first
        }]);

        if (insertError) {
            console.log('Probe Insert Error:', insertError.message);
            // If it says "column service_id does not exist", we know.
            // If it says "null value in column appointment_date violates not-null constraint", we know service_id is fine.
        }
    }
}

inspectTable();
