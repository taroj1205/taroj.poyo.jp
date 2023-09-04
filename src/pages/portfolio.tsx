import React from 'react';
import { ParallaxBanner } from 'react-scroll-parallax';
import { BannerLayer } from 'react-scroll-parallax/dist/components/ParallaxBanner/types';
import Footer from '../components/Footer';
import Contacts from '../components/Contacts';
import { useTranslation } from 'react-i18next';
import { SiNextdotjs, SiReact, SiTailwindcss } from 'react-icons/si';
import { IconType } from 'react-icons';
import { Fade } from "react-awesome-reveal";

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

const Portfolio = () => {
    const { t } = useTranslation();
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
            '/image/parallax/Kendama_Foreground.webp',
        translateY: [0, 15],
        scale: [0.5, 0.6, 'easeOutCubic'],
        shouldAlwaysCompleteAnimation: true,
        translateX: [20, -10],
    };

    const gradientOverlay: BannerLayer = {
        opacity: [0, 0.9],
        shouldAlwaysCompleteAnimation: true,
        expanded: false,
        children: (
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-blue-900" />
        ),
    };

    return (
        <>
            <ParallaxBanner
                layers={[background, headline, foreground, gradientOverlay]}
                className="aspect-[2/1] bg-gray-900 pt-[40px]"
            />
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

export default Portfolio;