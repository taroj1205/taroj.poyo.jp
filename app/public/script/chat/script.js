"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const socket = (0, socket_io_client_1.default)();
// Request default messages from the server
socket.emit('requestDefaultMessages');
// Receive default messages from the server
socket.on('defaultMessages', (messages) => {
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
        messages.forEach((message) => {
            const p = document.createElement('p');
            p.textContent = message;
            messagesContainer.appendChild(p);
        });
    }
});
// Send a new message to the server
const sendButton = document.getElementById('send-button');
const inputField = document.getElementById('input-field');
if (sendButton && inputField) {
    sendButton.addEventListener('click', () => {
        const message = inputField.value.trim();
        if (message !== '') {
            socket.emit('sendMessage', message);
            inputField.value = '';
        }
    });
}
// Receive new messages from the server
socket.on('newMessage', (message) => {
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
        const p = document.createElement('p');
        p.textContent = message;
        messagesContainer.appendChild(p);
    }
});
