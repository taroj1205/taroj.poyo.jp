import { useAuth, AuthContextValue } from "./AuthContext";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

const ChangeUsername = () => {
    const { t } = useTranslation()
    const { token, user, setUser, isLoading } = useAuth() as AuthContextValue;
    const [isValidUsername, setValidUsername] = useState(true);
    const [username, setUsername] = useState('');
    const [popupOpen, setPopupOpen] = useState(false);
    const [error, setError] = useState('');
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const { theme } = useTheme();

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
        setIsOverlayVisible(!isOverlayVisible);
        console.log(isOverlayVisible);
        setError('');
    };

    const checkUsername = (name: string) => {
        const regex = new RegExp(/^[A-Za-z0-9]{3,}(_[A-Za-z0-9]+)?(\.[A-Za-z0-9]+)?$/);
        setUsername(name)
        if (username.length >= 3 && !regex.test(username))
            setValidUsername(false);
        else
            setValidUsername(true);
    };

    const handleUrlSubmit = async (event: React.MouseEvent) => {
        event.preventDefault();
        if (username && username.trim()) {
            const newUsername = username.trim() as string;
            console.log(newUsername)
            if (isValidUsername) {
                try {
                    const response = await fetch('/api/change', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            method: 'username',
                            username: newUsername,
                            token,
                        })
                    });

                    if (response.ok) {
                        if (user) {
                            // Update user profile data
                            user.user_metadata.username = newUsername

                            setUser({ ...user}); // Update the user context
                        }
                        localStorage.setItem('userProfileData', JSON.stringify(user));
                    } else {
                        throw new Error('Failed to update username.')
                    }

                } catch (error) {
                    console.error(error);
                }
            } else {
                setError('Invalid username.')
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
                        {t('change.profile username')}
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
                            <div className="w-72 max-w-[90%] bg-white p-2 rounded-lg shadow-lg dark:bg-gray-800">
                                <div className="flex justify-end pr-1">
                                    <button
                                        className="text-gray-600 dark:text-white"
                                        aria-label='close'
                                        onClick={togglePopup}
                                    >
                                        X
                                    </button>
                                </div>
                                <div className='flex justify-center'>
                                    <div className='flex flex-col mb-3'>
                                        <h2 className="text-xl font-semibold text-center mb-1">
                                            {t('change.profile username new')}
                                        </h2>
                                        <form className="flex items-center flex-col">
                                            <input
                                                type="text"
                                                id="profile-picture-url"
                                                defaultValue={user?.user_metadata.username}
                                                onChange={(e) => {
                                                    checkUsername(e.target.value);
                                                    setError('');
                                                }}
                                                className="flex-grow text-center border-none rounded-lg shadow-sm text-black dark:text-white bg-gray-200  h-9 dark:bg-gray-900"
                                            />
                                            <button
                                                type="submit"
                                                aria-label='change'
                                                className="w-full mt-2 text-black dark:text-white bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-700 dark:hover:bg-gray-700 dark:bg-gray-900 h-9"
                                                onClick={(e) => handleUrlSubmit(e)}
                                            >
                                                {t('change.set username')}
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
    )
}

export default ChangeUsername