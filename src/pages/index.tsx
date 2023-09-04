import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Head from 'next/head';
import Contacts from '../components/Contacts';
import { AiFillHome } from 'react-icons/ai';
import { FaBlog, FaCog, FaComments, FaGithub, FaUser } from 'react-icons/fa';
import { SiNextdotjs, SiReact, SiTailwindcss } from 'react-icons/si';
import { IconType } from 'react-icons';
import Image from 'next/image';
import Footer from '../components/Footer';
import { Fade } from "react-awesome-reveal";

const SkillItem = ({ icon: Icon, label, color }: { icon: IconType; label: string; color: string }) => (
    <div
        className="flex flex-col items-center justify-center my-2 cursor-pointer transition duration-300 transform hover:scale-105 p-4 rounded-lg"
        style={{ backgroundColor: color, color: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
    >
        <Icon className="w-16 h-16 mb-2" />
        <span className="text-lg text-center font-semibold">{label}</span>
    </div>
);

const RouteLink = ({ path, label, icon: Icon }: { path: string; label: string; icon: IconType }) => (
    <Link href={path}
        className="group flex flex-col items-center justify-center p-5 rounded-lg hover:bg-opacity-70 transition-colors shadow-md bg-white dark:bg-zinc-950 text-black dark:text-white">
        {Icon && (
            <span
                className="flex justify-center md:group-hover:opacity-10 opacity-100 text-4xl dark:text-white text-black transition-opacity duration-500">
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
    const { t } = useTranslation(); // Assuming you have translation keys for skill labels

    const skills = [
        { icon: SiReact, label: t('skill.react'), color: '#0e7696' }, // Blue for React
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
    const sceneRef = React.useRef<HTMLDivElement>(null);

    const routes = [
        { path: '/', label: 'Home', icon: AiFillHome },
        { path: '/about', label: 'About', icon: FaUser },
        { path: '/apps/chat', label: 'Chat', icon: FaComments },
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


    useEffect(() => {
        const handleResize = () => {
            const height = window.innerHeight;
            if (sceneRef.current) {
                sceneRef.current.style.height = `${height - 40}px`;
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Head>
                <meta name='title' content='Home - taroj.poyo.jp' />
                <meta name='description' content='Index page for taroj.poyo.jp' />
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
                <link rel="preload" href="/image/thumbnail/thumbnail.webp" as="image" />
                <title>{t('title.index')}</title>
            </Head>
            <div className='fixed inset-0 z-[-10]'>
                <Image alt='thumbnail image' src="/image/thumbnail/thumbnail.webp" fill={true} className='object-cover' />
            </div>
            <div ref={sceneRef} style={{ height: 'calc(100vh - 40px)' }}
                className="flex flex-col justify-center items-center text-black dark:text-white dark:bg-zinc-950 bg-white bg-opacity-60 dark:bg-opacity-60">
                <Fade>
                    <h1 className="text-7xl font-bold flex justify-center items-center flex-col">
                        <div className="stack" style={{ ['--stacks' as any]: '3' }}>
                            <span style={{ ['--index' as any]: '0' }}>{t('index.welcome')}</span>
                            <span style={{ ['--index' as any]: '1' }}>{t('index.welcome')}</span>
                            <span style={{ ['--index' as any]: '2' }}>{t('index.welcome')}</span>
                        </div>
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
                </Fade>
            </div>
            <div className="mx-auto h-full pt-10 text-black dark:text-white bg-white dark:bg-zinc-950">
                <div className='flex items-center justify-center'>
                    <Fade>
                        <div className='mx-4 max-w-5xl'>
                            <h2 className="text-2xl md:text-4xl font-bold">{t('index.contact')}</h2>
                            <Contacts />
                            <MadeWith />
                            <h2 className="text-2xl md:text-4xl mt-8 mb-4 font-bold">{t('supported language')}</h2>
                            <ul className="list-disc list-inside text-lg font-bold mb-5">
                                <li>{t('english')}</li>
                                <li>{t('japanese')}</li>
                            </ul>
                        </div>
                    </Fade>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default HomePage;