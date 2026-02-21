
import { supabaseAdmin } from '../../_lib/supabaseAdmin.js';
import { checkAdmin } from '../../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!await checkAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

    const { path } = req.query;

    const { data, error } = await supabaseAdmin.storage
        .from('resumes')
        .createSignedUrl(path, 60);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ url: data.signedUrl });
}
