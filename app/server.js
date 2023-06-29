"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const rootDir = process.cwd();
const dataDir = path_1.default.join(rootDir, 'data');
const dbPath = path_1.default.join(dataDir, 'database.db');
// Create the data directory if it doesn't exist
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir);
}
// Create the database file if it doesn't exist
if (!fs_1.default.existsSync(dbPath)) {
    const db = new sqlite3_1.default.Database(dbPath);
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        current_date DATE DEFAULT (datetime('now','localtime'))
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
            if (err) {
                console.error('Error retrieving user count:', err);
                return;
            }
            if (row.count === 0) {
                db.run(`INSERT INTO users (username) VALUES (?)`, ['Anonymous'], (err) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        return;
                    }
                });
            }
        });
    });
}
const db = new sqlite3_1.default.Database(dbPath);
app.use(express_1.default.static('public'));
app.get('/', (req, res) => {
    res.redirect('/chat');
});
app.get('/chat', (req, res) => {
    res.sendFile(path_1.default.join(rootDir, 'public', 'html', 'chat', 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(rootDir, 'public', 'html', 'login', 'index.html'));
});
io.on('connection', (socket) => {
    socket.join('chat');
    // Create the messages table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        user_id INTEGER DEFAULT "1",
        sent_on DATE DEFAULT (datetime('now','localtime'))
    )`, (err) => {
        if (err) {
            console.error('Error creating messages table:', err);
            return;
        }
    });
    socket.on('requestDefaultMessages', () => {
        db.all('SELECT messages.id, messages.message, users.username, messages.sent_on FROM messages JOIN users ON messages.user_id = users.id', (err, rows) => {
            if (err) {
                console.error('Error retrieving default messages:', err);
                return;
            }
            const defaultMessages = rows.map((row) => ({
                id: row.id,
                message: row.message,
                username: row.username,
                sent_on: row.sent_on
            }));
            socket.emit('defaultMessages', defaultMessages);
        });
    });
    socket.on('sendMessage', (message, userId) => {
        const now = new Date().toISOString();
        if (!userId) {
            userId = '1';
        }
        db.run(`INSERT INTO messages (message, sent_on, user_id)
        VALUES (?, ?, ?)`, [message, now, userId], function (err) {
            if (err) {
                console.error('Error inserting message:', err);
                return;
            }
            const id = this.lastID;
            db.get(`SELECT username FROM users WHERE id = ?`, [userId], (err, row) => {
                if (err) {
                    console.error('Error retrieving username:', err);
                    return;
                }
                const username = row ? row.username : null;
                io.to('chat').emit('newMessage', { id, message, sent_on: now, userId, username });
            });
        });
    });
});
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
            process.exit(1);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
