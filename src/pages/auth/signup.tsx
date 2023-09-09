import Cookies from 'js-cookie';
import Head from 'next/head';
import router from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [viewPassword, setViewPassword] = useState(false);
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
    const [validPassword, setValidPassword] = useState([true, false, false]);
    const [isPopupShown, setIsPopupShown] = useState(false);
    const formRef = React.useRef<HTMLFormElement>(null);

    const passwordRequirements = [
        t('auth.passwordContainsEmailOrUsername'),
        t('auth.passwordMinLength'),
        t('auth.passwordRequirements')
    ];

    // Function to validate password in real-time
    const validatePassword = (password: string) => {
        function jaccardSimilarity(a: string, b: string) {
            const setA = new Set(a);
            const setB = new Set(b);

            const intersectionSize = new Set([...setA].filter((x) => setB.has(x))).size;
            const unionSize = setA.size + setB.size - intersectionSize;

            return intersectionSize / unionSize;
        }

        // Assuming you already have the variables `email`, `username`, and `password` defined
        const atIndex = email.indexOf('@');
        const emailWithoutDomain = email.substring(0, atIndex);
        const lowerCaseEmail = emailWithoutDomain.toLowerCase();
        const lowerCaseUsername = username.toLowerCase();
        const lowerCasePassword = password.toLowerCase();

        const emailSimilarity = jaccardSimilarity(lowerCaseEmail, lowerCasePassword);
        const usernameSimilarity = jaccardSimilarity(lowerCaseUsername, lowerCasePassword);

        // Now you can use `emailSimilarity` and `usernameSimilarity` to check for similarity.
        // The higher the similarity value (closer to 1), the more similar the strings are.
        console.log(emailSimilarity, usernameSimilarity);

        const isContainsEmailOrUsername = emailSimilarity < 0.7 && usernameSimilarity < 0.7;

        console.log(isContainsEmailOrUsername);
        const isPasswordLengthValid = password.length >= 8;
        const isPasswordFormatValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password);

        if (!isContainsEmailOrUsername) {
            setPasswordValidationMessage(t('auth.passwordContainsEmailOrUsername'));
            setIsPasswordValid(false);
        } else if (!isPasswordLengthValid) {
            setPasswordValidationMessage(t('auth.passwordMinLength'));
            setIsPasswordValid(false);
        } else if (!isPasswordFormatValid) {
            setPasswordValidationMessage(t('auth.passwordRequirements'));
            setIsPasswordValid(false);
        } else {
            setPasswordValidationMessage('');
            setIsPasswordValid(true);
        }

        const passwordValidationStatus = [
            isContainsEmailOrUsername,
            isPasswordLengthValid,
            isPasswordFormatValid,
        ];

        setValidPassword(passwordValidationStatus);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setPassword(password);
        validatePassword(password);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (password === confirmPassword) {
            fetch('/api/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ email, username, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setIsLoading(false);
                    if (response.status === 409) {
                        setError(t('auth.signupDupe')); // User already exists
                        formRef.current?.classList.add('shake-animation'); // add shake animation class if message is empty
                        setTimeout(() => {
                            formRef.current?.classList.remove('shake-animation'); // remove shake animation class after 0.5s
                        }, 500);
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    console.log(data);
                    if (!data.error) {
                        setSignupSuccess(true); // set state variable to true on successful signup
                        setIsPopupShown(true);
                        const expirationDate = new Date(Date.now() + 60000); // Set expiration to 60 seconds from now
                        localStorage.setItem('emailVerificationCooldownExpiration', expirationDate.toISOString());
                        Cookies.set('token', data.token, { expires: 7 });
                        localStorage.setItem('email', email);
                    }
                })
                .catch(error => {
                    console.error('Signup failed:', error);
                    setIsLoading(false);
                });
        } else {
            console.error('Password and confirm password do not match');
            setIsLoading(false);
            setError(t('auth.signupError'));
            formRef.current?.classList.add('shake-animation');
            setTimeout(() => {
                formRef.current?.classList.remove('shake-animation');
            }, 500);
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
                <title>{t('title.auth.signup')}</title>
            </Head>
            <div className="w-96 max-w-full bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg mx-auto mt-20">
                <h2 className="text-2xl font-bold mb-6">{t('title.auth.signup')}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} ref={formRef}>
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
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
                            {t('auth.username')}
                        </label>
                        <input
                            type="text"
                            id="username"
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            value={username}
                            autoComplete='username'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                            {t('auth.password')}
                        </label>
                        {viewPassword ?
                            <div className="flex justify-center items-center">
                                <input
                                    type="text"
                                    id="password"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    value={password}
                                    autoComplete='password'
                                    onChange={(e) => handlePasswordChange(e)}
                                />
                                <FiEyeOff onClick={handleEyeViewer} className="ml-2 cursor-pointer" />
                            </div>
                            :
                            <div className="flex justify-center items-center">
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    value={password}
                                    autoComplete='password'
                                    onChange={(e) => handlePasswordChange(e)}
                                />
                                <FiEye onClick={handleEyeViewer} className="ml-2 cursor-pointer" />
                            </div>
                        }
                    </div>
                    {passwordValidationMessage && (
                        <p className="text-red-500 mb-2">{passwordValidationMessage}</p>
                    )}
                    {/* Show password requirements */}
                    <div className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                        {passwordRequirements.map((requirement, index) => (
                            <p key={index}
                                className={validPassword[index] ? 'text-green-600 before:content-["✔"]' : 'text-red-600 before:content-["✖"]'}>
                                {requirement}
                            </p>
                        ))}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
                            {t('auth.confirmPassword')}
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            value={confirmPassword}
                            autoComplete='password'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            className={`${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 dark:bg-indigo-700 hover:bg-indigo-600 dark:hover:bg-indigo-800'
                                } text-white px-4 py-2 rounded-md focus:outline-none`}
                            disabled={isLoading}
                        >
                            {/* Show loading icon if isLoading is true, else show "Signup" text */}
                            {isLoading ? (
                                <div
                                    className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                t('auth.signup')
                            )}
                        </button>
                        <div className="text-sm">
                            <button
                                type="button"
                                className="text-indigo-500 hover:text-indigo-600 mr-2 underline hover:no-underline"
                                onClick={() => router.push('/auth/login')}
                            >
                                {t('auth.login')}
                            </button>
                        </div>
                    </div>
                </form>
                {signupSuccess && (
                    <div>
                        {/* Overlay div with dark background */}
                        {isPopupShown &&
                            <div className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50`}></div>}
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                            <div className="bg-indigo-500 dark:bg-slate-900 text-white rounded-lg p-8 shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">{t('auth.signupSuccess')}</h3>
                                <button
                                    className="bg-indigo-700 dark:bg-indigo-800 hover:bg-indigo-800 dark:hover:bg-indigo-900 text-white px-4 py-2 rounded-md focus:outline-none"
                                    onClick={() => {
                                        setIsPopupShown(false); // Hide the popup when the button is clicked
                                        setSignupSuccess(false);
                                        router.push('/auth/login');
                                    }}
                                >
                                    {t('auth.login')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Signup;