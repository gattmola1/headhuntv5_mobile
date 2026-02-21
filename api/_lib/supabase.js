
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
console.log('supabase.js initialized');
/**
 * Creates a Supabase client ensuring RLS policies are respected.
 * If an Authorization header is present, it injects the JWT so the request runs as that user.
 * @param {Object} req - The request object (optional)
 * @returns {Object} Supabase client instance
 */
export const getSupabaseClient = (req) => {
    // If we have an Authorization header with a Bearer token, we use it.
    // This allows RLS policies for authenticated users to work.
    const headers = {};
    if (req?.headers?.authorization) {
        headers['Authorization'] = req.headers.authorization;
    }

    const client = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers,
        },
    });
    return client;
};

// Default export for backward compatibility or simple scripts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
