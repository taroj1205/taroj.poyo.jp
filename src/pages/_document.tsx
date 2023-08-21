import Document, {Head, Html, Main, NextScript} from 'next/document';
import Script from 'next/script';

export default class MyDocument extends Document {
    render() {

        return (
            <Html>
                <Head>
                    <Script src="https://www.googletagmanager.com/gtag/js?id=G-5K9MK5PVGB" strategy="afterInteractive"/>
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-5K9MK5PVGB');
                    `}
                    </Script>
                    <Script strategy={"afterInteractive"} src="https://analytics.umami.is/script.js"
                            data-website-id="a611995c-1516-463b-ab58-c59d4b192391"></Script>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

