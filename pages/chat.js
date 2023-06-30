import { useEffect } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';

const Chat = () => {
    useEffect(() => {
        const socket = io("/api/chat");

        // Request default messages from the server
        socket.emit('requestDefaultMessages');

        // Receive default messages from the server
        socket.on('defaultMessages', (messages) => {
            messages.forEach((message) => {
                addMessage(message);
            });
            const messagesContainer = document.getElementById('messages');
            const savedScrollPos = localStorage.getItem('scrollPos');
            const savedMessage = document.getElementById(savedScrollPos);
            if (savedMessage) {
                savedMessage.scrollIntoView();
            }
        });

        // Send a new message to the server
        const sendButton = document.getElementById('send-button');
        const inputField = document.getElementById('input-field');

        if (sendButton && inputField) {
            function sendMessage() {
                const message = inputField.value.trim();

                if (message !== '') {
                    socket.emit('sendMessage', message);
                    inputField.value = '';
                    localStorage.removeItem("input");
                }
            }

            sendButton.addEventListener('click', sendMessage);
            inputField.addEventListener('keydown', (event) => {
                if (!event.shiftKey && event.key === 'Enter') {
                    // Submit the message
                    event.preventDefault();
                    sendMessage();
                }
            });
        }

        // Receive new messages from the server
        socket.on('newMessage', (message) => {
            showNotification('New message', message.message);
            addMessage(message);
        });

        // Clean up socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="container">
            <div className="sidebar" style={{ display: 'none' }}>
                <h1>Channels</h1>
                <ul>
                    <li>Channel 1</li>
                    <li>Channel 2</li>
                    <li>Channel 3</li>
                </ul>
            </div>
            <div className="main">
                <div id="messages"></div>
                <div className="input-container">
                    <textarea id="input-field" placeholder="Type a message..." autoFocus></textarea>
                    <button id="send-button">Send</button>
                </div>
            </div>
            <div id="hamburger-menu" style={{ display: 'none' }}>&#9776;</div>
        </div>
    );
};

const ChatPage = () => (
    <>
        <Head>
            <link rel="icon" type="image/png" href="/image/icon/favicon.ico" />
            <script type='text/javascript' defer src="/script/chat/script.js"></script>
        </Head>
        <Chat />
    </>
);

export default ChatPage;