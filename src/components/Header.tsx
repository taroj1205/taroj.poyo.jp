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
        <header className="absolute top-0 left-0 z-100 w-full bg-gray-950 shadow-xl transition-all duration-350 ease">
            <Announcement />
            <nav className="w-full flex items-center justify-between px-0 py-4">
                <div className="flex items-center font-medium ml-2 md:ml-0 space-x-6 flex-grow justify-center">
                    <button
                        aria-label="home"
                        onClick={() => handleLink('/')}
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaHome className="mr-2 text-xl" />
                        <span className="text-base">Home</span>
                    </button>
                    <button
                        aria-label="about"
                        onClick={() => handleLink('/about')}
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaInfoCircle className="mr-2 text-xl" />
                        <span className="text-base">About</span>
                    </button>
                    <button
                        aria-label="chat"
                        onClick={() => handleLink('/chat')}
                        className="flex items-center text-white text-lg hover:text-blue-600"
                    >
                        <FaComments className="mr-2 text-xl" />
                        <span className="text-base">Chat</span>
                    </button>
                </div>
                <div className="flex md:absolute md:right-64 items-center justify-end font-medium w-full md:w-auto">
                    <LanguageSwitch />
                    <div
                        className="ml-4 flex items-center relative"
                        ref={dropdownRef}
                    >
                        {user ? (
                            <>
                                <button
                                    aria-label="profile"
                                    className="focus:outline-none"
                                    onClick={toggleDropdown}
                                >
                                    <img
                                        className="w-8 h-8 m-1 rounded-full"
                                        src={user?.picture ?? ''}
                                        alt="Profile picture"
                                    />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute top-8 right-2 mt-2 w-48 bg-white rounded-md shadow-lg">
                                        <div className="py-1">
                                            <button
                                                aria-label="go to profile"
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() =>
                                                    handleLink('/profile')
                                                }
                                            >
                                                <FaUser className="mr-2 inline" />
                                                Profile
                                            </button>
                                            <button
                                                aria-label="logout"
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() =>
                                                    handleLink(
                                                        '/api/auth/logout'
                                                    )
                                                }
                                            >
                                                <FaSignOutAlt className="mr-2 inline" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
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
