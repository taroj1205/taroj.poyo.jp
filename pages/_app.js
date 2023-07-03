import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = '/style/global/style.css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);
    }, []);

    return (
        <>
            <Component {...pageProps} />
            <Analytics />
        </>
    );
}

export default MyApp;