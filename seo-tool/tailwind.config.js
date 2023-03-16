/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [],
    darkMode: "class", // or 'media' or 'class'
    purge: [
        './src/**/*.html',
        './src/**/*.js',
        './src/**/*.jsx',
    ],
    theme: {
        extend: {},
    },
    variants: {
        extend: {
            boxShadow: ['focus'],
            ringWidth: ['focus'],
            ringColor: ['focus'],
            outline: ['focus'],
        },
    },
    plugins: [],
}