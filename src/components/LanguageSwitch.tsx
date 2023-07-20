import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';
import { ImEarth } from 'react-icons/im';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const LanguageSwitch = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLanguage, setHoveredLanguage] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('');

    const switchRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const router = useRouter();

    const handleLanguageChange = (language: string) => {
        console.log(language, currentLanguage);
        const currentPath = router.asPath;
        const newPath = currentPath.replace(
            `/${language}/`,
            `/${currentLanguage}/`
        );
        router.push(newPath, newPath, { locale: language });

        if (language !== currentLanguage) {
            i18n.changeLanguage(language);
            setCurrentLanguage(language);
            Cookies.set('defaultLanguage', language); // Update the cookie with the new language
        }
        setIsOpen(false);
    };

    const handleClicks = (event: MouseEvent) => {
        if (
            switchRef.current &&
            !switchRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const lang = router.locale as string;
        console.log(lang);
        handleLanguageChange(lang);

        document.addEventListener('mousedown', handleClicks);

        return () => {
            document.removeEventListener('mousedown', handleClicks);

            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="language-switch switch z-10 relative" ref={switchRef}>
            <button
                aria-label="lang switch button"
                className="switch m-1 text-black dark:text-gray-300 focus:outline-none flex items-center justify-center"
                onClick={() => {
                    setIsOpen((prevIsOpen) => !prevIsOpen);
                    if (!isOpen && currentLanguage === '') {
                        setHoveredLanguage(i18n.language);
                        setCurrentLanguage(i18n.language);
                    } else {
                        setHoveredLanguage(currentLanguage);
                    }
                }}
            >
                {isOpen ? (
                    <ImEarth size={20} />
                ) : (
                    <FiGlobe size={20} />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-gray-700 ring-opacity-50 transition-all duration-300">
                    <div className="py-1">
                        <button
                            aria-label="switch to english"
                            className={`w-full flex items-center justify-between px-4 py-2 ${hoveredLanguage === 'en'
                                ? 'bg-blue-500 text-white hover:bg-blue-400'
                                : 'text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                                }`}
                            onClick={() => handleLanguageChange('en')}
                        >
                            <span>A</span>
                            {hoveredLanguage === 'en' && (
                                <span className="text-xs bg-blue-200 rounded-full px-2 py-1 hover:bg-blue-200">
                                    <span
                                        className={
                                            hoveredLanguage === 'en'
                                                ? 'text-blue-800 hover:text-blue-700'
                                                : 'text-gray-800'
                                        }
                                    >
                                        Active
                                    </span>
                                </span>
                            )}
                        </button>
                        <button
                            aria-label="switch to japanese"
                            className={`w-full flex items-center justify-between px-4 py-2 ${hoveredLanguage === 'ja'
                                ? 'bg-blue-500 text-white hover:bg-blue-400'
                                : 'text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                                }`}
                            onClick={() => handleLanguageChange('ja')}
                        >
                            <span>あ</span>
                            {hoveredLanguage === 'ja' && (
                                <span className="text-xs bg-blue-200 rounded-full px-2 py-1 hover:bg-blue-200">
                                    <span
                                        className={
                                            hoveredLanguage === 'ja'
                                                ? 'text-blue-800 hover:text-blue-700'
                                                : 'text-gray-800'
                                        }
                                    >
                                        Active
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitch;
