import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineEdit } from 'react-icons/ai';

const Footer = () => {
    const { t } = useTranslation('translation');
    const router = useRouter();

    return (
        <footer className="w-full bg-gray-100 dark:bg-gray-900 mt-auto">
            <div className="mx-auto p-4">
                <div className="flex justify-between items-center mx-auto md:max-w-2xl">
                    <div className="flex flex-col flex-1">
                        <div>
                        <p className="text-black dark:text-gray-300">
                            &copy; {new Date().getFullYear()} {t('name')} | {t('footer.all_rights_reserved')}
                        </p>
                        <Link href="mailto:taroj1205@gmail.com" className="text-black dark:text-gray-300">
                            taroj1205@gmail.com
                            </Link>
                        </div>
                        <div>
                            <Link
                                href={`https://github.com/taroj1205/taroj.poyo.jp/edit/dev/src/pages${router.pathname === '/'
                                    ? '/index'
                                    : `${router.pathname}`}.tsx`}
                                className="flex mt-2"
                            >
                                <span className="flex items-center bg-gray-200 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-black text-black dark:text-white font-bold py-2 px-4 rounded-lg">
                                    <AiOutlineEdit className="mr-2" />
                                    {t('footer.edit_on_github')}
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <p className="text-black dark:text-white font-bold mb-2">{t('footer.sitemap')}</p>
                        <ul className="text-right md:text-left flex flex-col">
                            <li>
                                <Link href="/" className="text-blue-700 dark:text-blue-500 hover:underline">
                                    {t('footer.home')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-blue-700 dark:text-blue-500 hover:underline">
                                    {t('footer.about')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/chat" className="text-blue-700 dark:text-blue-500 hover:underline">
                                    {t('footer.chat')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/settings" className="text-blue-700 dark:text-blue-500 hover:underline">
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
