import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import type { AuthContextValue } from './AuthContext';
import { validateImage } from 'image-validator';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';

const ChangeProfile = () => {
    const { t } = useTranslation();
    const { token, user, setUser, isLoading } = useAuth() as AuthContextValue;
    const [url, setURL] = useState('');
    const [popupOpen, setPopupOpen] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        console.log(user);
    }, []);
    if (!mounted) return null;

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
        setIsOverlayVisible(!isOverlayVisible);
        console.log(isOverlayVisible);
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
            const newPictureUrl = url.trim() as string;
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
                        if (setUser && user) {
                            // Update user profile data
                            user.user_metadata.avatar = newPictureUrl;
                        
                            setUser({ ...user }); // Update the user context
                        }                                                               
                        localStorage.setItem('userProfileData', JSON.stringify(user));
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

    const ChevronDown = ({ color }: { color: string }) => (
        <Svg className='flex items-center'>
            <path
                d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
                fill={color} // Use the color prop for the fill color
                fillRule="evenodd" />
        </Svg>
    );

    const Svg = (p: JSX.IntrinsicElements['svg']) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            focusable="false"
            role="presentation"
            {...p}
        />
    );

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : user && user.user_metadata.avatar ? (
                <div className="flex flex-col items-center">
                    <button
                        className="flex items-center text-black dark:text-white px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700"
                        aria-label='change profile picture button'
                        onClick={togglePopup}
                    >
                        {t('change.profile picture')}
                        {
                            isOverlayVisible ? (
                                <ChevronDown color={theme === 'dark' ? 'white' : 'black'} />
                            ) : (
                                <ChevronDown color="gray" />
                            )}
                    </button>
                    {isOverlayVisible && (
                        <div
                            className="fixed inset-0 z-10 bg-black bg-opacity-50"
                            onClick={togglePopup}
                        />
                    )}
                    {popupOpen && (
                        <div className="fixed inset-0 z-[11] flex items-center justify-center h-fit w-fit m-auto">
                            <div className="w-96 max-w-[90%] bg-white p-2 rounded-lg shadow-lg dark:bg-gray-800">
                                <div className="flex justify-end pr-1">
                                    <button
                                        className="text-gray-600 dark:text-white"
                                        aria-label='close'
                                        onClick={togglePopup}
                                    >
                                        X
                                    </button>
                                </div>
                                <div className='flex'>
                                    <div className="relative w-32 h-32 mb-4">
                                        <img
                                            src={user.user_metadata.avatar.toString()}
                                            alt="Profile picture"
                                            className="rounded-full object-cover w-full h-full cursor-pointer"
                                            onClick={() => {
                                                window.open(user.user_metadata.avatar.toString(), '_blank');
                                            }}
                                        />
                                    </div>
                                    <div className='flex flex-col ml-2'>
                                        <h2 className="text-xl font-semibold mb-2">
                                            {t('change.profile picture URL')}
                                        </h2>
                                        <form className="flex items-center flex-col" onSubmit={handleUrlSubmit}>
                                            <input
                                                type="text"
                                                id="profile-picture-url"
                                                defaultValue={user?.user_metadata.avatar}
                                                onChange={(e) => {
                                                    setURL(e.target.value);
                                                    setError('');
                                                }}
                                                className="flex-grow text-center border-none rounded-lg shadow-sm text-black dark:text-white bg-gray-200  h-9 dark:bg-gray-900"
                                            />
                                            <button
                                                type="submit"
                                                aria-label='change'
                                                className="w-full mt-2 text-black dark:text-white bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-700 dark:hover:bg-gray-700 dark:bg-gray-900 h-9"
                                            >
                                                {t('change.set picture')}
                                            </button>
                                        </form>
                                        {error && (
                                            <p className="text-red-500 mt-2">{error}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </>
    );
};

export default ChangeProfile;
