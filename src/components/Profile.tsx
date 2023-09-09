import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useAuth, AuthContextValue } from '../components/AuthContext';

const Profile = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    const { user } = useAuth() as AuthContextValue;

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
        setIsOverlayVisible(true);
    };

    const handleOverlayClick = () => {
        setIsDropdownOpen(false);
        setIsOverlayVisible(false);
    };


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

    const handleLink = (url: string) => {
        router.push(url);
        handleOverlayClick();
    };

    const ChevronDown = ({ color }: { color: string }) => (
        <span className='text-gray-700 dark:text-white flex items-center'>
            {user?.user_metadata.avatar ? (
                <img
                    className="w-8 h-8 rounded-full"
                    src={user?.user_metadata.avatar ?? ''}
                    alt="Profile picture"
                />
            ) : (
                <FaCog className="text-black dark:text-white" size={20} style={{ marginRight: -2 }} />
            )}
            <Svg className='flex items-center'>
                <path
                    d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
                    fill={color} // Use the color prop for the fill color
                    fillRule="evenodd" />
            </Svg></span>
    );

    const Svg = (p: JSX.IntrinsicElements['svg']) => (
        <svg
            width="32"
            height="32"
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
                {
                    isDropdownOpen ? (
                        <ChevronDown color={isDarkMode ? 'white' : 'black'} />
                    ) : (
                        <ChevronDown color="gray" />
                    )}
            </button>
            {isOverlayVisible && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={handleOverlayClick}
                />
            )}
            {isDropdownOpen && (
                <div className="absolute top-8 z-[11] right-2 mt-1 w-min-48 w-fit bg-white dark:bg-slate-800 rounded-md shadow-lg">
                    <div className="py-1">
                        {user && user?.user_metadata.avatar && (
                            <>
                                <button
                                    aria-label="go to profile"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-900"
                                    onClick={() => handleLink('/profile')}
                                >
                                    <FaUser className="mr-2 inline" />
                                    {t('profile')} - {user?.user_metadata.username}
                                </button>
                                <button
                                    aria-label="go to settings"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-900"
                                    onClick={() => handleLink('/settings')}
                                >
                                    <FaCog className="mr-2 inline" />
                                    {t('settings')}
                                </button>
                                <button
                                    aria-label="logout"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-900"
                                    onClick={() => handleLink('/auth/logout')}
                                >
                                    <FaSignOutAlt className="mr-2 inline" />
                                    {t('logout')}
                                </button>
                            </>
                        )}
                        {!user?.user_metadata.avatar && (
                            <>
                                <button
                                    aria-label="login"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-900"
                                    onClick={() => handleLink('/auth/login')}
                                >
                                    <FaSignInAlt className="mr-2 inline" />
                                    {t('login')}
                                </button>
                                <button
                                    aria-label="go to settings"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-900"
                                    onClick={() => handleLink('/settings')}
                                >
                                    <FaCog className="mr-2 inline" />
                                    {t('settings')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )
            }
        </div>
    );
};

export default Profile;
