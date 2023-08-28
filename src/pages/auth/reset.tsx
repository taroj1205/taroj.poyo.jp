import Head from 'next/head';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoBackLogin from '../../components/GoBackLogin';
import { useRouter } from 'next/router';

const ForgotPassword: React.FC<{ onGoBackClick: () => void }> = ({ onGoBackClick }) => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { t } = useTranslation();

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (email.length > 0) {
            console.log(email);
            try {
                const response = await fetch('/api/auth/reset/password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    console.log('Forgot Password Email:', email);
                    setIsSubmitted(true);
                    setIsLoading(false);
                    setIsSuccess(true); // Show success state
                } else {
                    setIsLoading(false);
                    setIsSuccess(false);
                    console.log(response);
                }
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
                setIsSuccess(false); // Show error state
            }
        }
    };

    return (
        <>
            <Head>
                <meta property="og:title" content="Forgot password - taroj.poyo.jp" />
                <meta property="og:description" content="Resetting password for taroj.poyo.jp" />
                <meta name="twitter:title" content="Forgot password - taroj.poyo.jp" />
                <meta name="twitter:description" content="Resetting password for taroj.poyo.jp" />
                <title>{t('title.auth.forgotPassword')}</title>
            </Head>
            <div className="w-96 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg mx-auto mt-20">
                {isSubmitted ? (
                    <div>
                        {isSuccess ? (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">{t('resetRequestSent')}</h2>
                                <p className="text-green-600 dark:text-green-400">{t('success')}</p>
                                <p className="text-gray-700 dark:text-gray-300">{t('resetRequestInstructions')}</p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">{t('submitting')}</h2>
                            </div>
                        )}
                        <GoBackLogin />
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">{t('auth.forgotPassword')}</h2>
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
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="submit"
                                    className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('submitting') : t('submit')}
                                </button>
                                <GoBackLogin />
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default ForgotPassword;
