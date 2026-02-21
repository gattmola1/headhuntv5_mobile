import { getSupabaseClient } from '../_lib/supabase.js';
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

        const { data, error } = await supabaseAdmin
            .from('rsvps')
            .select('*, events(title, date)')
            .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ rsvps: data });
    }

    if (req.method === 'POST') {
        const { event_id, name, email, phone, sms_consent } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email, and phone are required.' });
        }
        if (!sms_consent) {
            return res.status(400).json({ error: 'SMS consent is required to RSVP.' });
        }

        // Public insert allowed by RLS policy
        const supabase = getSupabaseClient(req);
        const { error } = await supabase
            .from('rsvps')
            .insert([{ event_id, name, email, phone, sms_consent }]);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json({ message: 'RSVP confirmed!' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
