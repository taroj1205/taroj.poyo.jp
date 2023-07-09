import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';

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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error occurred: {error.message}</div>;
    if (!user) {
        router.push('/api/auth/login');
        return null;
    }

    useEffect(() => {
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
    }, []);

    return (
        <div className="flex flex-col items-center">
            <img
                className="w-32 h-32 rounded-full mb-4"
                src={userData.picture ?? undefined}
                alt={userData.name ?? undefined}
            />
            <h2>Your username: {userData.username}</h2>
            <p className="text-gray-500">Your email: {userData.email}</p>
        </div>
    );
};

export default Profile;
