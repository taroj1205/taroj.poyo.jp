module.exports = {
    i18n: {
        locales: ['default', 'en', 'ja'],
        defaultLocale: 'default',
        localeDetection: true,
    },
    trailingSlash: true,
    compress: true,
    images: {
        domains: ['gravatar.com', 'github-readme-stats.vercel.app'],
    },
    async redirects() {
        return [
            {
                source: '/auth',
                destination: '/auth/login',
                permanent: true,
            },
            {
                source: '/chat',
                destination: '/apps/chat',
                permanent: true,
            },
            {
                source: '/',
                destination: '/home',
                permanent: true,
            }
        ];
    },
};