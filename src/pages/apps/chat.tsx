// @refresh disable
import React, {ReactNode, useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import Pusher from 'pusher-js';
import {FaPaperPlane} from 'react-icons/fa';
import router from 'next/router';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../../components/AuthContext';
import Script from 'next/script';
import i18n from '../../../i18n';
import {AiFillDelete} from 'react-icons/ai';
import {v4 as uuidv4} from 'uuid'

interface ChatMessage {
    content: string;
    sender: {
        username: string;
        avatar: string;
    };
    uuid: string;
    sent_on: string;
    message_id: string;
    deleted_at: null | string;
}

interface ChatPreviewMessage {
    content: string;
    sender: {
        username: string;
        avatar: string;
    };
    uuid: string;
}

const Chat = ({chatRef, setRoomName, setServerName}: {
    chatRef: React.RefObject<HTMLDivElement>,
    setRoomName: React.Dispatch<React.SetStateAction<string>>,
    setServerName: React.Dispatch<React.SetStateAction<string>>
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageLoading, setMessageLoading] = useState(true);
    const [serverId, setServerId] = useState('');
    const [roomId, setRoomId] = useState('');
    const {token, user, isLoading} = useAuth() || {};
    const [sendingMessage, setSendingMessage] = useState<ChatPreviewMessage[]>([]);
    const [bottomScroll, setBottomScroll] = useState(false);
    const [messageData, setMessageData] = useState<any>({});

    const {t} = useTranslation();

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollPosRef = useRef<number>(0);

    useEffect(() => {
        if (isLoading === false) {
            if (!token || !user) {
                router.push('/auth/login');
                return;
            }
        }
    }, [isLoading]);

    useEffect(() => {
        const fetchDefaultMessages = async () => {
            try {
                console.log('Getting default messages');
                const response = await fetch(`/api/chat/default`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log(data);
                console.log(data.messages[0].server.id, data.messages[0].server.name);
                if (data.error === 401) {
                    router.push('/auth');
                    return;
                } else if (data.verified === 0) {
                    router.push('/verify');
                    return;
                } else {
                    setMessageData(data);
                    console.log(data.messages[0].server.id, data.messages[0].server.name);
                    setServerId(data.messages[0].server.id);
                    setServerName(data.messages[0].server.name);
                    const currentLocale = router.locale === 'ja' ? '日本語' : 'English';

                    console.log(currentLocale);

                    const matchingRoom = data.messages[0].server.room.find((room: any) => room.name === currentLocale);
                    console.log(matchingRoom);

                    if (matchingRoom) {
                        console.log(matchingRoom.id);
                        console.log(matchingRoom.name);
                        console.log(matchingRoom.messages);
                        setRoomId(matchingRoom.id);
                        setRoomName(matchingRoom.name);
                        setMessages(matchingRoom.messages);
                    } else {
                        // Handle the case where the current [locale] doesn't match any room
                        console.error('No matching room found for the current [locale].');
                    }
                    console.log("Data:", data, data.messages, roomId, serverId);
                    if (data.status === 400) {
                        errorPopup(data.error.toString());
                        return;
                    }
                    const read = localStorage.getItem('read') || '0';
                    const readElement = document.getElementById(read) as HTMLDivElement;
                    readElement?.scrollTo({
                        top: readElement.scrollHeight,
                        behavior: 'smooth',
                    });

                    chatRef.current?.classList.remove('animate-pulse');

                    document
                        .getElementById('send-button')
                        ?.removeAttribute('disabled');
                    document
                        .getElementById('input-field')
                        ?.removeAttribute('disabled');

                    setMessageLoading(false);
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
    }, []);

    useEffect(() => {
        if (Object.keys(messageData).length > 0) {
            const lang = i18n.language;
            console.log(lang);

            const currentLocale = lang === 'ja' ? '日本語' : 'English';

            console.log(currentLocale);
            console.log(messageData);

            const matchingRoom = messageData.messages[0].server.room.find((room: any) => room.name === currentLocale);
            console.log(matchingRoom);

            if (matchingRoom) {
                console.log(matchingRoom.id);
                console.log(matchingRoom.name);
                console.log(matchingRoom.messages);
                setRoomId(matchingRoom.id);
                setRoomName(matchingRoom.name);
                setMessages(matchingRoom.messages);
            } else {
                // Handle the case where the current [locale] doesn't match any room
                console.error('No matching room found for the current [locale].');
            }
        }
    }, [i18n.language])

    useEffect(() => {
        if (!token || token.length < 0 || !user || messages.toString() === '') return;

        const pusher = new Pusher('cd4e43e93ec6d4f424db', {
            cluster: 'ap1',
        });

        const channel = pusher.subscribe(`${serverId},${roomId}`);
        console.log(channel);

        // Receive new messages from the server
        channel.bind(`newMessage`, (data: any) => {
            console.log('Received new message: ', data);
            const chatContainer = document.getElementById('messages') as HTMLDivElement;

            console.log("currently saved sending messages:", sendingMessage);
            console.log(messages[0], data.message_id);
            // delete the item with data.message_id = sendingMessage.message_id
            setSendingMessage((prevSendingMessage) =>
                prevSendingMessage.filter((message) => message.uuid.toString() !== data.uuid.toString())
            );

            setMessages((prevMessages) => [...prevMessages, ...[data]]);

            console.log("currently saved sending messages:", sendingMessage);
        });

        console.log('script loaded!');

        return () => {
            pusher.unsubscribe(`${serverId}${roomId}`);
        };
    }, [roomId, i18n.language]);

    useEffect(() => {
        const messagesContainer = document.getElementById(
            'messages'
        ) as HTMLDivElement;


        const handleScroll = () => {
            if (!messagesContainer) return;

            setBottomScroll(messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight);

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

                    // console.log(lowestVisibleElement);
                    const id = lowestVisibleElement.id;
                    scrollPosRef.current = parseInt(id);
                    // console.log(id);

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

        return () => {
            messagesContainer.removeEventListener('scroll', handleScroll);
            if (inputRef.current) {
                inputRef.current.removeEventListener('keydown', handleKeyDown);
            }
        }
    })

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

        const uuid = uuidv4();

        if (user && message && message.length > 0) {
            // const formatSentOn = (sent_on: string, lang: string) => {
            //     const format = lang === 'ja' ? 'ja-JP' : 'en-NZ';
            //     const options: Intl.DateTimeFormatOptions = {
            //         year: 'numeric',
            //         month: 'long',
            //         day: 'numeric',
            //         hour: 'numeric',
            //         minute: 'numeric',
            //         second: 'numeric',
            //         hour12: false,
            //     };

            //     const formatter = new Intl.DateTimeFormat(format, options);
            //     const formattedSentOn = formatter
            //         .format(new Date(sent_on))
            //         .replace(',', '.');

            //     return formattedSentOn;
            // }

            console.log(messages);

            setSendingMessage((prevSendingMessage) => [
                ...prevSendingMessage,
                {
                    content: message,
                    uuid,
                    sender: {
                        username: user.user_metadata.username,
                        avatar: user.user_metadata.avatar
                    },
                }
            ]);

            console.log(sendingMessage);
        }

        if (message && message.length < 500) {
            console.log('User id:', token);
            if (!token) {
                errorPopup(t('apps.chat.login'));
                chatRef.current?.classList.remove('animate-pulse');
                router.push('/auth');
                return;
            }
            // Send a new message to the server
            fetch('/api/chat/new-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    server_id: serverId,
                    room_id: roomId,
                    content: message,
                    uuid,
                }),
            })
                .then(async (response) => {
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
                    messageLoading={messageLoading}
                    bottomScroll={bottomScroll}
                    messages={messages}
                    sendingMessage={sendingMessage}
                />
            </Container>
        </>
    );
};

interface MainProps {
    inputRef: React.RefObject<HTMLTextAreaElement>;
    sendMessage: () => void;
    messageLoading: boolean;
    bottomScroll: boolean;
    messages: Array<ChatMessage>;
    sendingMessage: Array<ChatPreviewMessage>;
}

const Main: React.FC<MainProps> = ({
                                       inputRef,
                                       sendMessage,
                                       messageLoading,
                                       bottomScroll,
                                       messages,
                                       sendingMessage,
                                   }) => {
    const [isMobile, setIsMobile] = useState(false);
    const messagesRef = useRef<HTMLDivElement>(null);
    const [inputContainerHeight, setInputContainerHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [height, setHeight] = useState(0);
    const {t} = useTranslation();

    useEffect(() => {
        const checkIfMobile = () => {
            const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
            const isMobileDevice =
                mobileMediaQuery.matches ||
                typeof window.orientation !== 'undefined';
            setIsMobile(isMobileDevice);
        };

        const setVisualViewport = () => {
            const vv = document.documentElement;
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

        if (document.documentElement) {
            document.documentElement.addEventListener('resize', setVisualViewport);
        }

        return () => {
            window.removeEventListener('resize', checkIfMobile);
            if (document.documentElement) {
                document.documentElement.removeEventListener(
                    'resize',
                    setVisualViewport
                );
            }
        };
    }, []);

    const scrollToBottom = () => {
        const chatContainer = document.getElementById(
            'messages'
        ) as HTMLDivElement;

        chatContainer?.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth',
        });
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
            className="flex flex-col min-h-0 w-full max-h-full"
        >
            <MessagesComponent messages={messages} messageLoading={messageLoading} height={height}
                               sendingMessage={sendingMessage} bottomScroll={bottomScroll}/>
            <div className="w-full" style={{flex: '0'}}>
                <button
                    aria-label={t('apps.chat.scroll-to-bottom')}
                    className="whitespace-nowrap text-right bg-gray-300 dark:bg-gray-800 text-black dark:text-gray-200 rounded-tl-lg rounded-tr-lg px-2 py-1 w-full text-xs" // Modify the classes for height, font size, and background color
                    onClick={scrollToBottom}
                >
                    {t('apps.chat.scroll-to-bottom')}{' '}
                    <span className="ml-1 animate-bounce">&#8595;</span>
                </button>

                <div id="input-container" className="flex bg-gray-900">
                    <span className="grow-wrap flex-grow">
                        <textarea
                            id="input-field"
                            ref={inputRef}
                            placeholder={t('apps.chat.type a message')}
                            autoFocus
                            disabled
                            rows={1}
                            className="border-none overflow-y-auto text-black dark:text-white bg-white dark:bg-gray-900 text-base outline-none flex-grow focus:outline-0"
                            onInput={handleInput}
                        ></textarea>
                    </span>
                    <button
                        id="send-button"
                        aria-label={t('apps.chat.send')}
                        onClick={!messageLoading ? sendMessage : undefined}
                        disabled={messageLoading}
                        className="w-12 bottom-0 right-0 sm:w-auto min-w-[56px] h-11 rounded-br-lg bg-green-500 cursor-pointer flex items-center justify-center"
                    >
                        {messageLoading ? (
                            <div
                                className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <FaPaperPlane className="text-white"/>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MessagesComponent: React.FC<{
    messages: ChatMessage[],
    messageLoading: boolean,
    height: number,
    sendingMessage: ChatPreviewMessage[],
    bottomScroll: boolean
}> = ({messages, messageLoading, height, sendingMessage, bottomScroll}) => {
    const [formattedMessages, setFormattedMessages] = useState<string[]>([]);
    const [formattedSendingMessages, setFormattedSendingMessages] = useState<string[]>([]);

    const {t} = useTranslation();

    useEffect(() => {
        const formatMessages = async (messagesArray: ChatPreviewMessage[]) => {
            const formattedArray: string[] = [];

            for (const message of messagesArray) {
                const formattedMessageHTML = await formatMessageBody(message.content);
                formattedArray.push(formattedMessageHTML);
            }

            return formattedArray;
        };

        console.log(messages);
        console.log(sendingMessage);

        if (messages.length > 0) {
            formatMessages(messages).then(formattedArray => {
                setFormattedMessages(formattedArray);
            });
            messages.forEach(message => {
                const img = new Image();
                img.src = message.sender.avatar;
            });
        }

        if (sendingMessage.length > 0) {
            formatMessages(sendingMessage).then(formattedArray => {
                setFormattedSendingMessages(formattedArray);
            });
            sendingMessage.forEach(message => {
                const img = new Image();
                img.src = message.sender.avatar;
            });
        }
    }, [messages, sendingMessage]);

    const formatMessageBody = async (messageString: string): Promise<string> => {
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

        const messageText = messageString !== undefined ? await wrapCodeInTags(messageString) : '';

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
        return formattedMessageText as string;
    }

    const formatSentOn = (sent_on: string, lang: string) => {
        const format = lang === 'ja' ? 'ja-JP' : 'en-NZ';
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

        return formattedSentOn;
    }
    let deletedMessageCount = 0 as number;

    useEffect(() => {
        if (bottomScroll) {
            const chatContainer = document.getElementById(
                'messages'
            );
            chatContainer?.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth',
            });
        }
    })

    return (
        <div
            id="messages"
            className={`overflow-y-auto overflow-x-hidden ${messageLoading ? 'animate-pulse' : ''}`}
            style={{
                flex: '1',
            }}
        >
            {messageLoading ? (
                <PlaceholderMessages count={20} height={height}/>
            ) : (
                <>
                    {messages.map((message, index) => {
                        if (formattedMessages[index] !== undefined && message.deleted_at === null) {
                            deletedMessageCount = 0;
                            return (
                                <div
                                    className={`flex mb-2 whitespace-nowrap min-h-fit ${index === 0 ? 'mt-2' : ''}`}
                                    key={index}
                                >
                                    <img
                                        src={message.sender.avatar}
                                        alt={message.sender.username}
                                        width="50"
                                        height="50"
                                        className="w-10 h-10 rounded-full ml-2 mr-2"
                                    />
                                    <div>
                                        <div className="flex items-center">
                                            <span className="mr-1 text-xs text-gray-500">
                                                {message.message_id}
                                            </span>
                                            <span className="text-sm font-semibold">
                                                {message.sender.username}
                                            </span>
                                            <span className="ml-1 text-xs text-gray-500">
                                                {i18n.language === 'ja' ? (
                                                    <span className="ml-1 text-xs text-gray-500">
                                                        {formatSentOn(message.sent_on, 'ja')}
                                                    </span>
                                                ) : (
                                                    <span className="ml-1 text-xs text-gray-500">
                                                        {formatSentOn(message.sent_on, 'en')}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-sm mr-[1ch]">
                                            <span
                                                className="messageText whitespace-pre-line text-left"
                                                id={message.message_id}
                                                dangerouslySetInnerHTML={{
                                                    __html: formattedMessages[index],
                                                }}
                                            ></span>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else if (message.deleted_at !== null) {
                            deletedMessageCount++;
                            console.log(message.deleted_at);
                            const nextMessage = messages[index + 1];
                            const isNextMessageDeleted = nextMessage && nextMessage.deleted_at;
                            if (isNextMessageDeleted) return;
                            return (
                                <div
                                    className={`flex mb-2 whitespace-nowrap min-h-fit ${index === 0 ? 'mt-2' : ''}`}
                                    key={index}
                                >
                                    <AiFillDelete
                                        className="w-10 h-10 text-white rounded-full ml-2 mr-2 bg-slate-400 dark:bg-slate-600"/>
                                    <div>
                                        <div className="flex items-center">
                                            <div className="text-sm mr-[1ch]">
                                                <span
                                                    className="messageText whitespace-pre-line text-left"
                                                    id={message.message_id}
                                                >
                                                    <span
                                                        className="messageText whitespace-pre-line text-left text-red-500"
                                                        id={message.message_id}
                                                    >{t('apps.chat.deleted')}{deletedMessageCount > 1 && ` x${deletedMessageCount}`}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                    {sendingMessage.map((message, index) => {
                        if (formattedSendingMessages[index] !== undefined) {
                            return (
                                <div
                                    className={`flex opacity-50 mb-2 whitespace-nowrap min-h-fit ${index === 0 ? 'mt-2' : ''}`}
                                    key={index}
                                >
                                    <img
                                        src={message.sender.avatar}
                                        alt={message.sender.username}
                                        width="50"
                                        height="50"
                                        className="w-10 h-10 rounded-full ml-2 mr-2"
                                    />
                                    <div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold">
                                                {message.sender.username}
                                            </span>
                                            {/* <span className="ml-1 text-xs text-gray-500">
                                                    {i18n.language === 'ja' ? (
                                                        <span className="ml-1 text-xs text-gray-500">
                                                            {formatSentOn(message.sent_on, 'ja')}
                                                        </span>
                                                    ) : (
                                                        <span className="ml-1 text-xs text-gray-500">
                                                            {formatSentOn(message.sent_on, 'en')}
                                                        </span>
                                                    )}
                                                </span> */}
                                        </div>
                                        <div className="text-sm mr-[1ch]">
                                            <span
                                                className="messageText whitespace-pre-line text-left"
                                                dangerouslySetInnerHTML={{
                                                    __html: formattedSendingMessages[index],
                                                }}
                                            ></span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </>
            )
            }
        </div>
    )
}

const PlaceholderMessages: React.FC<{ count: number, height: number }> = ({count, height}) => {
    const placeholders = Array.from({length: count}, (_, index) => (
        <div className="flex mb-2 whitespace-nowrap min-h-fit bg-white dark:bg-gray-800 shadow rounded-lg p-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full ml-2 mr-2"></div>
            <div className="flex-grow">
                <div className="flex items-center mb-1">
                    <span
                        className="mr-1 text-xs text-gray-500 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    <span
                        className="text-sm font-semibold bg-gray-300 dark:bg-gray-600 rounded-full w-16 h-4 ml-2"></span>
                    <span
                        className="ml-1 text-xs text-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-12 h-4"></span>
                </div>
                <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded-md"></div>
                <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded-md mt-1"></div>
                <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded-md mt-1"></div>
            </div>
        </div>
    ));
    return (
        <div className="flex flex-col items-left justify-center z-0" style={{height}} key={count}>
            {placeholders}
        </div>
    );
};

interface ContainerProps {
    children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({children}) => {
    const [height, setHeight] = useState('calc(100vh-40px)');

    useEffect(() => {
        const setVisualViewport = () => {
            const vv = document.documentElement;
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
                setHeight(`${document.documentElement.clientHeight - 40}px`);
            }
        };
        setVisualViewport();

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', setVisualViewport);
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
    return <div className="flex box-border m-0" style={{height}}>{children}</div>;
};

const ChatPage = () => {
    const chatRef = useRef<HTMLDivElement | null>(null);
    const [roomName, setRoomName] = useState('');
    const [serverName, setServerName] = useState('');
    const {t} = useTranslation();

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.classList.add('animate-pulse');
        }
    }, []);

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
                <Script defer src="https://js.pusher.com/7.2/pusher.min.js"/>
                <meta name='title' content='Chat - taroj.poyo.jp'/>
                <meta name='description' content='Chat page for taroj.poyo.jp'/>
                <meta property="og:title" content="Chat - taroj.poyo.jp"/>
                <meta
                    property="og:description"
                    content="Chat page for taroj.poyo.jp"
                />
                <meta name="twitter:title" content="Chat - taroj.poyo.jp"/>
                <meta
                    name="twitter:description"
                    content="Chat page for taroj.poyo.jp"
                />
                <title>
                    {`${t('title.chat')} ${serverName ? `- ${serverName}` : ''} ${roomName ? `- ${roomName}` : ''}`}
                </title>
            </Head>
            <div>
                <div ref={chatRef} className="w-full max-h-full">
                    <Chat chatRef={chatRef} setRoomName={setRoomName} setServerName={setServerName}/>
                </div>
            </div>
        </>
    );
};

export default ChatPage;
