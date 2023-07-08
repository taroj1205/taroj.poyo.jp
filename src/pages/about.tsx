import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SchoolHistory from '../components/SchoolHistory';

const About = () => {
    const { t, i18n } = useTranslation('translation'); // Specify the translation key

    useEffect(() => {
        const userLanguage = window.navigator.language;
        let language;

        // Check if user language is Japanese
        if (userLanguage.includes('ja')) {
            language = 'ja'; // Set Japanese language
        } else {
            language = 'en'; // Set English as fallback language
        }
        i18n.changeLanguage(language);
    }, []);

    return (
        <main className="bg-cover bg-no-repeat bg-fixed bg-center" style={{ backgroundImage: "url('https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/thumbnail.png')" }}>
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
                    <h2 className="text-2xl mt-4">{t('about.countries')}</h2>
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
    );
};

export default About;
