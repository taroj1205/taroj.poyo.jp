import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

interface ProfileData {
    email: string;
    username: string;
    picture: string;
}

const Profile = () => {
    const [userData, setUserData] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
    });
    const { t } = useTranslation();

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/profile?token=${encodeURIComponent(token)}`, {
                        method: 'GET'
                    });
                    console.log(response);
                    const data = await response.json();
                    console.log(data);
                    setUserData(data);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
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
                    src={userData.picture ?? undefined}
                    alt={userData.username ?? undefined}
                />
                <h2 className='text-black dark:text-white'>{t('your.username')}: {userData.username}</h2>
                <p className="text-gray-500">{t('your.email')}: {userData.email}</p>
            </div>
        </>
    );
};

export default Profile;
