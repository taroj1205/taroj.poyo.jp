import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../components/AuthContext';
import router from 'next/router';
import Cookies from 'js-cookie';
import Head from 'next/head';

const EmailVerification: React.FC<{
    onVerificationSubmit: (code: string) => void;
}> = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');
    const { user } = useAuth() || {};
    const { t } = useTranslation();

    const [verifySuccess, setVerifySuccess] = useState(false); // State for displaying the success message
    const [resendCooldown, setResendCooldown] = useState(false); // State for cooldown of resending verification code
    const [resendDisabled, setResendDisabled] = useState(false); // State to disable the resend button during cooldown
    const [cooldownSeconds, setCooldownSeconds] = useState(0); // State for cooldown countdown in seconds
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isPopupShown, setIsPopupShown] = useState(false);
    const [verificationError, setVerificationError] = useState(false);

    const circleRadius = 18; // Radius of the circle
    const circleCircumference = 2 * Math.PI * circleRadius; // Circumference of the circle
    const circleStrokeWidth = 4; // Stroke width of the circle

    // Calculate the stroke-dasharray value based on the circle circumference and cooldownSeconds
    const circleDasharray = circleCircumference;
    const circleDashoffset = circleCircumference - (circleCircumference / 60) * cooldownSeconds; // 60 is the cooldown duration in seconds

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true

        const token = Cookies.get('token');

        // Prepare the data to be sent in the POST request
        const data = {
            email,
            verificationCode: verificationCode,
            token: token,
        };

        // Perform the POST request to the endpoint
        fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                // Handle the response, if needed
                if (response.ok) {
                    setVerifySuccess(true); // Set the success message state to true
                    setIsVerified(true); // Set the success state to true
                    setIsPopupShown(true); // Show the popup
                    // Reset the success state after 1 second
                    setTimeout(() => {
                        setIsVerified(false);
                    }, 1000);
                } else if (response.status === 401) {
                    setVerificationError(true);
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            })
            .finally(() => {
                setIsLoading(false); // Set loading state to false after the request is completed (success or error)
            });
    };

    const handleResendCode = () => {
        if (!resendCooldown) {
            setCooldownSeconds(60); // Set the initial cooldown seconds
            setResendCooldown(true);
            setResendDisabled(true);

            const expirationDate = new Date(Date.now() + 60000); // Set expiration to 60 seconds from now

            // Start cooldown countdown
            const interval = setInterval(() => {
                const currentTime = new Date();
                const timeDifference = expirationDate.getTime() - currentTime.getTime();

                if (timeDifference > 0) {
                    setCooldownSeconds(Math.ceil(timeDifference / 1000));
                } else {
                    setResendCooldown(false);
                    setResendDisabled(false);
                    clearInterval(interval);
                }
            }, 1000);

            // Save the expiration date to local storage during the countdown
            localStorage.setItem('emailVerificationCooldownExpiration', expirationDate.toISOString());

            // Send the token and email to the '/api/code' endpoint for generating a new verification code
            fetch('/api/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user?.email,
                }),
            })
                .then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        if (data.token) {
                            Cookies.set('token', data.token, { expires: 7 });
                            localStorage.setItem('userProfileData', JSON.stringify(data.user));
                        }
                    } else {
                        // Failed to regenerate verification code
                        // Handle the error if needed
                    }
                })
                .catch((error) => {
                    // Handle errors, if needed
                });
        }
    };

    useEffect(() => {
        console.log(user);
        if (user?.email) {
            setEmail(user.email);
            const storedUserProfileData = localStorage.getItem('userProfileData');
            if (storedUserProfileData) {
                const userProfileData = JSON.parse(storedUserProfileData);
                if (userProfileData.email) {
                    setEmail(userProfileData.email);
                }
            }
        }

        const storedExpiration = localStorage.getItem('emailVerificationCooldownExpiration');
        if (storedExpiration) {
            const expirationDate = new Date(storedExpiration);
            const currentTime = new Date();

            const timeDifference = expirationDate.getTime() - currentTime.getTime();

            if (timeDifference > 0) {
                setResendCooldown(true);
                setResendDisabled(true);

                // Initialize cooldownSeconds with the remaining seconds left in the countdown
                setCooldownSeconds(Math.ceil(timeDifference / 1000));

                // Start cooldown countdown
                const interval = setInterval(() => {
                    const currentTime = new Date();
                    const timeDifference = expirationDate.getTime() - currentTime.getTime();

                    if (timeDifference > 0) {
                        setCooldownSeconds(Math.ceil(timeDifference / 1000));
                    } else {
                        setResendCooldown(false);
                        setResendDisabled(false);
                        clearInterval(interval);
                    }
                }, 1000);
            } else {
                localStorage.removeItem('emailVerificationCooldownExpiration');
            }
        }
    }, [user]);

    return (
        <>
            <Head>
                <meta property="og:title" content="Email verification - taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="Email verification page for taroj.poyo.jp"
                />
                <meta name="twitter:title" content="Email verification - taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="Email verification page for taroj.poyo.jp"
                />
                <title>{t('title.emailVerification')}</title>
            </Head>
            <div className="w-96 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 mt-20 shadow-lg mx-auto">
                {verifySuccess && (
                    <div>
                        {/* Overlay div with dark background */}
                        {isPopupShown && <div className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50`}></div>}
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                            <div className="bg-indigo-500 dark:bg-slate-900 text-white rounded-lg p-8 shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">{t('auth.signupSuccess')}</h3>
                                <button
                                    className="bg-indigo-700 dark:bg-indigo-800 hover:bg-indigo-800 dark:hover:bg-indigo-900 text-white px-4 py-2 rounded-md focus:outline-none"
                                    onClick={() => {
                                        setIsPopupShown(false); // Hide the popup when the button is clicked
                                        setVerifySuccess(false);
                                        router.push('/auth');
                                    }}
                                >
                                    {t('auth.verify')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <h2 className="text-2xl font-bold mb-6">{t('title.emailVerification')}</h2>
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
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="verificationCode" className="block text-gray-700 dark:text-gray-300 mb-2">
                            {t('auth.verificationCode')}
                        </label>
                        <input
                            type="number"
                            id="verificationCode"
                            required
                            max={999999}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </div>
                    {verificationError && <p className="text-red-500 mb-2">{t('auth.verificationCodeResendError')}</p>}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none ${isVerified ? 'animate-checkmark' : ''
                                }`}
                            disabled={isLoading || isVerified} // Disable the button when loading is true or when already verified
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div> : isVerified ? '✓' : t('auth.verify')}
                        </button>
                        <button
                            type="button"
                            className="text-indigo-500 hover:text-indigo-600 focus:outline-none"
                            disabled={resendDisabled}
                            onClick={handleResendCode}
                        >
                            {resendCooldown ? (
                                <div className="flex items-center">
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        viewBox={`0 0 ${circleRadius * 2} ${circleRadius * 2}`}
                                        fill="none"
                                    >
                                        <circle
                                            cx={circleRadius}
                                            cy={circleRadius}
                                            r={circleRadius - circleStrokeWidth / 2}
                                            fill="transparent"
                                            stroke="rgba(79, 70, 229, 0.2)"
                                            strokeWidth={circleStrokeWidth}
                                        />
                                        <circle
                                            cx={circleRadius}
                                            cy={circleRadius}
                                            r={circleRadius - circleStrokeWidth / 2}
                                            fill="transparent"
                                            stroke="rgba(79, 70, 229, 1)"
                                            strokeWidth={circleStrokeWidth}
                                            strokeLinecap="round"
                                            strokeDasharray={circleDasharray}
                                            strokeDashoffset={circleDashoffset}
                                        />
                                    </svg>
                                    <span>{cooldownSeconds} s</span>
                                </div>
                            ) : (
                                t('auth.resend')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EmailVerification;
