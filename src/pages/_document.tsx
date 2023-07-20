import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {

        return (
            <Html className='dark'>
                <Head />
                <body className="text-black dark:text-white dark:bg-zinc-950 bg-white font-sans text-base">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

