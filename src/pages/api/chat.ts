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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                nanoid VARCHAR(30) UNIQUE,
                UNIQUE KEY idx_public_id (nanoid)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
                            user_id INT NOT NULL,
                            message TEXT NOT NULL,
                            sent_on TIMESTAMP NOT NULL,
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
        const cachedUserdata: {
            [key: string]: { username: string; profile_picture: string };
        } = {};

        if (req.body.method === 'defaultMessages') {
            try {
                const server_nanoid = req.body.server_id;

                if (!server_nanoid) {
                    return res.status(400).json({ error: 'Missing server_id' });
                }

                const now = new Date().toISOString().replace('Z', '');

                // Check if the server_nanoid is 'default', and if so, insert a new default server
                if (server_nanoid === 'default') {
                    const generatedNanoid = nanoid(30);
                    console.log('nanoid', generatedNanoid);

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
                                console.error('Error creating default server:', error);
                                throw new Error('Failed to create default server');
                            }
                            console.log('Default server created successfully:', result);
                        }
                    );
                }

                connection.query(
                    `SELECT messages.id, messages.user_id, messages.message, messages.sent_on, servers.id AS id
                    FROM messages
                    JOIN servers ON messages.server_id = servers.id
                    WHERE servers.id = (SELECT id FROM servers WHERE nanoid = ?)`,
                    server_nanoid,
                    async (
                        error,
                        results: {
                            id: string;
                            user_id: string;
                            message: string;
                            sent_on: Date;
                        }[]
                    ) => {
                        if (error) {
                            console.error('Error retrieving default messages:', error);
                            return res.status(500).json({ error: 'Failed to retrieve default messages' });
                        }

                        console.log('Default messages:', results);

                        const defaultMessages: {
                            id: string;
                            message: string;
                            userId: string;
                            sent_on: Date;
                            username?: string;
                            profile_picture?: string;
                        }[] = [];

                        for (const row of results) {
                            const { message, user_id, sent_on } = row;
                            if (user_id in cachedUserdata) {
                                // Use cached user data if available
                                const userData = cachedUserdata[user_id];
                                defaultMessages.push({
                                    id: server_nanoid,
                                    message,
                                    userId: user_id,
                                    sent_on,
                                    username: userData.username,
                                    profile_picture: userData.profile_picture,
                                });
                            } else {
                                try {
                                    const userData = await fetchUserDataFromDatabase(user_id);
                                    cachedUserdata[user_id] = userData;
                                    defaultMessages.push({
                                        id: server_nanoid,
                                        message,
                                        userId: user_id,
                                        sent_on,
                                        username: userData.username,
                                        profile_picture: userData.profile_picture,
                                    });
                                } catch (error) {
                                    console.error(`Error retrieving user data for userId '${user_id}':`, error);
                                    defaultMessages.push({
                                        id: server_nanoid,
                                        message,
                                        userId: user_id,
                                        sent_on,
                                    });
                                }
                            }
                        }

                        // Update the last_login of the server
                        connection.query(
                            `UPDATE servers SET last_login = ? WHERE nanoid = ?`,
                            [now, server_nanoid],
                            (error) => {
                                if (error) {
                                    console.error('Error updating last_login:', error);
                                    return res.status(500).json({ error: 'Failed to update last_login' });
                                }

                                console.log('Default messages:', defaultMessages);

                                return res.status(200).json({
                                    messages: defaultMessages.map(({ userId, ...rest }) => rest),
                                });
                            }
                        );

                        async function fetchUserDataFromDatabase(userId: string): Promise<{ username: string; profile_picture: string }> {
                            return new Promise<{ username: string; profile_picture: string }>((resolve, reject) => {
                                connection.query(
                                    'SELECT username, profile_picture FROM users WHERE id = ?',
                                    [userId],
                                    (error, results) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            if (results.length > 0) {
                                                resolve(results[0]);
                                            } else {
                                                // If user data is not found, provide default values
                                                resolve({ username: 'Unknown', profile_picture: '' });
                                            }
                                        }
                                    }
                                );
                            });
                        }
                    }
                );
            } catch (error) {
                console.error('Error retrieving default messages:', error);
                return res.status(500).json({ error: 'Failed to retrieve default messages from the server' });
            }
        } else if (req.body.method === 'newMessage') {
            try {
                console.log('Receiving sent message...');

                const { user, message, server_id } = req.body;
                console.log(message);

                const now = new Date().toISOString().replace('Z', '');
                if (!user) {
                    setTimeout(() => {
                        return res.status(400).end({ error: 'Missing username' });
                    }, 5000);
                    return;
                } else {
                    const userId = user as string;

                    // Fetch the server ID based on the provided server_id (nanoid)
                    connection.query(
                        'SELECT id FROM servers WHERE nanoid = ?',
                        [server_id],
                        (error, results) => {
                            if (error) {
                                console.error('Error retrieving server ID:', error);
                                return res.status(500).send({ error: 'Failed to retrieve server ID' });
                            }

                            if (results.length === 0) {
                                return res.status(400).send({ error: 'Server not found with the provided server_id' });
                            }

                            const serverId = results[0].id;

                            console.log('Server ID:', serverId);

                            // Now that you have the server ID, fetch the user data and insert the message
                            fetchData(userId)
                                .then((userData) => {
                                    console.log(userData);
                                    if (!userData || !userData.userId) {
                                        return res.status(400).send({
                                            error: 'Missing username, please go to your profile and add username',
                                        });
                                    } else {
                                        const { userId, username, profile_picture } = userData;
                                        insertMessage(
                                            userId,
                                            message,
                                            new Date(now),
                                            serverId,
                                            profile_picture,
                                            username
                                        );
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                    return res.status(500).send(error);
                                });
                        }
                    );
                }
            } catch (error) {
                console.error('Error inserting message:', error);
                return res.status(500).send(error);
            }
        }

        function fetchData(token: string): Promise<{ userId: number; username: string; profile_picture: string } | null> {
            return new Promise<{ userId: number; username: string; profile_picture: string } | null>((resolve, reject) => {
                connection.query(
                    'SELECT users.id AS userId, users.username, users.profile_picture FROM users JOIN user_tokens ON users.id = user_tokens.user_id WHERE user_tokens.token = ?',
                    [token],
                    (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            if (results.length > 0) {
                                resolve(results[0]);
                            } else {
                                resolve(null);
                            }
                        }
                    }
                );
            });
        }

        async function insertMessage(
            user_id: number,
            message: string,
            sent_on: Date,
            serverId: string,
            picture: string,
            username: string
        ) {
            try {

                if (filter.isProfane(message)) {
                    return res.status(400).send({
                        error: 'Message contains inappropriate content',
                    });
                } else {
                    connection.query(
                        'INSERT INTO messages (user_id, message, sent_on, server_id) VALUES (?, ?, ?, ?)',
                        [user_id, message, sent_on, serverId],
                        (error, results) => {
                            if (error) {
                                console.error('Error inserting message:', error);
                                return res.status(500).send(error);
                            } else {
                                console.log(results);

                                const newMessage = {
                                    id: serverId,
                                    message,
                                    username,
                                    sent_on,
                                    profile_picture: picture,
                                };
                                pusher.trigger('chat', 'newMessage', newMessage);
                                return res.status(200).end();
                            }
                        }
                    );
                }
            } catch (error) {
                console.error(error);
                return res.status(500).send(error);
            }
        };
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

export default chatHandler;
