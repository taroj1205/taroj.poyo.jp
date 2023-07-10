import React from 'react';
import { useTranslation } from 'react-i18next';

const Announcement = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-blue-600 text-white py-4 px-4 text-sm flex items-center justify-center max-w-screen">
            <p className="absolute animate-announcement w-full max-w-screen whitespace-nowrap">
                {t('announcement.content')}
            </p>
        </div>
    );
};

export default Announcement;
