
const fs = require('fs');
const path = require('path');

// 1. Load environment variables manually from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let envContent = '';

try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error('Could not read .env.local');
    process.exit(1);
}

const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        envVars[key] = value;
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

async function createDemoTrip() {
    console.log('Creating Demo Trip via REST API...');

    const demoTrip = {
        slug: 'demo-trip-2025',
        trip_name: 'Demo Ski Trip 2025',
        owner_email: 'demo@example.com',
        is_active: true
    };

    // Check if it already exists
    const checkUrl = `${supabaseUrl}/rest/v1/trips?slug=eq.${demoTrip.slug}&select=id`;
    const checkRes = await fetch(checkUrl, {
        headers: {
            'apikey': supabaseServiceRoleKey,
            'Authorization': `Bearer ${supabaseServiceRoleKey}`
        }
    });

    if (!checkRes.ok) {
        console.error('Error checking existing trip:', await checkRes.text());
        process.exit(1);
    }

    const existing = await checkRes.json();
    if (existing.length > 0) {
        console.log(`Demo trip already exists with ID: ${existing[0].id}`);
        return existing[0].id;
    }

    // Create
    const createUrl = `${supabaseUrl}/rest/v1/trips`;
    const createRes = await fetch(createUrl, {
        method: 'POST',
        headers: {
            'apikey': supabaseServiceRoleKey,
            'Authorization': `Bearer ${supabaseServiceRoleKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(demoTrip)
    });

    if (!createRes.ok) {
        console.error('Error creating demo trip:', await createRes.text());
        process.exit(1);
    }

    const data = await createRes.json();
    const newTrip = data[0];

    console.log(`Successfully created Demo Trip!`);
    console.log(`Trip ID: ${newTrip.id}`);
    console.log(`Trip Name: ${newTrip.trip_name}`);

    return newTrip.id;
}

createDemoTrip();
