import React, { useRef, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
    FaHome,
    FaInfoCircle,
    FaComments,
    FaSignOutAlt,
    FaUser,
} from 'react-icons/fa';
import LanguageSwitch from './LanguageSwitch';
import Announcement from './Announcement';
import Profile from './Profile';
import { useRouter } from 'next/router';

const Header = () => {
    const { user, error, isLoading } = useUser();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        const timeout = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 2000);

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(timeout);
        };
    }, []);

    const handleLink = (url: string) => {
        router.push(url);
        setIsDropdownOpen(false);
    };
    return (
        <header className="sticky top-0 left-0 z-100 w-full bg-white dark:bg-gray-950 shadow-xl transition-all duration-350 ease">
            <Announcement />
            <nav className="w-full flex items-center justify-between px-0 py-4">
                <div className="flex items-center font-medium text-black dark:text-white ml-2 md:ml-0 space-x-6 flex-grow justify-center">
                    <button
                        aria-label="home"
                        onClick={() => handleLink('/')}
                        className="flex items-center text-lg hover:text-blue-600"
                    >
                        <FaHome className="mr-2 text-xl" />
                        <span className="text-base">Home</span>
                    </button>
                    <button
                        aria-label="about"
                        onClick={() => handleLink('/about')}
                        className="flex items-center text-lg hover:text-blue-600"
                    >
                        <FaInfoCircle className="mr-2 text-xl" />
                        <span className="text-base">About</span>
                    </button>
                    <button
                        aria-label="chat"
                        onClick={() => handleLink('/chat')}
                        className="flex items-center text-lg hover:text-blue-600"
                    >
                        <FaComments className="mr-2 text-xl" />
                        <span className="text-base">Chat</span>
                    </button>
                </div>
                <div className="flex xl:absolute right-1 xl:right-64 items-center justify-end font-medium w-full md:w-auto">
                    <LanguageSwitch />
                    <div
                        className="flex items-center relative"
                        ref={dropdownRef}
                    >
                        {user ? (
                            <Profile />
                        ) : (
                            <button
                                aria-label="login"
                                className="text-white hover:shadow-md hover:bg-blue-600 transition duration-300 ease-in-out py-2 px-3 rounded-lg menu-block text-base"
                                onClick={() => handleLink('/api/auth/login')}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
