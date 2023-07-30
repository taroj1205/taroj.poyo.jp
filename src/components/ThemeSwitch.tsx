import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeSwitch: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');

    // Function to toggle theme
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.classList.remove(theme);
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Load theme from local storage on initial mount
    useEffect(() => {
        const storedTheme = document.documentElement.classList.contains('dark');
        if (storedTheme) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    return (
        <div
            className="rounded-full cursor-pointer"
            onClick={toggleTheme}
        >
            {theme === 'dark' ? <FiMoon className="text-indigo-500 w-6 h-6" /> : <FiSun className="text-yellow-500 w-6 h-6" />}
        </div>
    );
};

export default ThemeSwitch;
