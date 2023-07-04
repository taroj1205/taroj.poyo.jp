import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = '/style/global/style.css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);

        const fontStyles = `
            @font-face {
                font-family: 'NotoSansJP';
                src: url('../font/NotoSansJP/static/NotoSansJP-Regular.ttf') format('truetype');
            }
            @font-face {
                font-family: 'NotoSansThin';
                src: url('../font/NotoSans/NotoSans-Regular.ttf') format('truetype');
            }
            @font-face {
                font-family: 'Textar';
                src: url(../font/textar/textar.ttf') format ('truetype');
            }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(fontStyles));
        document.head.appendChild(style);
    }, []);

    return (
        <>
            <Component {...pageProps} />
            <Analytics />
        </>
    );
}

export default MyApp;
