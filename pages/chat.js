import { useEffect, useState } from 'react';
import Head from 'next/head';
import Pusher from 'pusher-js';

const Chat = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("useEffect running");
        const pusher = new Pusher("cd4e43e93ec6d4f424db", {
            cluster: 'ap1',
            encrypted: true,
        });

        const channel = pusher.subscribe('chat');

        const fetchDefaultMessages = async () => {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method: 'defaultMessages',
                        server_id: 1,
                    }),
                });
                const data = await response.json();
                console.log(data);
                setMessages(data.messages);
                await addMessage(data);
                const savedScrollPos = localStorage.getItem('scrollPos');
                const savedMessage = document.getElementById(savedScrollPos);
                if (savedMessage) {
                    savedMessage.scrollIntoView();
                }
            } catch (error) {
                console.error(
                    'An error occurred while fetching default messages:',
                    error
                );
            }
        };

        fetchDefaultMessages();

        // Receive new messages from the server
        channel.bind('newMessage', (data) => {
            console.log("Received new message: ", data);


            showNotification('New message', data.message);
            addMessage(data);
        });

        // Clean up Pusher subscription on component unmount
        return () => {
            console.log("Unmount pusher");
            pusher.unsubscribe('chat');
        };
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = () => {
        const inputField = document.getElementById('input-field');
        const message = inputField.value.trim();

        if (message !== '') {
            setIsLoading(true); // set loading state to true

            // Send a new message to the server
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method: 'newMessages',
                    message,
                    server_id: 1,
                }),
            })
                .then((response) => {
                    setIsLoading(false); // set loading state to false
                    console.log(response); // log the response
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                    setIsLoading(false); // set loading state to false
                });

            inputField.value = '';
            localStorage.removeItem('input');
        }
    };

    console.log('script loaded!');

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
                <div id="messages">
                    {messages &&
                        messages.map((message) => (
                            <div key={message.id}>{message.message}</div>
                        ))}
                </div>
                <div className="input-container">
                    <textarea
                        id="input-field"
                        placeholder="Type a message..."
                        autoFocus
                    ></textarea>
                    <button id="send-button" onClick={sendMessage} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
            <div id="hamburger-menu" style={{ display: 'none' }}>
                &#9776;
            </div>
        </div>
    );
};

const ChatPage = () => (
    <>
        <Head>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <link rel="icon" type="image/png" href="/image/icon/favicon.ico" />
            <script
                type="text/javascript"
                defer
                src="/script/chat/script.js"
            ></script>
            <script src="https://js.pusher.com/7.2/pusher.min.js"></script>
        </Head>
        <Chat />
    </>
);

export default ChatPage;
