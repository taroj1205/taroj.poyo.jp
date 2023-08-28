import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomSelect from '../components/SelectTheme';
import ChangeProfile from '../components/ChangeProfile';
import ChangeUsername from '../components/ChangeUsername';

const Settings = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <meta name='title' content='Settings - taroj.poyo.jp' />
                <meta name='description' content='Settings page for taroj.poyo.jp' />
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
            <div className="container mx-auto p-4 flex flex-col items-center pt-20">
                <h1 className="text-2xl font-bold mb-4">{t('settings')}</h1>
                <div className="mb-4">
                    <div className="flex flex-col gap-y-4 mb-4">
                        <ChangeProfile />
                        <ChangeUsername />
                    </div>
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
                            <CustomSelect />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
