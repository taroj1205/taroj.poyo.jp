// @refresh disable
import React, {
    useEffect,
    useState,
    useRef,
    RefObject,
    ReactNode,
} from 'react';
import Head from 'next/head';
import Pusher from 'pusher-js';
import { FaPaperPlane } from 'react-icons/fa';
import { FaSun, FaMoon } from 'react-icons/fa';

interface ChatProps {
    handleSwitchClick: () => void;
    isLightTheme: boolean;
}

const Chat: React.FC<ChatProps> = ({ handleSwitchClick, isLightTheme }) => {
    const [messages, setMessages] = useState([]);
    const [serverId, setServerId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        console.log('useEffect running');

        const pusher = new Pusher('cd4e43e93ec6d4f424db', {
            cluster: 'ap1',
        });

        const channel = pusher.subscribe('chat');

        const fetchDefaultMessages = async () => {
            try {
                console.log('Getting default messages');
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
                const read = localStorage.getItem('read') || '0';
                document.getElementById(read)?.scrollIntoView();
            } catch (error) {
                console.error(
                    'An error occurred while fetching default messages:',
                    error
                );
            }
        };

        fetchDefaultMessages();

        const setVisualViewport = () => {
            const w = Math.max(
                document.documentElement.clientWidth,
                window.innerWidth || 0
            );
            const h = Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
            );
            document.documentElement.style.setProperty('--vvw', `${w}px`);
            document.documentElement.style.setProperty('--vvh', `${h}px`);

            console.log(h);

            const hamburger = document.querySelector(
                '#hamburger-menu'
            ) as HTMLDivElement;
            const sidebar = document.querySelector(
                '.sidebar'
            ) as HTMLDivElement;

            if (sidebar && w >= 720) {
                sidebar.style.display = 'flex';
            }
            if (hamburger && w <= 720) {
                hamburger.style.display = 'flex';
            }

            if (w <= 720) {
                document.body.classList.add('phone');
            } else {
                document.body.classList.remove('phone');
            }

            const scrollableHeight =
                messagesContainer.scrollHeight - messagesContainer.clientHeight;
            const isScrolledToBottom =
                Math.abs(messagesContainer.scrollTop - scrollableHeight) <= 1;

            adjustMessagesHeight(isScrolledToBottom);
        };

        setVisualViewport();
        window.visualViewport?.addEventListener('resize', setVisualViewport);

        const handleKeyDown = (event: any) => {
            console.log(event.key);
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        };

        if (inputRef.current) {
            inputRef.current.addEventListener('keydown', handleKeyDown);
        }

        const handleScroll = () => {
            if (!messagesContainer) return;

            const rect = messagesContainer.getBoundingClientRect();
            const containerBottomVisible =
                rect.bottom >= 0 && rect.top <= window.innerHeight;

            if (containerBottomVisible) {
                const visibleElements = Array.from(
                    messagesContainer.children
                ).filter((element) => {
                    const rect = element.getBoundingClientRect();
                    return (
                        rect.bottom >= 0 &&
                        rect.top <= window.innerHeight &&
                        rect.top >= 0 &&
                        rect.bottom <= window.innerHeight
                    );
                });

                if (visibleElements.length > 0) {
                    const lowestVisibleElement = visibleElements.reduce(
                        (prev, current) => {
                            const prevRect = prev.getBoundingClientRect();
                            const currentRect = current.getBoundingClientRect();
                            return currentRect.bottom > prevRect.bottom
                                ? current
                                : prev;
                        }
                    );

                    console.log(lowestVisibleElement);
                    const id = lowestVisibleElement.id;
                    console.log(id);

                    // Check if the stored ID is null or lower than the current visible element's ID
                    const storedId = parseInt(localStorage.getItem('read') || '0') as number;
                    if (storedId < parseInt(id)) {
                        localStorage.setItem('read', id);
                    }

                    // Add data-read attribute to the visible element with the ID as a number
                    messagesContainer.setAttribute('data-read', id);
                }
            }
        };

        messagesContainer.addEventListener('scroll', handleScroll);

        // Receive new messages from the server
        channel.bind('newMessage', (data: any) => {
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
            messagesContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const sendMessage = () => {
        const message = inputRef.current?.value.trim();
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        if (message && message.length < 500) {
            setIsLoading(true); // set loading state to true

            // Send a new message to the server
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method: 'newMessage',
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

                    if (inputRef.current) {
                        const inputValue = localStorage.getItem('input');
                        if (inputValue !== null) {
                            inputRef.current.value = inputValue;
                        } else {
                            inputRef.current.value = '';
                        }
                        inputRef.current.classList.add('shake-animation'); // add shake animation class
                        setTimeout(() => {
                            inputRef.current?.classList.remove(
                                'shake-animation'
                            ); // remove shake animation class after 0.5s
                        }, 500);
                    }
                });
        } else {
            inputRef.current?.classList.add('shake-animation'); // add shake animation class if message is empty
            setTimeout(() => {
                inputRef.current?.classList.remove('shake-animation'); // remove shake animation class after 0.5s
            }, 500);
        }
        inputField?.focus();
    };

    return (
        <>
            <Container>
                <Sidebar
                    handleSwitchClick={handleSwitchClick}
                    isLightTheme={isLightTheme}
                />
                <Main
                    inputRef={inputRef}
                    sendMessage={sendMessage}
                    isLoading={isLoading}
                />
                <HamburgerMenu />
            </Container>
        </>
    );
};

