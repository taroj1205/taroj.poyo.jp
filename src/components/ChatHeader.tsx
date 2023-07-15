import React from 'react';
import { FaHome } from 'react-icons/fa';
import LanguageSwitch from '../components/LanguageSwitch';
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
        <header className="z-100 w-full shadow-xl transition-all duration-350 ease" style={{flex: '0'}}>
            {/* Announcement section */}
            <Announcement />

            {/* Navigation */}
            <nav className="w-full flex items-center bg-gray-950 justify-between p-0">
                <div className="flex ml-2 items-center font-medium space-x-2 flex-grow justify-center">
                    <button
                        aria-label="go to home"
                        onClick={() => handleLink('/')}
                        className="flex items-center text-white hover:text-blue-600"
                    >
                        <FaHome className="text-xl mx-auto" />
                        <span className="ml-1 text-sm whitespace-nowrap">
                            {t('header.home')}
                        </span>
                    </button>
                </div>
                {/* User Profile and Logout */}
                <div className="flex items-center justify-end font-medium w-full md:w-auto">
                    <LanguageSwitch />
                    <Profile />
                </div>
            </nav>
        </header>
    );
};

export default ChatHeader;
