import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import router from 'next/router';

interface ProfileData {
    email: string;
    username: string;
    picture: string;
}

const Profile = () => {
    const [user, setUser] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
    });
    const { t } = useTranslation();

    useEffect(() => {
        const userData = localStorage.getItem("userProfileData");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <>
            <Head>
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
            <div className="flex flex-col pt-1 items-center">
                <img
                    className="w-32 h-32 rounded-full mb-4"
                    src={user.picture ?? undefined}
                    alt={user.username ?? undefined}
                />
                <h2 className='text-black dark:text-white'>{t('your.username')}: {user.username}</h2>
                <p className="text-gray-500">{t('your.email')}: {user.email}</p>
            </div>
        </>
    );
};

export default Profile;
