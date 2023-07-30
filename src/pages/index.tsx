import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Head from 'next/head';
import FloatingBanner from '../components/FloatingBanner';
import Contacts from '../components/Contacts';
import Gallery from '../components/Gallery';
import { FiExternalLink } from 'react-icons/fi';

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
    });


    useEffect(() => {
        const userData = localStorage.getItem('userProfileData');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const routes = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/chat', label: 'Chat' },
        { path: '/settings', label: 'Settings' },
        { path: 'https://taroj1205.hatenablog.com', label: 'Blog' },
        { path: 'mailto:taroj1205@gmail.com', label: 'Email' },
    ];

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
            <main
                className="bg-cover bg-no-repeat bg-fixed bg-center"
                style={{
                    backgroundImage:
                        "url('/image/thumbnail/thumbnail.png')",
                }}
            >
                <div
                    className={`container mx-auto py-10 max-w-7xl text-black dark:text-white dark:bg-zinc-950 bg-white bg-opacity-80 dark:bg-opacity-60 font-sans text-base`}
                >
                    <div className="mx-4">
                        <h1 className="text-4xl mt-8 font-bold">
                            {t('index.welcome')}
                            {user.username && ` ${user.username}`}!
                        </h1>
                        <Contacts />
                        <div className="mt-4">
                            <Gallery />
                        </div>
                        <h2 className="text-2xl mt-8 mb-4 font-bold">
                            {t('index.routes')}
                        </h2>
                        <div className="flex mt-6 mb-12 space-x-4 dark:text-white">
                            {routes.map((route, index) => (
                                <Link
                                    key={index}
                                    href={route.path}
                                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    {t(`index.${route.label.toLowerCase()}`)}
                                    <FiExternalLink className="ml-1 w-4 h-4" />
                                    </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <FloatingBanner />
        </>
    );
};

export default HomePage;
