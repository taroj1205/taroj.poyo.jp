import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation('translation'); // Assuming you have translation keys for footer content

    return (
        <footer className="w-full bg-gray-100 dark:bg-gray-800 p-4 mt-auto">
            <div className="mx-auto">
                <div className="flex justify-between items-center">
                    <div className='mt-[-2rem]'>
                        <p className="text-gray-600 dark:text-gray-300">
                            &copy; {new Date().getFullYear()} Shintaro Jokagi | {t('footer.all_rights_reserved')}
                        </p>
                        <Link href='mailto:taroj1205@gmail.com' className="text-gray-600 dark:text-gray-300">taroj1205@gmail.com</Link>
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
                            <li>
                                <Link href="/settings" className="text-blue-500 hover:underline">
                                    {t('footer.settings')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
