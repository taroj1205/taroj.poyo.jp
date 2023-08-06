import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { I18nextProvider } from 'react-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import i18n from '../../i18n';
import { ThemeProvider } from "next-themes";
import '../globals.css';
import { AuthProvider } from '../components/AuthContext';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const currentPath = router.pathname === '/' ? 'index' : router.pathname;

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

    return (
        <AuthProvider>
            <I18nextProvider i18n={i18n}>
                <Head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
                    />
                    <link
                        rel="shortcut icon"
                        type="image/x-icon"
                        href={`/image/icon/${currentPath}/favicon.ico`}
                    />
                    <meta name="theme-color" content="#090808" />
                    <meta property='og:type' content='website' />
                    <meta
                        property="og:image"
                        content="https://raw.githubusercontent.com/taroj1205/taroj1205.github.io/main/thumbnail.png"
                    />
                    <meta
                        property="og:image:alt"
                        content="Shintaro Jokagi Website Thumbnail"
                    />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="taroj.poyo.jp" />
                    <meta
                        name="twitter:description"
                        content="A website for Shintaro Jokagi"
                    />
                    <meta
                        name="twitter:image"
                        content="/image/thumbnail/thumbnail.webp"
                    />
                    <meta
                        name="twitter:image:alt"
                        content="Shintaro Jokagi Website Thumbnail"
                    />
                    <meta name="twitter:site" content="@taroj1205" />
                    <meta name="twitter:creator" content="@taroj1205" />
                    {/* Add other custom metadata and tags */}
                </Head>
                <ThemeProvider attribute="class">
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
                <Analytics />
            </I18nextProvider>
        </AuthProvider >
    );
}