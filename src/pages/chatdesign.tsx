// @refresh disable
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import Head from 'next/head';
import Pusher from 'pusher-js';
import { FaPaperPlane } from 'react-icons/fa';
import ChatHeader from '../components/ChatHeader';
import { useRouter } from 'next/router';

interface ChatProps {
    userId: string;
}

const Chat = ({ userId }: ChatProps) => {
    const [messages, setMessages] = useState([]);
    const [serverId, setServerId] = useState('');
    const [isLoadingState, setisLoadingState] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollPosRef = useRef<number>(0);

    return (
        <>
            <Container>
                <Main
                    inputRef={inputRef}
                    isLoadingState={isLoadingState}
                    scrollPosRef={scrollPosRef}
                />
            </Container>
        </>
    );
};

interface MainProps {
    inputRef: React.RefObject<HTMLTextAreaElement>;
    isLoadingState: boolean;
    scrollPosRef: React.RefObject<number>;
}

const Main: React.FC<MainProps> = ({
    inputRef,
    isLoadingState,
    scrollPosRef,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const messagesRef = useRef<HTMLDivElement>(null);
    const [inputContainerHeight, setInputContainerHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const checkIfMobile = () => {
            const mobileMediaQuery = window.matchMedia('(max-width: 767px)');
            const isMobileDevice =
                mobileMediaQuery.matches ||
                typeof window.orientation !== 'undefined';
            setIsMobile(isMobileDevice);
        };

        checkIfMobile();

        const inputContainerHeight =
            inputRef.current?.parentElement?.offsetHeight;
        setInputContainerHeight(
            inputContainerHeight ? inputContainerHeight + 20 : 0
        );
        const headerHeight = document.querySelector('header')?.offsetHeight;
        setHeaderHeight(headerHeight || 0);

        window.addEventListener('resize', checkIfMobile);
        return () => {
            window.removeEventListener('resize', checkIfMobile);
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
        <div className="relative flex flex-col flex-grow h-screen max-h-full">
            <ChatHeader />
            <div
                id="messages"
                ref={messagesRef}
                className="overflow-y-auto overflow-x-hidden"
                style={{
                    marginTop: `${headerHeight}px`,
                    marginBottom: `${inputContainerHeight}px`,
                }}
            >
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>{' '}
                <p id="20" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    20{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 12:33:44
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    note to myself: wrap input container with a
                                    div and set a fixed height with position
                                    relative
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
            </div>
            <div className="fixed bottom-0 w-full">
                <button
                    aria-label="Scroll to bottom"
                    className="relative whitespace-nowrap text-right bg-gray-800 text-gray-200 rounded-tl-lg rounded-tr-lg px-2 py-1 w-full text-xs" // Modify the classes for height, font size, and background color
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
                            rows={1}
                            className="border-none overflow-y-auto text-white bg-gray-900 text-base outline-none flex-grow focus:outline-0"
                            onInput={handleInput} // Add onInput event handler
                        ></textarea>
                    </span>
                    <div className="w-12 h-11 min-w-[56px]"></div>
                    <button
                        id="send-button"
                        aria-label="send button"
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
    const [userData, setUserData] = useState('');

    const router = useRouter();

    return (
        <>
            <Head>
                <title>Chat</title>
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
                {/*<script
                    type="text/javascript"
                    defer
                    src="/script/chat/script.js"
                ></script>*/}
                <script defer src="https://js.pusher.com/7.2/pusher.min.js" />
                <meta property="og:title" content="taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="A website for Shintaro Jokagi"
                />
                <meta
                    property="og:image"
                    content="https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/thumbnail.png"
                />
                <meta
                    property="og:image:alt"
                    content="Shintaro Jokagi Website Thumbnail"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="A website for Shintaro Jokagi"
                />
                <meta
                    name="twitter:image"
                    content="https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/thumbnail.png"
                />
                <meta
                    name="twitter:image:alt"
                    content="Shintaro Jokagi Website Thumbnail"
                />
                <meta name="twitter:site" content="@taroj1205" />
                <meta name="twitter:creator" content="@taroj1205" />
                <title>Chat</title>
            </Head>
            <div className="flex flex-col max-h-full w-full h-full max-w-full">
                <main>
                    <Chat userId={userId} />
                </main>
            </div>
        </>
    );
};

export default ChatPage;
