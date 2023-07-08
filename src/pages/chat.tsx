// @refresh disable
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import Head from 'next/head';
import Pusher from 'pusher-js';
import { FaPaperPlane } from 'react-icons/fa';
import ChatHeader from '../components/ChatHeader';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

interface ChatProps {
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
}

const Chat = ({ userId, setUserId }: ChatProps) => {
    const [messages, setMessages] = useState([]);
    const [serverId, setServerId] = useState('');
    const [isLoadingState, setisLoadingState] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollPosRef = useRef<number>(0);

    useEffect(() => {
        console.log('useEffect running');

        const pusher = new Pusher('cd4e43e93ec6d4f424db', {
            cluster: 'ap1',
        });

        const channel = pusher.subscribe('chat');

        const messagesContainer = document.getElementById(
            'messages'
        ) as HTMLDivElement;

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
                const mainElement = document.querySelector('main');
                mainElement?.classList.remove('animate-pulse');
            } catch (error) {
                console.error(
                    'An error occurred while fetching default messages:',
                    error
                );
            }
        };

        fetchDefaultMessages();

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
                    scrollPosRef.current = parseInt(id);
                    console.log(id);

                    // Check if the stored ID is null or lower than the current visible element's ID
                    const storedId = parseInt(
                        localStorage.getItem('read') || '0'
                    ) as number;
                    if (storedId < parseInt(id)) {
                        localStorage.setItem('read', id);
                    }

                    // Add data-read attribute to the visible element with the ID as a number
                    messagesContainer.setAttribute('data-read', id);
                }
            }
        };

        messagesContainer.addEventListener('scroll', handleScroll);

        const deleteMessage = (messageId: number) => {
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method: 'deleteMessage',
                    message_id: messageId,
                    server_id: 'WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2',
                }),
            })
                .then((response) => {
                    console.log(response); // log the response
                    const messageElement = document.getElementById(
                        messageId.toString()
                    );
                    if (messageElement) {
                        messageElement.remove();
                    }
                })
                .catch((error) => {
                    console.error('Error deleting message:', error);
                });
        };

        // Receive new messages from the server
        channel.bind('newMessage', (data: any) => {
            console.log('Received new message: ', data);

            addMessage(data);
        });

        async function wrapCodeInTags(text: string): Promise<string> {
            const codeRegex = /```(\w*)([\s\S]*?)```/;
            const match = text.match(codeRegex);

            if (match) {
                const lang = match[1];
                const codeContent = match[2];
                const wrappedCode = `<code${
                    lang === 'aa' ? ' class="textar-aa"' : ` lang="${lang}"`
                }>${codeContent}</code>`;
                return text.replace(codeRegex, wrappedCode);
            }

            return text;
        }

        const addMessage = async (message: any) => {
            console.log('Running addMessage() ', message);
            const messagesContainer = document.getElementById(
                'messages'
            ) as HTMLDivElement;
            console.log(messagesContainer);

            if (Array.isArray(message)) {
                for (const item of message) {
                    console.log('Item: ', item);
                    await formatMessage(item);
                    const isAtBottom =
                        messagesContainer.scrollTop +
                            messagesContainer.clientHeight ===
                        messagesContainer.scrollHeight;
                    if (isAtBottom) {
                        messagesContainer.scrollTop =
                            messagesContainer.scrollHeight;
                    }
                }
            } else {
                console.log('Item: ', message);
                await formatMessage(message);
            }
        };

        const formatMessage = async (message: any) => {
            try {
                console.log('Formatting: ', message);

                const messageString = message.message;
                const username = message.username;
                const sent_on = message.sent_on;

                const messageText = await wrapCodeInTags(messageString);

                console.log(messageText);

                const format = navigator.language === 'ja' ? 'ja-JP' : 'en-NZ';
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: false,
                };

                const formatter = new Intl.DateTimeFormat(format, options);
                const formattedSentOn = formatter
                    .format(new Date(sent_on))
                    .replace(',', '.');

                let formattedMessageText = messageText.replace(
                    /((?:>>\d+)|(?:https?:\/\/[^\s]+))/g,
                    (match: any) => {
                        if (match.startsWith('>>')) {
                            return `<a href="#${match.slice(
                                2
                            )}" class="jump">${match}</a>`;
                        } else {
                            return `<a href="${match}" target="_blank">${match}</a>`;
                        }
                    }
                );

                const messagesContainer = document.getElementById(
                    'messages'
                ) as HTMLDivElement;
                const pCount =
                    messagesContainer.getElementsByTagName('p').length + 1;

                if (
                    formattedMessageText &&
                    formattedMessageText.includes('\\')
                ) {
                    formattedMessageText = formattedMessageText.replace(
                        /\\/g,
                        ''
                    );
                }

                const formattedHtml = `${pCount} ${username}: ${formattedSentOn}<br /><span class="messageText max-w-[90%]">${formattedMessageText}</span>`;

                const p = document.createElement('p') as HTMLParagraphElement;

                p.innerHTML = formattedHtml;

                p.id = pCount.toString();
                p.dataset.server = message.id;

                console.log(p);

                messagesContainer.appendChild(p);
            } catch (error) {
                console.error('Error formatting message:', error);
            }
        };

        inputRef.current?.addEventListener('input', () => {
            localStorage.setItem('input', inputRef.current?.value || '');
        });

        const input = localStorage.getItem('input');
        if (inputRef.current) {
            inputRef.current.rows = 1;
            if (input) {
                inputRef.current.value = input;
            }
        }

        console.log('script loaded!');

        // Clean up Pusher subscription on component unmount
        return () => {
            pusher.unsubscribe('chat');
            if (inputRef.current) {
                inputRef.current.removeEventListener('keydown', handleKeyDown);
            }
            messagesContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const sendMessage = () => {
        const message = inputRef.current?.value.trim();
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        if (message && message.length < 500) {
            setisLoadingState(true); // set loading state to true
            console.log('User id', userId);
            // Send a new message to the server
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method: 'newMessage',
                    user_id: userId,
                    message,
                    server_id: 'WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2',
                }),
            })
                .then((response) => {
                    setisLoadingState(false); // set loading state to false
                    console.log(response); // log the response

                    if (response.status !== 200) {
                        const inputValue = localStorage.getItem('input');
                        if (inputRef.current) {
                            if (inputValue !== null) {
                                inputRef.current.value = inputValue;
                            }
                        }

                        const rootContainer =
                            document.getElementById('messages');

                        if (rootContainer) {
                            rootContainer.classList.add('shake-animation'); // add shake animation class to the root container
                            setTimeout(() => {
                                rootContainer?.classList.remove(
                                    'shake-animation'
                                ); // remove shake animation class after 0.5s
                            }, 500);
                        }

                        const popup = document.createElement('div');
                        popup.innerText =
                            'Please login or sign up to send message';
                        popup.classList.add(
                            'popup',
                            'fixed',
                            'top-0',
                            'left-0',
                            'bg-red-500',
                            'text-white',
                            'text-center',
                            'p-4',
                            'rounded-md'
                        );
                        document.body.appendChild(popup);

                        setTimeout(() => {
                            document.body.removeChild(popup);
                        }, 3000);
                    } else {
                        localStorage.removeItem('input');
                    }
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                    setisLoadingState(false); // set loading state to false

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
        inputRef?.current?.focus();
    };

    return (
        <>
            <Container>
                <Main
                    inputRef={inputRef}
                    sendMessage={sendMessage}
                    isLoadingState={isLoadingState}
                    scrollPosRef={scrollPosRef}
                />
            </Container>
        </>
    );
};

