import { getSupabaseClient } from '../_lib/supabase.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {

    if (req.method === 'GET') {
        // Admin only for listing user queries
        if (!await checkAdmin(req)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Use Admin client for read (Private Read)
        try {
            const { data, error } = await supabaseAdmin
                .from('user_queries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            res.json({ queries: data });
        } catch (error) {
            console.error('Error fetching user queries:', error);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        // Public submission allowed by policy
        try {
            const queries = Array.isArray(req.body) ? req.body : [req.body];

            // Basic validation
            if (queries.length === 0) {
                return res.status(400).json({ error: "Empty payload" });
            }

            const validQueries = queries.filter(q => q.query_text);
            if (validQueries.length === 0) {
                return res.status(400).json({ error: "No valid queries provided" });
            }

            // Use standard client for insert (Public Insert)
            const supabase = getSupabaseClient(req);
            const { data, error } = await supabase
                .from('user_queries')
                .insert(validQueries);

            if (error) throw error;
            res.status(201).json({ message: "Queries logged" });
        } catch (error) {
            console.error('Error logging user query:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
