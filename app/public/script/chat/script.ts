import io from 'socket.io-client';

const socket = io();

// Request default messages from the server
socket.emit('requestDefaultMessages');

// Receive default messages from the server
socket.on('defaultMessages', (messages: string[]) => {
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
const sendButton = document.getElementById('send-button') as HTMLButtonElement;
const inputField = document.getElementById('input-field') as HTMLInputElement;

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
socket.on('newMessage', (message: string) => {
    const messagesContainer = document.querySelector('.messages');

    if (messagesContainer) {
        const p = document.createElement('p');
        p.textContent = message;
        messagesContainer.appendChild(p);
    }
});
