"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatRequest = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const rootDir = process.cwd();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use(express_1.default.json());
function handleChatRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Received request for /chat');
        console.log(req.method, req.url, req.body);
        if (req.method === 'GET' && req.url === '/chat') {
            console.log('Sending HTML');
            res.sendFile(path_1.default.join(rootDir, 'public', 'html', 'chat', 'index.html'));
        }
        else {
            res.status(404).send('Not Found');
        }
    });
}
exports.handleChatRequest = handleChatRequest;
exports.default = server;
