import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { I18nextProvider } from 'react-i18next';
import { AppProps } from 'next/app';
import i18n from '../../i18n';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import '../../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const addLink = (href: string) => {
            const link = document.createElement('link');
            link.href = `/style/${href}/style.css`;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            document.head.appendChild(link);
        };

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

        // Get the file name of the component accessing the _app.js file
        const fileName = Component.name || 'Unknown';

        addLink('global');
        addLink(fileName);
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
        <UserProvider>
            <I18nextProvider i18n={i18n}>
                    <Component {...pageProps} />
                    <Analytics />
            </I18nextProvider>
        </UserProvider>
    );
}
