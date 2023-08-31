import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Pusher from 'pusher';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const service_role = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, service_role, { auth: { autoRefreshToken: false, persistSession: false } });

// Pusher configuration
const appId = process.env.PUSHER_APP_ID || '';
const key = process.env.PUSHER_KEY || '';
const secret = process.env.PUSHER_SECRET || '';
const cluster = process.env.PUSHER_CLUSTER || '';
const pusher = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {

            const { server_id, room_id, token, uuid, content }: { server_id: string, room_id: string, token: string, uuid: string, content: string } = req.body;

            const { userId } = await authenticateUser(token) as any;

            console.log(userId);

            if (!userId) {
                console.error('Error authenticating user:', userId.error);
                res.status(401).json({ success: false, message: 'Error authenticating user' });
                return;
            }

            // content.body = req.body.content;

            // content._isEmojiBody = content.msgtype === 'm.text' && /\p{Emoji}/u.test(content.body);

            console.log(userId, content, server_id, room_id);

            // Insert message into chat_messages table
            const { data: insertedMessage, error: messageInsertError } = await supabase
                .from('chat_messages')
                .insert([
                    {
                        user_id: userId,
                        server_id,
                        room_id,
                        content,
                        uuid,
                    },
                ])
                .select('*') as { data: any, error: any };

            if (messageInsertError) {
                console.error('Error inserting chat message:', messageInsertError);
                res.status(500).json({ success: false, message: 'Error inserting chat message' });
                return;
            }

            console.log(insertedMessage);

            // Trigger Pusher event for new message
            const { data: message, error } = await supabase.from('chat_messages').select('*').eq('id', insertedMessage[0].id) as { data: any, error: any };

            if (error) {
                console.error('Error retrieving message:', error);
                res.status(500).json({ success: false, message: 'Error retrieving message' });
                return;
            }

            console.log(message);

            const { data: {user}, error: userError } = await supabase
                .auth.admin.getUserById(userId) as { data: any, error: any };

            if (userError) {
                console.error('Error retrieving user:', userError);
                res.status(500).json({ success: false, message: 'Error retrieving user' });
                return;
            }
            
            console.log(user.user_metadata.username);
            console.log(user.user_metadata.avatar);


            const newMessage = {
                message_id: insertedMessage[0].id,
                sender: {
                    username: user.user_metadata.username,
                    avatar: user.user_metadata.avatar,
                },
                server_id,
                room_id,
                sent_on: insertedMessage[0].sent_on,
                content,
                uuid,
                deleted_at: null,
            };

            pusher.trigger(`${server_id},${room_id}`, 'newMessage', newMessage);

            res.status(200).json({ success: true, message: 'Message inserted successfully' });
        } catch (error) {
            console.error('Error processing new message:', error);
            res.status(500).json({ success: false, message: 'Error processing new message' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

async function authenticateUser(token: string) {
    const { data, error } = await supabase.auth.getUser(token) as { data: any, error: any };
    const userId = data.user.id;
    if (error) {
        return { error };
    } else {
        return { userId };
    }
}