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
    if (isLoading) return;
    if (error) return;
    if (!user) {
        router.push('/api/auth/login');
        return;
    }
    const [userData, setUserData] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
        name: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = user?.sub;
                const url = `/api/getUser?user=${userId}`;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Add the request body if required
                    body: JSON.stringify({
                        user: userId
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
            <h2 className="text-2xl font-bold mb-2">{userData.name}</h2>
            <p className="text-gray-500">{userData.email}</p>
            <h2>{userData.username}</h2>
        </div>
    );
};

export default Profile;
