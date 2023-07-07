import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaHome, FaInfoCircle, FaComments } from 'react-icons/fa';
import LanguageSwitch from '../components/LanguageSwitch';

const Header = () => {
    const { user, error, isLoading } = useUser();
    return (
        <header className="sticky top-0 left-0 z-100 w-full bg-gray-950 shadow-xl transition-all duration-350 ease">
            <nav className="w-full flex items-center justify-between px-0 py-4">
                <div className="flex items-center font-medium space-x-6 flex-grow justify-center">
                    <a
                        href="/"
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaHome className="mr-2 text-xl" />
                        <span className="text-base">Home</span>
                    </a>
                    <a
                        href="/about"
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaInfoCircle className="mr-2 text-xl" />
                        <span className="text-base">About</span>
                    </a>
                    <a
                        href="/chat"
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaComments className="mr-2 text-xl" />
                        <span className="text-base">Chat</span>
                    </a>
                </div>
                <div className="flex absolute right-64 items-center justify-end font-medium">
                    <LanguageSwitch />
                    <div className="ml-4">
                        {user ? (
                            <a
                                className="text-white hover:shadow-md hover:bg-blue-600 transition duration-300 ease-in-out py-2 px-3 rounded-lg menu-block text-base"
                                href="/api/auth/logout"
                            >
                                Log out
                            </a>
                        ) : (
                            <a
                                className="text-white hover:shadow-md hover:bg-blue-600 transition duration-300 ease-in-out py-2 px-3 rounded-lg menu-block text-base"
                                href="/api/auth/login"
                            >
                                Log in
                            </a>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
