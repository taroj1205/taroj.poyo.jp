import React from 'react';
import { ParallaxBanner } from 'react-scroll-parallax';
import { BannerLayer } from 'react-scroll-parallax/dist/components/ParallaxBanner/types';
import Footer from '../components/Footer';
import Contacts from '../components/Contacts';
import { useTranslation } from 'react-i18next';
import { AiFillHome } from 'react-icons/ai';
import { FaBlog, FaCog, FaCubes, FaGithub, FaUser } from 'react-icons/fa';
import { SiNextdotjs, SiReact, SiTailwindcss } from 'react-icons/si';
import { IconType } from 'react-icons';
import { Fade } from "react-awesome-reveal";
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

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

const SkillItem = ({ icon: Icon, label, color }: { icon: IconType; label: string; color: string }) => (
    <div
        className="flex flex-col items-center justify-center my-2 cursor-pointer transition duration-300 transform hover:scale-105 p-4 rounded-lg"
        style={{ backgroundColor: color, color: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
    >
        <Icon className="w-16 h-16 mb-2" />
        <span className="text-lg text-center font-semibold">{label}</span>
    </div>
);

const RouteLink = ({ path, label, icon: Icon, backgroundColor }: { path: string; label: string; icon: IconType; backgroundColor: string }) => (
    <Link href={path}
        className={`group flex flex-col w-28 items-center justify-center p-5 rounded-lg hover:bg-opacity-70 transition-colors shadow-md text-white ${backgroundColor}`}>
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

const Portfolio = () => {
    const { t } = useTranslation();

    const routes = [
        { path: '/', label: 'Home', icon: AiFillHome, backgroundColor: 'bg-blue-400 dark:bg-blue-800' },
        { path: '/about', label: 'About', icon: FaUser, backgroundColor: 'bg-green-400 dark:bg-green-800' },
        { path: '/apps', label: 'Apps', icon: FaCubes, backgroundColor: 'bg-red-400 dark:bg-red-800' },
        { path: '/settings', label: 'Settings', icon: FaCog, backgroundColor: 'bg-purple-400 dark:bg-purple-800' },
        {
            path: 'https://taroj1205.hatenablog.com',
            label: 'Blog',
            icon: FaBlog,
            backgroundColor: 'bg-yellow-400 dark:bg-yellow-800'
        },
        {
            path: 'https://github.com/taroj1205',
            label: 'GitHub',
            icon: FaGithub,
            backgroundColor: 'bg-gray-400 dark:bg-gray-800'
        },
    ];

    const background: BannerLayer = {
        image:
            '/image/parallax/Background.webp',
        translateY: [0, 50],
        opacity: [1, 0.3],
        scale: [1.05, 1, 'easeOutCubic'],
        shouldAlwaysCompleteAnimation: true,
    };

    const headline: BannerLayer = {
        translateY: [0, 30],
        scale: [1, 1.05, 'easeOutCubic'],
        shouldAlwaysCompleteAnimation: true,
        expanded: false,
        children: (
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-6xl md:text-8xl text-white font-thin">
                    {t('index.welcome')}
                </h1>
            </div>
        ),
    };

    const foreground: BannerLayer = {
        image:
            '/image/parallax/foreground.webp',
        translateY: [0, 15],
        scale: [1, 1.1, 'easeOutCubic'],
        shouldAlwaysCompleteAnimation: true,
    };

    const gradientOverlay: BannerLayer = {
        opacity: [0, 0.9],
        shouldAlwaysCompleteAnimation: true,
        expanded: false,
        children: (
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-blue-900" />
        ),
    };

    React.useEffect(() => {
        const handleResize = () => {
            const height = window.innerHeight;
            const parallax = document.getElementById('parallax') as HTMLDivElement;
            parallax.style.height = `${height}px`;
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
                <link rel="preload" href="/image/parallax/background.webp" as="image" />
                <link rel="preload" href="/image/parallax/foreground.webp" as="image" />
                <title>{t('title.index')}</title>
            </Head>
            <Fade>
                <ParallaxBanner
                    layers={[background, headline, foreground, gradientOverlay]}
                    className="aspect-[2/1] bg-gray-900 pt-[40px] h-screen"
                    style={{ height: '100vh' }}
                    id='parallax'
                />
            </Fade>
            <div className="mx-auto h-full pt-10 text-black dark:text-white">
                <div className='flex items-center justify-center bg-white dark:bg-zinc-950'>
                    <div>
                        <Fade className='mx-4 max-w-5xl'>
                            <h2 className="text-2xl md:text-4xl font-bold">{t('index.links')}</h2>
                            <div className="flex flex-wrap gap-4 py-6 md:flex-nowrap md:justify-start lg:flex-wrap lg:justify-center"
                            >
                                {routes.map((route, index) => (
                                    <RouteLink
                                        key={index}
                                        path={route.path}
                                        label={t(`index.${route.label.toLowerCase()}`)}
                                        icon={route.icon}
                                        backgroundColor={route.backgroundColor}
                                    />
                                ))}
                            </div>
                            <h2 className="text-2xl md:text-4xl font-bold">{t('index.contact')}</h2>
                            <Contacts />
                            <MadeWith />
                            <h2 className="text-2xl md:text-4xl mt-8 mb-4 font-bold">{t('supported language')}</h2>
                            <ul className="list-disc list-inside text-lg font-bold mb-5">
                                <li>{t('english')}</li>
                                <li>{t('japanese')}</li>
                            </ul>
                        </Fade>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Portfolio;