import React from 'react';
import { useTranslation } from 'react-i18next';
import SchoolHistory from '../components/SchoolHistory';
import Head from 'next/head';
import Contacts from '../components/Contacts';
import MySkills from '../components/MySkills';
import Image from 'next/image';
import AboutMe from '../components/AboutMe';
import NCEA from '../components/NCEA/Ncea';
import RankScore from '../components/NCEA/RankScore';
import Graph from '../components/NCEA/NceaGraph';
import Link from 'next/link';
import i18n from '../../i18n';

const About = () => {
    const { t } = useTranslation('translation');

    return (
        <div>
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
            <AboutMe />
            <div className='lg:flex lg:flex-col lg:justify-center lg:items-center mb-8 px-4'>
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
        </div>
    );
};

export default About;
