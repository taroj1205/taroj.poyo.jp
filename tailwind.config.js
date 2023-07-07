/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
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
        },
    },
    plugins: [],
};
