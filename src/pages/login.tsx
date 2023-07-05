import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaGoogle } from 'react-icons/fa';
import Header from '../components/Header';

declare global {
    interface Window {
        gapi: any;
    }
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const Title = styled.h1`
    font-size: 3rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #333;
`;

const GoogleButton = styled.button`
    padding: 1.5rem 4rem;
    font-size: 2rem;
    background-color: #db4437;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    &:hover {
        background-color: #c33c30;
    }
`;

const ButtonText = styled.span`
    display: inline-block;
`;

const ButtonIcon = styled.span`
    display: inline-block;
    font-size: 2.5rem;
`;

const LanguageOption = styled.span<{ active: string }>`
    font-size: 1.2rem;
    color: ${(props) => (props.active === 'true' ? '#db4437' : '#333')};
    opacity: ${(props) => (props.active === 'true' ? '1' : '0.7')};
    transition: opacity 0.3s;

    &:hover {
        text-decoration: underline;
    }
`;

const LanguageSelector = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    cursor: pointer;

    &:hover ${LanguageOption} {
        opacity: 1;
    }
`;

const GlobeIcon = styled(FaGlobe)`
    font-size: 2.5rem;

    ${LanguageSelector}:hover & {
        opacity: 1;
    }
`;

const Login = (): JSX.Element => {
    const { t, i18n } = useTranslation();
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);

    useEffect(() => {
        // Load Google Sign-In API script
        const googleSignInScript = document.createElement('script');
        googleSignInScript.src = 'https://apis.google.com/js/platform.js';
        googleSignInScript.async = true;
        googleSignInScript.onload = initializeGoogleSignIn;
        document.body.appendChild(googleSignInScript);

        return () => {
            // Clean up script tag on unmount
            document.body.removeChild(googleSignInScript);
        };
    }, []);

    const initializeGoogleSignIn = (): void => {
        window.gapi.load('auth2', () => {
            window.gapi.auth2
                .init({
                    client_id:
                        '115243814326-0rkb9g92s716dsrcjdtslkbdm545d98g.apps.googleusercontent.com',
                })
                .then(() => {
                    console.log('Google Sign-In initialized');
                })
                .catch((error: Error) => {
                    console.error('Error initializing Google Sign-In:', error);
                });
        });
    };

    const handleGoogleSignIn = (): void => {
        // Handle Google Sign-In button click
        if (window.gapi && window.gapi.auth2) {
            const auth2 = window.gapi.auth2.getAuthInstance();
            auth2
                .signIn({
                    prompt: 'select_account', // Add this line to prompt account selection
                })
                .then((googleUser: any) => {
                    // Handle successful sign-in
                    console.log(googleUser);
                })
                .catch((error: any) => {
                    // Handle sign-in error
                    console.error(error);
                });
        }
    };

    const changeLanguage = (language: string): void => {
        i18n.changeLanguage(language);
    };

    return (
        <>
            <Header />
            <Container>
                <LanguageSelector
                    onMouseEnter={() => setShowLanguageOptions(true)}
                    onMouseLeave={() => setShowLanguageOptions(false)}
                >
                    <GlobeIcon />
                    {showLanguageOptions && (
                        <>
                            <LanguageOption
                                active={
                                    i18n.language === 'en' ? 'true' : 'false'
                                }
                                onClick={() => changeLanguage('en')}
                            >
                                {t('english')}
                            </LanguageOption>
                            <LanguageOption
                                active={
                                    i18n.language === 'ja' ? 'true' : 'false'
                                }
                                onClick={() => changeLanguage('ja')}
                            >
                                {t('japanese')}
                            </LanguageOption>
                            {/* Add more language options as needed */}
                        </>
                    )}
                </LanguageSelector>
                <Title>{t('welcome')}</Title>
                <GoogleButton onClick={handleGoogleSignIn}>
                    <ButtonIcon>
                        <FaGoogle />
                    </ButtonIcon>
                    <ButtonText>{t('signInWithGoogle')}</ButtonText>
                </GoogleButton>
                <p>{t('moreWaysToLogin')}</p>
            </Container>
        </>
    );
};

export default Login;
