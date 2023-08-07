import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutMe = () => {
    const { t } = useTranslation('translation');

    return (
        <div className="mt-8 mx-4">
            <p className="text-lg md:text-lg">
                {t('about.birthdate')}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mt-6 mb-4 font-bold">
                {t('about.events')}
            </h2>
            <p className="text-lg md:text-lg">
                {t('about.injury')}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mt-6 mb-4 font-bold">
                {t('about.countries')}
            </h2>
            <ul className="list-disc list-inside text-lg md:text-lg">
                <li>{t('about.country.japan')}</li>
                <li>{t('about.country.philippines')}</li>
                <li>{t('about.country.newzealand')}</li>
            </ul>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mt-6 mb-4 font-bold">
                {t('about.hobbies')}
            </h2>
            <ul className="list-disc list-inside text-lg md:text-lg">
                <li>{t('about.hobby.kendama')}</li>
                <li>{t('about.hobby.jumprope')}</li>
                <li>{t('about.hobby.programming')}</li>
                <li>{t('about.hobby.reading')}</li>
            </ul>
        </div>
    );
};

export default AboutMe;