// Import necessary libraries
import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql';

// MySQL database configuration
const dbConfig = process.env.DATABASE_URL || '';

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Authenticate the user using the provided token
async function authenticateUser(token: string): Promise<string | null> {
    const connection = await new Promise<mysql.PoolConnection>((resolve, reject) => {
        pool.getConnection((error: mysql.MysqlError | null, connection) => {
            if (error) reject(error);
            resolve(connection);
        });
    });

    try {
        // Fetch the user ID from the user_tokens table using the token
        const selectUserIdQuery = 'SELECT user_id FROM user_tokens WHERE token = ?';
        const rows: any[] = await new Promise((resolve, reject) => {
            connection.query(selectUserIdQuery, [token], (error: mysql.MysqlError | null, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        if (rows.length === 0) {
            return null; // User not found or token invalid
        }

        const userId = rows[0].user_id;
        return userId;
    } finally {
        connection.release();
    }
}

// Insert a new message into the messages table
async function insertMessage(token: string, sent_on: Date, server_name: string, room_name: string, content: any) {
    const connection = await new Promise<mysql.PoolConnection>((resolve, reject) => {
        pool.getConnection((error: mysql.MysqlError | null, connection) => {
            if (error) reject(error);
            resolve(connection);
        });
    });

    try {
        // Verify the token and authenticate the user
        const userId = await authenticateUser(token);
        if (!userId) {
            throw new Error('Unauthorized');
        }

        // Get the server_id from the chat_servers table
        const serverQuery = `SELECT id FROM chat_servers WHERE nanoid = ?`;
        const serverValues = [server_name];
        const serverResult = await new Promise<any>((resolve, reject) => {
            connection.query(serverQuery, serverValues, (error: mysql.MysqlError | null, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
        const server_id = serverResult[0].id;

        // Get the room_id from the chat_rooms table
        const roomQuery = `SELECT id FROM chat_rooms WHERE server_id = ? AND nanoid = ?`;
        const roomValues = [server_id, room_name];
        const roomResult = await new Promise<any>((resolve, reject) => {
            connection.query(roomQuery, roomValues, (error: mysql.MysqlError | null, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
        const room_id = roomResult[0].id;

        // Check if the message has msgType as "m.text" and if it's an emoji
        const isEmojiBody = content.msgtype === 'm.text' && /\p{Emoji}/u.test(content.body);
        content._isEmojiBody = isEmojiBody;
        console.log(content);

        // Insert the message into the messages table
        const insertQuery = `INSERT INTO messages (user_id, server_id, room_id, sent_on, content) VALUES (?, ?, ?, ?, ?)`;
        const values = [userId, server_id, room_id, sent_on, JSON.stringify(content)];
        await new Promise<void>((resolve, reject) => {
            connection.query(insertQuery, values, (error: mysql.MysqlError | null) => {
                if (error) reject(error);
                resolve();
            });
        });
    } finally {
        connection.release();
    }
}

// API endpoint for handling new messages
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { token, server_id, room_id } = req.body;
        const content: any = {};
        content.body = req.body.content;
        console.log(token, server_id, room_id, content);

        try {
            const now = new Date().toISOString().replace('Z', '');
            await insertMessage(token, new Date(now), server_id, room_id, content);

            res.status(200).json({ success: true, message: 'Message saved successfully' });
        } catch (error: any) {
            console.error('Error inserting message:', error);
            if (error.message === 'Unauthorized') {
                res.status(401).json({ success: false, message: 'Unauthorized' });
            } else {
                res.status(500).json({ success: false, message: 'Error inserting message' });
            }
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
