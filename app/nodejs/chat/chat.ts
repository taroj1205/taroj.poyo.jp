import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

const rootDir = process.cwd();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

export async function handleChatRequest(req: Request, res: Response) {
    console.log('Received request for /chat');
    console.log(req.method, req.url, req.body);

    if (req.method === 'GET' && req.url === '/chat') {
        console.log('Sending HTML');
        res.sendFile(path.join(rootDir, 'public', 'html', 'chat', 'index.html'));
    } else {
        res.status(404).send('Not Found');
    }
}

export default server;