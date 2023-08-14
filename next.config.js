module.exports = {
    i18n: {
        locales: ['default' ,'en', 'ja'],
        defaultLocale: 'default',
        localeDetection: true,
    },
    trailingSlash: true,
    compress: true,
    images: {
        domains: ['gravatar.com'],
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
    ];
}
};
