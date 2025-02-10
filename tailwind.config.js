import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import("tailwindcss").Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    safelist: [
        'border-red-500',
        'border-blue-500 bg-blue-100 dark:border-blue-300 dark:bg-blue-900',
        'border-red-500 bg-red-100 dark:border-red-300 dark:bg-red-900',
        'border-gray-500 bg-gray-100 dark:border-gray-300 dark:bg-gray-900',
        'border-purple-500 bg-purple-100 dark:border-purple-300 dark:bg-purple-900',
        'bg-red-100',
        'dark:border-red-300',
        'dark:bg-red-900',
        'border-green-500',
        'bg-green-100',
        'dark:border-green-300',
        'dark:bg-green-900',
        'border-yellow-500',
        'bg-yellow-100',
        'dark:border-yellow-300',
        'dark:bg-yellow-900',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
