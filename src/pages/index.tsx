import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Head from 'next/head';
import Contacts from '../components/Contacts';
import { AiFillHome } from 'react-icons/ai';
import { FaUser, FaComments, FaCog, FaBlog, FaEnvelope, FaGithub } from 'react-icons/fa';
import MadeWith from '../components/MadeWith';

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
        { path: 'https://github.com/taroj1205', label: 'GitHub', icon: <FaGithub /> },
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
            <div
                className="bg-cover bg-no-repeat bg-fixed bg-center"
                style={{
                    backgroundImage: "url('/image/thumbnail/thumbnail.webp')",
                }}
            >
                <div
                    className={`container mx-auto max-w-5xl text-black dark:text-white dark:bg-zinc-950 bg-white bg-opacity-60 dark:bg-opacity-60 font-sans text-base flex flex-col justify-between`}
                >
                    <div className="mx-4 flex flex-col justify-center flex-grow">
                        <h1 className="text-4xl mb-6 font-bold">
                            {t('index.welcome')}
                            {user.username && ` ${user.username}`}!
                        </h1>
                        <Contacts />
                        <h2 className="text-2xl mt-6 font-bold">
                            {t('index.routes')}
                        </h2>
                        <div className="mb-6 mt-2 dark:text-white rounded-lg bg-opacity-60 dark:bg-opacity-60 dark:bg-zinc-950 bg-white w-fit grid grid-cols-2 gap-2 p-4">
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
                        <MadeWith />
                        <h2 className="text-2xl mt-4 font-bold">{t('supported language')}</h2>
                        <ul className="mt-2 list-disc list-inside text-lg">
                            <li>{t('english')}</li>
                            <li>{t('japanese')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
