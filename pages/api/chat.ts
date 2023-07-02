import { NextApiHandler } from 'next';
import Pusher from 'pusher';
import { createClient } from '@vercel/postgres';

console.log('chat.ts running');

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

const DATABASE_URL = process.env.DATABASE_URL;

const chatHandler: NextApiHandler = async (req, res) => {
    console.log(req.body);
    console.log(req.body.method);

    try {
        const client = createClient({
            connectionString: DATABASE_URL,
        });

        await client.connect();

        client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        client.sql`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        created_at DATE DEFAULT CURRENT_DATE
        )
        `;
        client.sql`
        CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        message TEXT NOT NULL,
        sent_on TIMESTAMP NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        server_id INTEGER NOT NULL
        )
        `;

        if (req.body.method === 'defaultMessages') {
            try {
                const server_id = req.body.server_id;
                console.log(`Getting default messages for ${server_id}`);

                const { rows } = await client.sql`
                SELECT messages.id,
                messages.message,
                users.username,
                messages.sent_on
                FROM messages
                JOIN users ON messages.user_id = users.id
                WHERE messages.server_id = ${server_id}
                `;

                const defaultMessages = rows
                    .map((row) => ({
                        id: row.id,
                        message: row.message,
                        username: row.username,
                        sent_on: row.sent_on,
                    }))
                    .reverse();

                console.log(defaultMessages);

                res.status(200).json(defaultMessages);
            } catch (error) {
                console.error('Error retrieving default messages:', error);
                throw new Error(
                    'Failed to retrieve default messages from the server'
                ) as Error & { status: number };
            }
        } else if (req.body.method === 'newMessages') {
            try {
                console.log('Receiving sent message...');

                let { message, userId, server_id } = req.body;
                console.log(message);

                const now = new Date().toISOString();
                if (!userId) {
                    userId = 1;
                }

                console.log(userId);

                const { rows } = await client.sql`
                INSERT INTO messages (message, sent_on, user_id, server_id)
                VALUES (${message}, ${now}, ${userId}, ${server_id})
                RETURNING id
                `;

                const id = rows.length > 0 ? rows[0].id : null;

                const { rows: userRows } = await client.sql`
                SELECT username
                FROM users
                WHERE id = ${userId}
                `;

                const username =
                    userRows.length > 0 ? userRows[0].username : null;

                const newMessage = {
                    id,
                    message,
                    sent_on: now,
                    userId,
                    username,
                };
                await pusher.trigger(
                    'chat',
                    'newMessage',
                    JSON.stringify(newMessage)
                );
                res.status(200).end();
            } catch (error) {
                console.error('Error inserting message:', error);
            }
        } else {
            res.status(404).end();
        }

        await client.end();
        console.log('Disconnected from the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

export default chatHandler;
