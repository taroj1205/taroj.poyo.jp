import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {

        return (
            <Html>
                <Head />
                <body className="text-white bg-zinc-950 font-sans text-base">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

