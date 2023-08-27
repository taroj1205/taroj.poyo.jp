import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { useAuth } from '../../components/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [viewPassword, setViewPassword] = useState(false);
    const { user, setUser, setToken } = useAuth() || {};

    useEffect(() => {
        if (user?.email) {
            router.push('/profile');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Create the login data object to be sent in the request body
        const loginData = {
            email,
            password,
        };

        try {
            // Make the login request to your server
            const response = await fetch('/api/auth/login', {
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
                const token = data.data.session?.access_token;
                if (token) {
                    Cookies.set('token', token);
                    localStorage.setItem('userProfileData', JSON.stringify(data.data.user));
                    setUser?.(data.data.user);
                    setToken?.(token);
                    router.push('/profile');
                }
                // Add any other logic you need here after successful login
            } else {
                // Handle login failure
                if (response.status === 401) {
                    setIsLoading(false);
                    setError('auth.loginFailed');
                }
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            setIsLoading(false);
            setError('auth.loginError');
        }
    };

    // Sets password viewer to true/false
    const handleEyeViewer = () => {
        setViewPassword(v => v = !v);
    };

    return (
        <>
            <Head>
                <meta name='title' content='Authenication - taroj.poyo.jp' />
                <meta name='description' content='Authenication page for taroj.poyo.jp' />
                <meta property="og:title" content="Authenication - taroj.poyo.jp" />
                <meta property="og:description" content="Authenication page for taroj.poyo.jp" />
                <meta name="twitter:title" content="Authenication - taroj.poyo.jp" />
                <meta name="twitter:description" content="Authenication page for taroj.poyo.jp" />
                <title>{t('title.auth.login')}</title>
            </Head>
            <div className="flex items-center justify-center max-w-full pt-20">
                <div className="w-96 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">{t('title.auth.login')}</h2>
                    {error && <p className="text-red-500 mb-4">{t(error)}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.email')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
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
                            {viewPassword ?
                                <div className="flex justify-center items-center">
                                    <input
                                        type="password"
                                        id="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        value={password}
                                        autoComplete='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <FiEye onClick={handleEyeViewer} className="ml-2 cursor-pointer"/>
                                </div> :
                                <div className="flex justify-center items-center">
                                    <input
                                        type="text"
                                        id="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        value={password}
                                        autoComplete='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <FiEyeOff onClick={handleEyeViewer} className="ml-2 cursor-pointer"/>
                                </div>
                            }
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="submit"
                                className={`${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
                                    } text-white px-4 py-2 rounded-md focus:outline-none`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"
                                        viewBox="0 0 24 24"
                                    ></svg>
                                ) : (
                                    t('auth.login')
                                )}
                            </button>
                            <div className="text-sm">
                                <button
                                    type="button"
                                    className="text-indigo-500 hover:text-indigo-600 underline hover:no-underline mr-4"
                                    onClick={() => router.push('/auth/signup')}
                                >
                                    {t('auth.signup')}
                                </button>
                                <button
                                    type="button"
                                    className="text-indigo-500 hover:text-indigo-600 underline hover:no-underline"
                                    onClick={() => router.push('/auth/reset')}
                                >
                                    {t('auth.forgotPassword')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
