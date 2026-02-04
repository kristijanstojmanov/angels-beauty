
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// KEY CHANGE: Use the SERVICE_ROLE_KEY to bypass security/auth checks
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase credentials (SQL/Service Role) in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const fixLogin = async () => {
    const email = 'admin@angelsbeauty.com';
    const password = '1234554321';

    console.log(`Checking user: ${email}...`);

    // 1. Get User ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.log('User not found. Creating new verified user...');
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true // This auto-confirms the email!
        });
        if (error) console.error('Error creating user:', error);
        else console.log('User created and verified!');
    } else {
        console.log('User found. Updating verification status...');
        const { data, error } = await supabase.auth.admin.updateUserById(
            user.id,
            { email_confirm: true, password: password }
        );
        if (error) console.error('Error updating user:', error);
        else console.log('User email verified successfully! Password reset to ensure it works.');
    }
};

fixLogin();
