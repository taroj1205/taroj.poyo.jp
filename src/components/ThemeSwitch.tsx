import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';

const ThemeSwitch: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            setLoading(false);
        }
    }, [mounted]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return (
        <div
            className='text-gray-500 md:mr-0 mr-2 cursor-pointer dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2'
            onClick={toggleTheme}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></div>
            ) : (
                theme === 'dark' ? (
                    <FiMoon className="text-indigo-500 w-6 h-6" />
                ) : (
                    <FiSun className="text-yellow-500 w-6 h-6" />
                )
            )}
        </div>
    );
};

export default ThemeSwitch;
