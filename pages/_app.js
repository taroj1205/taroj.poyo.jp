import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const link = document.createElement('link');
        link.href = '/style/chat/style.css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;