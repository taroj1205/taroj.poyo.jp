import Cookies from 'js-cookie';
import router from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Signup: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    // Additional state variables for password validation
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');

    const passwordRequirements = [
        t('auth.passwordContainsEmailOrUsername'),
        t('auth.passwordMinLength'),
        t('auth.passwordRequirements')
    ];

    // Function to validate password in real-time
    const validatePassword = (password: string) => {
        // Check if the password contains the email or username
        if (password.includes(email) || password.includes(username)) {
            setIsPasswordValid(false);
            setPasswordValidationMessage(t('auth.passwordContainsEmailOrUsername'));
            return;
        }

        // Check if the password is at least 8 characters long
        if (password.length < 8) {
            setIsPasswordValid(false);
            setPasswordValidationMessage(t('auth.passwordMinLength'));
            return;
        }

        // Check if the password contains at least one uppercase letter, one lowercase letter, and one digit
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!password.match(passwordRegex)) {
            setIsPasswordValid(false);
            setPasswordValidationMessage(t('auth.passwordRequirements'));
            return;
        }

        setIsPasswordValid(true);
        setPasswordValidationMessage('');
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
            fetch('/api/signup', {
                method: 'POST',
                body: JSON.stringify({ email, username, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setIsLoading(false);
                    if (!data.error) {
                        setSignupSuccess(true); // set state variable to true on successful signup
                        const expirationDate = new Date(Date.now() + 60000); // Set expiration to 60 seconds from now
                        localStorage.setItem('emailVerificationCooldownExpiration', expirationDate.toISOString());
                        Cookies.set('token', data.token, { expires: 7 });
                    } else if (data.error === 'User with this email already exists') {
                        setError(t('auth.signupDupe'));
                        setSignupSuccess(false);
                    }
                })
                .catch(error => {
                    console.error('Signup failed:', error);
                    setIsLoading(false);
                });
        } else {
            console.error('Password and confirm password do not match');
        }
    };

    return (
        <div className="w-96 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('title.signup')}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
                    <input
                        type="password"
                        id="password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={password}
                        autoComplete='password'
                        onChange={(e) => handlePasswordChange(e)}
                    />
                </div>
                {passwordValidationMessage && (
                    <p className="text-red-500 mb-2">{passwordValidationMessage}</p>
                )}
                {/* Show password requirements */}
                <div className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {passwordRequirements.map((requirement, index) => (
                        <p key={index} className={`${isPasswordValid ? 'text-green-600' : 'text-red-600'}`}>
                            {isPasswordValid ? '✔' : '✖'} {requirement}
                        </p>
                    ))}
                </div>
                { isPasswordValid && (
                    
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
                )}
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="submit"
                        className={`${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
                            } text-white px-4 py-2 rounded-md focus:outline-none`}
                        disabled={isLoading}
                    >
                        {/* Show loading icon if isLoading is true, else show "Signup" text */}
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"
                                viewBox="0 0 24 24"
                            ></svg>
                        ) : (
                            t('auth.signup')
                        )}
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
            {signupSuccess && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="bg-indigo-500 text-white rounded-lg p-8 shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">{t('auth.signupSuccess')}</h3>
                        <button
                            className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md focus:outline-none"
                            onClick={() => {
                                setSignupSuccess(false);
                                router.push('/auth/verify');
                            }}
                        >
                            {t('auth.verify')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;