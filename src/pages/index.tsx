import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Head from 'next/head';
import Contacts from '../components/Contacts';
import { AiFillHome } from 'react-icons/ai';
import { FaUser, FaComments, FaCog, FaBlog, FaGithub } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import { SiReact, SiNextdotjs, SiMysql, SiTailwindcss } from 'react-icons/si';
import { IconType } from 'react-icons';

const SkillItem = ({ icon: Icon, label, color }: { icon: IconType; label: string; color: string }) => (
    <div
        className="flex flex-col items-center justify-center my-2 cursor-pointer transition duration-300 transform hover:scale-105 p-4 rounded-lg"
        style={{ backgroundColor: color, color: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
    >
        <Icon className="w-16 h-16 mb-2" /> {/* Adjust the icon size to your preference */}
        <span className="text-lg text-center font-semibold">{label}</span>
    </div>
);

const RouteLink = ({ path, label, icon: Icon }: { path: string; label: string; icon: IconType }) => (
    <Link href={path} className="group flex flex-col items-center justify-center p-5 rounded-lg hover:bg-opacity-70 transition-colors shadow-md bg-white dark:bg-zinc-950 text-black dark:text-white">
        {Icon && (
            <span className="flex justify-center md:group-hover:opacity-10 opacity-100 text-4xl dark:text-white text-black transition-opacity duration-500">
                <Icon />
            </span>
        )}
        <div
            className="flex justify-center md:group-hover:opacity-100 md:opacity-0 md:absolute transition-opacity duration-500"
        >
            <span className="text-lg font-bold dark:text-white text-black">{label}</span>
        </div>
    </Link>
);


const MadeWith = () => {
    const { t } = useTranslation('translation'); // Assuming you have translation keys for skill labels

    const skills = [
        { icon: SiReact, label: t('skill.react'), color: '#149eca' }, // Blue for React
        { icon: SiNextdotjs, label: t('skill.nextjs'), color: '#000000' }, // Black for Next.js
        { icon: SiTailwindcss, label: t('skill.tailwind'), color: '#4C51BF' } // Blue for Tailwind CSS
    ];

    return (
        <div className="my-8">
            <h2 className="text-2xl md:text-4xl font-bold">{t('skill.madeWith')}</h2>
            <div className="grid grid-cols-3 gap-4 max-w-sm">
                {skills.map((skill, index) => (
                    <SkillItem key={index} icon={skill.icon} label={skill.label} color={skill.color} />
                ))}
            </div>
        </div>
    );
};

const HomePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth() || {};

    const routes = [
        { path: '/', label: 'Home', icon: AiFillHome },
        { path: '/about', label: 'About', icon: FaUser },
        { path: '/chat', label: 'Chat', icon: FaComments },
        { path: '/settings', label: 'Settings', icon: FaCog },
        {
            path: 'https://taroj1205.hatenablog.com',
            label: 'Blog',
            icon: FaBlog
        },
        {
            path: 'https://github.com/taroj1205',
            label: 'GitHub',
            icon: FaGithub
        },
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
                className="bg-cover bg-no-repeat bg-fixed bg-center h-screen"
                style={{
                    backgroundImage: "url('/image/thumbnail/thumbnail.webp')",
                }}
            >
                <div className="flex flex-col justify-center items-center h-full text-black dark:text-white dark:bg-zinc-950 bg-white bg-opacity-60 dark:bg-opacity-60">
                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                        {t('index.welcome')}
                        {user?.username && ` ${user.username}`}!
                    </h1>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                        {routes.map((route, index) => (
                            <RouteLink
                                key={index}
                                path={route.path}
                                label={t(`index.${route.label.toLowerCase()}`)}
                                icon={route.icon}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="container mx-auto max-w-5xl py-10 text-black dark:text-white">
                <div className='mx-4'>
                    <h2 className="text-2xl md:text-4xl font-bold">{t('index.contact')}</h2>
                    <Contacts />
                    <MadeWith />
                    <h2 className="text-2xl md:text-4xl mt-8 mb-4 font-bold">{t('supported language')}</h2>
                    <ul className="list-disc list-inside text-lg">
                        <li>{t('english')}</li>
                        <li>{t('japanese')}</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default HomePage;