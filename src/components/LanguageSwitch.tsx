import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';
import { ImEarth } from 'react-icons/im';

const LanguageSwitch = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLanguage, setHoveredLanguage] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('');

    const switchRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleLanguageChange = (language: string) => {
        if (language !== currentLanguage) {
            i18n.changeLanguage(language);
            setCurrentLanguage(language);
        }
        setIsOpen(false);
    };

    /*const handleHover = (language: string) => {
        setHoveredLanguage(language);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        i18n.changeLanguage(language);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            setHoveredLanguage('');
            i18n.changeLanguage(currentLanguage);
        }, 500);
    };*/

    const handleClicks = (event: MouseEvent) => {
        if (
            switchRef.current &&
            !switchRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
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
                className="switch m-1 focus:outline-none flex items-center justify-center"
                /*onMouseEnter={() => handleHover(i18n.language)}
                onMouseLeave={handleMouseLeave}*/
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
                    <ImEarth className="text-gray-300" size={20} />
                ) : (
                    <FiGlobe className="text-gray-300" size={20} />
                )}
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-gray-800 ring-1 ring-gray-700 ring-opacity-50 transition-all duration-300"
                    /*onMouseEnter={() => handleHover(i18n.language)}
                    onMouseLeave={handleMouseLeave}*/
                >
                    <div className="py-1">
                        <button
                            className={` w-full flex items-center justify-between px-4 py-2 ${
                                hoveredLanguage === 'en'
                                    ? 'bg-blue-500 text-white hover:bg-blue-400'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                            onClick={() => handleLanguageChange('en')}
                            /*onMouseEnter={() => handleHover('en')}
                            onMouseLeave={handleMouseLeave}*/
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
                            className={`w-full flex items-center justify-between px-4 py-2 ${
                                hoveredLanguage === 'ja'
                                    ? 'bg-blue-500 text-white hover:bg-blue-400'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                            onClick={() => handleLanguageChange('ja')}
                            /*onMouseEnter={() => handleHover('ja')}
                            onMouseLeave={handleMouseLeave}*/
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
