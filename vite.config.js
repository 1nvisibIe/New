import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [ 'resources/css/app.css',
                'resources/js/app.jsx',
                ],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    ssr: {
        noExternal: ['@inertiajs/react'],
        ssrManifest: true// Важно: не выносить Inertia из бандла
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'), // ← добавь
        },
    },


});
