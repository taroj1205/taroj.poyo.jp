import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../components/AuthContext';
import router from 'next/router';
import Cookies from 'js-cookie';

const LoadingSpinner = () => (
    <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM17.938 3c1.863 2.114 3 4.896 3 7.938h4c0-6.627-5.373-12-12-12v4l5.938-.062L17.938 3z"
        ></path>
    </svg>
);

const EmailVerification: React.FC<{
    onVerificationSubmit: (code: string) => void;
}> = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');
    const { user, token } = useAuth() || {};
    const { t } = useTranslation();

    const [verifySuccess, setVerifySuccess] = useState(false); // State for displaying the success message
    const [resendCooldown, setResendCooldown] = useState(false); // State for cooldown of resending verification code
    const [resendDisabled, setResendDisabled] = useState(false); // State to disable the resend button during cooldown
    const [cooldownSeconds, setCooldownSeconds] = useState(0); // State for cooldown countdown in seconds
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

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
        fetch('/api/verify-email', {
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
                    // Reset the success state after 1 second
                    setTimeout(() => {
                        setIsVerified(false);
                    }, 1000);
                }
            })
            .catch((error) => {
                // Handle errors, if needed
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
        if (user) {
            setEmail(user.email);
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
        <div className="w-96 bg-gray-100 dark:bg-gray-900 rounded-lg p-8 shadow-lg mx-auto">
            {verifySuccess && (
                // Verified Successfully Popup
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="bg-indigo-500 text-white rounded-lg p-8 shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">{t('auth.signupSuccess')}</h3>
                        <button
                            className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md focus:outline-none"
                            onClick={() => {
                                setVerifySuccess(false);
                                router.push('/auth');
                            }}
                        >
                            {t('auth.login')}
                        </button>
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
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="submit"
                        className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none ${isVerified ? 'animate-checkmark' : ''
                            }`}
                        disabled={isLoading || isVerified} // Disable the button when loading is true or when already verified
                    >
                        {isLoading ? <LoadingSpinner /> : isVerified ? '✓' : t('auth.verify')}
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
    );
};

export default EmailVerification;
