import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import {useAuth, AuthContextValue} from '../components/AuthContext';

const Profile = () => {
    const { user, isLoading } = useAuth() || {} as AuthContextValue;

    useEffect(() => {
        if (isLoading === false) {
            if (!user) {
                window.location.href = '/auth/login';
            }
        }
    }, [isLoading])

    const { t } = useTranslation();

    return (
        <>
            <Head>
                <meta name='title' content='Profile - taroj.poyo.jp' />
                <meta name='description' content='Profile page for taroj.poyo.jp' />
                <meta property="og:title" content="Profile - taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="Profile page for taroj.poyo.jp"
                />
                <meta name="twitter:title" content="Profile - taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="Profile page for taroj.poyo.jp"
                />
                <title>{t('title.profile')}</title>
            </Head>
            <div className="flex flex-col items-center pt-20">
                <img
                    className="w-32 h-32 rounded-full mb-4"
                    src={user?.user_metadata.avatar}
                    alt={user?.user_metadata.username}
                />
                <h2 className='text-black dark:text-white'>{t('your.username')}: {user?.user_metadata.username}</h2>
                <p className="text-gray-500">{t('your.email')}: {user?.email}</p>
            </div>
        </>
    );
};

export default Profile;
