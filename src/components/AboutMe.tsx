import React from 'react';
import {useTranslation} from 'react-i18next';
import Image from 'next/image';

const AboutMe = () => {
    const {t} = useTranslation('translation');

    return (
        <div
            className="bg-cover bg-no-repeat bg-fixed bg-center min-h-screen h-fit"
            style={{
                backgroundImage: "url('/image/thumbnail/thumbnail.webp')",
            }}
        >
            <div
                className="flex flex-col min-h-screen h-fit justify-center items-center text-black dark:text-white dark:bg-zinc-950 bg-white bg-opacity-60 dark:bg-opacity-70 font-sans">
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
                    <h2 className="text-2xl md:text-3xl lg:text-4xl mt-2 md:mt-6 mb-4 font-bold">
                        {t('about.events')}
                    </h2>
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
        </div>
    );
};

export default AboutMe;