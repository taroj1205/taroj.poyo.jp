import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const service_role = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, service_role, { auth: { autoRefreshToken: false, persistSession: false } });

// API endpoint for retrieving messages on load
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Retrieve the chat room details
            const { data: chat_servers, error } = await supabase
                .from('chat_servers')
                .select('id, server_name')
                .order('id', { ascending: true }) as { data: any, error: any };

            console.log(error);

            console.log(chat_servers);

            if (chat_servers?.length === 0) {

                // Insert default server and room if they don't exist
                const { data: insertedServer, error } = await supabase.from('chat_servers').insert([
                    {
                        server_name: 'Default',

                    },
                ]) as { data: any, error: any };

                if (error) {
                    console.error('Error inserting chat server:', error);
                    return; // or handle the error appropriately
                }

                const { data: id } = await supabase
                    .from('chat_servers')
                    .select('id')
                    .order('id', { ascending: true }) as { data: any, error: any };

                const insertedId = id[0].id;

                console.log('Inserted default server:', insertedId);

                const { data: insertedRoom, error: roomInsertError } = await supabase
                    .from('chat_rooms')
                    .insert([
                        {
                            room_name: 'English',
                            server_id: insertedId,
                        },
                    ]);

                if (roomInsertError) {
                    console.error('Error inserting chat room:', roomInsertError);
                    return; // or handle the error appropriately
                }

                console.log(insertedRoom);

                // Retry the GET request now that the default server and room are created
                console.log('Creating default server and room...');
                return handler(req, res);
            }

            // Retrieve messages and sender info

            const server_id = chat_servers[0].id;
            const server_name = chat_servers[0].server_name;

            const { data: chat_rooms, error: chat_roomError } = await supabase
                .from('chat_rooms')
                .select('id, room_name, chat_servers(id)') as { data: any, error: any };

            if (chat_roomError) {
                console.error('Error retrieving chat room:', chat_roomError);
                return;
            }

            console.log('Server id:', server_id);
            console.log('Chat room ids:', chat_rooms);

            const room_id = chat_rooms[0].id;
            const room_name = chat_rooms[0].room_name;

            const selectedChatRoom = chat_rooms.find((chatRoom: any) => chatRoom.chat_servers.id === server_id);

            console.log("Selected chat room:", selectedChatRoom);

            if (selectedChatRoom) {
                const selectedRoomId = selectedChatRoom.id;
                const selectedRoomName = selectedChatRoom.room_name;

                console.log('Selected Room ID:', selectedRoomId);
                console.log('Selected Room Name:', selectedRoomName);
            } else {
                console.error('No matching chat room found for the selected server.');
                res.status(400).json({ success: false, message: 'No matching chat room found' });
                return;
            }

            const { data: messages, error: messageError } = await supabase
                .from('chat_messages')
                .select('*, users:id')
                .match({ server_id, room_id }) as { data: any[], error: any };

            if (messageError) {
                console.error('Error retrieving messages:', messageError);
                return;
            }

            console.log(messages);

            const channelDetail = {
                server: {
                    id: server_id,
                    name: server_name
                },
                room: {
                    id: room_id,
                    name: room_name
                }
            };

            const senderInfo = {} as any;
            const userId = messages[0].user_id;

            console.log('User ID:', userId);

            if (!senderInfo[userId]) {
                const { data: user, error: userError } = await supabase
                    .auth.admin.getUserById(userId)

                if (userError) {
                    console.error('Error retrieving user:', userError);
                    res.status(500).json({ success: false, message: 'Error retrieving user' });
                    return;
                }
                senderInfo[userId] = user;
                console.log(senderInfo[userId].user.user_metadata.username);
                console.log(senderInfo[userId].user.user_metadata.avatar);
            }

            // Format messages in the desired JSON format
            const formattedMessages = messages.map((message) => ({
                message_id: message.id,
                sender: {
                    username: senderInfo[message.user_id].user.user_metadata.username,
                    avatar: senderInfo[message.user_id].user.user_metadata.avatar,
                },
                server_id: message.server_id,
                room_id: message.room_id,
                sent_on: message.sent_on,
                content: message.content,
            }));


            console.log('Retrieved and formatted messages:', formattedMessages);

            res.status(200).json({ channelDetail, formattedMessages });
        } catch (error) {
            console.error('Error retrieving messages:', error);
            res.status(500).json({ success: false, message: 'Error retrieving messages' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
