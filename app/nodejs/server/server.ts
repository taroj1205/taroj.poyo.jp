import fs from 'fs';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';
import sqlite3 from 'sqlite3';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const dbPath = path.join(dataDir, 'database.db');

// Create the data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

app.use(express.static('public'));

app.get('/chat', (req, res) => {
    res.sendFile(path.join(rootDir, 'public', 'html', 'chat', 'index.html'));
});

io.on('connection', (socket: Socket) => {
    socket.join('chat');

    const db = new sqlite3.Database(dbPath);

    // Create the messages table if it doesn't exist
    db.run(
        `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT
    )`,
        (err) => {
            if (err) {
                console.error('Error creating messages table:', err);
                return;
            }
        }
    );

    socket.on('requestDefaultMessages', () => {
        db.all('SELECT message FROM messages', (err, rows) => {
            if (err) {
                console.error('Error retrieving default messages:', err);
                return;
            }

            const defaultMessages = rows.map((row: any) => row.message);
            socket.emit('defaultMessages', defaultMessages);
        });
    });

    socket.on('sendMessage', (message: string) => {
        db.run('INSERT INTO messages (message) VALUES (?)', [message], (err) => {
            if (err) {
                console.error('Error inserting message:', err);
                return;
            }

            io.to('chat').emit('newMessage', message);
        });
    });

    socket.on('disconnect', () => {
        db.close();
    });
});

server.listen(3000, () => {
    // Create the database file if it doesn't exist
    if (!fs.existsSync(dbPath)) {
        const db = new sqlite3.Database(dbPath);
        db.close();
    }

    console.log('Server is running on http://localhost:3000');
});
