// @refresh disable
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import Head from 'next/head';
import Pusher from 'pusher-js';
import { FaPaperPlane } from 'react-icons/fa';
import Header from '../components/Header';
import router, { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../components/AuthContext';
import Cookies from 'js-cookie';
import Script from 'next/script';

const Chat = ({ chatRef }: { chatRef: React.RefObject<HTMLDivElement> }) => {
    const [messages, setMessages] = useState([]);
    const [serverId, setServerId] = useState('fCw8bsQX3YnvHyCLJJUqXL95NT0U7j');
    const [roomId, setRoomId] = useState('Di9cKtg4sOgbN4mpmU9NdSm45FtrsN');
    const { token } = useAuth() || {};
    const [isLoadingState, setisLoadingState] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollPosRef = useRef<number>(0);

    useEffect(() => {
        const fetchDefaultMessages = async () => {
            try {
                console.log(token || Cookies.get('token'));
                const userToken = token || Cookies.get('token');
                if (userToken) {
                    const response = await fetch(`/api/profile?token=${encodeURIComponent(userToken)}`, {
                        method: 'GET',
                    });
                    const data = await response.json();
                    console.log(data);
                    if (data.error === 401) {
                        chatRef.current?.classList.remove('animate-pulse');
                        router.push('/auth');
                        return;
                    } else if (data.verified === 0) {
                        router.push('/verify');
                    } else {
                        console.log('Getting default messages');
                        const response = await fetch(`/api/chat/default?server_id=${encodeURIComponent(serverId)}&room_id=${encodeURIComponent(roomId)}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        const data = await response.json();
                        console.log(data);
                        if (data.status === 400) {
                            errorPopup(data.error.toString());
                            return;
                        }
                        await addMessage(data);
                        const read = localStorage.getItem('read') || '0';
                        document.getElementById(read)?.scrollIntoView();
                        chatRef.current?.classList.remove('animate-pulse');
                        document
                            .getElementById('send-button')
                            ?.removeAttribute('disabled');
                        document
                            .getElementById('input-field')
                            ?.removeAttribute('disabled');
                    }
                } else {
                    chatRef.current?.classList.remove('animate-pulse');
                    router.push('/auth');
                    return;
                }
            } catch (error: any) {
                console.error(
                    'An error occurred while fetching default messages:',
                    error
                );
            }
        };

        fetchDefaultMessages();

        console.log('useEffect running');

        const pusher = new Pusher('cd4e43e93ec6d4f424db', {
            cluster: 'ap1',
        });

        const channel = pusher.subscribe('chat');

        const messagesContainer = document.getElementById(
            'messages'
        ) as HTMLDivElement;

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
                rect.bottom >= 0 &&
                rect.top <= document.documentElement.clientHeight;

            if (containerBottomVisible) {
                const visibleElements = Array.from(
                    messagesContainer.children
                ).filter((element) => {
                    const rect = element.getBoundingClientRect();
                    return (
                        rect.bottom >= 0 &&
                        rect.top <= document.documentElement.clientHeight &&
                        rect.top >= 0 &&
                        rect.bottom <= document.documentElement.clientHeight
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
                const wrappedCode = `<code${lang === 'aa' ? ' class="textar-aa"' : ` lang="${lang}"`
                    }>${codeContent}</code>`;
                return text.replace(codeRegex, wrappedCode);
            }

            return text;
        }

        const addMessage = async (data: Array<any>) => {
            console.log('Running addMessage() ', data);
            const messagesContainer = document.getElementById(
                'messages'
            ) as HTMLDivElement;
            console.log(messagesContainer);

            for (let i = 0; i < data.length; i++) {
                console.log('Item: ', data[i]);
                await formatMessage(data[i]);
                const isAtBottom =
                    messagesContainer.scrollTop +
                    messagesContainer.clientHeight ===
                    messagesContainer.scrollHeight;
                if (isAtBottom) {
                    messagesContainer.scrollTop =
                        messagesContainer.scrollHeight;
                }
            }
        };

        interface ChatMessage {
            content: {
                body: string;
            };
            sender: {
                username: string;
                profile_picture: string;
            };
            sent_on: string;
            message_id: string;
        }

        const formatMessage = async (data: ChatMessage) => {
            try {
                const messageString = data.content.body;
                const username = data.sender.username;
                const sent_on = data.sent_on;
                const profilePicture = data.sender.profile_picture;

                const messageText = await wrapCodeInTags(messageString);

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

                if (
                    formattedMessageText &&
                    formattedMessageText.includes('\\')
                ) {
                    formattedMessageText = formattedMessageText.replace(
                        /\\/g,
                        ''
                    );
                }

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

                const messageContainer = document.createElement('div');
                messageContainer.classList.add(
                    'flex',
                    'items-start',
                    'mb-2',
                    'whitespace-nowrap',
                    'min-h-fit'
                );

                const imageElement = document.createElement('img') as HTMLImageElement;
                imageElement.setAttribute('src', profilePicture);
                imageElement.setAttribute('alt', username);
                imageElement.setAttribute('width', '50');
                imageElement.setAttribute('height', '50');
                imageElement.classList.add('w-10', 'h-10', 'rounded-full', 'ml-2', 'mr-2');

                const contentContainer = document.createElement('div');

                const usernameContainer = document.createElement('div');
                usernameContainer.classList.add('flex', 'items-center');

                const usernameSpan = document.createElement('span');
                usernameSpan.classList.add('text-sm', 'font-semibold');
                usernameSpan.textContent = `${username}`;

                const sentOnSpan = document.createElement('span');
                sentOnSpan.classList.add('ml-1', 'text-xs', 'text-gray-500');
                sentOnSpan.textContent = `${formattedSentOn}`;

                const messageTextContainer = document.createElement('div');
                messageTextContainer.classList.add('text-sm', 'mr-[1ch]');

                const messageTextSpan = document.createElement('span');
                messageTextSpan.classList.add('messageText', 'whitespace-pre-line', 'text-left');
                messageTextSpan.innerHTML = formattedMessageText;


                const messagesDiv = document.getElementById(
                    'messages'
                ) as HTMLDivElement;

                const pCountSpan = document.createElement('span');
                pCountSpan.classList.add('mr-1', 'text-xs', 'text-gray-500');
                pCountSpan.textContent = `${data.message_id}`;

                // Append elements in the correct order
                usernameContainer.appendChild(pCountSpan);
                usernameContainer.appendChild(usernameSpan);
                usernameContainer.appendChild(sentOnSpan);

                messageTextContainer.appendChild(messageTextSpan);

                contentContainer.appendChild(usernameContainer);
                contentContainer.appendChild(messageTextContainer);

                messageContainer.appendChild(imageElement);
                messageContainer.appendChild(contentContainer);

                messagesContainer.appendChild(messageContainer);
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
                let rows = input.split('\n').length;
                const mobileMediaQuery =
                    window.matchMedia('(max-width: 767px)');
                const isMobileDevice =
                    mobileMediaQuery.matches ||
                    typeof window.orientation !== 'undefined';

                if (rows > 5 && isMobileDevice) {
                    rows = 5;
                } else if (rows > 10) {
                    rows = 10;
                }

                inputRef.current.rows = rows;
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

    const errorPopup = (message: string) => {
        const popup = document.createElement('div') as HTMLDivElement;
        popup.innerText = message;
        popup.style.zIndex = '200';
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
    };

    const sendMessage = () => {
        const message = inputRef.current?.value.trim();
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        if (message && message.length < 500) {
            setisLoadingState(true); // set loading state to true
            console.log('User id', token);
            if (!token) {
                const userToken = Cookies.get('token');
                if (!userToken) {
                    errorPopup('Could not indentify you... reloading...');
                    chatRef.current?.classList.remove('animate-pulse');
                    router.push('/auth');
                    return;
                }
            }
            // Send a new message to the server
            fetch('/api/chat/new-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    server_id: serverId,
                    room_id: roomId,
                    content: message,
                }),
            })
                .then(async (response) => {
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

                        const responseJson = await response.json();
                        const message = responseJson.error;

                        errorPopup(message);
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
            if (token) {
                inputRef.current?.classList.add('shake-animation'); // add shake animation class if message is empty
                setTimeout(() => {
                    inputRef.current?.classList.remove('shake-animation'); // remove shake animation class after 0.5s
                }, 500);
                inputRef?.current?.focus();
            }
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
    const [inputContainerHeight, setInputContainerHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const checkIfMobile = () => {
            const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
            const isMobileDevice =
                mobileMediaQuery.matches ||
                typeof window.orientation !== 'undefined';
            setIsMobile(isMobileDevice);
        };

        const setVisualViewport = () => {
            const vv = window.visualViewport;
            if (vv) {
                const root = document.documentElement;
                root.style.setProperty(
                    '--vvw',
                    `${document.documentElement.clientWidth}px`
                );
                root.style.setProperty(
                    '--vvh',
                    `${document.documentElement.clientHeight}px`
                );
                setHeight(document.documentElement.clientHeight);
            }
        };
        setVisualViewport();

        checkIfMobile();

        const inputContainerHeight =
            inputRef.current?.parentElement?.offsetHeight;
        setInputContainerHeight(
            inputContainerHeight ? inputContainerHeight + 20 : 0
        );
        const headerHeight = document.querySelector('header')?.offsetHeight;
        setHeaderHeight(headerHeight || 0);

        window.addEventListener('resize', checkIfMobile);

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', setVisualViewport);
        }

        return () => {
            window.removeEventListener('resize', checkIfMobile);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener(
                    'resize',
                    setVisualViewport
                );
            }
        };
    }, []);

    const scrollToBottom = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            console.log(inputContainerHeight);
        }
    };

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let bottom = false;
        if (
            messagesRef.current?.scrollTop === messagesRef.current?.scrollHeight
        ) {
            bottom = true;
        }
        const target = event.target;
        let rows = target.value.split('\n').length;

        if (rows > 5 && isMobile) {
            rows = 5;
        } else if (rows > 10) {
            rows = 10;
        }

        target.rows = rows;

        const inputContainerHeight =
            inputRef.current?.parentElement?.offsetHeight;
        const headerHeight = document.querySelector('header')?.offsetHeight;
        setHeaderHeight(headerHeight || 0);
        setInputContainerHeight(
            inputContainerHeight ? inputContainerHeight + 20 : 0
        );

        if (bottom && messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    };

    return (
        <div
            className="flex flex-col flex-grow min-h-0 w-full max-h-full fixed top-0"
            style={{ height: height }}
        >
            <div
                id="messages"
                ref={messagesRef}
                className="overflow-y-auto overflow-x-hidden pt-16"
                style={{
                    flex: '1',
                }}
            >
                {/* Messages content */}
            </div>
            <div className="w-full" style={{ flex: '0' }}>
                <button
                    aria-label="Scroll to bottom"
                    className="whitespace-nowrap text-right bg-gray-300 dark:bg-gray-800 text-black dark:text-gray-200 rounded-tl-lg rounded-tr-lg px-2 py-1 w-full text-xs" // Modify the classes for height, font size, and background color
                    onClick={scrollToBottom}
                >
                    Scroll to Bottom{' '}
                    <span className="ml-1 animate-bounce">&#8595;</span>
                </button>

                <div id="input-container" className="flex bg-gray-900">
                    <span className="grow-wrap flex-grow">
                        <textarea
                            id="input-field"
                            ref={inputRef}
                            placeholder={`Type a message...`}
                            autoFocus
                            disabled
                            rows={1}
                            className="border-none overflow-y-auto text-black dark:text-white bg-white dark:bg-gray-900 text-base outline-none flex-grow focus:outline-0"
                            onInput={handleInput} // Add onInput event handler
                        ></textarea>
                    </span>
                    <button
                        id="send-button"
                        aria-label="send button"
                        onClick={!isLoadingState ? sendMessage : undefined}
                        disabled={isLoadingState}
                        className="w-12 bottom-0 right-0 sm:w-auto min-w-[56px] h-11 rounded-br-lg bg-green-500 cursor-pointer flex items-center justify-center"
                    >
                        {isLoadingState ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <FaPaperPlane className="text-white" />
                        )}
                    </button>
                </div>
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
    const chatRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState(0);
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
        const setVisualViewport = () => {
            const vv = window.visualViewport;
            if (vv) {
                const root = document.documentElement;
                root.style.setProperty(
                    '--vvw',
                    `${document.documentElement.clientWidth}px`
                );
                root.style.setProperty(
                    '--vvh',
                    `${document.documentElement.clientHeight}px`
                );
                setHeight(document.documentElement.clientHeight);
            }
        };
        setVisualViewport();

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', setVisualViewport);
        }

        if (chatRef.current) {
            chatRef.current.classList.add('animate-pulse');
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener(
                    'resize',
                    setVisualViewport
                );
            }
        };
    }, [router]);

    return (
        <>
            <Head>
                <link
                    rel="icon"
                    type="image/png"
                    href="/image/icon/chat/favicon.ico"
                />
                <link
                    href="/style/chat/style.css"
                    rel="stylesheet"
                    type="text/css"
                />
                <Script defer src="https://js.pusher.com/7.2/pusher.min.js" />
                <meta name='title' content='Chat - taroj.poyo.jp' />
                <meta name='description' content='Chat page for taroj.poyo.jp' />
                <meta property="og:title" content="Chat - taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="Chat page for taroj.poyo.jp"
                />
                <meta name="twitter:title" content="Chat - taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="Chat page for taroj.poyo.jp"
                />
                <title>{t('title.chat')}</title>
            </Head>
            <div>
                <div ref={chatRef} className="w-full max-h-full" style={{ height: height }}>
                    <Chat chatRef={chatRef} />
                </div>
            </div>
        </>
    );
};

export default ChatPage;