interface MainProps {
    inputRef: React.RefObject<HTMLTextAreaElement>;
    sendMessage: () => void;
    isLoadingState: boolean;
    scrollPosRef: React.RefObject<number>;
}

const Main: React.FC<MainProps> = ({
    inputRef,
    sendMessage,
    isLoadingState,
    scrollPosRef,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
            const isMobileDevice =
                mobileMediaQuery.matches ||
                typeof window.orientation !== 'undefined';
            setIsMobile(isMobileDevice);
        };

        checkIfMobile();

        window.addEventListener('resize', checkIfMobile);
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    useEffect(
        () => {
            scrollToBottom();
        },
        [
            /* any dependencies that may affect the number of <p> in #messages */
        ]
    );

    const scrollToBottom = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    };

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = event.target;
        let rows = target.value.split('\n').length;
        if (rows > 5 && isMobile) {
            rows = 5;
        } else if (rows > 10) {
            rows = 10;
        }
        target.rows = rows;
    };

    return (
        <div className="flex flex-col pt-20 flex-grow h-screen max-h-full">
            <div
                id="messages"
                ref={messagesRef}
                className="overflow-y-auto overflow-x-hidden flex-grow pb-0 sm:pb-3 md:pb-30 whitespace-pre-wrap"
            >
                {/* Messages content */}
            </div>
            <button
                className="relative whitespace-nowrap text-right bg-gray-800 text-gray-200 rounded-tl-lg rounded-tr-lg px-2 py-1 w-full mt-1 text-xs" // Modify the classes for height, font size, and background color
                onClick={scrollToBottom}
            >
                Scroll to Bottom{' '}
                <span className="ml-1 animate-bounce">&#8595;</span>
            </button>

            <div id="input-container" className="flex relative bg-gray-900">
                <span className="grow-wrap flex-grow">
                    <textarea
                        id="input-field"
                        ref={inputRef}
                        placeholder="Type a message..."
                        autoFocus
                        disabled
                        className="border-none overflow-y-auto text-white bg-gray-900 text-base outline-none flex-grow focus:outline-0"
                        onInput={handleInput} // Add onInput event handler
                    ></textarea>
                </span>
                <div className="w-12 h-11 min-w-[56px]"></div>
                <button
                    id="send-button"
                    onClick={sendMessage}
                    disabled={isLoadingState}
                    className="w-12 bottom-0 right-0 absolute sm:w-auto min-w-[56px] h-11 rounded-br-lg bg-green-500 cursor-pointer flex items-center justify-center"
                >
                    {isLoadingState ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    ) : (
                        <FaPaperPlane className="text-white" />
                    )}
                </button>
            </div>
        </div>
    );
};

interface ContainerProps {
    children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return <div className="flex box-border m-0">{children}</div>;
};

const ChatPage = () => {
    const [userId, setUserId] = useState('');

    const { user, error, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (error) return;
        if (!user) {
            router.push('/api/auth/login');
        } else {
            const id = user.sub ?? '';
            setUserId(id);
            document.getElementById('send-button')?.removeAttribute('disabled');
            document
                .getElementById('input-field')
                ?.removeAttribute('disabled');
        }
    }, [user, isLoading, error, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

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
                {/*<script
                    type="text/javascript"
                    defer
                    src="/script/chat/script.js"
                ></script>*/}
                <script defer src="https://js.pusher.com/7.2/pusher.min.js" />
            </Head>
            <ChatHeader />
            <div className="flex flex-col max-h-full w-full max-w-full">
                <main className="animate-pulse">
                    <Chat userId={userId} setUserId={setUserId} />
                </main>
            </div>
        </>
    );
};

export default ChatPage;
