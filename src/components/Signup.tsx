import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Signup: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your signup logic here
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
    };

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="w-96 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('title.signup')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                        {t('auth.email')}
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                        {t('auth.password')}
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
                        {t('auth.confirmPassword')}
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="submit"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none"
                    >
                        {t('auth.signup')}
                    </button>
                    <div className="text-sm">
                        <button
                            type="button"
                            className="text-indigo-500 hover:text-indigo-600 mr-2 underline hover:no-underline"
                            onClick={onLoginClick}
                        >
                            {t('auth.login')}
                        </button>
                    </div>
                </div>
            </form>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="darkMode"
                    className="mr-2"
                    checked={darkMode}
                    onChange={handleToggleDarkMode}
                />
                <label htmlFor="darkMode" className="text-gray-700 dark:text-gray-300">
                    Dark Mode
                </label>
            </div>
        </div>
    );
};

export default Signup;
