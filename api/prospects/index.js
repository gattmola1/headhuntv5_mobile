
import { getSupabaseClient } from '../_lib/supabase.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const isAdmin = await checkAdmin(req);
        console.log(`[API] GET /api/prospects - Admin Authenticated: ${isAdmin}`);

        if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

        // Use Admin client for SELECT as it's restricted
        const { data, error } = await supabaseAdmin
            .from('prospects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[API] Supabase Error (prospects):', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`[API] Success - Found ${data?.length || 0} prospects`);
        return res.status(200).json({ prospects: data });
    }

    if (req.method === 'POST') {
        // Public insert allowed by RLS policy "Allow public insert to prospects"
        // So we can use standard client (anon)
        const supabase = getSupabaseClient(req);
        const { data, error } = await supabase
            .from('prospects')
            .insert([req.body]);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: "Prospect created" });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
