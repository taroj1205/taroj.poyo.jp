import { NextApiHandler } from 'next';
import Pusher from 'pusher';
import mysql from 'mysql';
import { nanoid } from 'nanoid';
import Filter from 'bad-words';
import request from 'request';

console.log('chat.ts running');

const base_url = process.env.AUTH0_ISSUER_BASE_URL;
const client_secret = process.env.AUTH0_CLIENT_SECRET_TOKEN;
const client_id = process.env.AUTH0_CLIENT_ID_TOKEN;

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
                            message TEXT NOT NULL,
                            sent_on TIMESTAMP NOT NULL,
                            username TEXT NOT NULL,
                            server_id INT,
                            userId TEXT NOT NULL
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
            [key: string]: { username: string; profilePicture: string };
        } = {};

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
                    `SELECT messages.id, messages.message, messages.userId, messages.sent_on, servers.id AS id
        FROM messages
        JOIN servers ON messages.server_id = servers.id
        WHERE servers.id = (SELECT id FROM servers WHERE nanoid = ?)`,
                    server_nanoid,
                    async (
                        error,
                        results: {
                            id: string;
                            message: string;
                            userId: string;
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
                                    profilePicture: '',
                                },
                            });
                            return;
                        }

                        console.log(results);
                        const options = {
                            method: 'POST',
                            url: 'https://poyo.jp.auth0.com/oauth/token',
                            headers: { 'content-type': 'application/json' },
                            body: `{"client_id":"${client_id}","client_secret":"${client_secret}","audience":"https://poyo.jp.auth0.com/api/v2/","grant_type":"client_credentials"}`,
                        };

                        request(
                            options,
                            async function (error, response: any, body) {
                                if (error) throw new Error(error);
                                const api_key = JSON.parse(body).access_token;
                                const defaultMessages: {
                                    id: string;
                                    message: string;
                                    userId: string;
                                    sent_on: Date;
                                    username?: string;
                                    profilePicture?: string;
                                }[] = [];

                                for (const row of results) {
                                    const { id, message, userId, sent_on } =
                                        row;
                                    if (userId in cachedUserdata) {
                                        // Use cached user data if available
                                        const userData = cachedUserdata[userId];
                                        defaultMessages.push({
                                            id: server_nanoid,
                                            message,
                                            userId,
                                            sent_on,
                                            username: userData.username,
                                            profilePicture:
                                                userData.profilePicture,
                                        });
                                    } else {
                                        try {
                                            const userData =
                                                await fetchUserDataFromAuth0(
                                                    userId,
                                                    api_key
                                                );
                                            cachedUserdata[userId] = userData; // Cache the user data
                                            defaultMessages.push({
                                                id: server_nanoid,
                                                message,
                                                userId,
                                                sent_on,
                                                username: userData.username,
                                                profilePicture:
                                                    userData.profilePicture,
                                            });
                                        } catch (error) {
                                            console.error(
                                                `Error retrieving user data for userId '${userId}':`,
                                                error
                                            );
                                            defaultMessages.push({
                                                id: server_nanoid,
                                                message,
                                                userId,
                                                sent_on,
                                            });
                                        }
                                    }
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

                                        console.log(
                                            'Default messages:',
                                            defaultMessages
                                        );

                                        res.status(200).json({
                                            messages: defaultMessages.map(
                                                ({ userId, ...rest }) => rest
                                            ),
                                        });
                                    }
                                );
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

                let { user, message, server_id } = req.body;
                console.log(message);

                const now = new Date().toISOString().replace('Z', '');
                if (!user) {
                    setTimeout(() => {
                        res.status(400).end({ error: 'Missing username' });
                    }, 5000);
                    return;
                } else {
                    const fetchData = async () => {
                        try {
                            const userId = req.body.user as string;
                            console.log(userId);

                            const options = {
                                method: 'POST',
                                url: 'https://poyo.jp.auth0.com/oauth/token',
                                headers: { 'content-type': 'application/json' },
                                body: `{"client_id":"${client_id}","client_secret":"${client_secret}","audience":"https://poyo.jp.auth0.com/api/v2/","grant_type":"client_credentials"}`,
                            };

                            request(
                                options,
                                async function (error, response: any, body) {
                                    if (error) throw new Error(error);
                                    const api_key =
                                        JSON.parse(body).access_token;
                                    console.log(req.query);
                                    const userId = req.body.user as string;
                                    const fields = 'email,username,picture';
                                    const includeFields = true;
                                    const url = `${base_url}/api/v2/users/${encodeURIComponent(
                                        userId
                                    )}?fields=${encodeURIComponent(
                                        fields
                                    )}&include_fields=${encodeURIComponent(
                                        includeFields
                                    )}`;

                                    const headers = {
                                        Authorization: `Bearer ${api_key}`,
                                    };

                                    const responseData = await fetch(url, {
                                        headers,
                                    });
                                    const data = await responseData.json();
                                    console.log(data);
                                    const username = data.username;
                                    const picture = data.picture;
                                    console.log(username);
                                    if (!username || username === '') {
                                        res.status(400).send({
                                            error: 'Missing username, please go to your profile and add username',
                                        });
                                        return;
                                    }
                                    console.log('username: ', username);
                                    if (
                                        filter.isProfane(username) ||
                                        filter.isProfane(message)
                                    ) {
                                        res.status(400).send({
                                            error: 'Username or message contains inappropriate content',
                                        });
                                        return;
                                    } else {
                                        console.log(username);

                                        connection.query(
                                            'SELECT id FROM servers WHERE nanoid = ?',
                                            [server_id],
                                            (error, serverResults) => {
                                                if (error) {
                                                    console.error(
                                                        'Error retrieving server id:',
                                                        error
                                                    );
                                                    res.status(500).send(error);
                                                    return;
                                                }
                                                const serverId =
                                                    serverResults.length > 0
                                                        ? serverResults[0].id
                                                        : null;
                                                if (!serverId) {
                                                    // Server ID not found, insert it
                                                    connection.query(
                                                        'INSERT INTO servers (nanoid, server_name) VALUES (?, ?)',
                                                        [server_id, 'default'],
                                                        (error, results) => {
                                                            if (error) {
                                                                console.error(
                                                                    'Error inserting server id:',
                                                                    error
                                                                );
                                                                res.status(500).send(error);
                                                                return;
                                                            }

                                                            console.log(
                                                                `Inserted server id ${server_id} into servers table`
                                                            );

                                                            // Proceed with message insertion
                                                            insertMessage(
                                                                message,
                                                                now,
                                                                userId,
                                                                results.insertId,
                                                                username,
                                                                picture
                                                            );
                                                        }
                                                    );
                                                }
                                            }
                                        )
                                    };
                                });
                        } catch (error) {
                            console.error(error);
                            res.end(400).send(error);
                        }
                    };

                    fetchData();
                }

                function insertMessage(
                    message: string,
                    sent_on: string,
                    userId: string,
                    serverId: number,
                    username: string,
                    picture: string
                ) {
                    console.log(`Inserting message ${message} for ${userId}`);
                    connection.query(
                        `INSERT INTO messages (message, sent_on, username, server_id, userId) VALUES (?, ?, ?, ?, ?)`,
                        [message, sent_on, username, serverId, userId],
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
                                profilePicture: picture,
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
        async function fetchUserDataFromAuth0(
            userId: string,
            api_key: string
        ): Promise<{ username: string; profilePicture: string }> {
            return new Promise(async (resolve, reject) => {
                const fields = 'username,picture';
                const includeFields = true;
                const url = `${base_url}/api/v2/users/${encodeURIComponent(
                    userId
                )}?fields=${encodeURIComponent(
                    fields
                )}&include_fields=${encodeURIComponent(includeFields)}`;
                const headers = {
                    Authorization: `Bearer ${api_key}`,
                };

                try {
                    const responseData = await fetch(url, { headers });
                    const data = await responseData.json();

                    const username = data.username;
                    const profilePicture = data.picture;

                    resolve({ username, profilePicture });
                } catch (error) {
                    reject(error);
                }
            });
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send(error);
    }
};

export default chatHandler;
