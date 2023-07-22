import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

interface ProfileData {
    email: string;
    username: string;
    picture: string;
    name: string;
}

const Profile = () => {
    const router = useRouter();
    const { user, error, isLoading } = useUser();
    const [userData, setUserData] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
        name: '',
    });
    const { t } = useTranslation();

    useEffect(() => {
        if (isLoading) return;
        if (error) return;
        if (!user) {
            router.push('/api/auth/login');
            return;
        }

        const fetchData = async () => {
            try {
                const userId = user.sub;
                const url = `/api/getUser?user=${userId}`;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: userId,
                    }),
                };
                const response = await fetch(url, requestOptions);
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [isLoading, error, user, router]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error occurred: {error.message}</div>;
    if (!user) return null;

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
                alt={userData.name ?? undefined}
            />
            <h2 className='text-black dark:text-white'>{t('your.username')}: {userData.username}</h2>
            <p className="text-gray-500">{t('your.email')}: {userData.email}</p>
            </div>
            </>
    );
};

export default Profile;
