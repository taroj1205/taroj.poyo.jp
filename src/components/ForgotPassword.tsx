import Head from 'next/head';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GoBack: React.FC<{ onGoBackClick: () => void }> = ({ onGoBackClick }) => {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            className="text-indigo-500 hover:text-indigo-600"
            onClick={onGoBackClick}
        >
            {t('goBack')}
        </button>
    );
};

const ForgotPassword: React.FC<{ onGoBackClick: () => void }> = ({ onGoBackClick }) => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true); // Show loading state

        // Simulating API call delay with setTimeout (Replace this with your actual API call)
        setTimeout(() => {
            // Add your logic to submit the forgot password request here
            console.log('Forgot Password Email:', email);
            // You can make API calls or any other logic to handle the forgot password request
            setIsSubmitted(true);
            setIsLoading(false);
            setIsSuccess(true); // Show success state
        }, 2000);
    };

    return (
        <>
            <Head>
                <meta property="og:title" content="Forgot password - taroj.poyo.jp" />
                <meta property="og:description" content="Resetting password for taroj.poyo.jp" />
                <meta name="twitter:title" content="Forgot password - taroj.poyo.jp" />
                <meta name="twitter:description" content="Resetting password for taroj.poyo.jp" />
                <title>{t('title.forgotPassword')}</title>
            </Head>
            <div className="w-96 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg mx-auto mt-20">
                {isSubmitted ? (
                    <div>
                        {isSuccess ? (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Password Reset Request Sent</h2>
                                <p className="text-green-600 dark:text-green-400">✔️ Success!</p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    An email with instructions to reset your password has been sent to your registered email address.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Submitting...</h2>
                            </div>
                        )}
                        <GoBack onGoBackClick={onGoBackClick} />
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="submit"
                                    className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </button>
                                    <GoBack onGoBackClick={onGoBackClick} />
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default ForgotPassword;
