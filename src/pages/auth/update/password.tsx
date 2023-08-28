import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import GoBackLogin from '../../../components/GoBackLogin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

const UpdatePassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [access_token, setAccessToken] = useState('');
    const [error, setError] = useState('');
    const { t } = useTranslation();
    const router = useRouter();
    const email = router.query.email as string;
    const [username, setUsername] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
    const [validPassword, setValidPassword] = useState([true, false, false]);
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

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hashParams.get('access_token') as string;
        if (accessToken) {
            setAccessToken(accessToken);
        };
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            const { data, error } = await supabase.auth.updateUser({ password });

            if (error) {
                throw error;
            }

            setIsSuccess(true);
            console.log(data);

            // const response = await fetch('/api/update/password', {
            //     method: 'POST',
            //     body: JSON.stringify({ access_token, password }),
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });

            // if (response.ok) {
            //     setIsSuccess(true);
            //     setError('');
            // } else {
            //     const data = await response.json();
            //     setError(data.error || t('auth.updatePasswordFailed'));
            // }

            setIsLoading(false);
        } catch (error) {
            console.error('Update password error:', error);
            if (error = 'AuthApiError: New password should be different from the old password.') {
                setError(t('auth.samePassword'));
            } else {
                setError(t('auth.updatePasswordFailed'));
            }
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <meta name="title" content="Update Password - taroj.poyo.jp" />
                <meta name="description" content="Update your password for taroj.poyo.jp" />
                <meta property="og:title" content="Update Password - taroj.poyo.jp" />
                <meta property="og:description" content="Update your password for taroj.poyo.jp" />
                <meta name="twitter:title" content="Update Password - taroj.poyo.jp" />
                <meta name="twitter:description" content="Update your password for taroj.poyo.jp" />
                <title>{t('title.auth.updatePassword')}</title>
            </Head>
            <div className='flex items-center justify-center h-full pt-20'>
                <div className="w-96 max-w-full bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg mx-auto">
                    <h2 className="text-2xl font-bold mb-6">{t('auth.updatePassword')}</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {isSuccess ? (
                        <>
                            <p className="text-green-600 mb-4">{t('auth.updatePasswordSuccess')}</p>
                            <GoBackLogin />
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                                    {t('auth.email')}
                                </label>
                                <input
                                    disabled={true}
                                    value={email}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 text-gray-100 cursor-not-allowed"
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
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className={`${!isPasswordValid || isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 dark:bg-indigo-700 hover:bg-indigo-600 dark:hover:bg-indigo-800'
                                        } text-white px-4 py-2 rounded-md focus:outline-none`}
                                    disabled={!isPasswordValid}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                                    ) : (
                                        t('auth.updatePassword')
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="text-indigo-500 hover:text-indigo-600 underline hover:no-underline"
                                    onClick={() => router.push('/auth/login')}
                                >
                                    {t('auth.cancel')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpdatePassword;
