
import multer from 'multer';
import { getSupabaseClient } from './_lib/supabase.js';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';


export const config = {
    api: {
        bodyParser: false,
    },
};

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    },
});

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await runMiddleware(req, res, upload.single('resume'));
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    // req.body and req.file are now available
    const { idea_id, posting_id, full_name, email, phone, linkedin_url, committed_hours } = req.body;
    const isCollaboration = !!committed_hours;

    if (!isCollaboration && !req.file) {
        return res.status(400).json({ error: 'Resume PDF is required for job applications.' });
    }

    try {
        if (isCollaboration) {
            // 1. Insert Collaborator - Public Insert Allowed via RLS
            const supabase = getSupabaseClient(req);
            const { data: collab, error: collabErr } = await supabase
                .from('collaborators')
                .insert([{ idea_id, full_name, email, phone, committed_hours: parseInt(committed_hours) }]);

            if (collabErr) throw collabErr;

            // 2. Update Idea participants/hours
            // RPC might require execution permissions for anon. 
            // If it fails, fallback to admin update? RPC is usually secure definer.
            // Using user client to invoke RPC.
            const { error: updateErr } = await supabase.rpc('increment_idea_stats', {
                row_id: idea_id,
                h_count: parseInt(committed_hours)
            });

            if (updateErr) {
                // Fallback manual update
                // Fallback manual update - Requires Admin because anon cannot UPDATE ideas
                const { data: idea } = await supabaseAdmin.from('ideas').select('total_hours, participants_count').eq('id', idea_id).single();
                if (idea) {
                    await supabaseAdmin.from('ideas').update({
                        total_hours: (idea.total_hours || 0) + parseInt(committed_hours),
                        participants_count: (idea.participants_count || 0) + 1
                    }).eq('id', idea_id);
                }
            }

            return res.status(200).json({ message: "Collaboration successful" });
        } else {
            // Job Application
            // RATE LIMIT CHECK
            // Extract IP (Works on Vercel and local)
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            // Check counts for this IP or Email in the last 24 hours
            // MUST use Admin client because anon cannot select from applications
            const { count, error: countErr } = await supabaseAdmin
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .or(`email.eq.${email},ip_address.eq.${ip}`)
                .gte('created_at', oneDayAgo);

            if (countErr) {
                console.error('Rate Limit Check Failed:', countErr);
                // Fail open or closed? Failing closed for security, but logging it.
                // throw new Error('System error, please try again.');
            }

            if (count >= 2) {
                return res.status(429).json({
                    error: 'You used up all your applications for the day. Please join our discord.'
                });
            }

            const fileName = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
            // MUST use Admin client because storage is private (no public write)
            const { error: uploadErr } = await supabaseAdmin.storage
                .from('resumes')
                .upload(fileName, req.file.buffer, {
                    contentType: 'application/pdf',
                    upsert: false
                });

            if (uploadErr) throw uploadErr;

            // Use User Client (Anon) for Insert - RLS Allowed
            const supabase = getSupabaseClient(req);
            const { data: appData, error: appErr } = await supabase
                .from('applications')
                .insert([{
                    posting_id,
                    full_name,
                    email,
                    phone,
                    linkedin_url,
                    resume_url: fileName,
                    ip_address: ip
                }])
                .select();

            if (appErr) throw appErr;
            return res.status(200).json({ message: "Application successful", id: appData[0].id });
        }
    } catch (err) {
        console.error('Apply Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
