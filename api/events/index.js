
import { getSupabaseClient } from '../_lib/supabase.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    const supabase = getSupabaseClient(req);

    if (req.method === 'GET') {
        try {
            let query = supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            // Optional filtering
            if (req.query.category) {
                query = query.eq('category', req.query.category);
            }
            if (req.query.featured === 'true') {
                query = query.eq('is_featured', true);
            }

            const { data, error } = await query;

            if (error) throw error;
            res.json({ events: data });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            // Admin only
            if (!await checkAdmin(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const {
                title,
                date,
                time_string,
                location,
                type,
                category,
                description,
                image_url,
                attendees_count,
                is_featured,
                color
            } = req.body;

            // Use Admin client for private write
            const { supabaseAdmin } = await import('../_lib/supabaseAdmin.js');
            const { data, error } = await supabaseAdmin
                .from('events')
                .insert([{
                    title,
                    date,
                    time_string,
                    location,
                    type,
                    category,
                    description,
                    image_url,
                    attendees_count,
                    is_featured,
                    color
                }])
                .select();

            if (error) throw error;
            res.status(201).json({ event: data[0] });
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
