<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Динамический заголовок через Inertia -->
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    @viteReactRefresh
    <!-- Vite подключает CSS и JS -->
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    <!-- Обязательный тег Inertia для мета и заголовков -->
    @inertiaHead
</head>
<body class="antialiased">
@inertia
</body>
</html>

