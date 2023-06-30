import { Server, Socket } from 'socket.io';
import { NextApiHandler } from 'next';
import path from 'path';
import sqlite3 from 'sqlite3';

const chatHandler: NextApiHandler = async (req, res) => {
    console.log(req);
    if (req.method === 'GET') {
        const rootDir = process.cwd();
        const dbPath = path.join(rootDir, 'data', 'database.db');

        const db = new sqlite3.Database(dbPath);

        const io = new Server();

        io.on('connection', (socket: Socket) => {
            socket.join('chat');

            socket.on('requestDefaultMessages', () => {
                db.all(
                    `SELECT messages.id, messages.message, users.username, messages.sent_on
                    FROM messages
                    JOIN users ON messages.user_id = users.id`,
                    (err, rows: { id: number; message: string; username: string; sent_on: string }[]) => {
                        if (err) {
                            console.error('Error retrieving default messages:', err);
                            return;
                        }

                        const defaultMessages = rows.map((row: { id: number; message: string; username: string; sent_on: string }) => ({
                            id: row.id,
                            message: row.message,
                            username: row.username,
                            sent_on: row.sent_on,
                        }));

                        socket.emit('defaultMessages', defaultMessages);
                    }
                );
            });

            socket.on('sendMessage', (message: string, userId: string) => {
                const now = new Date().toISOString();
                if (!userId) {
                    userId = '1';
                }
                db.run(
                    `INSERT INTO messages (message, sent_on, user_id)
                    VALUES (?, ?, ?)`,
                    [message, now, userId],
                    function (err) {
                        if (err) {
                            console.error('Error inserting message:', err);
                            return;
                        }

                        const id = this.lastID;
                        db.get(
                            `SELECT username FROM users WHERE id = ?`,
                            [userId],
                            (err, row: any) => {
                                if (err) {
                                    console.error('Error retrieving username:', err);
                                    return;
                                }

                                const username = row ? row.username : null;
                                io.to('chat').emit('newMessage', {
                                    id,
                                    message,
                                    sent_on: now,
                                    userId,
                                    username,
                                });
                            }
                        );
                    }
                );
            });
        });

        io.listen(3000);

        res.status(200).end();
    } else {
        res.status(404).end();
    }
};

export default chatHandler;
