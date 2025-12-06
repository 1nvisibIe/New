import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [ 'resources/css/app.css',
                'resources/js/app.js',
                'resources/assets/admin/plugins/fontawesome-free/css/all.min.css',
                'resources/assets/admin/css/adminlte.min.css'
                ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
