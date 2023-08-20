import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SchoolHistory from '../components/SchoolHistory';
import Head from 'next/head';
import Contacts from '../components/Contacts';
import MySkills from '../components/MySkills';
import NCEA from '../components/NCEA/Ncea';
import RankScore from '../components/NCEA/RankScore';
import Graph from '../components/NCEA/NceaGraph';
import Link from 'next/link';
import i18n from '../../i18n';
import Footer from '../components/Footer';
import Image from 'next/image';


const About = () => {
    const { t } = useTranslation('translation');
    const sceneRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const height = window.innerHeight;
            if (sceneRef.current) {
                sceneRef.current.style.minHeight = `${height}px`;
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return (
        <>
            <Head>
                <meta name='title' content='About - taroj.poyo.jp' />
                <meta name='description' content='About page for taroj.poyo.jp' />
                <meta property="og:title" content="About - taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="About page for taroj.poyo.jp"
                />
                <meta name="twitter:title" content="About - taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="About page for taroj.poyo.jp"
                />
                <link rel="preload" href="/image/thumbnail/thumbnail.webp" as="image" />
                <title>{t('title.about')}</title>
            </Head>
            <div className='fixed inset-0 z-[-10]'>
                <Image alt='thumbnail image' src="/image/thumbnail/thumbnail.webp" layout="fill" objectFit="cover" />
            </div>
            <div ref={sceneRef} style={{ minHeight: 'calc(100vh - 40px)' }} className="flex flex-col justify-center items-center text-black dark:text-white dark:bg-zinc-950 bg-white bg-opacity-60 dark:bg-opacity-70">
                <Image
                    className="pfp rounded-full w-40 mx-auto"
                    src="/image/profile/pfp.webp"
                    alt="Profile Picture"
                    width={300}
                    height={300}
                />
                <h1 className="text-4xl md:text-5xl lg:text-6xl text-center mt-2 md:mt-8 font-bold">
                    {t('about.title')}
                </h1>
                <div className="mt-2 md:mt-8 mx-4">
                    <p className="text-lg md:text-lg">
                        {t('about.birthdate')}
                    </p>
                    <p className="text-lg md:text-lg">
                        {t('about.injury')}
                    </p>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl mt-2 md:mt-6 mb-2 md:mb-4 font-bold">
                        {t('about.countries')}
                    </h2>
                    <ul className="list-disc list-inside text-lg md:text-lg">
                        <li>{t('about.country.japan')}</li>
                        <li>{t('about.country.philippines')}</li>
                        <li>{t('about.country.newzealand')}</li>
                    </ul>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl mt-2 md:mt-6 mb-2 md:mb-4 font-bold">
                        {t('about.hobbies')}
                    </h2>
                    <ul className="list-disc list-inside text-lg md:text-lg">
                        <li>{t('about.hobby.kendama')}</li>
                        <li>{t('about.hobby.jumprope')}</li>
                        <li>{t('about.hobby.programming')}</li>
                        <li>{t('about.hobby.reading')}</li>
                    </ul>
                </div>
            </div>
            <div className='bg-white dark:bg-zinc-950 w-full'>
                <div className='mb-8'>
                    <div className='lg:flex lg:flex-col lg:justify-center lg:items-center mb-5 px-4'>
                        <MySkills />
                        <h2 className="text-2xl md:text-4xl mt-6 font-bold">
                            {t('ncea.title')}
                        </h2>
                        {i18n.language === 'ja' && (
                            <Link href="https://www.edukiwi.com/highschool/ncea-ue/" target="_blank" rel="noopener noreferrer" className='flex items-center'>
                                https://www.edukiwi.com/highschool/ncea-ue/
                            </Link>
                        )}
                        <p className='text-lg font-bold mt-2'>{t('ncea.currentRankScore')}<RankScore /></p>
                        <Graph />
                        <NCEA />
                        <h2 className="text-2xl md:text-4xl mt-6 mb-4 font-bold">
                            {t('about.education.schoolHistory')}
                        </h2>
                        <SchoolHistory />
                        <h2 className="text-2xl md:text-3xl lg:text-4xl mt-6 mb-2 font-bold">
                            {t('index.contact')}
                        </h2>
                        <Contacts />
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default About;
