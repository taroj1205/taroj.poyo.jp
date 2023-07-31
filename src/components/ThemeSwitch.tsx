import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';

const ThemeSwitch: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    if (!mounted) return null; // Prevent rendering on the server-side

    return (
        <div
            className='rounded-full cursor-pointer md:mr-0 mr-2'
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
