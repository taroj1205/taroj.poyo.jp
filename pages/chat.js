import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Pusher from 'pusher-js';
import { FaPaperPlane } from 'react-icons/fa';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [serverId, setServerId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleKeyDown = (event) => {
        console.log(event.key);
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };
    
    const inputRef = useRef(null);

    useEffect(() => {
        console.log('useEffect running');

        const pusher = new Pusher('cd4e43e93ec6d4f424db', {
            cluster: 'ap1',
            encrypted: true,
        });

        const channel = pusher.subscribe('chat');

        const fetchDefaultMessages = async () => {
            try {
                /*
                const askServerId = () => {
                    const input = prompt('Please enter the server ID:');
                    if (input) {
                        setServerId(input);
                    } else {
                        askServerId();
                    }
                };

                if (serverId !== '') {
                    fetchDefaultMessages();
                } else {
                    askServerId();
                }
                */
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method: 'defaultMessages',
                        server_id: 'WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2',
                    }),
                });
                const data = await response.json();
                console.log(data);
                setMessages(data.messages);
                await addMessage(data.messages);
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

        const setVisualViewport = () => {
            const vv = window.visualViewport;
            const root = document.documentElement;
            if (vv) {
                root.style.setProperty('--vvw', `${vv.width}px`);
                root.style.setProperty('--vvh', `${vv.height}px`);
            }

            const hamburger = document.querySelector('#hamburger-menu');
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && window.innerWidth >= 720) {
                sidebar.style.display = 'block';
            }
            if (hamburger && window.innerWidth <= 720) {
                hamburger.style.display = 'block';
            }
            adjustMessagesHeight();
        };

        setVisualViewport();
        window.visualViewport?.addEventListener('resize', setVisualViewport);

        if (inputRef.current) {
            inputRef.current.addEventListener('keydown', handleKeyDown);
        }

        // Receive new messages from the server
        channel.bind('newMessage', (data) => {
            console.log('Received new message: ', data);

            showNotification('New message', data.message);
            addMessage(data);
        });

        console.log('script loaded!');

        // Clean up Pusher subscription on component unmount
        return () => {
            pusher.unsubscribe('chat');
            if (inputRef.current) {
                inputRef.current.removeEventListener('keydown', handleKeyDown);
            }
            window.visualViewport?.removeEventListener(
                'resize',
                setVisualViewport
            );
        };
    }, []);

    const sendMessage = () => {
        const inputField = document.getElementById('input-field');
        const message = inputField.value.trim();
        inputField.value = '';

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
                    server_id: 'WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2',
                }),
            })
                .then((response) => {
                    setIsLoading(false); // set loading state to false
                    console.log(response); // log the response
                    
                    localStorage.removeItem('input');
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                    setIsLoading(false); // set loading state to false

                    inputField.value = localStorage.getItem('input');
                });
        }
        inputField.focus();
    };

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
                <div id="input-container">
                    <textarea
                        id="input-field"
                        ref={inputRef}
                        placeholder="Type a message..."
                        autoFocus
                    ></textarea>
                    <button
                        id="send-button"
                        onClick={sendMessage}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="loading-circle"></div>
                        ) : (
                            <FaPaperPlane />
                        )}
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
            <Script src="https://js.pusher.com/7.2/pusher.min.js" />
        </Head>
        <Chat />
    </>
);

export default ChatPage;
