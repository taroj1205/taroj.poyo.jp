// Import necessary libraries
// Import necessary libraries
import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql';
import { nanoid } from 'nanoid';

// MySQL database configuration
const dbConfig = process.env.DATABASE_URL || '';

// API endpoint for retrieving messages on load
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Connect to the MySQL database
        const connection = mysql.createConnection(dbConfig);
        connection.connect();

        try {
            const chatRoomsQuery = `SELECT chat_rooms.nanoid AS room_nanoid, chat_servers.nanoid AS server_nanoid
                                    FROM chat_rooms
                                    INNER JOIN chat_servers ON chat_rooms.server_id = chat_servers.id
                                    ORDER BY chat_rooms.id LIMIT 1`;
            const chatRoomsResult = await new Promise<any>((resolve, reject) => {
                connection.query(chatRoomsQuery, (error, results) => {
                    if (error) reject(error);
                    resolve(results[0]);
                });
            });

            if (!chatRoomsResult) {
                const now = new Date().toISOString().replace('Z', '');
                const generatedServerNanoid = nanoid(30);
                const generatedRoomNanoid = nanoid(30);

                connection.query(
                    `INSERT INTO chat_servers (server_name, created_at, last_login, nanoid)
                    VALUES (?, ?, NULL, ?)
                    ON DUPLICATE KEY UPDATE nanoid = VALUES(nanoid)`,
                    ['default', now, generatedServerNanoid],
                    (error, serverResult) => {
                        if (error) {
                            console.error('Error creating default server:', error);
                            res.status(500).json({ success: false, message: 'Failed to create default server' });
                            return;
                        }

                        connection.query(
                            `INSERT INTO chat_rooms (room_name, server_id, nanoid)
                            VALUES (?, ?, ?)`,
                            ['default', serverResult.insertId, generatedRoomNanoid],
                            (error, roomResult) => {
                                if (error) {
                                    console.error('Error creating default room:', error);
                                    res.status(500).json({ success: false, message: 'Failed to create default room' });
                                    return;
                                }

                                // Retry the GET request now that the default server and room are created
                                handler(req, res);
                            }
                        );
                    }
                );

                return;
            }

            const { server_nanoid, room_nanoid } = chatRoomsResult;

            const senderInfo: Array<any> = [];

            // Retrieve messages from the messages table
            const selectQuery = `SELECT *
                    FROM messages
                    WHERE server_id = (
                        SELECT id
                        FROM chat_servers
                        WHERE nanoid = ?
                    ) AND room_id = (
                        SELECT id
                        FROM chat_rooms
                        WHERE nanoid = ?
                    )`;
            const values = [server_nanoid, room_nanoid];
            const messages = await new Promise<any[]>((resolve, reject) => {
                connection.query(selectQuery, values, (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                });
            });

            // Get unique user IDs from messages
            const userIds = [...new Set(messages.map((message) => message.user_id))];

            // Retrieve sender info for each user ID
            for (const userId of userIds) {
                if (!senderInfo[userId]) {
                    const selectUserQuery = `SELECT username, profile_picture FROM users WHERE id = ?`;
                    const userValues = [userId];
                    const user = await new Promise<any>((resolve, reject) => {
                        connection.query(selectUserQuery, userValues, (error, results) => {
                            if (error) reject(error);
                            resolve(results[0]);
                        });
                    });
                    senderInfo[userId] = user;
                }
            }

            const channelDetail = {
                server_id: server_nanoid,
                room_id: room_nanoid,
            };

            // Format messages in the desired JSON format
            const formattedMessages = messages.map((message) => ({
                message_id: message.id,
                sender: senderInfo[message.user_id],
                server_id: message.server_id,
                room_id: message.room_id,
                sent_on: message.sent_on,
                content: JSON.parse(message.content),
            }));

            res.status(200).json({ channelDetail, formattedMessages });
        } catch (error) {
            console.error('Error retrieving messages:', error);
            res.status(500).json({ success: false, message: 'Error retrieving messages' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
