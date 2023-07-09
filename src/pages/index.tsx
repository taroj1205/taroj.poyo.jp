import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';

const HomePage = () => {
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
                <title>{t('index.title')}</title>
            </Head>

            <main className="container mx-auto py-10 max-w-6xl">
                <h2 className="text-4xl">{t('index.welcome')}</h2>
            </main>
        </div>
    );
};

export default HomePage;
