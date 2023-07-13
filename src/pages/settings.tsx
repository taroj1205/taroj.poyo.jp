import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiExternalLink } from 'react-icons/fi';

const Settings = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">{t('settings')}</h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                    {t('change.profile picture')}
                </h2>
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
            <div>{/* Add other settings options here */}</div>
        </div>
    );
};

export default Settings;
