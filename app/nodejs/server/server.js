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
app.use(express_1.default.static('public'));
app.get('/chat', (req, res) => {
    res.sendFile(path_1.default.join(rootDir, 'public', 'html', 'chat', 'index.html'));
});
io.on('connection', (socket) => {
    socket.join('chat');
    const db = new sqlite3_1.default.Database(dbPath);
    // Create the messages table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating messages table:', err);
            return;
        }
    });
    socket.on('requestDefaultMessages', () => {
        db.all('SELECT message FROM messages', (err, rows) => {
            if (err) {
                console.error('Error retrieving default messages:', err);
                return;
            }
            const defaultMessages = rows.map((row) => row.message);
            socket.emit('defaultMessages', defaultMessages);
        });
    });
    socket.on('sendMessage', (message) => {
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
    if (!fs_1.default.existsSync(dbPath)) {
        const db = new sqlite3_1.default.Database(dbPath);
        db.close();
    }
    console.log('Server is running on http://localhost:3000');
});
