import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Head from 'next/head';
import FloatingBanner from '../components/FloatingBanner';
import Contacts from '../components/Contacts';
import Gallery from '../components/Gallery';
import { AiFillHome } from 'react-icons/ai';
import { FaUser, FaComments, FaCog, FaBlog, FaEnvelope } from 'react-icons/fa';

interface ProfileData {
    email: string;
    username: string;
    picture: string;
    name: string;
}

interface RouteData {
    path: string;
    label: string;
    icon?: React.ReactNode;
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

    const routes: RouteData[] = [
        { path: '/', label: 'Home', icon: <AiFillHome /> },
        { path: '/about', label: 'About', icon: <FaUser /> },
        { path: '/chat', label: 'Chat', icon: <FaComments /> },
        { path: '/settings', label: 'Settings', icon: <FaCog /> },
        { path: 'https://taroj1205.hatenablog.com', label: 'Blog', icon: <FaBlog /> },
        { path: 'mailto:taroj1205@gmail.com', label: 'Email', icon: <FaEnvelope /> },
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
                    backgroundImage: "url('/image/thumbnail/thumbnail.png')",
                }}
            >
                <div
                    className={`container mx-auto py-10 max-w-5xl text-black dark:text-white dark:bg-zinc-950 bg-white bg-opacity-60 dark:bg-opacity-60 font-sans text-base`}
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
                        <div className="mt-6 dark:text-white rounded-lg bg-opacity-60 dark:bg-opacity-60 dark:bg-zinc-950 bg-white w-fit grid grid-cols-2 gap-2 p-4">
                            {routes.map((route, index) => (
                                <Link
                                    key={index}
                                    href={route.path}
                                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    {route.icon && (
                                        <span className="mr-1">{route.icon}</span>
                                    )}
                                    {t(`index.${route.label.toLowerCase()}`)}
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