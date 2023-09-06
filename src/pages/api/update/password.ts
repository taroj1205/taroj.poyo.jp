import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { access_token, password } = req.body as { access_token: string, password: string };

        try {
            // Verify the access_token against Supabase
            const { error: verificationError } = await supabase.auth.updateUser({
                password
            });

            if (verificationError) {
                throw verificationError;
            }

            // Password update successful
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Password update error:', error);
            res.status(500).json({ error: 'An error occurred while updating the password' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
