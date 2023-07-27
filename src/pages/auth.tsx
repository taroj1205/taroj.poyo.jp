import React, { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import ForgotPassword from '../components/ForgotPassword'; // Import the ForgotPassword component

const Auth: React.FC = () => {
    const [showLogin, setShowLogin] = useState(true); // State to determine which component to show
    const [showForgotPassword, setShowForgotPassword] = useState(false); // State to determine whether to show ForgotPassword
    const { t } = useTranslation();

    const handleToggleComponent = () => {
        setShowLogin(!showLogin);
        setShowForgotPassword(false); // Hide the ForgotPassword component when switching between Login and Signup
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true); // Show the ForgotPassword component when the user clicks "Forgot Password"
        setShowLogin(false); // Hide the Login component
    };

    const handleGoBackClick = () => {
        setShowForgotPassword(false);
        setShowLogin(true);
    };

    return (
        <>
            <Head>
                <meta property="og:title" content="Authenication - taroj.poyo.jp" />
                <meta property="og:description" content="Authenication page for taroj.poyo.jp" />
                <meta name="twitter:title" content="Authenication - taroj.poyo.jp" />
                <meta name="twitter:description" content="Authenication page for taroj.poyo.jp" />
                <title>{t('title.auth')}</title>
            </Head>
            <div className="flex justify-center items-center pt-20">
                {showForgotPassword ? (
                    <ForgotPassword onGoBackClick={handleGoBackClick} />
                ) : showLogin ? (
                    <Login onSignupClick={handleToggleComponent} onForgotPasswordClick={handleForgotPasswordClick} />
                ) : (
                    <Signup onLoginClick={handleToggleComponent} />
                )}
            </div>
        </>
    );
};

export default Auth;
