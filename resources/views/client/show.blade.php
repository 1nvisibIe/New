@extends('client.layouts.layout')
@section('h1')
    {{$card->name}}
@endsection

@section('content')

    <div class="container ">
        <div class="shrifthleba">
            <ol class="breadcrumb float-sm-left">
                <li class="breadcrumb-item "><a href="{{route('Home')}}" class="hleb">Главная</a></li>
                <li class="breadcrumb-item "><a href="{{route('Catalog')}}" class="hleb">Каталог</a></li>
                <li class="breadcrumb-item  hleb2 active">@yield('h1')</li>
            </ol>
        </div>

    </div>

    <div class="container ">
        <div class="row ">
            <div class="col-12 col-md-5 pe-0 ps-3 pb-3 paddiv d-flex justify-content-start align-items-center">
                <img src="{{$card->product->getimage()}}" class="img-fluid rounded-4 razmerikompvkataloge" alt="">
            </div>
            <div class="col-12 col-md-7 d-flex flex-column justify-content-between  px-2">
                <div>
                    <h1 class="shrift">@yield('h1')</h1>

                    <div class="mt-3">
                        <p>{{$card->description}}</p>

                    </div>
                </div>
                <div class="d-flex container align-items-center gap-1">
                    <div>

                        @if(!empty($card->old_price))

                            <p class="mx-2 mb-0 pb-0 bezskidki">{{$card->old_price}} ₽</p>
                            <p class="mx-2 mb-2 mt-0 pt-0 soskidkoy "> {{$card->price}} ₽</p>

                        @else
                            <div class="d-flex flex-column align-items-start">

                                <p class="mx-2 mb-2 mt-0 pt-0 soskidkoy "> {{$card->price}} ₽</p>
                            </div>
                        @endif
                    </div>
                    <div>
                        <button type="button" class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Сделать заказ
                        </button>


                    </div>
                </div>
            </div>
        </div>
    </div>

    <br><br><br><br><br><br><br>


@endsection
