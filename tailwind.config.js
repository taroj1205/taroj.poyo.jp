/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                textar: [
                    'Textar',
                    'MS PGothic',
                    'IPAMonaPGothic',
                    'Mona',
                    'sans-serif',
                ],
            },
            keyframes: {
                announcement: {
                    '0%': {
                        transform: 'translateX(150%)',
                    },
                    '100%': {
                        transform: 'translateX(-150%)',
                    },
                },
            },
            animation: {
                announcement:
                    'announcement 20s linear infinite',
            },
        },
    },
    plugins: [],
};
