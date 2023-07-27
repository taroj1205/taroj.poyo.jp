import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Login: React.FC<{ onSignupClick: () => void; onForgotPasswordClick: () => void }> = ({ onSignupClick, onForgotPasswordClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create the login data object to be sent in the request body
        const loginData = {
            email,
            password,
        };

        try {
            // Make the login request to your server
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful! Received data:', data);
                // Add any logic you need here after successful login
            } else {
                // Handle login failure
                const errorData = await response.json();
                setError(errorData.message || 'Login failed! Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            setError('An error occurred during login. Please try again later.');
        }
    };

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-96 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">{t('title.login')}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
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
                            autoComplete='email'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                            {t('auth.password')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            value={password}
                            autoComplete='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none"
                        >
                            {t('auth.login')}
                        </button>
                        <div className="text-sm">
                            <button
                                type="button"
                                className="text-indigo-500 hover:text-indigo-600 underline hover:no-underline mr-4"
                                onClick={onSignupClick}
                            >
                                {t('auth.signup')}
                            </button>
                            <button
                                type="button"
                                className="text-indigo-500 hover:text-indigo-600 underline hover:no-underline"
                                onClick={onForgotPasswordClick}
                            >
                                {t('auth.forgotPassword')}
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
        </div>
    );
};

export default Login;
