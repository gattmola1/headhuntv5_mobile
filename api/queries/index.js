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
            const { query_text, intent, matched } = req.body;

            // Basic validation
            if (!query_text) {
                return res.status(400).json({ error: "Missing query_text" });
            }

            // Use standard client for insert (Public Insert)
            const supabase = getSupabaseClient(req);
            const { data, error } = await supabase
                .from('user_queries')
                .insert([{ query_text, intent, matched }]);

            if (error) throw error;
            res.status(201).json({ message: "Query logged" });
        } catch (error) {
            console.error('Error logging user query:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
