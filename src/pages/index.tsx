import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import FloatingBanner from '../components/FloatingBanner';
import { Tooltip } from 'react-tooltip';
import copy from 'copy-to-clipboard';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
    FaFacebook,
    FaYoutube,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaDiscord,
} from 'react-icons/fa';
import { BsInstagram } from 'react-icons/bs';
import { IconType } from 'react-icons';

interface ContactLinkProps {
    hover: string;
    icon: JSX.Element & { type: IconType };
    label: string;
    href: string;
}

const ContactLink = ({ hover, icon, label, href }: ContactLinkProps) => {
    return (
        <div className="flex items-center">
            <a
                className={`text-lg flex items-center rounded-lg p-1 w-full transition-colors duration-300 ${hover}`}
                data-tooltip-content={label}
                data-tooltip-place="top"
                data-tooltip-id={label}
                href={href}
            >
                {icon}
                <span className="ml-2">{label}</span>
            </a>
            <Tooltip id={label} />
        </div>
    );
};

interface ProfileData {
    email: string;
    username: string;
    picture: string;
    name: string;
}

const HomePage = () => {
    const { t } = useTranslation('translation');
    const { user, error, isLoading } = useUser();
    const [copied, setCopied] = useState(false);

    const [userData, setUserData] = useState<ProfileData>({
        email: '',
        username: '',
        picture: '',
        name: '',
    });

    const handleCopy = (text: string) => {
        copy(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = user?.sub;
                const url = `/api/getUser?user=${userId}`;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: userId,
                    }),
                };
                const response = await fetch(url, requestOptions);
                const data = await response.json();
                setUserData(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (!isLoading) {
            fetchData();
        }
    }, [user, isLoading]);

    return (
        <>
            <Head>
                <title>{t('index.title')}</title>
            </Head>

            <main className="container mx-auto py-10 max-w-6xl">
                <h2 className="text-4xl">
                    {t('index.welcome')}
                    {userData.username && ` ${userData.username}`}!
                </h2>

                <section className="mt-10">
                    <h3 className="text-2xl mb-5">{t('index.contact')}</h3>
                    <div className="grid grid-cols-2 gap-2 max-w-full w-64 font-semibold">
                        <ContactLink
                            hover="hover:bg-blue-600 hover:text-white text-blue-600"
                            icon={<FaFacebook className="mr-1" />}
                            label="Facebook"
                            href="https://facebook.com/taroj1205"
                        />
                        <ContactLink
                            hover="hover:bg-pink-600 hover:text-white text-pink-600"
                            icon={<FaInstagram className="mr-1" />}
                            label="Instagram"
                            href="https://instagram.com/taroj1205"
                        />
                        <ContactLink
                            hover="hover:text-white hover:bg-red-600 text-red-600"
                            icon={<FaYoutube className="mr-1" />}
                            label="YouTube"
                            href="https://www.youtube.com/@user-le6xc5nx5k"
                        />
                        <div className="flex items-center">
                            <a
                                className={`text-lg flex items-center rounded-lg p-1 w-full transition-colors duration-300 hover:text-white hover:bg-[#7289DA] text-[#7289DA]`}
                                data-tooltip-content="Discord"
                                data-tooltip-place="top"
                                data-tooltip-id="Discord"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleCopy('taroj1205')}
                            >
                                <FaDiscord className="mr-1" />
                                <span className="ml-2">Discord</span>
                            </a>
                            <Tooltip
                                id="Discord"
                                content={copied ? t('copied') : 'Discord'}
                            />
                        </div>
                        <ContactLink
                            hover="hover:bg-blue-400 hover:text-white text-blue-400"
                            icon={<FaTwitter className="mr-1" />}
                            label="Twitter"
                            href="https://twitter.com/taroj1205"
                        />
                        <ContactLink
                            hover="hover:bg-indigo-600 hover:text-white text-indigo-600"
                            icon={<FaLinkedin className="mr-1" />}
                            label="LinkedIn"
                            href="https://www.linkedin.com/in/taroj1205/"
                        />
                    </div>
                </section>
            </main>

            <FloatingBanner />
        </>
    );
};

export default HomePage;
