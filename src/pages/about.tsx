import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SchoolHistory from '../components/SchoolHistory';
import Head from 'next/head';

const About = () => {
    const { t } = useTranslation('translation'); // Specify the translation key

    return (
        <div>
            <Head>
                <meta property="og:title" content="taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="A website for Shintaro Jokagi"
                />
                <meta
                    property="og:image"
                    content="https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/thumbnail.png"
                />
                <meta
                    property="og:image:alt"
                    content="Shintaro Jokagi Website Thumbnail"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="A website for Shintaro Jokagi"
                />
                <meta
                    name="twitter:image"
                    content="https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/thumbnail.png"
                />
                <meta
                    name="twitter:image:alt"
                    content="Shintaro Jokagi Website Thumbnail"
                />
                <meta name="twitter:site" content="@taroj1205" />
                <meta name="twitter:creator" content="@taroj1205" />
                <title>{t('about.title')}</title>
            </Head>
            <main
                className="bg-cover bg-no-repeat bg-fixed bg-center"
                style={{
                    backgroundImage:
                        "url('https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/thumbnail.png')",
                }}
            >
                <div className="about container mx-auto py-10 max-w-6xl text-white bg-zinc-950 font-sans text-base">
                    <img
                        className="pfp rounded-full w-40 mx-auto"
                        src="https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/pfp.png"
                        alt="Profile Picture"
                    />
                    <h1 className="text-4xl text-center mt-8">
                        {t('about.title')}
                    </h1>
                    <section className="mt-8 mx-4">
                        <p className="text-lg">{t('about.birthdate')}</p>
                        <h2 className="text-2xl mt-4">{t('about.events')}</h2>
                        <p>{t('about.injury')}</p>
                        <h2 className="text-2xl mt-4">
                            {t('about.countries')}
                        </h2>
                        <ul>
                            <li>{t('about.country.japan')}</li>
                            <li>{t('about.country.philippines')}</li>
                            <li>{t('about.country.newzealand')}</li>
                        </ul>
                        <h2 className="text-2xl mt-4">{t('about.hobbies')}</h2>
                        <ul>
                            <li>{t('about.hobby.kendama')}</li>
                            <li>{t('about.hobby.jumprope')}</li>
                            <li>{t('about.hobby.programming')}</li>
                            <li>{t('about.hobby.reading')}</li>
                        </ul>
                    </section>
                    <div className="mx-4">
                        <SchoolHistory />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default About;
