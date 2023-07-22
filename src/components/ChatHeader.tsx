import React from 'react';
import { FaHome } from 'react-icons/fa';
import LanguageSwitch from './LanguageSwitch';
import Announcement from './Announcement';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Profile from './Profile';

const ChatHeader = () => {
    const router = useRouter();

    const { t } = useTranslation();

    const handleLink = (url: string) => {
        router.push(url);
    };

    return (
        <header className="z-100 w-full transition-all duration-350 ease" style={{ flex: '0' }}>
            {/* Announcement section */}
            <Announcement />
            {/* Navigation */}
            <nav className="w-full flex items-center justify-between px-0 py-2 bg-white dark:bg-gray-950">
                <div className="flex xl:absolute left-1 xl:left-64 items-center justify-start font-medium w-full md:w-auto">
                    {/* Move the LanguageSwitch to the left side */}
                    <div className="flex items-center ml-2 xl:ml-0 relative">
                        <LanguageSwitch />
                    </div>
                </div>
                <div className="flex ml-2 items-center font-medium text-black dark:text-white space-x-2 flex-grow justify-center">
                    <button
                        aria-label="go to home"
                        onClick={() => handleLink('/')}
                        className="flex items-center hover:text-blue-600"
                    >
                        <FaHome className="text-xl mx-auto" />
                        <span className="ml-1 text-sm whitespace-nowrap">
                            {t('header.home')}
                        </span>
                    </button>
                </div>
                {/* User Profile and Logout */}
                <div className="flex xl:absolute items-center right-1 xl:right-64 justify-end font-medium w-full md:w-auto">
                    <Profile />
                </div>
            </nav>
        </header>
    );
};

export default ChatHeader;
