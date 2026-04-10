<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Server-Side Rendering
    |--------------------------------------------------------------------------
    |
    | Settings for server-side rendering of Inertia pages.
    |
    */
    'ssr' => [
        'enabled' => env('INERTIA_SSR_ENABLED', true),
        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
        'bundle' => base_path('bootstrap/ssr/ssr.js'), // ← ДОБАВЬ ЭТУ СТРОКУ
    ],

];
