import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const service_role = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, service_role, { auth: { autoRefreshToken: false, persistSession: false } });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email } = req.body;
        const url = req.headers.host;
        const protocol = url === 'localhost:3000' ? 'http' : 'https';
        console.log(`${protocol}://${url}/api/auth/callback`);

        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${protocol}://${url}/auth/update/password?email=${encodeURIComponent(email)}`,
            })

            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred while processing the request.' });
            }

            return res.status(200).json({ message: 'Reset email sent successfully.' });
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'An error occurred while processing the request.' });
        }
    }

    return res.status(405).end();
}
