import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';

const ThemeSwitch: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [themeLoaded, setThemeLoaded] = useState(false);

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setTheme('dark');
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (theme) {
            setThemeLoaded(true);
        }
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    if (!mounted || !themeLoaded) {
        return (
            <div className="rounded-full cursor-pointer md:mr-0 mr-2">
                <svg className="animate-spin h-6 w-6 text-gray-500" viewBox="0 0 24 24"></svg>
            </div>
        );
    }

    return (
        <div
            // className='rounded-full cursor-pointer md:mr-0 mr-2'
            className='text-gray-500 md:mr-0 mr-2 cursor-pointer  dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2'
            onClick={toggleTheme}
        >
            {theme === 'dark' ? (
                <FiMoon className="text-indigo-500 w-6 h-6" />
            ) : (
                <FiSun className="text-yellow-500 w-6 h-6" />
            )}
        </div>
    );
};

export default ThemeSwitch;