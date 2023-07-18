import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { I18nextProvider } from 'react-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import i18n from '../../i18n';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

import '../../styles/globals.css';
import '../styles.css';

import Header from '../components/Header';
import FloatingBanner from '../components/FloatingBanner';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const { pathname } = router;

    useEffect(() => {
        const addFontStyles = (
            fontFamily: string,
            src: string,
            format: string
        ) => {
            const fontStyles = `
            @font-face {
                font-family: '${fontFamily}';
                src: url('${src}') format('${format}');
            }
            `;
            const style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(fontStyles));
            document.head.appendChild(style);
        };

        addFontStyles(
            'NotoSansJP',
            '../font/NotoSansJP/static/NotoSansJP-Regular.ttf',
            'truetype'
        );
        addFontStyles(
            'NotoSansThin',
            '../font/NotoSans/NotoSans-Regular.ttf',
            'truetype'
        );
        addFontStyles('Textar', '../font/textar/textar.ttf', 'truetype');
    }, []);

    const shouldRenderHeaderAndBanner =
        pathname !== '/chat';

    return (
        <UserProvider>
            <I18nextProvider i18n={i18n}>
                <Head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
                    />
                    <link
                        rel="shortcut icon"
                        type="image/x-icon"
                        href="/image/icon/global/favicon.ico"
                    />
                    <meta name="theme-color" content="#090808" />
                    
                    {/* Add other custom metadata and tags */}
                </Head>
                {shouldRenderHeaderAndBanner && <Header />}
                <Component {...pageProps} />
                {shouldRenderHeaderAndBanner && <FloatingBanner />}
                <Analytics />
            </I18nextProvider>
        </UserProvider>
    );
}
