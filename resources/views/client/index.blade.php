@extends('client.layouts.layout')
@section('title')
    Главная
@endsection
@section('h1')
    Главная
@endsection
@section('content')

            <!-- Content Header (Page header) -->



            <div class="container py-3">
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1>@yield('h1')</h1>
                            </div>

                        </div>
                    </div><!-- /.container-fluid -->
                </section>

                <div class=" d-flex justify-content-center align-items-center">
                    <div id="carouselExampleIndicators" class="carousel slide">
                        <div class="carousel-indicators ">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-label="Slide 1" aria-current="true"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2" class=""></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3" class=""></button>
                        </div>
                        <div class="carousel-inner  razmerikaryseli">
                            <div class="carousel-item active">
                                <img src="{{asset('uploads/images/client/slajd-1.jpg')}}" class="d-block w-100 rounded-4" alt="">
                            </div>
                            <div class="carousel-item">
                                <img src="{{asset('uploads/images/client/slajd-2.jpg')}}" class="d-block w-100 rounded-4 " alt="">
                            </div>
                            <div class="carousel-item">
                                <img src="{{asset('uploads/images/client/slajd-3.jpg')}}" class="d-block w-100 rounded-4" alt="">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Предыдущий</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Следующий</span>
                        </button>
                    </div>
                </div>
                <br><br>
                <div>
                    <p class="shrift">Розмарин рекомендует</p>
                    <div class="row pt-3 px-2 tex">
                        @foreach($cards as $card)
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3 p-2 padmin ">
                            <a href="{{route('Catalog.single',['slug'=>$card->product->slug])}}">
                                <div class="card h-100">
                                    <div class="p-2">
                                        <img src="{{$card->product->image_url}}" class="card-img-top photo-fixed" alt="">
                                    </div>
                                    <div class="card-body d-flex flex-column h-100">

                                        <div class="flex-grow-1">
                                            <p class="card-title">{{$card->name}}</p>
                                        </div>
                                        @if(!empty($card->old_price))
                                        <div class="d-flex flex-column align-items-start">

                                            <p class="card-body p-0 m-0 bezskidkiCartochka">{{$card->old_price}} ₽</p>
                                            <p class=" card-body p-0 m-0 soskidkoyCartochka "> {{$card->price}} ₽</p>
                                        </div>
                                        @else
                                            <div class="d-flex flex-column align-items-start">

                                                <p class=" card-body p-0 m-0 soskidkoyCartochka "> {{$card->price}} ₽</p>
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </a>
                        </div>
                        @endforeach

                    </div>
                </div>

                <br><br>
                <div class=" d-flex align-items-center">
                    <div class="row">
                        <div class="pe-4 col-12  col-lg-6">
                            <h1 class="pb-4">Розмарин всегда рядом</h1>
                            <div>
                                <p>За каждым блюдом стоят наши классные сотрудники, которые с любовью и творческим подходом готовят для вас самые вкусные и качественные блюда.</p>
                                <p>В Розмарине мы ценим каждого сотрудника и делаем все возможное, чтобы они радовали вас своим профессионализмом и творческими идеями.</p>
                                <p>Мы также гордимся тем, что остаемся первой демократичной доставкой, делая наши вкусные блюда доступными для всех!</p>
                                <p>Радуем вас вкусными суши и пиццей с 2015 года!</p>

                            </div>
                        </div>
                        <div class="col-12 col-lg-6 d-flex justify-content-center align-items-center px-3">
                            <img src="{{asset('uploads/images/client/ban-1.webp')}}" class=" rounded-3 w-100 razmeriimg">
                        </div>
                    </div>
                </div>


                <br><br>
            </div>

@endsection

