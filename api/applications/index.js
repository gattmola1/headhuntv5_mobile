
import { supabaseAdmin } from '../_lib/supabaseAdmin.js';
import { checkAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const isAdmin = await checkAdmin(req);
    console.log(`[API] GET /api/applications - Admin Authenticated: ${isAdmin}`);

    if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

    // Use admin client because RLS policy is Private Read
    const { data, error } = await supabaseAdmin
        .from('applications')
        .select(`
        *,
        postings (title)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[API] Supabase Error (applications):', error);
        return res.status(500).json({ error: error.message });
    }

    console.log(`[API] Success - Found ${data?.length || 0} applications`);

    const formatted = data.map(app => ({
        ...app,
        job_title: app.postings ? app.postings.title : 'Unknown Job'
    }));

    return res.status(200).json({ applications: formatted });
}
