import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function ChangeProfile() {
    const { t } = useTranslation();
    const router = useRouter();

    interface ProfileData {
        email: string;
        username: string;
        picture: string;
        name: string;
    }

    const [user, setUser] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
        name: '',
    })

    useEffect(() => {
        const userData = localStorage.getItem("userProfileData");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <div>
            {user && user.picture && (
                <img
                    src={user.picture}
                    alt="Profile picture"
                    className="w-32 h-32 rounded-full mb-4 mx-auto cursor-pointer"
                    onClick={() => router.push('/profile')}
                />
            )}
            <h2 className="text-xl font-semibold mb-2">{t('change.profile picture')}</h2>
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
}

export default ChangeProfile;