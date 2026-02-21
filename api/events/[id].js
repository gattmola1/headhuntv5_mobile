
import { getSupabaseClient } from '../../_lib/supabase.js';
import { supabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { checkAdmin } from '../../_lib/auth.js';

export default async function handler(req, res) {
    const supabase = getSupabaseClient(req);
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return res.status(404).json({ error: 'Event not found' });

            res.json({ event: data });
        } catch (error) {
            console.error('Error fetching event:', error);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            // Admin only
            if (!await checkAdmin(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { error } = await supabaseAdmin
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            res.status(204).end();
        } catch (error) {
            console.error('Error deleting event:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
