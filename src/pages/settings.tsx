import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';
import CustomSelect from '../components/SelectTheme';
import Profile from './profile';
import LanguageSwitch from '../components/LanguageSwitch';

const Settings = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <meta property="og:title" content="Settings - taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="Settings page for taroj.poyo.jp"
                />
                <meta name="twitter:title" content="Settings - taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="Settings page for taroj.poyo.jp"
                />
                <title>{t('title.settings')}</title>
            </Head>
            <div className="container mx-auto p-4 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">{t('settings')}</h1>
                <Profile />
                <div className="mb-4">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">
                            {t('change.profile picture')}
                        </h2>
                        <p>
                            {t('gravatar.message')}
                            <br />
                            {t('gravatar.signupMessage')}
                            <a
                                href="https://gravatar.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-2"
                            >
                                Gravatar
                                <FiExternalLink className="inline-block ml-1" />
                            </a>
                        </p>
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
                            <CustomSelect />
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
                            <LanguageSwitch isHeader={false} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
