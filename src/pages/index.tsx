import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import FloatingBanner from '../components/FloatingBanner';
import copy from 'copy-to-clipboard';
import Contacts from '../components/Contacts';

interface ProfileData {
    email: string;
    username: string;
    picture: string;
    name: string;
}

const HomePage = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
        name: '',
    })

    useEffect(() => {
        const userData = localStorage.getItem("userProfileData");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <>
            <Head>
                <meta property="og:title" content="Home - taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="Index page for taroj.poyo.jp"
                />
                <meta name="twitter:title" content="Home - taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="Index page for taroj.poyo.jp"
                />
                <title>{t('title.index')}</title>
            </Head>
            <main className="container mx-auto py-10 w-[90%] max-w-6xl">
                <h1 className="text-4xl mt-8 font-bold">
                    {t('index.welcome')}
                    {user.username && ` ${user.username}`}!
                </h1>
                <Contacts />
            </main>

            <FloatingBanner />
        </>
    );
};

export default HomePage;
