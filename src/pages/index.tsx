import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const HomePage = () => {
    const { t } = useTranslation('translation'); // Specify the translation key

    return (
        <main className="container mx-auto py-10 max-w-6xl">
            <h2 className="text-4xl">{t('index.welcome')}</h2>
        </main>
    );
};

export default HomePage;
