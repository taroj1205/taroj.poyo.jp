import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';

const Settings = () => {
    const { t } = useTranslation();
    const [darkMode, setDarkMode] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const savedTheme = localStorage.theme;
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mode = e.target.value;
        localStorage.theme = mode;
        setDarkMode(mode === 'dark');
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !(dropdownRef.current as any).contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <Head>
                <title>{t('settings')}</title>
            </Head>
            <div className="container mx-auto p-4 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">{t('settings')}</h1>
                <div className="mb-4">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">
                            {t('change.profile picture')}
                        </h2>
                        <p>
                            {t('gravatar.message')}
                            <br />
                            {t('gravatar.signupMessage')}
                            <a
                                href="https://gravatar.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-2"
                            >
                                Gravatar
                                <FiExternalLink className="inline-block ml-1" />
                            </a>
                        </p>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                        {t('change.theme')}
                    </h2>
                    <div className="relative inline-flex">
                        <svg
                            className={`w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none transition-transform ${isDropdownOpen ? '' : 'rotate-180'
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 412 232"
                        >
                            <path
                                d="M0,232 l206,-232 l206,232 z"
                                fill="currentColor"
                            ></path>
                        </svg>
                        <select
                            value={darkMode ? 'dark' : 'light'}
                            onChange={handleThemeChange}
                            onClick={toggleDropdown}
                            className="rounded-full py-2 pl-4 pr-10 bg-white dark:bg-gray-800 dark:text-white text-black appearance-none"
                        >
                            <option value="dark">{t('dark')}</option>
                            <option value="light">{t('light')}</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
