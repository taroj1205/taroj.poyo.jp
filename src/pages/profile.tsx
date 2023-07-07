import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

const Profile = () => {
    const { user, error, isLoading } = useUser();
    const router = useRouter();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    if (!user) {
        router.push('/api/auth/login');
        return null;
    }

    return (
        <div className="flex flex-col items-center">
            <img
                className="w-32 h-32 rounded-full mb-4"
                src={user?.picture ?? undefined}
                alt={user?.name ?? undefined}
            />
            <h2 className="text-2xl font-bold mb-2">{user.nickname}</h2>
            <p className="text-gray-500">{user.email}</p>
        </div>
    );
};

export default Profile;