const Sidebar = ({
    handleSwitchClick,
    isLightTheme,
}: {
    handleSwitchClick: () => void;
    isLightTheme: boolean;
}) => (
    <div className="sidebar" style={{ display: 'none' }}>
        <h1>Channels</h1>
        <ul>
            <li>Channel 1</li>
            <li>Channel 2</li>
            <li>Channel 3</li>
        </ul>
        <div className="theme-switch" onClick={handleSwitchClick}>
            <div className={`switch-slider ${isLightTheme ? 'on' : ''}`}>
                {isLightTheme ? (
                    <FaSun className="slider-icon" />
                ) : (
                    <FaMoon className="slider-icon" />
                )}
            </div>
        </div>
    </div>
);

interface MainProps {
    inputRef: RefObject<HTMLTextAreaElement>;
    sendMessage: () => void;
    isLoading: boolean;
}

const Main: React.FC<MainProps> = ({ inputRef, sendMessage, isLoading }) => {
    return (
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
    );
};

const HamburgerMenu = () => (
    <div id="hamburger-menu" style={{ display: 'none' }}>
        &#9776;
    </div>
);

interface ContainerProps {
    children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return <div className="container">{children}</div>;
};

const ChatPage = () => {
    const [isLightTheme, setIsLightTheme] = useState(false);

    const handleSwitchClick = () => {
        setIsLightTheme((prevIsLightTheme) => !prevIsLightTheme);
        document.body.classList.toggle('light');
    };

    useEffect(() => {
        // Add or remove 'light' class to the body based on isLightTheme state
        document.body.classList.toggle('light', isLightTheme);
    }, [isLightTheme]);

    return (
        <>
            <Head>
                <title>Chat</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link
                    rel="icon"
                    type="image/png"
                    href="/image/icon/favicon.ico"
                />
                <link
                    href="/style/chat/style.css"
                    rel="stylesheet"
                    type="text/css"
                />
                <script
                    type="text/javascript"
                    defer
                    src="/script/chat/script.js"
                ></script>
                <script defer src="https://js.pusher.com/7.2/pusher.min.js" />
            </Head>
            <Chat
                handleSwitchClick={handleSwitchClick}
                isLightTheme={isLightTheme}
            />
        </>
    );
};

export default ChatPage;
