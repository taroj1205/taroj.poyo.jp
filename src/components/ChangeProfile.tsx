import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { validateImage } from 'image-validator';

const ChangeProfile = () => {
    const { t } = useTranslation();
    const { token, user, setUser } = useAuth() || {};
    const [url, setURL] = useState('');
    const [popupOpen, setPopupOpen] = useState(false);
    const [error, setError] = useState('');

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
        setError('');
    };

    const urlValidation = async (url: string) => {
        let isValidImage = await validateImage(url);
        console.log(isValidImage);
        if (url.trim() === user?.picture) {
            isValidImage = false;
        }
        return isValidImage;
    };

    const handleUrlSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (url && url.trim()) {
            const newPictureUrl = url.trim();
            const validUrl = urlValidation(newPictureUrl);
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
                        if (setUser) {
                            setUser((prevUser) => ({
                                ...prevUser,
                                picture: newPictureUrl,
                            }));
                        }
                        localStorage.setItem('userProfileData', JSON.stringify(user));
                        window.location.reload();
                    } else {
                        throw new Error('Failed to upload image');
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setError('Invalid URL');
            }
        }
    };

    return (
        <>
            {user && user.picture && (
                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                        <img
                            src={user.picture.toString()}
                            alt="Profile picture"
                            className="rounded-full object-cover w-full h-full cursor-pointer"
                        />
                    </div>
                    <button
                        className="text-blue-500 underline"
                        onClick={togglePopup}
                    >
                        {t('change.profile picture')}
                    </button>
                    {popupOpen && (
                        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-96 bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800">
                                <div className="flex justify-end">
                                    <button
                                        className="text-gray-600 dark:text-white"
                                        aria-label='close'
                                        onClick={togglePopup}
                                    >
                                        X
                                    </button>
                                </div>
                                <h2 className="text-xl font-semibold mb-2">
                                    {t('change.profile picture URL')}
                                </h2>
                                <form className="flex items-center" onSubmit={handleUrlSubmit}>
                                    <input
                                        type="text"
                                        id="profile-picture-url"
                                        defaultValue={user?.picture}
                                        onChange={(e) => {
                                            setURL(e.target.value);
                                            setError('');
                                        }}
                                        className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 h-9 dark:bg-gray-900 dark:border-gray-600"
                                    />
                                    <button
                                        type="submit"
                                        aria-label='change'
                                        className="ml-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 dark:bg-gray-900 dark:hover:bg-gray-700 h-9"
                                    >
                                        {t('change.set picture')}
                                    </button>
                                </form>
                                {error && (
                                    <p className="text-red-500 mt-2">{error}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ChangeProfile;
