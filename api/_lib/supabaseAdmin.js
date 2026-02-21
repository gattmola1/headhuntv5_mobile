
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey || supabaseServiceKey.includes('INSERT_YOUR')) {
    console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is missing or invalid. Admin operations will fail.');
}

// Admin client with Service Role Key (Bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || 'placeholder', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
