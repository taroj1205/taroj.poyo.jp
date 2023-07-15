import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {

        return (
            <Html>
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
                <body className="max-h-full">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

