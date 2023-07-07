import React, { useEffect } from 'react';

import Profile from '../components/Profile';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t, i18n } = useTranslation('translation'); // Specify the translation key

    useEffect(() => {
        const userLanguage = window.navigator.language;
        let language;

        // Check if user language is Japanese
        if (userLanguage.includes('ja')) {
            language = 'ja'; // Set Japanese language
        } else {
            language = 'en'; // Set English as fallback language
        }
        i18n.changeLanguage(language);
    }, []);
    return (
        <main className="container mx-auto py-10 max-w-6xl">
            <h2 className="text-4xl">{t('index.welcome')}</h2>
            <Profile />
        </main>
    );
};

export default HomePage;
