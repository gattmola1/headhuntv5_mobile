
import { getSupabaseClient } from '../_lib/supabase.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    const supabase = getSupabaseClient(req);

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('postings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ jobs: data });
    }

    if (req.method === 'POST') {
        if (!await checkAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

        const { title, company, location, salary, description } = req.body;

        // Use the client which might be authenticated or default to anon.
        // However, since 'postings' insert is restricted to admin via RLS (no public insert),
        // we need to be sure we are using a client that can write.
        // If checkAdmin passed because of PASSWORD, 'supabase' client is still anon.
        // If checkAdmin passed because of JWT, 'supabase' client has that JWT.

        // If we are relying on password auth, we MUST use the Service Role Key client for the insert
        // OR rely on the policy allowing the user (if JWT). 
        // Given existing patterns, let's stick to the forwarded client if possible, 
        // BUT if it's password auth, that client is still anon. 
        // So we really should use supabaseAdmin for the write if we want to support password auth properly.

        // Let's import supabaseAdmin for the write operation to be safe and consistent with password auth.
        const { supabaseAdmin } = await import('../_lib/supabaseAdmin.js');

        const { data, error } = await supabaseAdmin
            .from('postings')
            .insert([{ title, company, location, salary: salary || null, description }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data[0]);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
