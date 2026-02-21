
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
        // If there is no actual file selected, the browser might still send a part 
        // with an empty string filename and application/octet-stream.
        // We should just ignore it.
        if (!file || !file.originalname) {
            return cb(null, false);
        }

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
    const { posting_id, full_name, email, phone, linkedin_url } = req.body;

    try {
        // Job Application
        // RATE LIMIT CHECK — Extract IP (Works on Vercel and local)
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
        }

        if (count >= 2) {
            return res.status(429).json({
                error: 'You used up all your applications for the day. Please join our discord.'
            });
        }

        // Upload resume only if one was provided
        let resume_url = null;
        if (req.file) {
            const fileName = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
            // MUST use Admin client because storage is private (no public write)
            const { error: uploadErr } = await supabaseAdmin.storage
                .from('resumes')
                .upload(fileName, req.file.buffer, {
                    contentType: 'application/pdf',
                    upsert: false
                });
            if (uploadErr) throw uploadErr;
            resume_url = fileName;
        }

        // Use User Client (Anon) for Insert - RLS Allowed
        const supabase = getSupabaseClient(req);
        const { error: appErr } = await supabase
            .from('applications')
            .insert([{
                posting_id,
                full_name,
                email,
                phone,
                linkedin_url,
                resume_url,
                ip_address: ip
            }]);

        if (appErr) throw appErr;
        return res.status(200).json({ message: "Application successful" });
    } catch (err) {
        console.error('Apply Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
