import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials missing in .env.local (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Authentication will not work.');
}

// gracefully handle missing credentials to prevent app crash
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase credentials missing. Check console.' } })
        },
        from: () => ({
            select: () => Promise.resolve({ error: { message: 'Supabase credentials missing.' }, data: [] }),
            insert: () => Promise.resolve({ error: { message: 'Supabase credentials missing.' }, data: [] }),
            update: () => Promise.resolve({ error: { message: 'Supabase credentials missing.' }, data: [] }),
            delete: () => Promise.resolve({ error: { message: 'Supabase credentials missing.' }, data: [] }),
        })
    };
