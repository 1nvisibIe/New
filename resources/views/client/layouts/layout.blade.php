<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">


    <title>@yield('h1')</title>
    <meta name="description" content="Описание страницы">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wdth,wght@0,75..100,300..800;1,75..100,300..800&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@400;700&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@400;700&amp;family=Playpen+Sans:wght@100..800&amp;display=swap" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="{{asset('assets/css/main.css')}}">
    <link rel="stylesheet" href="{{asset('assets/css/fontawesome/css/all.min.css')}}">

</head>
<body>
<header>

    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-body">
        <div class="container d-flex justify-content-between ps-0">
            <div class="ps-2 pe-0 d-flex align-items-center gap-1">

                <a class="navbar-brand" href="/"><img src="{{asset('uploads/images/client/logo.png')}}" width="125px" alt=""></a>
                <div class="container align-items-start gap-1 pt-5 px-0">
                    <a href="tel:+7 (950) 412-88-92" class="zelen"><i class="fa-solid fa-phone-volume"></i>+7 (950) 412-88-92</a>
                    <div class="d-flex justify-content-center gap-1">
                        <a class="fs-2 px-2 colorVK" href="https://vk.com/id265680268" target="blank"><i class=" fa-brands fa-vk"></i></a>
                        <a class="fs-2 px-2 colorTG" href="https://web.telegram.org" target="blank"><i class=" fa-brands fa-telegram"></i></a>
                    </div>
                </div>

            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Переключатель навигации">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse ps-0" id="navbarSupportedContent">

                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item ">
                        <a class="nav-link  zelen {{ request()->routeIs('Home') ? 'active' : '' }}" href="/" >Главная</a></li>
                    <li class="nav-item">
                        <a class="nav-link zelen {{ request()->routeIs('Catalog') ? 'active' : '' }}" href="{{route('Catalog')}}">Каталог</a></li>
                    <li class="nav-item">
                        <a class="nav-link zelen {{ request()->routeIs('recommendation') ? 'active' : '' }}" href="{{route('recommendation')}}">Рекоммендации</a></li>
                    <li class="nav-item">
                        <a class="nav-link zelen {{ request()->routeIs('') ? 'active' : '' }}" href="#">Контакты</a>
                    </li>
                </ul>


                <form class="d-flex justify-content-end" role="search" action="{{route('Search')}}">
                    <input class="form-control me-2 ms-0 w-90" type="search" name="s" placeholder="Поиск" aria-label="Поиск">
                    <button class="btn " type="submit">Поиск</button>
                </form>
                <form action="{{ route('logout') }}" method="POST" class="d-inline ms-1" onsubmit="return confirm('Вы действительно хотите выйти?');">
                    @csrf

                    <button type="submit" class="btn " title="Выйти из аккаунта" >
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </form>
            </div>
        </div>
    </nav>
</header>
<main>
    <div class="content-wrapper">

        <div class="row ">
            <div class="col-12">
                @if ($errors->any())
                    <div class="alert alert-danger ">
                        <ul class="list-unstyled">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                @if (session()->has('success'))
                    <div class="alert alert-success">
                        {{session('success')}}
                    </div>
                @endif
            </div>

        </div>
    @yield('content')
</main>
<footer class="bg-secondary text-white tex">
    <div class="container py-5">
        <div class="row">
            <div class="col-12 col-sm-6 col-md-4 mb-3">
                <h4 class="mb-4 mt-0 gran2">Меню</h4>
                <p><a href="http://m950417j.beget.tech/">Главная</a></p>
                <p><a href="katalog/">Каталог</a></p>
                <p><a href="dostavka-i-oplata">Доставка и оплата</a></p><p>
                </p><p><a href="o-kompanii">О компании</a></p><p>

                </p></div>

            <div class="col-12 col-sm-6 col-md-4 gran mb-3">
                <h4 class="mb-4 mt-0 gran2">Контакты</h4>
                <p> <a href="tel:+7 (950) 412-88-92"><i class="fa-solid fa-phone-volume me-1"></i>+7 (950) 412-88-92</a></p>
                <p> <i class="fa-regular fa-envelope me-1"></i>sibaviator4@gmail.com</p>
                <p> <i class="fa-solid fa-location-dot me-1"></i>Красноярск, ул. Авиаторов, д. 62</p>
            </div>
            <div class="col-12 col-sm-12 col-md-4 mb-3">
                <h4 class="mb-2 mt-0 text-center">Наши Социальные сети</h4>
                <div class="d-flex justify-content-center">
                    <a class="fs-1 px-2 tex colorVK2" href="https://vk.com/id265680268" target="blank"><i class=" fa-brands fa-vk"></i></a>
                    <a class="fs-1 px-2 colorTG2" href="https://web.telegram.org" target="blank"><i class=" fa-brands fa-telegram"></i></a>
                </div>

            </div>
        </div>
    </div>



</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const currentPath = window.location.pathname.replace(/\/$/, '');

        document.querySelectorAll('.nav-sidebar a.nav-link').forEach(function (link) {
            let href = link.getAttribute('href');
            if (!href || href === '#') return;

            // Извлекаем pathname из полного URL
            let linkPath;
            try {
                const url = new URL(href, window.location.origin);
                linkPath = url.pathname.replace(/\/$/, '');
            } catch (e) {
                linkPath = href.split('?')[0].replace(/\/$/, '');
            }

            if (linkPath === currentPath) {
                link.classList.add('active');

                // ИСПРАВЛЕНО: правильный селектор для родителя
                const treeItem = link.closest('.has-treeview');
                if (treeItem) {
                    treeItem.classList.add('menu-open');
                    // :scope > a.nav-link вместо > a.nav-link
                    const parentLink = treeItem.querySelector(':scope > a.nav-link');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            }
        });
    });
</script>






<script src="{{asset('assets/admin/js/jquery.min.js')}}"></script>

    <script src="{{asset('assets/admin/js/bootstrap.bundle.min.js')}}"></script>

    <script src="{{asset('assets/admin/js/adminlte.min.js')}}"></script>

    {{--    ^влияет на анимацию выпадающего списка--}}

    <script src="{{asset('assets/admin/js/demo.js')}}"></script>
</body>
</html>
