import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineEdit } from 'react-icons/ai'; // Import the AiOutlineEdit icon

const Footer = () => {
    const { t } = useTranslation('translation');
    const router = useRouter();

    return (
        <footer className="w-full bg-white dark:bg-slate-900 p-4 mt-auto">
            <div className="mx-auto md:max-w-7xl">
                <div className="flex justify-between items-center">
                    <div className="mt-0">
                        <p className="text-gray-600 dark:text-gray-300">
                            &copy; {new Date().getFullYear()} Shintaro Jokagi | {t('footer.all_rights_reserved')}
                        </p>
                        <Link href="mailto:taroj1205@gmail.com" className="text-gray-600 dark:text-gray-300">
                            taroj1205@gmail.com
                        </Link>
                        <Link
                            href={`https://github.com/taroj1205/taroj.poyo.jp/edit/dev/src/pages/${router.pathname === '/'
                                ? 'index'
                                : `${router.pathname}`}.tsx`}
                            className="flex mt-2"
                        >
                            <span className="flex items-center bg-gray-200 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-black text-black dark:text-white font-bold py-2 px-4 rounded-lg">
                                <AiOutlineEdit className="mr-2" />
                                {t('footer.edit_on_github')}
                            </span>
                        </Link>
                    </div>
                    <div>
                        <h4 className="text-gray-800 dark:text-white font-bold mb-2">{t('footer.sitemap')}</h4>
                        <ul className="space-y-1 flex flex-col">
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
