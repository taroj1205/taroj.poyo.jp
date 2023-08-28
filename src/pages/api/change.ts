import { NextApiHandler } from 'next';
import { createClient } from '@supabase/supabase-js';

// Methods have to be implemented (avatar, username, etc)
const changeHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.body.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const service_role = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(supabaseUrl, service_role, { auth: { autoRefreshToken: false, persistSession: false } });

    try {
        const userId = req.body.token;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: user, error: userError } = await supabase.auth.getUser(userId);

        if (userError) {
            console.error('Error fetching user:', userError);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user_id = user.user.id;

        try {
            const newPictureURL = req.body.url || undefined;
            const newUsername = req.body.username || undefined;
            
            if (newPictureURL !== undefined) {
                // Update the user's profile picture in the metadata using Supabase
                const { error: updateError } = await supabase.auth.admin.updateUserById(
                    user_id,
                    {
                        user_metadata: { avatar: newPictureURL }
                    }
                );

                if (updateError) {
                    console.error('Error updating user profile picture:', updateError);
                    return res.status(500).json({ error: 'Internal server error' });
                } else {
                    return res.status(200).json({ message: 'Profile picture updated successfully' });
                }
            }

            if (newUsername !== undefined) {
                // Update the user's username using Supabase
                const {error: updateError} = await supabase.auth.admin.updateUserById(
                    user_id,
                    {
                    user_metadata: { username: newUsername }
                    }
                )

                if (updateError) {
                    console.error('Error updating user username:', updateError);
                    return res.status(500).json({ error: 'Internal server error' })
                } else {
                    return res.status(200).json({ message: 'Username updated successfully' })
                }
            }

        } catch (error) {
            console.error('Error validating image URL:', error);
            return res.status(400).json({ error: 'Invalid image URL' });
        }
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default changeHandler;
