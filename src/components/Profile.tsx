import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaCog } from 'react-icons/fa';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const Profile = () => {
    const { user, error, isLoading } = useUser();
    const { t } = useTranslation();
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);


    // Function to check if the documentElement has the class 'dark'
    const isDocumentDark = () => document.documentElement.classList.contains('dark');

    // Set the initial isDarkMode state based on the class on mount
    useEffect(() => {
        setIsDarkMode(isDocumentDark());
    }, []);

    // Listen for changes to the class attribute of the documentElement
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(isDocumentDark());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };
    const handleLink = (url: string) => {
        router.push(url);
        setIsDropdownOpen(false);
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

    const ChevronDown = ({ color }: { color: string }) => (
        <>
            <FaCog className="text-black dark:text-white" size={20} style={{ marginRight: -5 }} />
            <Svg>
                <path
                    d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
                    fill={color} // Use the color prop for the fill color
                    fillRule="evenodd" />
            </Svg></>
    );

    const Svg = (p: JSX.IntrinsicElements['svg']) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            focusable="false"
            role="presentation"
            {...p}
        />
    );

    return (
        <div className="md:ml-4 flex items-center relative" ref={dropdownRef}>
            <button
                aria-label="profile picture"
                className="focus:outline-none"
                onClick={toggleDropdown}
            >
                {user ? (
                    <img
                        className="w-8 h-8 m-1 rounded-full"
                        src={user.picture ?? ''}
                        alt="Profile picture"
                    />
                ) : (
                    <span className='dark:text-white flex items-center'>
                        {
                            isDropdownOpen ? (
                                <ChevronDown color={isDarkMode ? 'white' : 'black'} />
                            ) : (
                                <ChevronDown color="gray" />
                            )}
                    </span>
                )}
            </button>
            {isDropdownOpen && (
                <div className="absolute top-8 right-2 w-48 bg-white rounded-md shadow-lg">
                    <div className="py-1">
                        {!user && (
                            <>
                                <button
                                    aria-label="login"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => handleLink('/api/auth/login')}
                                >
                                    <FaSignInAlt className="mr-2 inline" />
                                    {t('login')}
                                </button>
                                <button
                                    aria-label="go to settings"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => handleLink('/settings')}
                                >
                                    <FaCog className="mr-2 inline" />
                                    {t('settings')}
                                </button>
                            </>
                        )}
                        {user && (
                            <>
                                <button
                                    aria-label="go to profile"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => handleLink('/profile')}
                                >
                                    <FaUser className="mr-2 inline" />
                                    {t('profile')}
                                </button>
                                <button
                                    aria-label="go to settings"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => handleLink('/settings')}
                                >
                                    <FaCog className="mr-2 inline" />
                                    {t('settings')}
                                </button>
                                <button
                                    aria-label="logout"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => handleLink('/api/auth/logout')}
                                >
                                    <FaSignOutAlt className="mr-2 inline" />
                                    {t('logout')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;