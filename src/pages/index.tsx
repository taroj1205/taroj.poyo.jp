import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import FloatingBanner from '../components/FloatingBanner';
import { Tooltip } from 'react-tooltip';
import {
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaGithub,
    FaTwitter,
    FaLinkedin,
} from 'react-icons/fa';

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

const HomePage = () => {
    const { t } = useTranslation('translation');

    return (
        <div>
            <Head>
                {/* Meta tags... */}
                <title>{t('index.title')}</title>
            </Head>

            <main className="container mx-auto py-10 max-w-6xl">
                <h2 className="text-4xl">{t('index.welcome')}</h2>

                <section className="mt-10">
                    <h3 className="text-2xl mb-5">{t('index.contact')}</h3>
                    <div className="grid grid-cols-2 gap-2 max-w-full w-60">
                        <ContactLink
                            hover="hover:bg-blue-600 hover:text-white text-blue-600"
                            icon={<FaFacebook className="mr-1 text-xl" />}
                            label="Facebook"
                            href="https://facebook.com/taroj1205"
                        />
                        <ContactLink
                            hover="hover:bg-pink-600 hover:text-white text-pink-600"
                            icon={<FaInstagram className="mr-1 text-xl" />}
                            label="Instagram"
                            href="https://instagram.com/taroj1205"
                        />
                        <ContactLink
                            hover="hover:bg-white hover:text-red-600 text-red-600"
                            icon={<FaYoutube className="mr-1 text-xl" />}
                            label="YouTube"
                            href="https://www.youtube.com/@user-le6xc5nx5k"
                        />
                        <ContactLink
                            hover="hover:bg-white hover:text-black text-white"
                            icon={<FaGithub className="mr-1 text-xl" />}
                            label="GitHub"
                            href="https://github.com/taroj1205"
                        />
                        <ContactLink
                            hover="hover:bg-blue-400 hover:text-white text-blue-400"
                            icon={<FaTwitter className="mr-1 text-xl" />}
                            label="Twitter"
                            href="https://twitter.com/taroj1205"
                        />
                        <ContactLink
                            hover="hover:bg-indigo-600 hover:text-white text-indigo-600"
                            icon={<FaLinkedin className="mr-1 text-xl" />}
                            label="LinkedIn"
                            href="https://www.linkedin.com/in/your-linkedin-profile"
                        />
                    </div>
                </section>
            </main>

            <FloatingBanner />
        </div>
    );
};

export default HomePage;
