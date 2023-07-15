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

const Chat = () => {
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
                <p id="1" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    1{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    12 July 2023 at 21:51:29
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="2" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    2{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 24:03:08
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hello
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="3" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    3{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 24:04:42
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="4" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    4{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 24:06:05
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="5" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    5{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 24:22:10
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    <a
                                        href="https://embed.rauf.wtf/Testing+Embed?&amp;author=JetBrains%20Embed&amp;color=18F900&amp;image=https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png"
                                        target="_blank"
                                    >
                                        https://embed.rauf.wtf/Testing+Embed?&amp;author=JetBrains%20Embed&amp;color=18F900&amp;image=https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="6" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    6{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 24:23:08
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    <a
                                        href="https://embed.rauf.wtf/Testing+Embed?&amp;author=JetBrains%20Embed&amp;color=18F900&amp;image=https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png"
                                        target="_blank"
                                    >
                                        https://embed.rauf.wtf/Testing+Embed?&amp;author=JetBrains%20Embed&amp;color=18F900&amp;image=https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png
                                    </a>{' '}
                                    <a
                                        href="https://embed.rauf.wtf/Testing+Embed?&amp;author=JetBrains%20Embed&amp;color=18F900&amp;image=https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png"
                                        target="_blank"
                                    >
                                        https://embed.rauf.wtf/Testing+Embed?&amp;author=JetBrains%20Embed&amp;color=18F900&amp;image=https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="7" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    7{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 24:52:56
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="8" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/7832f98c10c1982ca4ea595c88a5034b?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
                            alt="hi"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    8 <span className="font-semibold">hi</span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 01:07:55
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hewwo
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="9" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/7832f98c10c1982ca4ea595c88a5034b?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
                            alt="hi"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    9 <span className="font-semibold">hi</span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 01:09:13
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hihihihihihihihi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="10" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/7832f98c10c1982ca4ea595c88a5034b?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
                            alt="hi"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    10 <span className="font-semibold">hi</span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 01:10:16
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    awdwaioda
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="11" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/7832f98c10c1982ca4ea595c88a5034b?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
                            alt="hi"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    11 <span className="font-semibold">hi</span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 01:10:38
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    owo
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="12" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/7832f98c10c1982ca4ea595c88a5034b?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
                            alt="hi"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    12 <span className="font-semibold">hi</span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 01:10:53
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    afddfwefqw
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="13" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/50b5b9bfde7b62bff9547ad5f6e301ab?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
                            alt="stmlex001"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    13{' '}
                                    <span className="font-semibold">
                                        stmlex001
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 10:06:12
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="14" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/50b5b9bfde7b62bff9547ad5f6e301ab?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
                            alt="stmlex001"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    14{' '}
                                    <span className="font-semibold">
                                        stmlex001
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 10:10:07
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    testing
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="15" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/b0e2814a622845f1e0418853939e30ce?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fde.png"
                            alt="test123"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    15{' '}
                                    <span className="font-semibold">
                                        test123
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 10:11:03
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    testing
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="16" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    16{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 10:25:08
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="17" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/50b5b9bfde7b62bff9547ad5f6e301ab?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
                            alt="stmlex001"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    17{' '}
                                    <span className="font-semibold">
                                        stmlex001
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 10:25:11
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    yo
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="18" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/50b5b9bfde7b62bff9547ad5f6e301ab?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
                            alt="stmlex001"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    18{' '}
                                    <span className="font-semibold">
                                        stmlex001
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 10:26:14
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
                <p id="19" data-server="WzB5nAz5Q_LTzv7YOZmyZrka6sCyS2">
                    <div className="flex items-start mb-2 whitespace-nowrap min-h-fit">
                        <img
                            src="https://s.gravatar.com/avatar/230680dc8cd0bb55cc4c1e9bbabcb296?s=480&amp;r=pg&amp;d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png"
                            alt="taroj1205"
                            className="w-8 h-8 rounded-full m-0 mr-2"
                        />
                        <div>
                            <div className="flex items-center">
                                <span className="text-sm">
                                    19{' '}
                                    <span className="font-semibold">
                                        taroj1205
                                    </span>
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                    13 July 2023 at 10:30:22
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="messageText whitespace-pre-line text-left max-w-[90%]">
                                    hi
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
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

const ChatDesign = () => {
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
                    <Chat />
                </main>
            </div>
        </>
    );
};

export default ChatDesign;
