import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from './AuthContext';
import { validateImage } from "image-validator";

interface ProfileData {
    email: string;
    username: string;
    picture: string;
    name: string;
}

const ChangeProfile = () => {
    const { t } = useTranslation();
    const { token, user, setUser } = useAuth() || {}; // Get the user data directly from useAuth
    const [url, setURL] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('userProfileData');
        if (userData && setUser) { // check if setUser exists
            setUser(JSON.parse(userData));
        }
    }, [setUser]); // add setUser to the dependency array

    const urlValidation = async (url: string) => {
        const isValidImage = await validateImage(url);
        console.log(isValidImage);
        return isValidImage;
    };

    const handleUrlSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (url && url.trim()) {
            const newPictureUrl = url.trim();
            const validUrl =urlValidation(newPictureUrl);
            if (await validUrl) {
                try {
                    const response = await fetch('/api/change', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            method: 'picture',
                            url: newPictureUrl,
                            token,
                        }),
                    });

                    if (response.ok) {
                        if (setUser) { // check if setUser exists
                            setUser((prevUser) => ({
                                ...prevUser,
                                picture: newPictureUrl,
                            }));
                        }
                        localStorage.setItem('userProfileData', JSON.stringify(user));
                    } else {
                        throw new Error('Failed to upload image');
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error('Invalid URL');
            }
        }
    };

    return (
        <div>
            {user && user.picture && (
                <div className="relative">
                    <img
                        src={user.picture.toString()}
                        alt="Profile picture"
                        className="w-32 h-32 rounded-full mb-4 mx-auto cursor-pointer"
                        width={128}
                        height={128}
                    />
                </div>
            )}
            <form onSubmit={handleUrlSubmit}>
                <h2 className="text-xl font-semibold mb-2">{t('change.profile picture')}</h2>
                <label htmlFor="profile-picture-url">{t('profile picture URL')}</label>
                <input
                    type="text"
                    id="profile-picture-url"
                    defaultValue={user?.picture}
                    onChange={(e) => {
                        setURL(e.target.value);
                    }}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                />
                <button
                    type="submit"
                    className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    {t('change.set picture')}
                </button>
            </form>
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
    );
};

export default ChangeProfile;
