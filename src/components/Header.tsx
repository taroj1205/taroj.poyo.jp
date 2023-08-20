import React, { useState, useEffect } from 'react';
import { FaHome, FaComments, FaAngleDown, FaUser, FaCubes } from 'react-icons/fa';
import LanguageSwitch from './LanguageSwitch';
import Profile from './Profile';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { UnmountClosed } from 'react-collapse';
import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';
import { useActiveLink } from './ActiveContext';

const Header = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { activeLink, setActiveLink } = useActiveLink();
    const [scrollProgress, setScrollProgress] = useState(0);

    const toggleDropdown = () => {
        setIsExpanded(!isExpanded);
    };

    const isActive = (path: string) => {
        return activeLink === path;
    };

    useEffect(() => {
        console.log(scrollProgress);
        const handleStart = () => setIsLoading(true);
        const handleComplete = () => setIsLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    useEffect(() => {
        const handleScroll = () => {
            const main = document.querySelector('.content') as HTMLDivElement;
            const windowHeight = window.innerHeight as number;
            const fullHeight = main.scrollHeight as number;
            if (!fullHeight) return;
            const scrollTop = main.scrollTop as number;
            if (windowHeight === fullHeight) {setScrollProgress(0); return;}
            const progress = (scrollTop / (fullHeight - windowHeight)) * 100;
            setScrollProgress(progress);
        };

        const main = document.querySelector('.content') as HTMLDivElement;
        main.addEventListener('scroll', handleScroll);

        return () => {
            main.removeEventListener('scroll', handleScroll);
            setScrollProgress(0);
        };
    }, []);

    return (
        <header className={`relative top-0 z-[2] whitespace-nowrap w-full bg-white dark:bg-slate-900 shadow-xl transition-all duration-350 ease`}>
            <div>
                {isExpanded && (
                    <div
                        className="fixed inset-0 z-0"
                        onClick={toggleDropdown}
                        onTouchMove={() => toggleDropdown()}
                    />
                )}
                <div className="relative w-full flex items-center z-[100] justify-between px-0 md:h-10 min-h-[40px]">
                    <div className="flex xl:absolute left-1 xl:left-64 items-center justify-start font-medium w-full md:w-auto">
                        <div className="flex items-center ml-2 xl:ml-0 relative">
                            <LanguageSwitch isHeader={true} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center font-medium text-black dark:text-white space-x-0 md:space-x-2.5 flex-grow justify-center">
                        <UnmountClosed isOpened={true || false}>
                            <nav
                                className={`flex ${isExpanded ? 'flex mt-2' : 'hidden duration-300 md:flex'
                                    } flex-col md:flex-row items-center gap-1 font-medium text-black dark:text-white`}
                            >
                                <Link href="/"
                                    className={`flex items-center text-center hover:text-blue-600 px-2 ${isActive('/') ? 'border-b-2 border-blue-600 text-blue-600' : 'border-b-2 border-transparent text-black dark:text-white'
                                        } transition-all duration-300`}
                                >
                                    <FaHome className="mr-1 text-xl mb-1 md:mb-0" />
                                    <span className="text-base">{t('header.home')}</span>
                                </Link>
                                <Link href="/about"
                                    className={`flex items-center text-center hover:text-blue-600 px-2 ${isActive('/about')
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'border-b-2 border-transparent text-black dark:text-white'
                                        } transition-all duration-300`}
                                >
                                    <FaUser className="mr-1 text-lg mb-1 md:mb-0" />
                                    <span className="text-base">{t('header.about')}</span>
                                </Link>
                                <Link href="/apps"
                                    className={`flex items-center text-center hover:text-blue-600 px-2 ${isActive('/apps')
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'border-b-2 border-transparent text-black dark:text-white'
                                        } transition-all duration-300`}
                                >
                                    <FaCubes className="mr-1 text-xl mb-1 md:mb-0" />
                                    <span className="text-base">{t('header.apps')}</span>
                                </Link>
                            </nav>
                        </UnmountClosed>
                        <div className={`md:hidden flex justify-center flex-grow`}>
                            <button
                                aria-label="dropdown"
                                onClick={toggleDropdown}
                                className={`flex items-center w-full p-2 ${isExpanded ? 'transform rotate-180' : 'text-gray-500'} transition-all duration-300`}
                            >
                                <FaAngleDown className="text-2xl" />
                            </button>
                        </div>

                    </div>
                    <div className="flex xl:absolute right-1 xl:right-64 items-center justify-end font-medium w-full md:w-auto">
                        <div className="flex items-center relative">
                            <ThemeSwitch />
                            <Profile />
                        </div>
                    </div>
                </div>
                {isLoading && (
                    <div className="absolute bottom-0 left-0 w-full h-full opacity-25 bg-blue-600 transition-all duration-500 ease-in-out loading-bar" />
                )}
            </div>
            <div className='progress' style={{ width: scrollProgress + '%' }}></div>
        </header >
    );
};

export default Header;