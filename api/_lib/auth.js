
import { supabase } from './supabase.js';

/**
 * Verifies if the request is authenticated as an admin.
 * Supports both legacy password (process.env.ADMIN_PASSWORD) and Supabase JWT.
 * @param {Object} req - The request object
 * @returns {Promise<boolean>} True if authenticated
 */
export async function checkAdmin(req) {
    // req.headers is a plain object in Node/Express/Vercel functions
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    if (!token) return false;

    // 1. Legacy Check (Backwards Compatibility)
    if (process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD) {
        return true;
    }

    // 2. Supabase JWT Check
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) return false;

        // For now, any authenticated user is considered admin if they have a valid token
        // since we only gave login access to the admin user.
        return true;
    } catch (err) {
        console.error('Auth Check Error:', err);
        return false;
    }
}
