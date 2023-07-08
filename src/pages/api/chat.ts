import { NextApiHandler } from 'next';
import Pusher from 'pusher';
import mysql from 'mysql';
import { nanoid } from 'nanoid';
import Filter from 'bad-words';

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

const DATABASE_URL = process.env.DATABASE_URL || '';
const filter = new Filter();

const chatHandler: NextApiHandler = async (req, res) => {
    console.log(req.body);
    console.log(req.body.method);

    const connection = mysql.createConnection(DATABASE_URL);

    connection.connect((error) => {
        if (error) {
            console.error('Error connecting to the database:', error);
            return;
        }
        console.log('Connected to the database');
    });

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(
                `CREATE TABLE IF NOT EXISTS servers (
                            id BIGINT PRIMARY KEY AUTO_INCREMENT,
                            server_name VARCHAR(255) NOT NULL,
                            created_at TIMESTAMP DEFAULT NULL,
                            last_login TIMESTAMP DEFAULT NULL,
                            nanoid VARCHAR(30) UNIQUE,
                            UNIQUE KEY idx_public_id (nanoid)
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
                            `,
                (error) => {
                    if (error) {
                        console.error('Error creating servers table:', error);
                        reject(
                            new Error(
                                'Failed to create servers table'
                            ) as Error & {
                                status: number;
                            }
                        );
                    } else {
                        connection.query(
                            `CREATE TABLE IF NOT EXISTS messages (
                            id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            message TEXT NOT NULL,
                            sent_on TIMESTAMP NOT NULL,
                            username TEXT NOT NULL,
                            server_id INT
                            )`,
                            (error) => {
                                if (error) {
                                    console.error(
                                        'Error creating messages table:',
                                        error
                                    );
                                    reject(
                                        new Error(
                                            'Failed to create messages table'
                                        ) as Error & {
                                            status: number;
                                        }
                                    );
                                } else {
                                    resolve();
                                }
                            }
                        );
                    }
                }
            );
        });

        if (req.body.method === 'defaultMessages') {
            try {
                const server_nanoid = req.body.server_id;

                if (!server_nanoid) {
                    res.status(400).json({ error: 'Missing server_id' });
                    return;
                }

                const now = new Date().toISOString().replace('Z', '');

                if (server_nanoid === 'default') {
                    const generatedNanoid = nanoid(30);
                    console.log(generatedNanoid);

                    connection.query(
                        `INSERT INTO servers (server_name, created_at, last_login, nanoid)
                        SELECT 'default', ?, NULL, ?
                        FROM DUAL 
                        WHERE NOT EXISTS (
                        SELECT * FROM servers LIMIT 1
                        )
                        ON DUPLICATE KEY UPDATE nanoid = VALUES(nanoid)`,
                        [now, generatedNanoid],
                        (error, result) => {
                            if (error) {
                                console.error(
                                    'Error creating default server:',
                                    error
                                );
                                throw new Error(
                                    'Failed to create default server'
                                );
                            }
                            console.log(
                                'Default server created successfully:',
                                result
                            );
                        }
                    );
                }

                connection.query(
                    `SELECT messages.id, messages.message, messages.username, messages.sent_on, servers.id AS id
                    FROM messages
                    JOIN servers ON messages.server_id = servers.id
                    WHERE servers.id = (SELECT id FROM servers WHERE nanoid = ?)`,
                    server_nanoid,
                    (
                        error,
                        results: {
                            id: string;
                            message: string;
                            username: string;
                            sent_on: Date;
                        }[]
                    ) => {
                        if (error) {
                            console.error(
                                'Error retrieving default messages:',
                                error
                            );
                            res.status(200).json({
                                messages: {
                                    id: '',
                                    message: '',
                                    username: '',
                                    sent_on: '',
                                },
                            });
                            return;
                        }

                        console.log(results);

                        const defaultMessages = results.map((row) => ({
                            id: server_nanoid,
                            message: row.message,
                            username: row.username,
                            sent_on: row.sent_on,
                        }));

                        const filteredMessages = defaultMessages.filter(
                            (message) => {
                                return (
                                    filter.isProfane(message.message) ||
                                    filter.isProfane(message.username)
                                );
                            }
                        );

                        if (filteredMessages.length > 0) {
                            res.status(400).send({
                                error: 'Content contains inappropriate words',
                            });
                        }

                        connection.query(
                            `UPDATE servers SET last_login = ? WHERE nanoid = ?`,
                            [now, server_nanoid],
                            (error) => {
                                if (error) {
                                    console.error(
                                        'Error updating last_login:',
                                        error
                                    );
                                    throw new Error(
                                        'Failed to update last_login'
                                    );
                                }

                                console.log(defaultMessages);

                                res.status(200).json({
                                    messages: defaultMessages,
                                });
                            }
                        );
                    }
                );
            } catch (error) {
                console.error('Error retrieving default messages:', error);
                throw new Error(
                    'Failed to retrieve default messages from the server'
                );
            }
        } else if (req.body.method === 'newMessage') {
            try {
                console.log('Receiving sent message...');

                let { username, message, server_id } = req.body;
                console.log(message);

                const now = new Date().toISOString().replace('Z', '');
                if (!username) {
                    setTimeout(() => {
                        res.status(400).send({ error: 'Missing username' });
                    }, 5000);
                    return;
                }

                console.log(username);

                if (filter.isProfane(username) || filter.isProfane(message)) {
                    res.status(400).send({
                        error: 'Username or message contains inappropriate content',
                    });
                    return;
                }

                connection.query(
                    'SELECT id FROM servers WHERE nanoid = ?',
                    [server_id],
                    (error, serverResults) => {
                        if (error) {
                            console.error('Error retrieving server id:', error);
                            res.status(500).send(error);
                            return;
                        }
                        const serverId =
                            serverResults.length > 0
                                ? serverResults[0].id
                                : null;

                        // Proceed with message insertion
                        insertMessage(message, now, username, serverId);
                    }
                );

                function insertMessage(
                    message: string,
                    sent_on: string,
                    username: string,
                    serverId: number
                ) {
                    connection.query(
                        `INSERT INTO messages (message, sent_on, username, server_id) VALUES (?, ?, ?, ?)`,
                        [message, sent_on, username, serverId],
                        async (error, results) => {
                            if (error) {
                                console.error(
                                    'Error inserting message:',
                                    error
                                );
                                res.status(500).send(error);
                                return;
                            }

                            console.log(results);

                            const newMessage = {
                                id: server_id,
                                message,
                                username,
                                sent_on: now,
                            };
                            await pusher.trigger(
                                'chat',
                                'newMessage',
                                newMessage
                            );
                            res.status(200).end();
                        }
                    );
                }
            } catch (error) {
                console.error('Error inserting message:', error);
                res.status(500).send(error);
            }
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send(error);
    }
};

export default chatHandler;
