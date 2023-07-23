import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import FloatingBanner from '../components/FloatingBanner';
import copy from 'copy-to-clipboard';
import { useUser } from '@auth0/nextjs-auth0/client';
import Contacts from '../components/Contacts';

interface ProfileData {
    email: string;
    username: string;
    picture: string;
    name: string;
}

const HomePage = () => {
    const { t } = useTranslation();
    const { user, error, isLoading } = useUser();

    const [userData, setUserData] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
        name: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = user?.sub;
                const url = `/api/getUser?user=${userId}`;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: userId,
                    }),
                };
                const response = await fetch(url, requestOptions);
                const data = await response.json();
                setUserData(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (!isLoading) {
            fetchData();
        }
    }, [user, isLoading]);

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
                    {userData.username && ` ${userData.username}`}!
                </h1>
                <Contacts />
            </main>

            <FloatingBanner />
        </>
    );
};

export default HomePage;
