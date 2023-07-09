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
    const [editingName, setEditingName] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
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

    const handleNameEdit = () => {
        if (editingName) {
            // Perform API request to update the name
            // You can replace the alert with your own logic
            alert(`Name updated to: ${newName}`);
        }
        setEditingName(!editingName);
    };

    const handlePasswordEdit = () => {
        if (editingPassword) {
            // Perform API request to update the password
            // You can replace the alert with your own logic
            alert(`Password updated`);
        }
        setEditingPassword(!editingPassword);
    };

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
            <h2 className="text-2xl font-bold mb-2">
                {editingName ? (
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                ) : (
                    userData.name
                )}
            </h2>
            <p className="text-gray-500">{userData.email}</p>
            <h2>{userData.username}</h2>

            <div>
                <button onClick={handleNameEdit}>
                    {editingName ? 'Save Name' : 'Edit Name'}
                </button>
                <button onClick={handlePasswordEdit}>
                    {editingPassword ? 'Save Password' : 'Edit Password'}
                </button>
            </div>
        </div>
    );
};

export default Profile;
