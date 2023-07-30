import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation('translation'); // Assuming you have translation keys for footer content

    return (
        <footer className="fixed bottom-0 w-full bg-gray-100 dark:bg-gray-800 p-4 mt-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600 dark:text-gray-300">
                            &copy; {new Date().getFullYear()} Shintaro Jokagi | {t('footer.all_rights_reserved')}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{t('footer.contact_info')}</p>
                    </div>
                    <div>
                        <h4 className="text-gray-800 dark:text-white font-bold mb-2">{t('footer.sitemap')}</h4>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/" className="text-blue-500 hover:underline">
                                    {t('footer.home')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-blue-500 hover:underline">
                                    {t('footer.about')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/chat" className="text-blue-500 hover:underline">
                                    {t('footer.chat')}
                                </Link>
                            </li>
                            {/* Add more links to other pages as needed */}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
