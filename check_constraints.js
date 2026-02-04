
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const checkConstraints = async () => {
    console.log("Logging in as admin...");
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@angelsbeauty.com',
        password: '1234554321'
    });
    if (loginError) {
        console.error("Login failed:", loginError.message);
        return;
    }

    console.log("Checking for Foreign Key constraints...");

    // We can't query information_schema directly with supabase-js easily unless we have a helper or RPC.
    // Instead, we'll try to insert a Service and an Appointment linked to it, then try to delete the service.

    // 1. Create Service
    const { data: service, error: sError } = await supabase.from('services').insert({
        title: 'Constraint Test Service',
        price: '10',
        description: 'Testing FK',
        image_url: 'http://test'
    }).select().single();

    if (sError) {
        console.error("Failed to create service:", sError.message);
        return;
    }
    console.log("Created Service:", service.id);

    // 2. Create Appointment linked to it
    // We need to know the appointment schema.
    const { data: appt, error: aError } = await supabase.from('appointments').insert({
        service_id: service.id,
        service_name: 'Constraint Test Service',
        service_price: '10',
        customer_name: 'Test User',
        customer_email: 'test@test.com',
        appointment_date: '2026-01-01',
        status: 'pending'
    }).select().single();

    if (aError) {
        console.log("Could not create appointment (maybe no foreign key?):", aError.message);
        // If we can't create an appointment, we can't test the blocking.
    } else {
        console.log("Created Appointment:", appt.id);

        // 3. Try to Delete Service
        console.log("Attempting to delete Service (should fail if FK exists without cascade)...");
        const { error: dError } = await supabase.from('services').delete().eq('id', service.id);

        if (dError) {
            console.error("❌ Delete Blocked:", dError.message);
            console.log("👉 This confirms that Foreign Keys are blocking deletion of used services.");
        } else {
            console.log("✅ Delete Succeeded. No FK blocking (or cascade is on).");
            // Cleanup appointment
            await supabase.from('appointments').delete().eq('id', appt.id);
        }
    }

    // Cleanup if delete failed
    if (appt) await supabase.from('appointments').delete().eq('id', appt.id);
    await supabase.from('services').delete().eq('id', service.id);
};

checkConstraints();
