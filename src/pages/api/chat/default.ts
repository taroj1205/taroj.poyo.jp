// Import necessary libraries
import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql';
import { nanoid } from 'nanoid';

// MySQL database configuration
const dbConfig = process.env.DATABASE_URL || '';

// API endpoint for retrieving messages on load
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { server_id, room_id } = req.query;

        // Connect to the MySQL database
        const connection = mysql.createConnection(dbConfig);
        connection.connect();

        try {
            if (server_id === 'default') {
                // Check if the server_nanoid is 'default', and if so, insert a new default server
                const generatedNanoid = nanoid(30);
                const now = new Date().toISOString().replace('Z', '');
                console.log('nanoid', generatedNanoid);

                connection.query(
                    `INSERT INTO chat_servers (server_name, created_at, last_login, nanoid)
                SELECT 'default', ?, NULL, ?
                FROM DUAL 
                WHERE NOT EXISTS (
                    SELECT * FROM chat_servers LIMIT 1
                )
                ON DUPLICATE KEY UPDATE nanoid = VALUES(nanoid)`,
                    [now, generatedNanoid],
                    (error, result) => {
                        if (error) {
                            console.error('Error creating default server:', error);
                            throw new Error('Failed to create default server');
                        }
                        const room_id = nanoid(30);
                        const now = new Date().toISOString().replace('Z', '');
                        // Check if the room_id already exists for the server
                        connection.query(
                            `SELECT * FROM chat_rooms WHERE server_id = ? AND nanoid = ?`,
                            [1, room_id],
                            (error, results) => {
                                if (error) {
                                    console.error('Error checking for existing room_id:', error);
                                    throw new Error('Failed to check for existing room_id');
                                }

                                if (results.length > 0) {
                                    console.log('Room already exists for server:', results.server_id);
                                    return;
                                }

                                console.log(server_id);
                                connection.query(
                                    `INSERT INTO chat_rooms (room_name, created_at, server_id, nanoid) VALUES (?, ?, ?, ?)`,
                                    ['default', now, '1', room_id],
                                    (error, chatRoomsResult) => {
                                        if (error) {
                                            console.error('Error inserting into chat_rooms:', error);
                                            throw new Error('Failed to insert into chat_rooms');
                                        }
                                        console.log('Data inserted into chat_rooms successfully:', chatRoomsResult);
                                    }
                                );
                            }
                        );
                    }
                );
            }

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
            const values = [server_id, room_id];
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

            // Format messages in the desired JSON format
            const formattedMessages = messages.map((message) => ({
                message_id: message.id,
                sender: senderInfo[message.user_id],
                server_id: message.server_id,
                room_id: message.room_id,
                sent_on: message.sent_on,
                content: JSON.parse(message.content),
            }));

            res.status(200).json(formattedMessages);
        } catch (error) {
            console.error('Error retrieving messages:', error);
            res.status(500).json({ success: false, message: 'Error retrieving messages' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
