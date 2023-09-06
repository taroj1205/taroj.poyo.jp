import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const service_role = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, service_role, { auth: { autoRefreshToken: false, persistSession: false } });

interface RequestBody {
    subject: string;
    standardNumber: string;
    name: string;
    credits: string;
    achievement: string;
}

// Define the API handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract the token value from the header
        const token = authHeader.substring('Bearer '.length);
        console.log(token);

        // Verify user with Supabase and get user_id from the token
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            console.log(userError);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        console.log(user);

        const userId = user.id;

        // Parse the request body
        const requestBody = req.body;

        console.log(requestBody);

        // Read the ncea_data for user_id
        const { data: existingData, error: selectError } = await supabase
            .from('ncea_data')
            .select()
            .eq('user_id', userId);

        if (selectError) {
            console.log(selectError);
            return res.status(500).json({ error: 'An error occurred while processing the request.' });
        }

        if (existingData && existingData.length > 0) {
            // Update the existing row
            const { data, error: updateError } = await supabase
                .from('ncea_data')
                .update({
                    subjects: requestBody,
                })
                .eq('user_id', userId);

            if (updateError) {
                console.log(updateError);
                return res.status(500).json({ error: 'An error occurred while processing the request.' });
            }
        } else {
            // Insert a new row
            const { data, error: insertError } = await supabase
                .from('ncea_data')
                .insert({
                    user_id: userId,
                    subjects: requestBody,
                });

            if (insertError) {
                console.log(insertError);
                return res.status(500).json({ error: 'An error occurred while processing the request.' });
            }
        }

        return res.status(200).json({ message: 'Data inserted successfully' });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
