import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const service_role = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, service_role, {
    auth: { autoRefreshToken: false, persistSession: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        // Extract the token value from the header
        const token = req.query.token?.toString();

        // Verify user with Supabase and get user_id from the token
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = user.id;

        // Read the ncea_data for user_id
        const { data, error: selectError } = await supabase
            .from('ncea_data')
            .select()
            .eq('user_id', userId);

        if (selectError) {
            return res.status(500).json({ error: 'An error occurred while fetching ncea_data.' });
        }

        const nceaData = data[0];

        const subjects = nceaData.subjects;

        console.log(subjects);

        return res.status(200).json({subjects});
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
