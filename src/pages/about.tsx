import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const userLanguage =
            window.navigator.language;
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
        <main className="container">
            <div id="ja_content">
                <img
                    className="pfp"
                    src="https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/pfp.png"
                    alt="Profile Picture"
                />
                <h1>{t('about.title')}</h1>
                <section className="general">
                    <p>{t('about.birthdate')}</p>
                    <h2>{t('about.events')}</h2>
                    <p>{t('about.injury')}</p>
                    <h2>{t('about.countries')}</h2>
                    <ul>
                        <li>{t('about.country.japan')}</li>
                        <li>{t('about.country.philippines')}</li>
                        <li>{t('about.country.newzealand')}</li>
                    </ul>
                    <h2>{t('about.hobbies')}</h2>
                    <ul>
                        <li>{t('about.hobby.kendama')}</li>
                        <li>{t('about.hobby.jumprope')}</li>
                        <li>{t('about.hobby.programming')}</li>
                        <li>{t('about.hobby.reading')}</li>
                    </ul>
                </section>
                <section className="education">
                    <h2>{t('about.school_history')}</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('about.start')}</th>
                                    <th>{t('about.end')}</th>
                                    <th>{t('about.school_name')}</th>
                                    <th>{t('about.grade')}</th>
                                    <th>{t('about.duration')}</th>
                                    <th>{t('about.location')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2009年4月</td>
                                    <td>2010年5月</td>
                                    <td>世田谷幼児生活団</td>
                                    <td>年少～年中</td>
                                    <td>1年ちょい</td>
                                    <td>東京</td>
                                </tr>
                                {/* Add more rows for other school history */}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default About;
